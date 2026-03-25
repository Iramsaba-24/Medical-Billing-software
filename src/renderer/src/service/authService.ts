import axios from "axios";

const API_BASE_URL = "http://localhost:5158/api";

// Define proper types
export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  companyName: string;
  clinicName: string;
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
  couponCode?: string;
}

export interface PaymentResponse {
  SrNo: number;
  userPaymentId: number;
  userId: number;
  subscriptionId: number;
  amount: number;
  paymentMethod: string;
  couponCode: string;
  paymentStatus: string;
  paymentDate: string;
}

export const authService = {
  // Complete registration with all steps
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}/Auth/register`,
      userData,
    );
    return response.data;
  },

  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}/Auth/login`,
      credentials,
    );
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      if (response.data.userId) {
        localStorage.setItem("userId", response.data.userId.toString());
      }
    }
    return response.data;
  },

  // Create subscription after payment
  createSubscription: async (
    subscriptionData: CreateSubscriptionRequest,
  ): Promise<CreateSubscriptionResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}/UserSubscription`,
      subscriptionData,
    );
    return response.data;
  },

  // Process payment
  processPayment: async (
    paymentData: PaymentRequest,
  ): Promise<PaymentResponse> => {
    const response = await axios.post(`${API_BASE_URL}/Payments`, paymentData);
    return response.data;
  },
};

// Optional: Create axios instance with interceptors
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
