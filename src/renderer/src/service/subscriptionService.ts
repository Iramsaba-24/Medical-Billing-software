import axios from 'axios';
import { API_BASE_URL } from '@/constants/ApiEndpoints';

export const subscriptionService = {
  // Create user subscription after registration
  createSubscription: async (userId: number, planId: number) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/UserSubscription`, {
        userId: userId,
        planId: planId,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        isActive: true
      });
      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },
  
  // Activate subscription after payment
  activateSubscription: async (subscriptionId: number) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/UserSubscription/${subscriptionId}/activate`, {
        isActive: true,
        paymentStatus: 'completed'
      });
      return response.data;
    } catch (error) {
      console.error('Error activating subscription:', error);
      throw error;
    }
  },

  // Get user's subscription status
  getUserSubscription: async (userId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/UserSubscription/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  }
};