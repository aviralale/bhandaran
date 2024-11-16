"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: formType === "sign-up" ? z.string().email() : z.string().optional(),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    displayName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
    password: z.string().min(8).max(50),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const router = useRouter();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setDebugInfo(null);
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      console.log(`Starting ${type} process...`);

      if (type === "sign-in") {
        const loginData = {
          username: values.username,
          password: values.password,
        };

        console.log("Sending login request...");
        const response = await authService.login(loginData);

        setDebugInfo({
          action: "login",
          response: response,
          tokenReceived: !!response.access,
          userDataReceived: !!response.user,
        });

        if (response.access) {
          console.log("Login successful, redirecting...");
          setSuccessMessage("Login successful!");
          // Add a slight delay before redirect to ensure state updates
          setTimeout(() => {
            router.push("/dashboard");
          }, 100);
        } else {
          throw new Error("No access token received");
        }
      } else {
        const result = await authService.register({
          username: values.username,
          email: values.email!,
          password: values.password,
          re_password: values.password,
          display_name: values.displayName,
        });

        localStorage.setItem("email", values.email!);
        setSuccessMessage(result.message);
        form.reset();
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setDebugInfo({
        action: type,
        error: error,
        errorDetails: error.response?.data || error.message,
        stack: error.stack,
      });

      setErrorMessage(
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>

          {/* Form fields remain the same */}
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">
                      Display Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your display name"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            {type === "sign-in" ? "Sign In" : "Sign Up"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="Loading"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>

          {errorMessage && (
            <div className="error-message mt-4">
              <p className="text-red-600">*{errorMessage}</p>
              {debugInfo && (
                <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-40">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              )}
            </div>
          )}

          {successMessage && (
            <div className="success-message mt-4">
              <p className="text-green-600">{successMessage}</p>
            </div>
          )}

          <div className="body-2 flex justify-center mt-4">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              className="ml-1 font-medium text-brand"
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AuthForm;
