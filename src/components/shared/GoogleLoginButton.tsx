"use client";

import React, { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              width?: number;
              text?: string;
            }
          ) => void;
        };
      };
    };
  }
}

interface GoogleLoginButtonProps {
  redirectTo?: string;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
}

export default function GoogleLoginButton({
  redirectTo,
  text = "continue_with",
}: GoogleLoginButtonProps) {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const { googleLogin } = useAuth();
  const callbackUrl = redirectTo || DEFAULT_LOGIN_REDIRECT;

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const handleCredentialResponse = async (response: {
      credential: string;
    }) => {
      try {
        await googleLogin(response.credential, callbackUrl);
        toast.success("Welcome!");
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Google login failed. Please try again.";
        toast.error(message);
      }
    };

    const initializeGoogleButton = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      if (buttonContainerRef.current) {
        buttonContainerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(buttonContainerRef.current, {
          theme: "outline",
          size: "large",
          width: buttonContainerRef.current.offsetWidth || 320,
          text,
        });
      }
    };

    if (window.google) {
      initializeGoogleButton();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleButton;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [callbackUrl, googleLogin, text]);

  return (
    <div className="relative w-full">
      {/* Real Google button - invisible but interactive */}
      <div
        ref={buttonContainerRef}
        className="[&_div]:w-full [&_iframe]:w-full"
        style={{ opacity: 0 }}
      />

      {/* Dark overlay - pointer-events-none lets clicks reach the real Google button */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-3 rounded-xl border border-[#27272A] bg-[#111111] px-5 py-3">
        <svg
          className="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </div>
    </div>
  );
}
