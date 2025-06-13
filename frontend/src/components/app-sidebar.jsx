import React, { useEffect, useState } from "react";
import {
  User2,
  ChevronUp,
  BriefcaseBusinessIcon,
  Newspaper,
  ArrowRightLeft,
  HandCoins,
  Bell,
  Cog,
  Users,
  Plus,
  Bot,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarFooter, SidebarHeader } from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import Cookies from "js-cookie";
import { UpdateWalletModal } from "./modals/update-wallet";

const itemsOverview = [
  {
    title: "Bot",
    url: "/my-account",
    icon: Bot,
  },
  {
    title: "Market",
    url: "#",
    icon: HandCoins,
  },
  {
    title: "Wallets",
    url: "#",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "News",
    url: "#",
    icon: Newspaper,
  },
  {
    title: "Transactions",
    url: "#",
    icon: ArrowRightLeft,
  },
];

const itemsAccount = [
  {
    title: "Notifications",
    url: "#",
    icon: Bell,
  },
  {
    title: "Community",
    url: "#",
    icon: Users,
  },
  {
    title: "Settings",
    url: "#",
    icon: Cog,
  },
];

export function AppSidebar({ user, getBalancesFunction }) {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        document.body.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
    return false;
  });

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

  const [modalOpen, setModalOpen] = useState(false);
  const [wallet, setWallet] = useState(user.wallet || "");

  function saveWallet() {
    const formData = new FormData();
    formData.append("wallet", wallet);

    const token = Cookies.get("token");

    fetch("http://159.223.111.198:8000/api/edit-wallet", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Puedes manejar la respuesta aquí si lo necesitas
        if (typeof getBalancesFunction === "function") {
          getBalancesFunction();
        }
      })
      .catch((err) => {
        // Manejo de errores opcional
        console.error(err);
      });
    setModalOpen(false);
  }

  return (
    <Sidebar className="!bg-muted" collapsible="icon">
      <div className="pt-8 flex flex-col items-center px-2">
        <img
          src={dark ? "/img/R3BOOT.png" : "/img/R3BOOT_BLACK.png"}
          alt="Logo de R3BOOT"
          className="w-28 pb-6"
        />
      </div>
      <SidebarContent>
        <div className="pt-4 flex gap-6  px-6">
          <select className="w-2/3 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-popover text-popover-foreground transition-all dark:bg-[#232323] dark:text-white">
            <option>Mantle</option>
            <option>Ethereum</option>
          </select>
          <button
            type="button"
            title="Agregar Wallet"
            className="p-0 rounded-full dark:text-white text-black"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="size-6" />
          </button>
        </div>
        <UpdateWalletModal
          open={modalOpen}
          onSave={saveWallet}
          onCancel={() => setModalOpen(false)}
          wallet={wallet}
          setWallet={setWallet}
        />
        <SidebarGroup>
          <SidebarGroupLabel>Summary</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsOverview.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsAccount.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
