import axios, { AxiosError } from "axios";

const API_BASE_URL = "http://localhost:5158/api";

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  companyName: string;
  city: string;
  state: string;
  businessDetail?: CreateBusinessDetailRequest;
}

export interface CreateBusinessDetailRequest {
  businessType: string;
  gstin: string;
  licenseNumber: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  licenseKey?: string;
}

export interface LoginResponse {
  licenseNumber: string | undefined;
  ownerName: string;
  message: string;
  token: string;
  userId?: number;
  username?: string;
  email?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: number;
}

export interface ExistingUser {
  userId: number;
  email: string;
  mobileNumber: string;
}

export interface CreateSubscriptionRequest {
  userId: number;
  planId: number;
}

export interface CreateSubscriptionResponse {
  SrNo: number;
  subscriptionId: number;
  userId: number;
  planId: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PaymentRequest {
  userId: number;
  subscriptionId: number;
  amount: number;
  paymentMethod: string;
}

export interface PaymentResponse {
  success: boolean;
  SrNo: number;
  userPaymentId: number;
  userId: number;
  subscriptionId: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate: string;
}

export interface SubscriptionResponse {
  subscriptionId: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  message?: string;
  status?: string;

  data?: {
    subscriptionId: number;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
  };
}

export interface UserSubscription {
  subscriptionId: number;
  userId: number;
  planId: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export const authService = {
  register: async (
    userData: RegisterRequest
  ): Promise<RegisterResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}/Auth/register`,
      userData
    );

    if (response.data.token) {
      try {
        const loginResponse = await axios.post(
          `${API_BASE_URL}/Auth/login`,
          {
            usernameOrEmail: userData.email,
            password: userData.password,
          }
        );

        if (loginResponse.data.token) {
          localStorage.setItem(
            "token",
            loginResponse.data.token
          );

          localStorage.setItem(
            "userId",
            loginResponse.data.userId.toString()
          );
        }
      } catch (error) {
        console.error(
          "Auto-login error:",
          error
        );
      }
    }

    return response.data;
  },

  login: async (
    credentials: LoginRequest
  ): Promise<LoginResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}/Auth/login`,
      credentials
    );

    if (response.data.token) {
      localStorage.setItem(
        "token",
        response.data.token
      );

      if (response.data.userId) {
        localStorage.setItem(
          "userId",
          response.data.userId.toString()
        );
      }
    }

    return response.data;
  },

  getUsers: async (): Promise<
    ExistingUser[]
  > => {
    const response =
      await axiosInstance.get(
        "/Auth"
      );

    return response.data;
  },

  getUserSubscriptions: async (
    userId: number
  ): Promise<UserSubscription[]> => {
    try {
      const response =
        await axiosInstance.get(
          `/UserSubscription/user/${userId}`
        );

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching user subscriptions:",
        error
      );

      return [];
    }
  },

  createSubscription: async (
    data: {
      userId: number;
      planId: number;
    }
  ): Promise<SubscriptionResponse> => {
    try {
      const requestData = {
        userId: Number(data.userId),
        planId: Number(data.planId),
      };

      const response =
        await axiosInstance.post(
          "/UserSubscription",
          requestData
        );

      return response.data;
    } catch (error: unknown) {
      console.error(
        "Create subscription error:",
        error
      );

      if (
        error instanceof AxiosError &&
        error.response?.status ===
          400
      ) {
        const subscriptions =
          await authService.getUserSubscriptions(
            data.userId
          );

        if (
          subscriptions &&
          subscriptions.length > 0
        ) {
          const activeSub =
            subscriptions.find(
              (
                s: UserSubscription
              ) => s.isActive
            );

          if (activeSub) {
            return activeSub;
          }
        }
      }

      throw error;
    }
  },

  processPayment: async (
    paymentData: PaymentRequest,
    sendVia: "email" | "whatsapp",
    email?: string
  ): Promise<PaymentResponse> => {
    const requestData = {
      userId: paymentData.userId,
      subscriptionId:
        paymentData.subscriptionId,
      amount: paymentData.amount,
      paymentMethod:
        paymentData.paymentMethod,
      sendVia,
      email: email || "",
    };

    const response =
      await axiosInstance.post(
        "/Payments",
        requestData
      );

    return response.data;
  },
};

export const axiosInstance =
  axios.create({
    baseURL: API_BASE_URL,
  });

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);