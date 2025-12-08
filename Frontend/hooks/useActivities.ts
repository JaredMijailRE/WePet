import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityCreateDTO,
  ActivityResponseDTO,
  ActivityUpdateDTO,
  ApiError
} from './types';

const API_BASE_URL = 'http://localhost/groups'; // Adjust this to your backend URL

export const useActivities = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

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
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message || 'An error occurred',
        status: error.response?.status || 500,
        details: error.response?.data,
      };
      setError(apiError);
      return Promise.reject(apiError);
    }
  );

  const createActivity = async (groupId: string, activityData: Omit<ActivityCreateDTO, 'group_id'>): Promise<ActivityResponseDTO> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<ActivityResponseDTO>(`/groups/${groupId}/activities`, {
        ...activityData,
        group_id: groupId,
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const getActivity = async (activityId: string): Promise<ActivityResponseDTO> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<ActivityResponseDTO>(`/activities/${activityId}`);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const listActivities = async (groupId: string): Promise<ActivityResponseDTO[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<ActivityResponseDTO[]>(`/groups/${groupId}/activities`);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async (activityId: string, activityData: ActivityUpdateDTO): Promise<ActivityResponseDTO> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put<ActivityResponseDTO>(`/activities/${activityId}`, activityData);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (activityId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/activities/${activityId}`);
    } finally {
      setLoading(false);
    }
  };

  const listUserActivities = async (): Promise<ActivityResponseDTO[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<ActivityResponseDTO[]>('/my-activities');
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    // State
    loading,
    error,

    // Actions
    createActivity,
    getActivity,
    listActivities,
    listUserActivities,
    updateActivity,
    deleteActivity,
    clearError,
  };
};

