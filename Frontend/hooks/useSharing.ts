import { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodName } from "@/assets/moodAssets";
import {
  EmotionRestponseDTO,
  GroupResponseDTO,
} from './types';

const API_BASE_URL = 'http://localhost';

type GroupMoods = {
  group: GroupResponseDTO;
  moods: EmotionRestponseDTO[];
};

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');

    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);


export function useSharing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const request = useCallback(<T,>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);

    return fn()
      .then((res) => res)
      .catch((err) => {
        setError(err as Error);
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const fetchUserGroups = useCallback(
    async (): Promise<GroupResponseDTO[]> => {
      const res = await axiosInstance.get<GroupResponseDTO[]>('/groups/my-groups');
      return res.data;
    },
    [], 
  );

  const postMoodRaw = useCallback(
    async (groupIds: string[], emotion: MoodName): Promise<void> => {
      const payload = {
        emotion,
        group_ids: groupIds,
      };

      await axiosInstance.post('/sharing/mood', payload);
    },
    [],
  );

  const getGroupMoodsRaw = useCallback(
    async (groupId: string): Promise<EmotionRestponseDTO[]> => {
      const res = await axiosInstance.get<EmotionRestponseDTO[]>(
        `/sharing/mood/group/${groupId}`,
      );
      return res.data;
    },
    [],
  );

  const listUserGroups = useCallback(
    (): Promise<GroupResponseDTO[]> =>
      request(() => fetchUserGroups()),
    [request, fetchUserGroups],
  );

  const postMoodToUserGroups = useCallback(
    (emotion: MoodName): Promise<void> =>
      request(async () => {
        const groups = await fetchUserGroups();
        const groupIds = groups.map((g) => g.id);

        if (!groupIds.length) {
          console.warn('El usuario no tiene grupos, no se envía ningún mood.');
          return;
        }

        await postMoodRaw(groupIds, emotion);
      }),
    [request, fetchUserGroups, postMoodRaw],
  );

  const getGroupMoods = useCallback(
    (groupId: string): Promise<EmotionRestponseDTO[]> =>
      request(() => getGroupMoodsRaw(groupId)),
    [request, getGroupMoodsRaw],
  );

  const getMoodsForUserGroups = useCallback(
    (): Promise<GroupMoods[]> =>
      request(async () => {
        const groups = await fetchUserGroups();
        if (!groups.length) return [];

        const result = await Promise.all(
          groups.map(async (group) => ({
            group,
            moods: await getGroupMoodsRaw(group.id),
          })),
        );

        return result;
      }),
    [request, fetchUserGroups, getGroupMoodsRaw],
  );

  return {
    loading,
    error,
    listUserGroups,
    postMoodToUserGroups,
    getGroupMoods,
    getMoodsForUserGroups,
  };
}
