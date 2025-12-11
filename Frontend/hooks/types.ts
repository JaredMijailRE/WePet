// API Types based on GroupManagement DTOs
export enum ActivityStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  COMPLETED = "completed"
}

export enum Role {
  ADMIN = "admin",
  MEMBER = "member"
}

// Group DTOs
export interface GroupCreateDTO {
  name: string;
}

export interface JoinGroupDTO {
  invite_code: string;
}

export interface GroupResponseDTO {
  id: string;
  name: string;
  invite_code: string;
}

export interface GroupUpdateDTO {
  name?: string;
}

// Group Member DTOs
export interface GroupMemberDTO {
  group_id: string;
  user_id: string;
  role: Role;
  is_sharing_location_with_group: boolean;
  has_notifications_enabled: boolean;
  joined_at: string; // ISO date string
}

export interface GroupMemberUpdateDTO {
  role?: Role;
  is_sharing_location_with_group?: boolean;
  has_notifications_enabled?: boolean;
}

// Activity DTOs
export interface ActivityCreateDTO {
  group_id: string;
  title: string;
  description?: string;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  xp_reward: number;
  status?: ActivityStatus;
}

export interface ActivityUpdateDTO {
  title?: string;
  description?: string;
  start_date?: string; // ISO date string
  end_date?: string; // ISO date string
  xp_reward?: number;
  status?: ActivityStatus;
}

export interface ActivityResponseDTO {
  id: string;
  group_id: string;
  title: string;
  description?: string;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  xp_reward: number;
  status: ActivityStatus;
  created_at: string; // ISO date string
}

export interface UserActivityResponseDTO {
  id: string;
  group_id: string;
  group_name: string;
  title: string;
  description?: string;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  xp_reward: number;
  status: ActivityStatus;
  created_at: string; // ISO date string
}

// Auth DTOs
export interface LoginDTO {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserCreateDTO {
  username: string;
  email: string;
  password: string;
  birth_date: string; // ISO date string
}

export interface UserResponseDTO {
  id: string;
  username: string;
  email: string;
}

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  birth_date: string; // ISO date string
  current_emotional_status?: string | null;
  its_sharing_location: boolean;
  created_at?: string | null; // ISO date string
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

