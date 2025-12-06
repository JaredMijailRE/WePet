// services/sharingService.ts
import axios from "axios";
import { MoodName } from "../../assets/moodAssets";

// Base URL del servicio de sharing
const baseURL = "http://localhost:80/sharing";

const api = axios.create({ baseURL });

// 🔐 Interceptor para token (luego lo cambias a SecureStore/AsyncStorage)
api.interceptors.request.use((config) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNTlhODcyNS1mOGJhLTQwN2MtYjkxMC1iZWVmNGY2ZDAzZWYiLCJleHAiOjE3NjQ4NzgxOTN9.bNFZZjzdty18HJtTDjDXQhRUehQWRGDYi9c3An3o7uY";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type BackendMember = {
  user_id: string;
  emotion: MoodName;
  created_at: string;
};

// Lo que devuelva tu endpoint de grupos.
// Ajusta las props según tu back (id, name, etc.)
export type BackendGroup = {
  id: string;
  name: string;
};

// POST /sharing/mood
export async function postMood(
  groupIds: string | string[],
  emotion: MoodName
) {
  const idsArray = Array.isArray(groupIds) ? groupIds : [groupIds];

  const payload = {
    emotion,
    group_ids: idsArray,
  };

  try {
    const res = await api.post("/mood", payload);
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.log("🔴 Error al hacer POST /mood");
      console.log("Status:", err.response?.status);
      console.log("Data:", err.response?.data); // <- aquí FastAPI dice qué campo no le gusta
    }
    throw err;
  }
}

// GET /sharing/mood/group/{groupId}
export async function getGroupMoods(
  groupId: string
): Promise<BackendMember[]> {
  const res = await api.get(`/mood/group/${groupId}`);
  return res.data;
}

// 👉 Nuevo: endpoint para saber a qué grupos pertenece el usuario
// Ajusta la ruta según tu backend: /group, /groups/me, etc.
export async function getUserGroups(): Promise<BackendGroup[]> {
  const res = await api.get("/group/my-groups");
  return res.data;
}
