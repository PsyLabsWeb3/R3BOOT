import { useState, useRef, useEffect, use } from "react";
import { Button } from "./ui/button";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { useLoaderData } from "react-router-dom";
import Cookies from "js-cookie";
import { Menu, Wallet } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { getBalance, getMovements } from "../lib/functions";
import "./ui/circle-loader.css";

export function MyAccount() {
  const { user, balance } = useLoaderData();

  const [userInfo, setUserInfo] = useState({
    name: user?.name || null,
    email: user?.email || null,
    wallet: user?.wallet || null,
  });

  const [userConversation, setUserConversation] = useState(user?.messages);
  const [movements, setMovements] = useState([]);
  const [crypto, setCrypto] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [loadingMovements, setLoadingMovements] = useState(false);

  const exampleMovemenmts = [
    {
      type: "Received",
      amount: "0.5 BTC",
      status: "Completed",
    },
    {
      type: "Sent",
      amount: "1.2 ETH",
      status: "Pending",
    },
    {
      type: "Received",
      amount: "1000 USDT",
      status: "Completed",
    },
    {
      type: "Sent",
      amount: "0.3 BNB",
      status: "Failed",
    },
    {
      type: "Received",
      amount: "2.5 BTC",
      status: "Completed",
    },
  ];

  const [userTyping, setUserTyping] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [message, setMessage] = useState("");

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [userConversation, userTyping, agentTyping]);

  function handleSubmit() {
    setUserTyping(false);

    setUserConversation((prev) => [
      ...prev,
      {
        type: 1,
        message: message,
      },
    ]);

    setMessage("");

    setAgentTyping(true);

    const formData = new FormData();
    formData.append("message", message);

    const cookies = Cookies.get("token");

    fetch("http://159.223.111.198:8000/api/receive-message", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${cookies}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserConversation((prev) => [
          ...prev,
          {
            type: 0,
            message: data.response,
          },
        ]);
        setAgentTyping(false);
      })
      .catch(() => setAgentTyping(false));
  }

  function handleTyping(event) {
    const inputValue = event.target.value;
    if (event.target.value == 0) {
      setUserTyping(false);
    } else {
      setUserTyping(true);
    }
    setMessage(inputValue);
  }

  useEffect(() => {
    getBalancesFunction();
  }, []);

  async function getBalancesFunction() {
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

  //Actualizar Widgets
  //Cuando se actualiza la Wallet
  //Calidar leyendas de cuando no hay wallet -
  //Loader de cargando transacciones

  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden bg-[#e7e7e7] sm:dark:bg-muted dark:bg-black sm:bg-muted sm:flex w-full">
        <div className="sm:hidden flex pt-4 pl-6">
          <button onClick={() => setMenuOpen(true)}>
            <Menu />
          </button>
        </div>
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          user={userInfo}
        />
        <AppSidebar user={userInfo} getBalancesFunction={getBalancesFunction} />
        <main className="w-full">
          <div className="float-start items-center sm:flex h-1/12 sm:ml-4 hidden">
            <SidebarTrigger />
          </div>
          <div className="sm:flex sm:gap-8 w-full sm:h-11/12 h-full pb-6 pl-6 sm:px-10 dark:bg-black bg-[#e7e7e7] sm:rounded-tl-4xl pt-6 sm:pt-4 sm:py-8">
            <div className="hidden w-1/3 sm:flex sm:flex-col gap-8">
              <div className="w-full h-full bg-muted rounded-3xl border-2 overflow-scroll pt-2 px-2">
                {(loadingBalances || crypto.length === 0) && (
                  <div className="flex flex-1 min-h-[120px] items-center justify-center">
                    {userInfo.wallet == null ? (
                      "Add your wallet to display this information."
                    ) : loadingBalances ? (
                      <div className="circle-loader" />
                    ) : (
                      "Your wallet doesn't have crypto..."
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
              </div>
              <div className="w-full h-full bg-muted border-2 rounded-3xl px-2 overflow-auto">
                {(loadingMovements || movements.length === 0) && (
                  <div className="flex flex-col items-center justify-center mt-4 h-full">
                    {userInfo.wallet == null ? (
                      "Add your wallet to display this information."
                    ) : loadingMovements ? (
                      <div className="circle-loader" />
                    ) : (
                      "Your wallet doesn't have transactions."
                    )}
                    <br />
                  </div>
                )}
                {!loadingMovements &&
                  movements.map((movement, idx) => (
                    <div
                      key={idx}
                      className={`flex w-full gap-2 pt-2 pb-4 ${
                        idx !== movements.length - 1 ? " border-b" : ""
                      }`}
                    >
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
                      <div className="text-right w-1/3">
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
                  ))}
              </div>
            </div>
            <div className="sm:w-2/3 h-[87vh] sm:h-full flex items-center justify-center bg-muted rounded-3xl p-0 border-0 mr-6 sm:mr-0">
              <div className="w-full h-full space-y-0 flex flex-col rounded-3xl overflow-hidden shadow-none p-0 bg-muted border-2">
                <div className="flex flex-row bg-muted items-center justify-between px-6 py-4 m-0 border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="text-black dark:text-white rounded-full flex items-center justify-center p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </div>
                    <span className="font-normal text-lg">Agent</span>
                  </div>
                </div>
                <div className="flex-1 bg-muted px-6 py-4 relative m-0">
                  {/* Contenedor de chat con scroll solo en los mensajes, mensajes nuevos abajo */}
                  <div className="relative h-full w-full flex flex-col justify-end">
                    <div
                      className="overflow-auto w-full"
                      style={{ maxHeight: "calc(100vh - 320px)" }}
                      ref={messagesContainerRef}
                    >
                      <div className="flex flex-col-reverse gap-2 justify-end min-h-[200px]">
                        {userConversation.length === 0 && (
                          <div className="text-center text-muted-foreground mt-4">
                            You don't have any messages yet.
                          </div>
                        )}
                        {userConversation &&
                          [...userConversation]
                            .reverse()
                            .map((message, idx) => (
                              <div
                                className={
                                  message?.type == 0
                                    ? "self-start bg-[#e9e9e9] dark:bg-[#ffffff20] rounded-lg px-4 py-2 max-w-[75%]"
                                    : "self-end text-white bg-black dark:bg-white dark:text-black rounded-lg px-4 py-2 max-w-[75%]"
                                }
                                key={idx}
                              >
                                <span> {message?.message} </span>
                              </div>
                            ))}
                      </div>
                      {userTyping && (
                        <div className="flex justify-end">
                          <div className="mt-4 self-end bg-black text-white dark:text-black dark:bg-white rounded-lg px-4 py-2 max-w-[75%] shadow pointer-events-none">
                            <span>Typing...</span>
                          </div>
                        </div>
                      )}
                      {agentTyping && (
                        <div className="flex justify-start">
                          <div className="left-4 self-start bg-[#e9e9e9] dark:bg-[#ffffff20] rounded-lg px-4 py-2 max-w-[75%] shadow pointer-events-none">
                            <span>Agent Typing...</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Indicadores typing fuera del scroll */}
                  </div>
                </div>
                <form className="p-4 flex gap-2 bg-muted px-4 ">
                  <div className="border-3 w-full flex rounded-lg px-4 py-1 bg-[#fffff20]">
                    <input
                      type="text"
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => {
                        handleTyping(e);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                      className="flex-1 rounded-lg px-3 py-2 focus:outline-none border-0"
                    />
                    <Button
                      variant={"ghost"}
                      type="button"
                      onClick={() => handleSubmit()}
                      className="flex items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black "
                    >
                      {/* Icono de flecha hacia arriba */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className=""
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
