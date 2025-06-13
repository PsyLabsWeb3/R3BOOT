import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { LoginForm } from "@/components/login-form";
import { CreateAccountForm } from "@/components/create-account-form";
import { MyAccount } from "@/components/my-account";
import { ThemeToggle } from "@/components/theme-toggle";
import { getBalance, getSanctumUser } from "./lib/functions";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginForm />,
    },
    {
      path: "/create-account",
      element: <CreateAccountForm />,
    },
    {
      path: "/my-account",
      lazy: async () => {
        try {
          const user = await getSanctumUser();

          return {
            loader: () => ({ user }),
            Component: MyAccount,
          };
        } catch (error) {
          window.location.href = "/login";
          return {
            error: () => <div>Error al cargar la cuenta: {error.message}</div>,
          };
        }
      },
    },
    {
      path: "/",
      element: <LoginForm />,
    },
  ]);

  return (
    <div className="min-h-screen w-full bg-muted">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
