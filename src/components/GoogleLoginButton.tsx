import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.google && buttonRef.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          loginWithGoogle(response.credential);
        },
      });

      window.google.accounts.id.renderButton(
        buttonRef.current,
        {
          theme: "filled_black",
          size: "large",
          width: buttonRef.current.offsetWidth,
          text: "continue_with",
          locale: "pt-BR",
        }
      );
    }
  }, [loginWithGoogle]);

  return <div ref={buttonRef} className="w-full" />;
}
