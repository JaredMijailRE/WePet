const DEFAULT_BASE = process.env.PET_API_URL ?? process.env.EXPO_PUBLIC_PET_API_URL ?? 'http://localhost';

function buildUrl(path: string) {
  // allow base like http://localhost:8000 or /api
  return `${DEFAULT_BASE.replace(/\/+$/,'')}/${path.replace(/^\/+/, '')}`;
}

export async function getPetByGroup(groupId: string) {
  const url = buildUrl(`/pet/group/${encodeURIComponent(groupId)}`);
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`Failed to fetch pet: ${res.status}`);
  return res.json();
}

export async function performPetAction(petId: string, action: 'feed' | 'clean' | 'play') {
  const url = buildUrl(`/pet/${encodeURIComponent(petId)}/actions/${action}`);
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error(`Action ${action} failed: ${res.status}`);
  return res.json();
}

export async function updatePetStatus(petId: string, body: Record<string, any>) {
  const url = buildUrl(`/pet/${encodeURIComponent(petId)}`);
  const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Update pet failed: ${res.status}`);
  return res.json();
}

export async function createPet(groupId: string, name: string, type: string) {
  const url = buildUrl(`/pet/`);
  console.log('Creating pet with URL:', url, 'and data:', { group_id: groupId, name, type });
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ group_id: groupId, name, type }) });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Pet creation failed:', res.status, errorText);
    throw new Error(`Create pet failed: ${res.status} - ${errorText}`);
  }
  return res.json();
}

export async function updatePetName(petId: string, newName: string) {
  const url = buildUrl(`/pet/pet/${encodeURIComponent(petId)}`);
  const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName }) });
  if (!res.ok) throw new Error(`Update pet name failed: ${res.status}`);
  return res.json();
}

export default {
  getPetByGroup,
  performPetAction,
  updatePetStatus,
  createPet,
  updatePetName,
};
