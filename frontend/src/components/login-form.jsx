import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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

  function handleSubmit() {
    // Aquí puedes manejar el envío del formulario
    // Por ejemplo, enviar los datos a tu API de autenticación
    if (email == "" || password == "") {
      setError(true);
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const response = fetch("https://backend.r3boot-ai.xyz/api/login", {
      method: "POST",
      body: formData,
    });

    response
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          setError(true);
          setErrorMessage(errorData.message || "Error creating the account.");
          return;
        }
        const data = await res.json();
        const token = data.token;
        // You can save the token in localStorage or a global state variable
        Cookies.set("token", token);
        // Redirect or clear the form if you wish
        window.location.href = "/my-account";
      })
      .catch(() => {
        setError(true);
        setErrorMessage("Network error when trying to log in.");
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
            <span className="text-xl font-bold">Sign In</span>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/create-account"
                className="underline underline-offset-4 text-black dark:text-white"
              >
                Register
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
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
            {error && (
              <div className="text-red-500 text-sm">
                {errorMessage || "Please fill in all fields."}
              </div>
            )}
            <Button
              type="button"
              onClick={() => handleSubmit()}
              className="w-full"
            >
              Sign In
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="text-muted-foreground bg- relative z-10 px-2">
              Or sign in with
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" type="button" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                  fill="currentColor"
                />
              </svg>
              Continue with Apple
            </Button>
            <Button variant="outline" type="button" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
        <div className="mt-4 text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you accept our{" "}
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
