export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  timestamp: number;
}

export interface ToastOptions {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}
