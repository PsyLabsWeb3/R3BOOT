import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function CreateAccountForm({ className, ...props }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [alert, setAlert] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

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

  function handleCreateAccount() {
    if (
      email === "" ||
      password === "" ||
      passwordConfirm === "" ||
      name === ""
    ) {
      setAlert("error");
      setAlertMessage("Por favor, completa todos los campos.");
      return;
    }

    if (password !== passwordConfirm) {
      setAlert("error");
      setAlertMessage("Las contraseñas no coinciden.");
      return;
    } else {
      if (password.length <= 6) {
        setAlert("error");
        setAlertMessage("La contraseña debe tener más de 6 caracteres.");
        return;
      }
    }

    // Aquí iría la lógica para crear la cuenta, por ejemplo, una llamada a una API
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirm);

    const response = fetch("http://159.223.111.198:8000/api/register", {
      method: "POST",
      body: formData,
    });

    response
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          setAlert("error");
          setAlertMessage(errorData.message || "Error al crear la cuenta.");
          return;
        }
        const data = await res.json();
        const token = data.token;
        // Puedes guardar el token en localStorage o en una variable de estado global
        Cookies.set("token", token);
        // Redirigir o limpiar formulario si lo deseas
        window.location.href = "/my-account";
      })
      .catch(() => {
        setAlert("error");
        setAlertMessage("Error de red al crear la cuenta.");
      });
  }

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center bg-muted overflow-hidden",
        className
      )}
      {...props}
    >
      <form className="sm:w-1/4 w-full mx-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <img
              src={dark ? "/img/R3BOOT.png" : "/img/R3BOOT_BLACK.png"}
              alt="R3BOOT logo"
              className="w-32 pb-6"
            />
            <span className="text-xl font-bold">Create Account</span>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="underline underline-offset-4 text-black dark:text-white"
              >
                Sign In
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password_confirm">Confirm Password</Label>
              <Input
                id="password_confirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </div>
            {alert && (
              <div
                className={
                  "text-red-500 dark:text-red-700 rounded-md text-sm text-center"
                }
              >
                {alertMessage === "Por favor, completa todos los campos."
                  ? "Please fill in all fields."
                  : alertMessage === "Las contraseñas no coinciden."
                  ? "Passwords do not match."
                  : alertMessage ===
                    "La contraseña debe tener más de 6 caracteres."
                  ? "Password must be longer than 6 characters."
                  : alertMessage === "Error al crear la cuenta."
                  ? "Error creating account."
                  : alertMessage === "Error de red al crear la cuenta."
                  ? "Network error while creating account."
                  : alertMessage}
              </div>
            )}
            <Button
              type={"button"}
              onClick={() => handleCreateAccount()}
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </div>
        <div className="mt-4 text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking Create Account, you accept our{" "}
          <Link to="#" className="text-black dark:text-white">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="#" className="text-black dark:text-white">
            Privacy Policy
          </Link>
          .
        </div>
      </form>
    </div>
  );
}
