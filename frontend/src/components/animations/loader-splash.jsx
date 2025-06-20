import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import normalLogo from "../../../src/assets/normal-lottie.json"; // Guarda tu JSON aquí
import darkLogo from "../../../src/assets/dark-lottie.json"; // Guarda tu JSON aquí

export default function LoaderSplash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  // Detecta dark mode con media query
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
      <div className="w-80 h-80 flex items-center justify-center">
        <Lottie
          animationData={isDark ? darkLogo : normalLogo}
          loop
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
