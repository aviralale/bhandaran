"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }
  }, []);

  return <>{children}</>;
}
