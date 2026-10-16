import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import safeAsync from "../utils/safeAsync";
import { fetchFn } from "../utils/fetchFn";
import { getPdfPageCount } from "../utils/pdf";
import calculatePrice, { type PrintConfig } from "../utils/calculatePrice";
import type { PriceBreakdown, SelectedFile, ShopDetails } from "../types/individualShop";

const ShopOrderPage: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [shop, setShop] = useState<ShopDetails | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  const [printConfig, setPrintConfig] = useState<PrintConfig>({
    copies: 1,
    colorMode: "black_white",
    pageSize: "A4",
    printSide: "double",
    binding: false,
    lamination: false,
  });

  // ----------------------------------------
  // Fetch shop
  // ----------------------------------------

  useEffect(() => {
    const fetchShopDetails = async () => {
      if (!shopId) return;

      setLoading(true);

      const [data, err] = await safeAsync(
        fetchFn(`/customer/shop/${shopId}`, {
          method: "GET",
        }),
      );

      if (err || !data?.success) {
        alert("Failed to load shop details.");
        navigate(-1);
        return;
      }

      setShop(data.shop);
      setLoading(false);
    };

    fetchShopDetails();
  }, [shopId, navigate]);

  // ----------------------------------------
  // Total pages
  // ----------------------------------------

  const totalPages = useMemo(() => {
    return selectedFiles.reduce((total, selectedFile) => total + selectedFile.pages, 0);
  }, [selectedFiles]);

  // ----------------------------------------
  // Price calculation
  // ----------------------------------------

  const priceBreakdown = useMemo<PriceBreakdown>(() => {
    if (!shop || totalPages === 0) {
      return {
        printingCost: 0,
        bindingCost: 0,
        laminationCost: 0,
        totalPrice: 0,
        printableSheets: 0,
      };
    }

    const { printingCost, bindingCost, laminationCost, totalPrice, printableSheets } = calculatePrice(
      totalPages,
      printConfig,
      shop.pricing,
    );

    return {
      printingCost,
      bindingCost,
      laminationCost,
      totalPrice,
      printableSheets,
    };
  }, [shop, totalPages, printConfig]);

  // ----------------------------------------
  // File handling
  // ----------------------------------------

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    const pdfFiles = fileArray.filter((file) => file.type === "application/pdf");

    const invalidFiles = fileArray.filter((file) => file.type !== "application/pdf");

    if (invalidFiles.length > 0) {
      alert("Only PDF files are allowed.");
    }

    if (pdfFiles.length === 0) {
      return;
    }

    const newFiles: SelectedFile[] = pdfFiles.map((file) => ({
      file,
      pages: 0,
      loading: true,
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // Calculate page count for each PDF
    for (const file of pdfFiles) {
      try {
        const pages = await getPdfPageCount(file);

        setSelectedFiles((prev) =>
          prev.map((item) =>
            item.file === file
              ? {
                  ...item,
                  pages,
                  loading: false,
                }
              : item,
          ),
        );
      } catch (error) {
        console.error(`Failed to read PDF: ${file.name}`, error);

        setSelectedFiles((prev) => prev.filter((item) => item.file !== file));

        alert(`Could not read ${file.name}.`);
      }
    }
  };

  // ----------------------------------------
  // Drag & Drop
  // ----------------------------------------

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    }

    if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // ----------------------------------------
  // Remove file
  // ----------------------------------------

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ----------------------------------------
  // Place order
  // ----------------------------------------

  const handlePlaceOrder = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!shopId) {
      alert("Shop ID is missing.");
      return;
    }

    if (selectedFiles.length === 0) {
      alert("Please upload at least one PDF file.");
      return;
    }

    const stillCalculating = selectedFiles.some((item) => item.loading);

    if (stillCalculating) {
      alert("Please wait until PDF page counts are calculated.");
      return;
    }

    if (totalPages === 0) {
      alert("Could not determine PDF pages.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("shopId", shopId);

      formData.append(
        "printSettings",
        JSON.stringify({
          totalPages,
          copies: printConfig.copies,
          colorMode: printConfig.colorMode,
          pageSize: printConfig.pageSize,
          printSide: printConfig.printSide,
          binding: printConfig.binding,
          lamination: printConfig.lamination,
        }),
      );

      selectedFiles.forEach((item) => {
        formData.append("documents", item.file);
      });

      const [data, err] = await safeAsync(
        fetchFn("/customer/order", {
          method: "POST",
          body: formData,
        }),
      );

      if (err || !data?.success) {
        alert(data?.message || "Order placement failed.");
        return;
      }

      alert("Order placed successfully!");
      console.log("Order placed successfully!", data);
      // Example:
      // navigate(`/customer/orders/${data.order._id}`);
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------
  // Loading
  // ----------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading shop...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Shop not found.</p>
      </div>
    );
  }

  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to shops
        </button>

        {/* SHOP HEADER */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10.5 4.5 4h15l1.5 6.5M5 10.5V20h14v-9.5M8 20v-5h8v5M3 10.5c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{shop.shopName}</h1>

                  {shop.isActive ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      Open
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                      Unavailable
                    </span>
                  )}
                </div>

                <p className="mt-1.5 text-sm text-slate-500">{shop.address}</p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-4 w-4"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" d="M12 7v5l3 2" />
                    </svg>

                    {shop.openingHours}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-amber-500">★</span>
                    {shop.rating ?? "N/A"}
                  </span>
                </div>

                {shop.services?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {shop.services.map((service: string) => (
                      <span
                        key={service}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="hidden shrink-0 rounded-xl bg-indigo-50 px-4 py-3 text-right sm:block">
              <p className="text-xs font-medium text-indigo-500">Start your order</p>
              <p className="mt-0.5 text-sm font-semibold text-indigo-700">Upload your PDFs</p>
            </div>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-6">
          {/* UPLOAD */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-600">
                  1
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-900">Upload documents</h2>

                  <p className="mt-0.5 text-sm text-slate-500">Add the PDF files you want to print.</p>
                </div>
              </div>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
              cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition sm:p-10
              ${
                isDragActive
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40"
              }
            `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    handleFiles(e.target.files);
                  }

                  e.target.value = "";
                }}
              />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-7 w-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16V4m0 0L8 8m4-4 4 4M5 13v4a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-4"
                  />
                </svg>
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-900">Drop your PDF files here</p>

              <p className="mt-1 text-sm text-slate-500">or click to browse from your device</p>

              <p className="mt-3 text-xs text-slate-400">Only PDF files are supported</p>
            </div>
          </div>

          {/* SELECTED FILES */}
          {selectedFiles.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-600">
                    2
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Selected files</h2>

                    <p className="mt-0.5 text-sm text-slate-500">Review the documents before continuing.</p>
                  </div>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {selectedFiles.length} file
                  {selectedFiles.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {selectedFiles.map((item, index) => (
                  <div
                    key={`${item.file.name}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M8 13h8M8 17h5" />
                      </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{item.file.name}</p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {item.loading ? "Calculating pages..." : `${item.pages} page${item.pages !== 1 ? "s" : ""}`}
                      </p>
                    </div>

                    {item.loading && (
                      <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
                    )}

                    <button
                      type="button"
                      className="shrink-0 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-medium text-slate-600">Total pages</span>

                <span className="text-sm font-semibold text-slate-900">{totalPages}</span>
              </div>
            </div>
          )}

          {/* PRINT SETTINGS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-600">
                3
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">Print settings</h2>

                <p className="mt-0.5 text-sm text-slate-500">Choose how you want your documents printed.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Copies */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Copies</label>

                <input
                  type="number"
                  min={1}
                  max={100}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  value={printConfig.copies}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    setPrintConfig((prev) => ({
                      ...prev,
                      copies: value < 1 ? 1 : value,
                    }));
                  }}
                />
              </div>

              {/* Color */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Color mode</label>

                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  value={printConfig.colorMode}
                  onChange={(e) =>
                    setPrintConfig((prev) => ({
                      ...prev,
                      colorMode: e.target.value as PrintConfig["colorMode"],
                    }))
                  }
                >
                  <option value="black_white">Black & White — ₹{shop.pricing.blackAndWhite}/page</option>

                  <option value="color">Color — ₹{shop.pricing.colorPrint}/page</option>
                </select>
              </div>

              {/* Page size */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Page size</label>

                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  value={printConfig.pageSize}
                  onChange={(e) =>
                    setPrintConfig((prev) => ({
                      ...prev,
                      pageSize: e.target.value as PrintConfig["pageSize"],
                    }))
                  }
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="Letter">Letter</option>
                </select>
              </div>

              {/* Print side */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Print side</label>

                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  value={printConfig.printSide}
                  onChange={(e) =>
                    setPrintConfig((prev) => ({
                      ...prev,
                      printSide: e.target.value as PrintConfig["printSide"],
                    }))
                  }
                >
                  <option value="single">Single-sided</option>
                  <option value="double">Double-sided</option>
                </select>
              </div>
            </div>

            {/* Extra services */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="mb-3 text-sm font-medium text-slate-700">Additional services</p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      checked={printConfig.binding}
                      onChange={(e) =>
                        setPrintConfig((prev) => ({
                          ...prev,
                          binding: e.target.checked,
                        }))
                      }
                    />

                    <span className="text-sm font-medium text-slate-700">Binding</span>
                  </div>

                  <span className="text-sm font-semibold text-slate-500">+₹{shop.pricing.binding}</span>
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      checked={printConfig.lamination}
                      onChange={(e) =>
                        setPrintConfig((prev) => ({
                          ...prev,
                          lamination: e.target.checked,
                        }))
                      }
                    />

                    <span className="text-sm font-medium text-slate-700">Lamination</span>
                  </div>

                  <span className="text-sm font-semibold text-slate-500">+₹{shop.pricing.lamination}</span>
                </label>
              </div>
            </div>
          </div>

          {/* PRICE SUMMARY */}
          {totalPages > 0 && (
            <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Price summary</h2>

                  <p className="mt-0.5 text-sm text-slate-500">Review your estimated order cost.</p>
                </div>

                <div className="rounded-xl bg-indigo-50 px-3 py-2">
                  <span className="text-lg font-bold text-indigo-700">₹{priceBreakdown.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total pages</span>
                  <span className="font-medium text-slate-900">{totalPages}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Copies</span>
                  <span className="font-medium text-slate-900">{printConfig.copies}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Printable sheets</span>
                  <span className="font-medium text-slate-900">
                    {priceBreakdown.printableSheets * printConfig.copies}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Printing</span>
                  <span className="font-medium text-slate-900">₹{priceBreakdown.printingCost.toFixed(2)}</span>
                </div>

                {printConfig.binding && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Binding</span>
                    <span className="font-medium text-slate-900">₹{priceBreakdown.bindingCost.toFixed(2)}</span>
                  </div>
                )}

                {printConfig.lamination && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lamination</span>
                    <span className="font-medium text-slate-900">₹{priceBreakdown.laminationCost.toFixed(2)}</span>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-base font-semibold text-slate-900">Total</span>

                  <span className="text-2xl font-bold text-indigo-600">₹{priceBreakdown.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={submitting || selectedFiles.length === 0 || selectedFiles.some((file) => file.loading)}
            className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting
              ? "Placing Order..."
              : `Place Order${priceBreakdown.totalPrice > 0 ? ` • ₹${priceBreakdown.totalPrice.toFixed(2)}` : ""}`}
          </button>

          <p className="pb-4 text-center text-xs text-slate-400">
            Your documents will be sent to {shop.shopName} for printing.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ShopOrderPage;
