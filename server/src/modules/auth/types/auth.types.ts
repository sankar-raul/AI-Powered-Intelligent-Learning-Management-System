import type { Types } from "mongoose";
import { UserRole } from "../constants/auth.constants.js";

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string | null;
  is_verified: boolean;
  is_active: boolean;
  last_login?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  is_verified: boolean;
  is_active: boolean;
  last_login?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface IRefreshToken {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  token: string;
  expires_at: Date;
  device_info?: string | null;
  ip_address?: string | null;
  is_revoked: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface IPasswordResetToken {
  _id?: Types.ObjectId;
  user_id: Types.ObjectId;
  token: string;
  expires_at: Date;
  used_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface AuthJwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export interface AuthenticatedUser extends AuthJwtPayload {
  id: string;
  userId: string;
}

export interface DeviceMetadata {
  device_info?: string | null;
  ip_address?: string | null;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: IUserResponse;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordResult {
  resetToken?: string;
  expiresAt?: Date;
}
