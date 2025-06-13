import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";

export function UpdateWalletModal({
  open,
  onSave,
  onCancel,
  wallet,
  setWallet,
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Actualizar Wallet</DialogTitle>
          <DialogDescription>
            Ingresa tu wallet y guarda los cambios.
          </DialogDescription>
        </DialogHeader>
        <input
          type="text"
          className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring"
          placeholder="Ingresa tu wallet"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        />
        <DialogFooter className={"flex justify-between w-full"}>
          <button
            className="px-4 py-2 rounded-lg bg-red-200 hover:bg-red-300 dark:bg-red-800 dark:hover:bg-red-700 text-black dark:text-white"
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold"
            onClick={() => onSave(wallet)}
            type="button"
          >
            Guardar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
