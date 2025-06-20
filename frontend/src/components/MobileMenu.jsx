import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  ArrowRightLeft,
  Bell,
  Bot,
  BriefcaseBusinessIcon,
  ChevronUp,
  Cog,
  HandCoins,
  House,
  Newspaper,
  User2,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { SidebarMenuButton } from "./ui/sidebar";
import { Button } from "./ui/button";
import { UpdateWalletModal } from "./modals/update-wallet";

export function MobileMenu({ open, onClose, user, wallet, setWallet }) {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        document.body.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
    return false;
  });

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) =>
      setDark(document.body.classList.contains("dark") || e.matches);
    mq.addEventListener("change", handler);
    // Listen for manual theme toggle (class change)
    const observer = new MutationObserver(() => {
      setDark(document.body.classList.contains("dark"));
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      mq.removeEventListener("change", handler);
      observer.disconnect();
    };
  }, []);

  function handleSignOut() {
    Cookies.remove("token");
    window.location.href = "/";
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-red-muted bg-opacity-40 flex justify-end">
      <UpdateWalletModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        wallet={wallet}
        setWallet={setWallet}
      />
      <div className="w-full h-full max-w-full bg-muted shadow-lg p-6 relative flex flex-col">
        <button
          className="absolute top-4 right-4 text-black dark:text-white"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex justify-center items-center w-full mt-14">
          <img
            src={dark ? "/img/R3BOOT.png" : "/img/R3BOOT_BLACK.png"}
            alt="Logo de R3BOOT"
            className="w-36"
          />
        </div>
        <div className="flex flex-col gap-2 mt-16 flex-1 px-6 space-y-3">
          <span>Summary</span>
          <Link
            className="flex gap-6 text-lg tracking-wider items-center"
            to={"/my-account"}
            onClick={onClose}
          >
            <Bot />
            <span>Chat</span>
          </Link>
          <Link
            className="flex gap-6 text-lg tracking-wider items-center"
            to={"/my-account"}
            onClick={onClose}
          >
            <HandCoins />
            <span>Market</span>
          </Link>
          <button
            className="flex gap-6 text-lg tracking-wider items-center"
            onClick={() => setModalOpen(true)}
          >
            <BriefcaseBusinessIcon />
            <span>Wallets</span>
          </button>
          <Link
            className="flex gap-6 text-lg tracking-wider items-center"
            to={"/my-account"}
            onClick={onClose}
          >
            <Newspaper />
            <span>News</span>
          </Link>
          <Link
            className="flex gap-6 text-lg tracking-wider items-center"
            to={"/my-transactions"}
            onClick={onClose}
          >
            <ArrowRightLeft />
            <span>Transactions</span>
          </Link>
        </div>
        <div className="flex flex-col gap-2 mt-4 flex-1 px-6 space-y-3">
          <span>Account</span>
          <Link
            className="flex gap-6 text-lg tracking-wider items-center"
            to={"/my-account"}
            onClick={onClose}
          >
            <Bell />
            <span>Notifications</span>
          </Link>
          <Link
            className="flex gap-6 text-lg tracking-wider items-center"
            to={"/my-account"}
            onClick={onClose}
          >
            <Users />
            <span>Community</span>
          </Link>
          <Link
            className="flex gap-6 text-lg tracking-wider items-center"
            to={"/my-account"}
            onClick={onClose}
          >
            <Cog />
            <span>Settings</span>
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <User2 /> {user.name}
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="min-w-[180px] bg-popover text-popover-foreground border border-border rounded-md shadow-lg p-1"
          >
            <DropdownMenuItem>
              <Button
                variant="default"
                type={"button"}
                onClick={() => handleSignOut()}
                className="w-full justify-start"
              >
                <span>Log Out</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
