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
import Cookies from "js-cookie";

export function UpdateWalletModal({ open, onCancel, wallet, setWallet }) {
  function saveWallet() {
    const formData = new FormData();
    formData.append("wallet", wallet);

    const token = Cookies.get("token");
    fetch("https://backend.r3boot-ai.xyz/api/edit-wallet", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof getBalancesFunction == "function") {
          getBalancesFunction(2);
        }
      })
      .catch((err) => {
        // Manejo de errores opcional
        console.error(err);
      });
    onCancel(false);
  }
  return (
    <Dialog open={open} onOpenChange={() => onCancel(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Wallet</DialogTitle>
          <DialogDescription>
            Enter your wallet and save the changes.
          </DialogDescription>
        </DialogHeader>
        <input
          type="text"
          className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring"
          placeholder="Enter your wallet"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        />
        <DialogFooter className={"flex justify-between w-full"}>
          <button
            className="px-4 py-2 sm:block hidden rounded-lg bg-red-200 hover:bg-red-300 dark:bg-red-800 dark:hover:bg-red-700 text-black dark:text-white"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold"
            onClick={() => saveWallet()}
            type="button"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
