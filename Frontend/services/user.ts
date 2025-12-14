import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDTO } from '../hooks/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_USER_API_URL ?? 'http://localhost/user';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 500,
      details: error.response?.data,
    };
    return Promise.reject(apiError);
  }
);

export async function getUserById(userId: string): Promise<UserDTO> {
  const response = await axiosInstance.get<UserDTO>(`/users/${encodeURIComponent(userId)}`);
  return response.data;
}

export async function getUsersByIds(userIds: string[]): Promise<UserDTO[]> {
  const params = new URLSearchParams();
  userIds.forEach(id => params.append('ids', id));
  const response = await axiosInstance.get<UserDTO[]>(`/users?${params.toString()}`);
  return response.data;
}

export default {
  getUserById,
  getUsersByIds,
};
