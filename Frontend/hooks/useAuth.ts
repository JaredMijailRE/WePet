import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LoginDTO,
  LoginResponse,
  UserCreateDTO,
  UserResponseDTO,
  ApiError
} from './types';

// API URL - use Traefik gateway for proper routing
// Can be overridden via environment variable EXPO_PUBLIC_USER_API_URL
const API_BASE_URL = process.env.EXPO_PUBLIC_USER_API_URL || 'http://localhost/user';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add response interceptor for error handling
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const apiError: ApiError = {
        message: error.response?.data?.detail || error.response?.data?.message || error.message || 'An error occurred',
        status: error.response?.status || 500,
        details: error.response?.data,
      };
      setError(apiError);
      return Promise.reject(apiError);
    }
  );

  const login = async (loginData: LoginDTO): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', loginData);

      // Store token in AsyncStorage
      await AsyncStorage.setItem('authToken', response.data.access_token);

      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: UserCreateDTO): Promise<UserResponseDTO> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<UserResponseDTO>('/auth/register', userData);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Clear token from storage
      await AsyncStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const getStoredToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem('authToken');
  };

  const clearError = () => {
    setError(null);
  };

  return {
    // State
    loading,
    error,

    // Actions
    login,
    register,
    logout,
    getStoredToken,
    clearError,
  };
};
