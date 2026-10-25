import { useCallback, useEffect, useState } from "react";
import safeAsync from "../utils/safeAsync";
import { fetchFn } from "../utils/fetchFn";
import { useDialog } from "../Context/DialogueContext";
import { socket } from "../lib/socket.io";

import {
  Search,
  FileText,
  Package,
  CheckCircle2,
  ChevronRight,
  X,
  ExternalLink,
  Check,
  XCircle,
  Mail,
  LoaderCircle,
} from "lucide-react";
import {
  orderActionConfig,
  type File,
  type FileRes,
  type Order,
  type OrderActionType,
  type OrderRes,
  type Shop,
  type ShopRes,
} from "../types/shopkeeperDash";
import { getStatusStyle } from "../utils/getStatusStyles";

const ShopkeeperDashboard: React.FC = () => {
  //dialogue imports
  const { alert, confirm, danger } = useDialog();
  //pdf states
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  //order completed
  const [orderTab, setOrderTab] = useState<"active" | "completed">("active");
  const [orderAction, setOrderAction] = useState<"accepting" | "rejecting" | "completing" | null>(null);

  const [shop, setShop] = useState<Shop | null>(null);
  const [orders, setOrders] = useState<Order[] | []>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order>();

  const [files, setFiles] = useState<File[] | []>([]);
  const [filesLoading, setFilesLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  //get pdfURL using blob
  useEffect(() => {
    if (!selectedFile) {
      setPdfUrl(null);
      return;
    }

    let objectUrl: string | null = null;
    const controller = new AbortController();

    const fetchPdf = async () => {
      try {
        setLoadingPdf(true);
        setPdfUrl(null);

        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/shopkeeper/files/${selectedFile._id}`;

        const response = await fetch(apiUrl, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load PDF: ${response.status}`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("PDF preview failed:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingPdf(false);
        }
      }
    };

    fetchPdf();

    return () => {
      controller.abort();

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedFile?._id]);
  //getorders utility
  const getOrders = useCallback(async () => {
    const [data, err] = await safeAsync(fetchFn<OrderRes>("/shopkeeper/orders"));

    if (err) {
      console.log("Unable to fetch orders", err);
      return;
    }

    if (!data?.success) {
      console.log("Unable to fetch orders");
      return;
    }

    setOrders(data.orders);

    // Select the first order only if there isn't already a selection.
    setSelectedOrder((current) => {
      if (current) return current;

      return data.orders.length > 0 ? data.orders[0] : null;
    });
  }, []);

  //socket
  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected to Socket.IO:", socket.id);
    };

    const handleDisconnect = () => {
      console.log("Disconnected from Socket.IO");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, []);

  //new order listener effect for socket
  useEffect(() => {
    const handleNewOrder = (data: { orderId: string; shopId: string }) => {
      console.log("New order received:", data);
      getOrders();
    };

    socket.on("new-order", handleNewOrder);

    return () => {
      socket.off("new-order", handleNewOrder);
    };
  }, [getOrders]);
  //handle Order status

  const handleOrderAction = async (action: OrderActionType) => {
    if (!selectedOrder?._id || orderAction) return;

    const config = orderActionConfig[action];
    const currentStatus = selectedOrder.status?.toLowerCase();

    // Prevent invalid status transitions.
    if (
      (action === "accepting" && currentStatus !== "pending") ||
      (action === "rejecting" && currentStatus !== "pending") ||
      (action === "completing" && currentStatus !== "accepted")
    ) {
      return;
    }

    const dialogOptions = {
      title: config.confirmTitle,
      message: config.confirmMessage,
      confirmText: config.confirmText,
      cancelText: config.cancelText,
    };

    const confirmed = config.dialogType === "danger" ? await danger(dialogOptions) : await confirm(dialogOptions);

    if (!confirmed) return;

    setOrderAction(action);

    try {
      const [data, err] = await safeAsync(
        fetchFn(`/shopkeeper/orders/${selectedOrder._id}`, {
          method: "PATCH",
          body: { status: config.status },
        }),
      );

      if (err || !data?.success) {
        await alert({
          title: config.errorTitle,
          message: data?.message || config.errorMessage,
          confirmText: "Okay",
        });
        return;
      }

      const updatedOrder = {
        ...selectedOrder,
        status: config.status,
      };

      setOrders((prevOrders) => prevOrders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order)));

      setSelectedOrder(updatedOrder);

      if (action === "completing") {
        setOrderTab("completed");
        setSearchQuery("");
      }

      await alert({
        title: config.successTitle,
        message: config.successMessage,
        confirmText: "Okay",
      });
    } catch (error) {
      console.error(`Failed to ${action} order`, error);

      await alert({
        title: config.errorTitle,
        message: config.errorMessage,
        confirmText: "Okay",
      });
    } finally {
      setOrderAction(null);
    }
  };
  //Update orders
  useEffect(() => {
    async function getShop() {
      const [data, err] = await safeAsync(fetchFn<ShopRes>("/shopkeeper/shop"));

      if (err) {
        console.log("Unable to fetch shop details", err);
        return;
      }

      if (!data?.success) {
        console.log("Unable to fetch shop details");
        return;
      }

      setShop(data.shop);
    }

    getShop();
    getOrders();
  }, []);

  useEffect(() => {
    const handleNewOrder = (data: { orderId: string; shopId: string }) => {
      console.log("New order received:", data);

      // Fetch the latest orders using your existing function.
      getOrders();
    };

    socket.on("new-order", handleNewOrder);

    return () => {
      socket.off("new-order", handleNewOrder);
    };
  }, [getOrders]);

  /*
   * Fetch files whenever selected order changes
   */
  useEffect(() => {
    if (!selectedOrder?._id) {
      setFiles([]);
      return;
    }

    async function getFilesByOrder() {
      setFilesLoading(true);
      setFiles([]);
      setSelectedFile(null);
      if (!selectedOrder?._id) return;
      const [data, err] = await safeAsync(fetchFn<FileRes>(`/shopkeeper/orders/${selectedOrder._id}/files`));

      if (err) {
        console.log("Unable to fetch order files", err);
        setFilesLoading(false);
        return;
      }

      if (!data?.success) {
        console.log("Unable to fetch order files");
        setFilesLoading(false);
        return;
      }

      setFiles(data.files);
      setFilesLoading(false);
    }

    getFilesByOrder();
  }, [selectedOrder]);

  /*
   * Search
   */
  const activeOrders = orders.filter((order) => {
    const status = order.status?.toLowerCase() || "";

    return ["pending", "accepted", "processing"].includes(status);
  });

  const completedOrderList = orders.filter((order) => order.status?.toLowerCase() === "completed");

  const ordersForCurrentTab = orderTab === "active" ? activeOrders : completedOrderList;

  const filteredOrders = ordersForCurrentTab.filter((order) => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return true;
    const customerName =
      typeof order.customer === "object" && order.customer !== null ? order.customer.name : "Unknown customer";

    const CustomerEmail =
      typeof order.customer === "object" && order.customer !== null ? order.customer.email : "Unknown customer";
    return order._id?.toLowerCase().includes(query) || customerName || CustomerEmail;
  });

  /*
   * Open PDF
   */
  const handleViewFile = (file: any) => {
    setSelectedFile(file);
  };

  const pendingOrders = orders.filter((order) => order.status === "Pending" || order.status === "Printing").length;

  const completedOrders = orders.filter((order) => order.status === "Completed").length;

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden bg-[#f6f8fb]">
      <main className="mx-auto flex h-full max-w-[1500px] flex-col px-5 py-4 lg:px-6">
        {/* =====================================================
            COMPACT PAGE TOOLBAR
        ===================================================== */}

        <div className="mb-4 flex shrink-0 items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight text-slate-900">Orders</h1>

              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                {shop?.shopName || "Your Shop"}
              </span>
            </div>

            <p className="mt-0.5 text-xs text-slate-500">Review and manage incoming print orders</p>
          </div>

          <div className="hidden items-center gap-5 text-xs sm:flex">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-slate-500">Pending</span>
              <span className="font-semibold text-slate-800">{pendingOrders}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-slate-500">Completed</span>
              <span className="font-semibold text-slate-800">{completedOrders}</span>
            </div>

            <div className="flex items-center gap-2">
              <Package size={14} className="text-slate-400" />
              <span className="text-slate-500">Total</span>
              <span className="font-semibold text-slate-800">{orders.length}</span>
            </div>
          </div>
        </div>

        {/* =====================================================
            MAIN WORKSPACE
        ===================================================== */}

        <section className="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          {/* ===================================================
              LEFT — ORDER LIST
          =================================================== */}

          <aside className="flex w-[285px] shrink-0 flex-col border-r border-slate-200 bg-white">
            {/* Search */}

            <div className="shrink-0 border-b border-slate-200 p-3">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders..."
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Order list header */}
            <div className="grid grid-cols-2 gap-2 border-b border-slate-200 p-3">
              <button
                type="button"
                onClick={() => setOrderTab("active")}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  orderTab === "active" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Active Orders
                <span className="ml-2">{activeOrders.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderTab("completed")}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  orderTab === "completed"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Completed
                <span className="ml-2">{completedOrderList.length}</span>
              </button>
            </div>

            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Recent orders</span>

              <span className="text-[10px] font-medium text-slate-400">{filteredOrders.length}</span>
            </div>

            {/* Orders */}

            <div className="min-h-0 flex-1 overflow-y-auto">
              {filteredOrders.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Package size={18} className="text-slate-400" />
                  </div>

                  <p className="mt-3 text-xs font-medium text-slate-700">No orders found</p>

                  <p className="mt-1 text-[11px] leading-4 text-slate-400">New customer orders will appear here.</p>
                </div>
              ) : (
                <div>
                  {filteredOrders.map((order) => {
                    const isSelected = selectedOrder?._id === order._id;

                    const isCompleted = order.status === "Completed";

                    const isCancelled = order.status === "Cancelled";

                    return (
                      <button
                        key={order._id}
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className={`relative w-full border-b border-slate-100 px-4 py-3 text-left transition ${
                          isSelected ? "bg-indigo-50/70" : "hover:bg-slate-50"
                        }`}
                      >
                        {isSelected && <span className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />}

                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2 w-2 shrink-0 rounded-full ${
                                  isCompleted ? "bg-emerald-500" : isCancelled ? "bg-red-500" : "bg-amber-400"
                                }`}
                              />

                              <p className="truncate text-xs font-semibold text-slate-900">
                                {typeof order?.customer === "object" && order.customer !== null
                                  ? order.customer.name || "Customer"
                                  : "Customer"}
                              </p>
                            </div>

                            <p className="mt-1.5 text-[10px] text-slate-400">#{order._id?.slice(-8)}</p>

                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[10px] capitalize text-slate-500">{order.status || "pending"}</span>

                              <span className="text-slate-300">•</span>

                              <span className="text-[10px] text-slate-500">₹{order.totalPrice || 0}</span>

                              {order.otp && <span className="ms-14 text-red-500">OTP: {order.otp}</span>}
                            </div>
                          </div>

                          <ChevronRight
                            size={15}
                            className={`mt-1 shrink-0 ${isSelected ? "text-indigo-500" : "text-slate-300"}`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* ===================================================
              CENTER — ORDER DETAILS
          =================================================== */}

          <div className="min-w-0 flex-1 bg-[#f8fafc]">
            {!selectedOrder ? (
              <div className="flex h-full flex-col items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                  <FileText size={20} className="text-slate-400" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-800">Select an order</h3>

                <p className="mt-1 text-xs text-slate-500">Choose an order from the list to view its details.</p>
              </div>
            ) : (
              <div className="flex h-full min-h-0 flex-col">
                {/* Order heading */}

                <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate text-base font-semibold text-slate-900">
                          {typeof selectedOrder.customer === "object" ? selectedOrder.customer?.name : "Customer Order"}
                        </h2>

                        <span
                          className={`rounded-md px-2 py-1 text-[10px] font-medium capitalize ${getStatusStyle(
                            selectedOrder.status || "Pending",
                          )}`}
                        >
                          {selectedOrder.status || "Pending"}
                        </span>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span>Order #{selectedOrder._id}</span>

                        {typeof selectedOrder.customer === "object" && selectedOrder.customer?.email && (
                          <span className="flex items-center gap-1">
                            <Mail size={12} />
                            {selectedOrder.customer.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[10px] text-slate-400">Total</p>

                      <p className="mt-0.5 text-lg font-bold text-slate-900">₹{selectedOrder.totalPrice || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}

                <div className="min-h-0 flex-1 overflow-y-auto p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Documents</h3>

                      <p className="mt-0.5 text-[11px] text-slate-500">Review the files before accepting the order.</p>
                    </div>

                    <span className="rounded-md bg-white px-2.5 py-1 text-[10px] font-medium text-slate-500 ring-1 ring-slate-200">
                      {files.length} {files.length === 1 ? "document" : "documents"}
                    </span>
                  </div>

                  {filesLoading ? (
                    <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

                      <p className="mt-3 text-xs text-slate-500">Loading documents...</p>
                    </div>
                  ) : files.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
                      <FileText size={20} className="text-slate-400" />

                      <p className="mt-2 text-xs text-slate-500">No documents attached.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={file._id || index}
                          className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-indigo-200 hover:shadow-sm"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                              <FileText size={17} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-slate-800">
                                {file.originalName || `Document ${index + 1}`}
                              </p>

                              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                                <span>{file.pages || 0} pages</span>

                                {file.fileSize && (
                                  <>
                                    <span>•</span>

                                    <span>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleViewFile(file)}
                            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            <FileText size={14} />
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ===================================================
              RIGHT — ORDER SUMMARY
          =================================================== */}

          {selectedOrder && (
            <aside className="hidden w-[260px] shrink-0 flex-col overflow-y-auto border-l border-slate-200 bg-white xl:flex">
              {/* Summary */}

              <div className="border-b border-slate-200 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Order summary</p>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-[11px] text-slate-500">Amount</p>

                    <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
                      ₹{selectedOrder.totalPrice || 0}
                    </p>
                  </div>

                  <span
                    className={`rounded-md px-2 py-1 text-[10px] font-medium capitalize ${getStatusStyle(
                      selectedOrder.status || "Pending",
                    )}`}
                  >
                    {selectedOrder.status || "Pending"}
                  </span>
                </div>
              </div>

              {/* Print settings */}

              <div className="border-b border-slate-200 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Print settings</p>

                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Copies</span>

                    <span className="text-xs font-semibold text-slate-800">
                      {selectedOrder.printSettings?.copies || 1}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Color</span>

                    <span className="text-xs font-semibold capitalize text-slate-800">
                      {selectedOrder.printSettings?.colorMode || "B&W"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Paper</span>

                    <span className="text-xs font-semibold text-slate-800">
                      {selectedOrder.printSettings?.pageSize || "A4"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Sides</span>

                    <span className="text-xs font-semibold capitalize text-slate-800">
                      {selectedOrder.printSettings?.printSide || "Single"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer */}

              <div className="border-b border-slate-200 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Customer</p>

                <p className="mt-2 truncate text-xs font-semibold text-slate-800">
                  {typeof selectedOrder.customer === "object" ? selectedOrder.customer?.name : "Customer"}
                </p>

                {typeof selectedOrder.customer === "object" && selectedOrder.customer?.email && (
                  <p className="mt-1 truncate text-[11px] text-slate-500">{selectedOrder.customer.email}</p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-auto border-t border-slate-200 p-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Order actions</p>

                {selectedOrder.status?.toLowerCase() === "accepted" ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Check size={16} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-emerald-800">Order Accepted</p>
                        <p className="mt-0.5 text-[10px] text-emerald-600">
                          Complete printing when the order is ready.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOrderAction("completing")}
                      disabled={orderAction !== null}
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {orderAction === "completing" ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Completing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={15} />
                          Mark as Complete
                        </>
                      )}
                    </button>
                  </div>
                ) : selectedOrder.status?.toLowerCase() === "completed" ? (
                  <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-3">
                    <CheckCircle2 size={20} className="shrink-0 text-blue-600" />
                    <div>
                      <p className="text-xs font-semibold text-blue-800">Order Completed</p>
                      <p className="mt-0.5 text-[10px] text-blue-600">This order is finished.</p>
                    </div>
                  </div>
                ) : selectedOrder.status?.toLowerCase() === "rejected" ? (
                  <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <XCircle size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-800">Order Rejected</p>
                      <p className="mt-0.5 text-[10px] text-red-600">This order cannot be processed.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
                      <p className="text-xs font-semibold text-amber-800">Awaiting acceptance</p>
                      <p className="mt-1 text-[10px] text-amber-700">Accept the order before marking it complete.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOrderAction("completing")}
                      disabled
                      className="flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-400"
                    >
                      <CheckCircle2 size={15} />
                      Mark as Complete
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOrderAction("accepting")}
                      disabled={orderAction !== null}
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {orderAction === "accepting" ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <Check size={15} />
                          Accept Order
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOrderAction("rejecting")}
                      disabled={orderAction !== null}
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {orderAction === "rejecting" ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <XCircle size={15} />
                          Reject Order
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </aside>
          )}
        </section>
      </main>

      {/* =========================================================
          PDF VIEWER
      ========================================================= */}

      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <FileText size={17} />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-slate-900">{selectedFile.originalName}</h3>

                  <p className="mt-0.5 text-[11px] text-slate-500">{selectedFile.pages || 0} pages</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="min-h-0 flex-1 bg-slate-100 p-3">
              {loadingPdf ? (
                <div className="flex h-full min-h-[320px] w-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-center">
                  <LoaderCircle className="mb-4 h-9 w-9 animate-spin text-blue-600" />

                  <h3 className="text-sm font-semibold text-slate-800">Preparing your document</h3>

                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
                    Please wait while we securely load the PDF preview.
                  </p>
                </div>
              ) : pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  title={selectedFile.originalName}
                  className="h-full w-full rounded-xl border border-slate-200 bg-white"
                />
              ) : (
                <div className="flex h-full min-h-[320px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                    <FileText className="h-7 w-7 text-slate-400" />
                  </div>

                  <h3 className="text-sm font-semibold text-slate-800">No document selected</h3>

                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
                    Select a document from the order to preview it here.
                  </p>
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-between border-t border-slate-200 px-5 py-3">
              <p className="hidden text-[11px] text-slate-400 sm:block">Securely streamed from Printerly</p>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Close
                </button>

                <a
                  href={`/api/shopkeeper/files/${selectedFile._id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                >
                  <ExternalLink size={14} />
                  Open
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopkeeperDashboard;
