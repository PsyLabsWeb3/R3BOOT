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
  Eye,
  HandCoins,
  House,
  Menu,
  Newspaper,
  User2,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { MobileMenu } from "./MobileMenu";
import { SidebarProvider } from "./ui/sidebar";
import { getBalance, getMovements } from "../lib/functions";

export function TransactionsPage() {
  const { user } = useLoaderData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: user?.name || null,
    email: user?.email || null,
    wallet: user?.wallet || null,
  });
  const [walletInfo, setWalletInfo] = useState(null);

  const [crypto, setCrypto] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [loadingMovements, setLoadingMovements] = useState(false);

  async function getBalancesFunction(status) {
    if (userInfo.wallet != null) {
      setLoadingBalances(true);
      setLoadingMovements(true);
      const balances = await getBalance();

      if (balances && balances.balance) {
        try {
          const parsed = JSON.parse(balances.balance);
          setCrypto(parsed);
        } catch (e) {
          setCrypto([]);
        }
      }
      setLoadingBalances(false);

      const movements = await getMovements();
      if (movements && movements.balance) {
        try {
          const parsedMovements = JSON.parse(movements.balance);
          setMovements(parsedMovements);
        } catch (e) {
          setMovements([]);
        }
      }
      setLoadingMovements(false);
    } else {
      if (status == 2) {
        setLoadingBalances(true);
        setLoadingMovements(true);
        const balances = await getBalance();

        if (balances && balances.balance) {
          try {
            const parsed = JSON.parse(balances.balance);
            setCrypto(parsed);
          } catch (e) {
            setCrypto([]);
          }
        }
        setLoadingBalances(false);

        const movements = await getMovements();
        if (movements && movements.balance) {
          try {
            const parsedMovements = JSON.parse(movements.balance);
            setMovements(parsedMovements);
          } catch (e) {
            setMovements([]);
          }
        }
        setLoadingMovements(false);
      }
    }
  }

  useEffect(() => {
    getBalancesFunction(1);
  }, []);

  return (
    <SidebarProvider>
      <div className="overflow-auto custom-scroll bg-[#e7e7e7] sm:dark:bg-muted dark:bg-black sm:bg-muted sm:flex w-full">
        <div className="sm:hidden flex pt-4 pl-6">
          <button onClick={() => setMenuOpen(true)}>
            <Menu />
          </button>
        </div>
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          user={userInfo}
          wallet={walletInfo}
          setWallet={setWalletInfo}
        />
        <div className="space-y-8 mt-9 px-6">
          <div className="ml-2 text-xl">
            <span>Balances</span>
          </div>
          <div className="w-full h-1/2 bg-muted rounded-3xl border-2 overflow-y-scroll overflow-x-hidden custom-scroll pt-2 px-2">
            {(loadingBalances || crypto.length === 0) && (
              <div className="flex flex-1 min-h-[120px] items-center justify-center">
                {loadingBalances == true ? (
                  <div className="circle-loader" />
                ) : userInfo.wallet == null ? (
                  <span className="text-muted-foreground">
                    Add your wallet to display this information.
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    Your wallet doesn't have crypto...
                  </span>
                )}
              </div>
            )}
            {!loadingBalances &&
              crypto.map((crypto_i, idx) => (
                <div
                  key={crypto_i.sku}
                  className={`flex w-full gap-2 pt-2 pb-4 ${
                    idx !== crypto.length - 1 ? " border-b" : ""
                  }`}
                >
                  <div className="w-1/5 flex items-center pl-2">
                    <img
                      src={crypto_i.icon}
                      alt={`${crypto_i.sku}`}
                      className="size-8 rounded-full"
                    />
                  </div>
                  <div className="text-left w-2/5">
                    <span
                      className="text-sm font-semibold line-clamp-1"
                      title={crypto_i.sku}
                    >
                      {crypto_i.sku}
                    </span>
                    <span
                      className="text-xs font-medium line-clamp-1 mt-2"
                      title={crypto_i.sku}
                    >
                      {crypto_i.sku}
                    </span>
                  </div>
                  <div className="text-right w-2/5 items-center">
                    <span
                      className="text-sm text-muted-foreground line-clamp-1"
                      title={`${Number(crypto_i.balance).toFixed(2)}} ${
                        crypto_i.sku
                      }`}
                    >
                      {Number(crypto_i.balance).toFixed(2)} {crypto_i.sku}
                    </span>
                  </div>
                </div>
              ))}
          </div>{" "}
          <div className="ml-2 text-xl">
            <span>Movements</span>
          </div>
          <div className="w-full h-full bg-muted border-2 rounded-3xl px-2 overflow-scroll custom-scroll">
            {(loadingMovements || movements.length === 0) && (
              <div className="flex flex-col items-center justify-center mt-4 h-full">
                {loadingMovements == true ? (
                  <div className="circle-loader" />
                ) : userInfo.wallet == null ? (
                  <span className="text-muted-foreground">
                    Add your wallet to display this information.
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    Your wallet doesn't have transactions.
                  </span>
                )}
                <br />
              </div>
            )}
            {!loadingMovements &&
              movements.map((movement, idx) => (
                <div
                  key={idx}
                  className={`w-full gap-2 pt-2 pb-4 ${
                    idx !== movements.length - 1 ? " border-b" : ""
                  }`}
                >
                  <div className="flex mt-4">
                    <div className="w-1/3 flex items-center pl-2">
                      <span className={`text-sm font-normal `}>
                        {movement.type}
                      </span>
                    </div>
                    <div className="text-left w-1/3">
                      <span
                        className="text-sm font-normal line-clamp-1"
                        title={movement.amount}
                      >
                        {movement.amount}
                      </span>
                    </div>
                    <div className="text-left w-1/3">
                      <span
                        className="text-sm font-normal line-clamp-1"
                        title={`${movement.from} ... ${movement.to}`}
                      >
                        {`${movement.from?.slice(-4) || ""} ... ${
                          movement.to?.slice(-4) || ""
                        }`}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pr-10 mt-2">
                    <div className="text-right flex justify-end items-center pr-2 ml-2">
                      <a
                        className="text-xs font-normal"
                        title={movement.amount}
                        href={movement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye size={17} className="align-middle" />
                      </a>
                    </div>
                    <div className="text-right w-1/5">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-3xl ${
                          movement.status === "Completed"
                            ? "text-green-600 bg-green-200 dark:bg-green-900 dark:text-green-100"
                            : movement.status === "Pending"
                            ? "text-yellow-600 bg-yellow-200  dark:bg-yellow-900 dark:text-yellow-100"
                            : "text-red-600 bg-red-200 dark:bg-red-900 dark:text-red-100"
                        }`}
                      >
                        {movement.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
