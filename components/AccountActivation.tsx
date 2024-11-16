"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { authService } from "@/lib/services/authService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AccountActivation = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const uid = Array.isArray(params.uid) ? params.uid[0] : params.uid;
        const token = Array.isArray(params.token)
          ? params.token[0]
          : params.token;

        if (!uid || !token) {
          throw new Error("Invalid activation link");
        }

        const response = await authService.activateAccount({ uid, token });
        setStatus("success");
        setMessage(response.message);
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Activation failed"
        );
      }
    };

    activateAccount();
  }, [params]);

  const handleNavigate = () => {
    router.push(status === "success" ? "/sign-in" : "/sign-up");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Account Activation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            {status === "loading" && <p>Activating your account...</p>}
            {status !== "loading" && (
              <>
                <p
                  className={
                    status === "success" ? "text-green-600" : "text-red-600"
                  }
                >
                  {message}
                </p>
                <Button onClick={handleNavigate} className="mt-4">
                  {status === "success" ? "Go to Sign In" : "Back to Sign Up"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountActivation;
