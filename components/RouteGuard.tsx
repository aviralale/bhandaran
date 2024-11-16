"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();

    // Listen for storage changes in case of logout in another tab
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [pathname]);

  function checkAuth() {
    const token = localStorage.getItem("token");
    const publicPaths = [
      "/sign-in",
      "/sign-up",
      "/activate",
      "/reset-password",
    ];
    const isPublicPath = publicPaths.some((path) => pathname?.startsWith(path));

    if (!token && !isPublicPath) {
      setAuthorized(false);
      router.push("/sign-in");
    } else if (token && isPublicPath) {
      setAuthorized(false);
      router.push("/dashboard");
    } else {
      setAuthorized(true);
    }
  }

  return authorized ? children : null;
}
