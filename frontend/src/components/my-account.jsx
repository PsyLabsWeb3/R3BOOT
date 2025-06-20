import { useState, useRef, useEffect, use } from "react";
import { Button } from "./ui/button";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { useLoaderData } from "react-router-dom";
import Cookies from "js-cookie";
import { Eye, Icon, Menu, Wallet } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { getBalance, getMovements } from "../lib/functions";
import "./ui/circle-loader.css";
import { ModalIframe } from "./modals/modal-iframe";
import { UpdateWalletModal } from "./modals/update-wallet";
import LoaderSplash from "./animations/loader-splash";

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

  const [userTyping, setUserTyping] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [message, setMessage] = useState("");

  const messagesContainerRef = useRef(null);
  // Función para hacer scroll hacia abajo
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 50);
  };

  const [urlCrypto, setUrlCrypto] = useState(null);
  const [modalCrypto, setModalCrypto] = useState(false);

  const [updateModalWallet, setUpdateModalWallet] = useState(false);
  const [walletInfo, setWalletInfo] = useState(userInfo.wallet);
  useEffect(() => {
    scrollToBottom();
  }, [userConversation, userTyping, agentTyping, message]);

  function handleSubmit() {
    handleSubmitWithMessage(message);
  }

  function handleSubmitWithMessage(messageToSend) {
    setUserTyping(false);

    setUserConversation((prev) => [
      ...prev,
      {
        type: 1,
        message: messageToSend,
      },
    ]);

    setMessage("");
    scrollToBottom();

    setAgentTyping(true);

    const formData = new FormData();
    formData.append("message", messageToSend);

    const cookies = Cookies.get("token");

    fetch("https://backend.r3boot-ai.xyz/api/receive-message", {
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
        if (data?.action == true) {
          setUrlCrypto(data?.url);
          setModalCrypto(true);
        }
        if (data?.modal_wallet == true) {
          setUpdateModalWallet(true);
          setWalletInfo(userInfo.wallet);
        }
      })
      .catch(() => setAgentTyping(false));
  }
  function handleTyping(event) {
    const inputValue = event.target.value;
    if (inputValue.length === 0) {
      setUserTyping(false);
    } else {
      setUserTyping(true);
    }
    setMessage(inputValue);
    scrollToBottom();
  }

  useEffect(() => {
    getBalancesFunction(1);
  }, []);

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
    if (userInfo.wallet != null) {
      if (walletInfo != userInfo.wallet) {
        getBalancesFunction(2);
      }
    }
  }, [walletInfo]);
  async function createWalletButton() {
    const newMessage = "Create Wallet";
    setMessage(newMessage);
    handleSubmitWithMessage(newMessage);
  }

  // Animación de puntos para typing
  function TypingDots() {
    return (
      <span className="inline-flex gap-1 items-end h-5">
        <span className="dot-typing" style={{ animationDelay: "0s" }}>
          .
        </span>
        <span className="dot-typing" style={{ animationDelay: "0.2s" }}>
          .
        </span>
        <span className="dot-typing" style={{ animationDelay: "0.4s" }}>
          .
        </span>
        <style>{`
        .dot-typing {
          display: inline-block;
          font-size: 2rem;
          line-height: 1;
          transform: translateY(0);
          animation: dot-bounce 1s infinite;
        }
        @keyframes dot-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
      `}</style>
      </span>
    );
  }

  return (
    <SidebarProvider>
      <LoaderSplash />
      <ModalIframe
        open={modalCrypto}
        onCancel={() => setModalCrypto(false)}
        url={urlCrypto}
      />
      <UpdateWalletModal
        open={updateModalWallet}
        onCancel={() => setUpdateModalWallet(false)}
        wallet={walletInfo}
        setWallet={setWalletInfo}
      />
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
          wallet={walletInfo}
          setWallet={setWalletInfo}
        />
        <AppSidebar
          user={userInfo}
          getBalancesFunction={getBalancesFunction}
          wallet={walletInfo}
          setWallet={setWalletInfo}
        />
        <main className="w-full">
          <div className="float-start items-center sm:flex h-1/12 sm:ml-4 hidden">
            <SidebarTrigger />
          </div>
          <div className="sm:flex sm:gap-8 w-full sm:h-11/12 h-full pb-6 pl-6 pr-4 sm:pr-0 sm:px-10 dark:bg-black bg-[#e7e7e7] sm:rounded-tl-4xl pt-6 sm:pt-4 sm:py-8">
            <div className="hidden w-1/3 sm:flex sm:flex-col gap-8">
              <div className="w-full h-full bg-muted rounded-3xl border-2 overflow-y-auto pt-2 px-2">
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
              </div>
              <div className="w-full h-full bg-muted border-2 rounded-3xl px-2 overflow-auto">
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
                      className={`flex w-full gap-2 pt-2 pb-4 ${
                        idx !== movements.length - 1 ? " border-b" : ""
                      }`}
                    >
                      <div className="w-1/5 flex items-center pl-2">
                        <span className={`text-sm font-normal `}>
                          {movement.type}
                        </span>
                      </div>
                      <div className="text-left w-1/5">
                        <span
                          className="text-sm font-normal line-clamp-1"
                          title={movement.amount}
                        >
                          {movement.amount}
                        </span>
                      </div>
                      <div className="text-left w-1/5">
                        <span
                          className="text-sm font-normal line-clamp-1"
                          title={`${movement.from} ... ${movement.to}`}
                        >
                          {`${movement.from?.slice(-4) || ""} ... ${
                            movement.to?.slice(-4) || ""
                          }`}
                        </span>
                      </div>
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
                  ))}
              </div>
            </div>
            <div className="sm:w-[105vh] w-full h-[87vh] sm:h-full flex items-center justify-center bg-muted rounded-3xl p-0 border-0 sm:mr-0 min-h-[500px]">
              <div className="w-full h-full space-y-0 flex flex-col rounded-3xl overflow-hidden shadow-none p-0 bg-muted border-2 min-h-[500px]">
                {/* Header */}
                <div className="flex flex-row bg-muted items-center justify-between px-6 py-4 m-0 h-[10vh] border-b-0">
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
                </div>{" "}
                {/* Body */}{" "}
                <div
                  className="px-4 overflow-auto h-[75vh]"
                  ref={messagesContainerRef}
                >
                  <div className="flex flex-col gap-2 min-h-full pb-4">
                    {userConversation.length === 0 && (
                      <div className="text-center">
                        <div className="text-center text-muted-foreground mt-4">
                          You don't have any messages yet.
                        </div>
                        <div className="mt-4">
                          <button
                            className="bg-muted text-muted-foreground border-2 px-4 py-2 rounded-lg hover:bg-muted-foreground hover:text-muted transition-colors"
                            onClick={() => createWalletButton()}
                          >
                            Create Wallet
                          </button>
                        </div>
                      </div>
                    )}
                    {userConversation &&
                      userConversation.map((message, idx) => {
                        let content = message?.message;
                        let link = null;
                        if (content && content.includes("Payment Link:")) {
                          //Explota por el ultimo espacio
                          const match = content.match(
                            /Payment Link:\s*(https?:\/\/\S+)/
                          );
                          if (match) {
                            link = match[1];
                            // Separa el texto antes y después del link
                            const [before, after] = content.split(match[0]);
                            content = (
                              <>
                                {before}
                                Payment Link:{" "}
                                <button
                                  onClick={() => {
                                    setUrlCrypto(link);
                                    setModalCrypto(true);
                                  }}
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline break-all text-left"
                                >
                                  {link}
                                </button>
                                {after}
                              </>
                            );
                          }
                        }
                        return (
                          <div
                            className={
                              message?.type == 0
                                ? "self-start bg-[#e9e9e9] dark:bg-[#ffffff20] rounded-lg px-4 py-2 max-w-[75%]"
                                : "self-end text-white bg-black dark:bg-white dark:text-black rounded-lg px-4 py-2 max-w-[75%]"
                            }
                            key={idx}
                          >
                            <span className="break-words whitespace-pre-line block w-full">
                              {content}
                            </span>
                          </div>
                        );
                      })}
                    {userTyping && (
                      <div className="flex justify-end">
                        <div className="mt-4 self-end bg-black text-white dark:text-black dark:bg-white rounded-lg px-4 py-2 max-w-[75%] shadow pointer-events-none">
                          <TypingDots />
                        </div>
                      </div>
                    )}
                    {agentTyping && (
                      <div className="flex justify-start">
                        <div className="left-4 self-start bg-[#e9e9e9] dark:bg-[#ffffff20] rounded-lg px-4 py-2 max-w-[75%] shadow pointer-events-none">
                          <span>
                            <TypingDots />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Footer */}
                <form className="p-4 flex gap-2 h-[10vh] bg-muted px-4 ">
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
