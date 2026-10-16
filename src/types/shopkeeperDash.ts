export type OrderActionType = "accepting" | "rejecting" | "completing";

export type OrderActionConfig = {
  status: "Accepted" | "Rejected" | "Completed";
  loadingState: OrderActionType;
  confirmTitle: string;
  confirmMessage: string;
  confirmText: string;
  cancelText: string;
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  errorMessage: string;
  dialogType: "confirm" | "danger";
};

export const orderActionConfig: Record<OrderActionType, OrderActionConfig> = {
  accepting: {
    status: "Accepted",
    loadingState: "accepting",
    confirmTitle: "Accept this order?",
    confirmMessage: "The customer will be notified that you accepted this order.",
    confirmText: "Accept Order",
    cancelText: "Cancel",
    successTitle: "Order accepted",
    successMessage: "The order has been accepted successfully.",
    errorTitle: "Unable to accept order",
    errorMessage: "Failed to accept the order. Please try again.",
    dialogType: "confirm",
  },
  rejecting: {
    status: "Rejected",
    loadingState: "rejecting",
    confirmTitle: "Reject this order?",
    confirmMessage: "The customer will be notified that you rejected this order.",
    confirmText: "Reject Order",
    cancelText: "Keep Order",
    successTitle: "Order rejected",
    successMessage: "The order has been rejected successfully.",
    errorTitle: "Unable to reject order",
    errorMessage: "Failed to reject the order. Please try again.",
    dialogType: "danger",
  },
  completing: {
    status: "Completed",
    loadingState: "completing",
    confirmTitle: "Mark order as complete?",
    confirmMessage: "Confirm that printing is finished. This order will move to Completed Orders.",
    confirmText: "Mark Complete",
    cancelText: "Cancel",
    successTitle: "Order completed",
    successMessage: "The order has been moved to Completed Orders.",
    errorTitle: "Unable to complete order",
    errorMessage: "Failed to complete the order. Please try again.",
    dialogType: "confirm",
  },
};

export interface ShopRes {
  success: boolean;
  message: string;
  shop?: any;
}

export interface OrderRes {
  success: boolean;
  message: string;
  orders: any[];
}

export interface FileRes {
  success: boolean;
  message: string;
  files: any[];
}

type colorMode = "black_white" | "color";
type pageSize = "A4" | "A3" | "Letter";
type printSide = "single" | "double";
type paymentStatus = "pending" | "paid" | "failed" | "refunded";
type deliveryType = "pickup" | "delivery";
type status = "Pending" | "Accepted" | "Printing" | "Completed" | "Rejected" | "Cancelled";

interface PrintSettings {
  totalPages: number;
  copies: number;
  colorMode: colorMode;

  pageSize: pageSize;

  printSide: printSide;

  binding: boolean;

  lamination: boolean;
}

export interface Order {
  _id?: string;
  customer?:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  shop?: string;
  files?: string[];
  placedAt?: Date;
  status?: status;
  printSettings?: PrintSettings;
  totalPrice?: number;
  paymentStatus?: paymentStatus;
  deliveryType?: deliveryType;
  notes?: string;
  otp?: number;
}

export interface Shop {
  _id: string;
  shopName?: string;
  ownerId?: string;
  address?: string;
  location?: {
    type: "Point";
    coordinates: number[];
  };
  openingHours?: string;
  locationUrl?: string;
  pricing?: {
    blackAndWhite: number;
    colorPrint: number;
    lamination: number;
    binding: number;
  };
  services?: string[];
  rating?: number;
  isActive: boolean;
  documents?: string[];
}

export interface File {
  _id: string;

  originalName?: string;
  orderId?: string;
  uploadedBy?: string;
  storageKey?: string;
  fileType?: string;
  fileSize?: number;
  pages?: number;
}
