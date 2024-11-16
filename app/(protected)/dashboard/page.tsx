"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={logout} className=" px-4 py-2 rounded ">
          Logout
        </Button>
      </div>
      <p>Welcome to your protected dashboard!</p>
    </div>
  );
}
