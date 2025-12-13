const DEFAULT_BASE = process.env.PET_API_URL ?? process.env.EXPO_PUBLIC_PET_API_URL ?? 'http://localhost';

function buildUrl(path: string) {
  // allow base like http://localhost:8000 or /api
  return `${DEFAULT_BASE.replace(/\/+$/,'')}/${path.replace(/^\/+/, '')}`;
}

export async function getPetByGroup(groupId: string) {
  const url = buildUrl(`/pet/group/${encodeURIComponent(groupId)}`);
  console.debug('[petService] GET', url);
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[petService] getPetByGroup failed', res.status, text, 'URL:', url);
    throw new Error(`Failed to fetch pet: ${res.status}`);
  }
  return res.json();
}

export async function performPetAction(groupId: string, action: 'feed' | 'clean' | 'play') {
  const pathMap: Record<'feed' | 'clean' | 'play', string> = {
    feed: `/${encodeURIComponent(groupId)}/feed`,
    clean: `/${encodeURIComponent(groupId)}/clean`,
    play: `/${encodeURIComponent(groupId)}/play`,
  };
  const path = pathMap[action];
  const url = buildUrl(`/pet${path}`);
  console.debug('[petService] POST', url, { groupId, action });
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[petService] performPetAction failed', res.status, text, 'URL:', url, 'groupId:', groupId, 'action:', action);
    throw new Error(`Action ${action} failed: ${res.status}`);
  }
  return res.json();
}

export async function updatePetStatus(petId: string, body: Record<string, any>) {
  const url = buildUrl(`/pet/${encodeURIComponent(petId)}`);
  const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Update pet failed: ${res.status}`);
  return res.json();
}

export async function updatePetStatsByGroup(groupId: string, stats: { hunger_level?: number; hygiene_level?: number; health_level?: number; happiness_level?: number }) {
  const url = buildUrl(`/pet/${encodeURIComponent(groupId)}/stats`);
  console.debug('[petService] PATCH', url, { groupId, stats });
  const res = await fetch(url, { 
    method: 'PATCH', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(stats) 
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[petService] updatePetStatsByGroup failed', res.status, text, 'URL:', url);
    throw new Error(`Update pet stats failed: ${res.status}`);
  }
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
  const url = buildUrl(`/pet/${encodeURIComponent(petId)}`);
  console.debug('[petService] PATCH', url, { petId, newName });
  const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName }) });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[petService] updatePetName failed', res.status, text, 'URL:', url);
    throw new Error(`Update pet name failed: ${res.status}`);
  }
  return res.json();
}

export default {
  getPetByGroup,
  performPetAction,
  updatePetStatus,
  updatePetStatsByGroup,
  createPet,
  updatePetName,
};
