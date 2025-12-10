// // services/sharingService.ts
// import axios from "axios";
// import { MoodName } from "../../assets/moodAssets";



// // POST /sharing/mood
// export async function postMood(
//   groupIds: string | string[],
//   emotion: MoodName
// ) {
//   const idsArray = Array.isArray(groupIds) ? groupIds : [groupIds];

//   const payload = {
//     emotion,
//     group_ids: idsArray,
//   };

//   try {
//     const res = await api.post("/mood", payload);
//     return res.data;
//   } catch (err: unknown) {
//     if (axios.isAxiosError(err)) {
//       console.log(" Error al hacer POST /mood");
//       console.log("Status:", err.response?.status);
//       console.log("Data:", err.response?.data); // <- aquí FastAPI dice qué campo no le gusta
//     }
//     throw err;
//   }
// }

// // GET /sharing/mood/group/{groupId}
// export async function getGroupMoods(
//   groupId: string
// ): Promise<EmotionRestponseDTO[]> {
//   const res = await api.get(`/mood/group/${groupId}`);
//   return res.data;
// }

// // 👉 Nuevo: endpoint para saber a qué grupos pertenece el usuario
// // Ajusta la ruta según tu backend: /group, /groups/me, etc.
// export async function getUserGroups(): Promise<GroupResponseDTO[]> {
//   const res = await api.get("/group/my-groups");
//   return res.data;
// }
