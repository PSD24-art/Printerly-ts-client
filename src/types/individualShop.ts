export interface ShopPricing {
  blackAndWhite: number;
  colorPrint: number;
  lamination: number;
  binding: number;
}
export interface ShopDetails {
  _id: string;
  shopName: string;
  address: string;
  openingHours: string;
  services: string[];
  rating: number;
  pricing: ShopPricing;
  locationUrl?: string;
  isActive: boolean;
}
export interface PrintConfig {
  copies: number;
  colorMode: "black_white" | "color";
  pageSize: "A4" | "A3" | "Letter";
  printSide: "single" | "double";
  binding: boolean;
  lamination: boolean;
}
export interface SelectedFile {
  file: File;
  pages: number;
  loading: boolean;
}
export interface PriceBreakdown {
  printingCost: number;
  bindingCost: number;
  laminationCost: number;
  totalPrice: number;
  printableSheets: number;
}
