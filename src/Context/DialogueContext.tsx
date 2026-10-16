import { createContext, useContext, useState, type ReactNode } from "react";
import ConfirmDialog from "../components/Utility/ConfirmDialog";

type DialogType = "confirm" | "alert" | "warning" | "danger";

interface DialogOptions {
  type: DialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface DialogContextType {
  showDialog: (options: DialogOptions) => Promise<boolean | void>;
}

const DialogContext = createContext<DialogContextType | null>(null);

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [dialog, setDialog] = useState<DialogOptions | null>(null);

  const [resolver, setResolver] = useState<((value: boolean | void) => void) | null>(null);

  const showDialog = (options: DialogOptions): Promise<boolean | void> => {
    setDialog(options);

    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    resolver?.(true);

    setDialog(null);
    setResolver(null);
  };

  const handleCancel = () => {
    resolver?.(false);

    setDialog(null);
    setResolver(null);
  };

  const handleCloseAlert = () => {
    resolver?.();

    setDialog(null);
    setResolver(null);
  };

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}

      {dialog && (
        <ConfirmDialog
          {...dialog}
          onConfirm={dialog.type === "alert" ? handleCloseAlert : handleConfirm}
          onCancel={dialog.type === "alert" ? handleCloseAlert : handleCancel}
        />
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used inside DialogProvider");
  }

  const { showDialog } = context;

  const confirm = async (options: Omit<DialogOptions, "type">): Promise<boolean> => {
    const result = await showDialog({
      ...options,
      type: "confirm",
    });

    return result === true;
  };

  const alert = async (options: Omit<DialogOptions, "type">): Promise<void> => {
    await showDialog({
      ...options,
      type: "alert",
    });
  };

  const warning = async (options: Omit<DialogOptions, "type">): Promise<boolean> => {
    const result = await showDialog({
      ...options,
      type: "warning",
    });

    return result === true;
  };

  const danger = async (options: Omit<DialogOptions, "type">): Promise<boolean> => {
    const result = await showDialog({
      ...options,
      type: "danger",
    });

    return result === true;
  };

  return {
    confirm,
    alert,
    warning,
    danger,
  };
};
