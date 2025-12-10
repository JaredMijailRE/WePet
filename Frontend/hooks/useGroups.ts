import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GroupCreateDTO,
  GroupResponseDTO,
  GroupUpdateDTO,
  JoinGroupDTO,
  ApiError
} from './types';

const API_BASE_URL = 'http://localhost'; // Adjust this to your backend URL

export const useGroups = () => {
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

  const createGroup = async (groupData: GroupCreateDTO): Promise<GroupResponseDTO> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<GroupResponseDTO>('/groups', groupData);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const getGroup = async (groupId: string): Promise<GroupResponseDTO> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<GroupResponseDTO>(`/groups/${groupId}`);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const updateGroup = async (groupId: string, groupData: GroupUpdateDTO): Promise<GroupResponseDTO> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put<GroupResponseDTO>(`/groups/${groupId}`, groupData);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (groupId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/groups/${groupId}`);
    } finally {
      setLoading(false);
    }
  };


  const getGroupInviteCode = async (groupId: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<GroupResponseDTO>(`/groups/${groupId}`);
      return response.data.invite_code;
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (joinData: JoinGroupDTO): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/groups/join', joinData);
    } finally {
      setLoading(false);
    }
  };

  const listUserGroups = async (): Promise<GroupResponseDTO[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<GroupResponseDTO[]>('/groups/my-groups');
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
    createGroup,
    getGroup,
    getGroupInviteCode,
    updateGroup,
    deleteGroup,
    joinGroup,
    listUserGroups,
    clearError,
  };
};

