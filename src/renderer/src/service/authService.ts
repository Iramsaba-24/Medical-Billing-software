// import axios, { AxiosError } from "axios";

// const API_BASE_URL = "http://localhost:5158/api";

// export interface RegisterRequest {
//   username: string;
//   password: string;
//   fullName: string;
//   email: string;
//   mobileNumber: string;
//   companyName: string;
//   city: string;
//   state: string;
//   businessDetail?: CreateBusinessDetailRequest;
// }

// export interface CreateBusinessDetailRequest {
//   businessType: string;
//   gstin: string;
//   licenseNumber: string;
// }

// export interface LoginRequest {
//   usernameOrEmail: string;
//   password: string;
//   licenseKey?: string;
// }

// export interface LoginResponse {
//   //profilePicture: string;
//   ownerName: string;
//   message: string;
//   token: string;
//   userId?: number;
//   username?: string;
//   email?: string;
// }

// export interface RegisterResponse {
//   success: boolean;
//   message: string;
//   userId?: number;
// }

// export interface CreateSubscriptionRequest {
//   userId: number;
//   planId: number;
// }

// export interface CreateSubscriptionResponse {
//   SrNo: number;
//   subscriptionId: number;
//   userId: number;
//   planId: number;
//   startDate: string;
//   endDate: string;
//   isActive: boolean;
// }

// export interface PaymentRequest {
//   userId: number;
//   subscriptionId: number;
//   amount: number;
//   paymentMethod: string;
// }

// export interface PaymentResponse {
//   success: boolean;
//   SrNo: number;
//   userPaymentId: number;
//   userId: number;
//   subscriptionId: number;
//   amount: number;
//   paymentMethod: string;
//   paymentStatus: string;
//   paymentDate: string;
// }

// export interface SubscriptionResponse {
//   subscriptionId: number;
//   isActive?: boolean;
//   startDate?: string;
//   endDate?: string;
//   message?: string;
//   status?: string;

//    data?: {  
//     subscriptionId: number;
//     isActive?: boolean;
//     startDate?: string;
//     endDate?: string;
//   };
// }

// export interface UserSubscription {
//   subscriptionId: number;
//   userId: number;
//   planId: number;
//   startDate: string;
//   endDate: string;
//   isActive: boolean;
// }

// export const authService = {
//   register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
//     const response = await axios.post(
//       `${API_BASE_URL}/Auth/register`,
//       userData,
//     );
//     return response.data;
//   },

//   login: async (credentials: LoginRequest): Promise<LoginResponse> => {
//     const response = await axios.post(
//       `${API_BASE_URL}/Auth/login`,
//       credentials,
//     );
//     if (response.data.token) {
//       localStorage.setItem("token", response.data.token);
//       if (response.data.userId) {
//         localStorage.setItem("userId", response.data.userId.toString());
//       }
//     }
//     return response.data;
//   },

//   getUserSubscriptions: async (userId: number): Promise<UserSubscription[]> => {
//     try {
//       const response = await axiosInstance.get(`/UserSubscription/user/${userId}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching user subscriptions:", error);
//       return [];
//     }
//   },

//   createSubscription: async (data: { userId: number; planId: number }): Promise<SubscriptionResponse> => {
//     try {
//       console.log("Sending subscription request:", data);
      
//       const requestData = {
//         userId: Number(data.userId),
//         planId: Number(data.planId)
//       };
      
//       const response = await axiosInstance.post(`/UserSubscription`, requestData);
//       console.log("Subscription response:", response.data);
//       return response.data;
//     } catch (error: unknown) {
//       console.error("Create subscription error:", error);
      
//       if (error instanceof AxiosError && error.response?.status === 400) {
//         console.log("Attempting to fetch existing subscription...");
//         const subscriptions = await authService.getUserSubscriptions(data.userId);
        
//         if (subscriptions && subscriptions.length > 0) {
//           const activeSub = subscriptions.find((s: UserSubscription) => s.isActive === true);
//           if (activeSub) {
//             console.log("Found existing active subscription:", activeSub);
//             return activeSub;
//           }
//         }
//       }
      
//       throw error;
//     }
//   },

//   processPayment: async (
//     paymentData: PaymentRequest,
//     sendVia: "email" | "whatsapp",
//     email?: string,
//   ): Promise<PaymentResponse> => {
//     const requestData = {
//       userId: paymentData.userId,
//       subscriptionId: paymentData.subscriptionId,
//       amount: paymentData.amount,
//       paymentMethod: paymentData.paymentMethod,
//       sendVia: sendVia,
//       email: email || "",
//     };
    
//     console.log("Sending payment request:", requestData);
    
//     const response = await axiosInstance.post("/Payments", requestData);
//     return response.data;
//   }
// };

// export const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );




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

// interface SubscriptionResponse {
//   subscriptionId: number;
//   message?: string;
//   status?: string;
// }

// interface ApiErrorResponse {
//   message?: string;
//   errors?: Record<string, string[]>;
//   statusCode?: number;
// }

export interface PaymentRequest {
  userId: number;
  subscriptionId: number;
  amount: number;
  paymentMethod: string;
  couponCode?: string;
}

// export interface PaymentResponse {
//   SrNo: number;
//   userPaymentId: number;
//   userId: number;
//   subscriptionId: number;
//   amount: number;
//   paymentMethod: string;
//   couponCode: string;
//   paymentStatus: string;
//   paymentDate: string;
// }
export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    srNo: number;
    userPaymentId: number;
    userId: number;
    subscriptionId: number;
    amount: number;
    paymentMethod: string;
    couponCode: string;
    paymentStatus: string;
    paymentDate: string;
  };
  receiptSent?: {
    via: string;
    to: string;
    status: string;
  };
}

export interface SubscriptionResponse {
  subscriptionId: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  message?: string;
  status?: string;
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


  getUserSubscriptions: async (userId: number): Promise<UserSubscription[]> => {
    try {
      const response = await axiosInstance.get(`/UserSubscription/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user subscriptions:", error);
      return [];
    }
  },

  createSubscription: async (data: { userId: number; planId: number }): Promise<SubscriptionResponse> => {
    try {
      console.log("Sending subscription request:", data);
      
      const requestData = {
        userId: Number(data.userId),
        planId: Number(data.planId)
      };
      
      const response = await axiosInstance.post(`/UserSubscription`, requestData);
      console.log("Subscription response:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("Create subscription error:", error);
      
      // Type guard for AxiosError
      if (error instanceof AxiosError && error.response?.status === 400) {
        console.log("Attempting to fetch existing subscription...");
        const subscriptions = await authService.getUserSubscriptions(data.userId);
        
        if (subscriptions && subscriptions.length > 0) {
          const activeSub = subscriptions.find((s: UserSubscription) => s.isActive === true);
          if (activeSub) {
            console.log("Found existing active subscription:", activeSub);
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
  email?: string,
  whatsapp?: string
): Promise<PaymentResponse> => {
  // Include the receipt delivery info in the request body
  const requestData = {
    userId: paymentData.userId,
    subscriptionId: paymentData.subscriptionId,
    amount: paymentData.amount,
    paymentMethod: paymentData.paymentMethod,
    couponCode: paymentData.couponCode || "",
    sendVia: sendVia,
    email: email || "",
    whatsapp: whatsapp || ""
  };
  
  console.log("Sending payment request:", requestData);
  
  const response = await axiosInstance.post("/Payments", requestData);
  return response.data;
}
};


  // Create subscription after payment
  // createSubscription: async (
  //   subscriptionData: CreateSubscriptionRequest,
  // ): Promise<CreateSubscriptionResponse> => {
  //   const response = await axios.post(
  //     `${API_BASE_URL}/UserSubscription`,
  //     subscriptionData,
  //   );
  //   return response.data;
  // },

  // Process payment
//   processPayment: async (
//     paymentData: PaymentRequest,
//   ): Promise<PaymentResponse> => {
//     const response = await axios.post(`${API_BASE_URL}/Payments`, paymentData);
//     return response.data;
//   },
// };

//  Payment (with headers)
// Update the processPayment method in authService.ts


// processPayment: async (
//   paymentData: PaymentRequest,
//   sendVia: "email" | "whatsapp",
//   email?: string,
//   whatsapp?: string
// ): Promise<PaymentResponse> => {
//   // Include the receipt delivery info in the request body
//   const requestData = {
//       ...paymentData,
//       sendVia: sendVia,
//       email: email || "", // Convert undefined to empty string
//       whatsapp: whatsapp || "" // Convert undefined to empty string
//   };
  
//   const response = await axiosInstance.post("/Payments", requestData);
//   return response.data;
// }

// };


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