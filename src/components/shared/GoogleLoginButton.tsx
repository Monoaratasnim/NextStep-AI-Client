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
    <div className="w-full">
      <div
        ref={buttonContainerRef}
        className="flex w-full justify-center [&_div]:w-full [&_iframe]:w-full"
      />
    </div>
  );
}
