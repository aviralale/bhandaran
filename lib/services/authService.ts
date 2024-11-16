import axiosInstance from "../auth/axiosConfig";
import {
  RegisterData,
  LoginData,
  AuthResponse,
  ActivationData,
} from "../types/authTypes";

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log("Attempting login with:", data);
      const response = await axiosInstance.post<AuthResponse>(
        "/auth/jwt/create/",
        data
      );
      console.log("Response from login:", response);
      if (response.data.access) {
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      console.error("Error in login:", error);
      throw this.handleError(error);
    }
  }

  async register(data: RegisterData): Promise<{ message: string }> {
    try {
      await axiosInstance.post("/auth/users/", data);
      return {
        message:
          "Registration successful! Please check your email to activate your account.",
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async activateAccount(data: ActivationData): Promise<{ message: string }> {
    try {
      await axiosInstance.post("/auth/users/activation/", data);
      return {
        message: "Account activated successfully! You can now login.",
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resendActivation(email: string): Promise<{ message: string }> {
    try {
      await axiosInstance.post("/auth/users/resend_activation/", { email });
      return {
        message: "Activation email has been resent. Please check your inbox.",
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message =
        error.response.data?.detail ||
        Object.values(error.response.data)[0] ||
        "An error occurred";
      return new Error(message as string);
    }
    return new Error("Network error occurred");
  }
}

export const authService = new AuthService();
