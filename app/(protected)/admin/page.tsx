"use client";
import { PrivateRoute } from "@/components/PrivateRoute";

export default function AdminPage() {
  return (
    <PrivateRoute requiredRole={["admin"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>This page is only accessible to admins.</p>
      </div>
    </PrivateRoute>
  );
}
