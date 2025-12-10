import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GroupMemberDTO,
  GroupMemberUpdateDTO,
  UserResponseDTO,
  ApiError
} from './types';

const API_BASE_URL = 'http://localhost'; // Adjust this to your backend URL

export const useGroupMembers = () => {
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

  const listGroupMembers = async (groupId: string): Promise<GroupMemberDTO[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<GroupMemberDTO[]>(`/groups/${groupId}/members`);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const updateGroupMember = async (
    groupId: string,
    memberUserId: string,
    memberData: GroupMemberUpdateDTO
  ): Promise<GroupMemberDTO> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put<GroupMemberDTO>(
        `/groups/${groupId}/members/${memberUserId}`,
        memberData
      );
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const removeGroupMember = async (groupId: string, memberUserId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/groups/${groupId}/members/${memberUserId}`);
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (userId: string): Promise<UserResponseDTO> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<UserResponseDTO>(`/users/${userId}`);
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
    listGroupMembers,
    updateGroupMember,
    removeGroupMember,
    getUserById,
    clearError,
  };
};

