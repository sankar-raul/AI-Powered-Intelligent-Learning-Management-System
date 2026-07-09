import type { HydratedDocument, Types } from "mongoose";
import UserModel from "../schemas/user.schema.js";
import type { IUser } from "../types/auth.types.js";
import { UserRole } from "../constants/auth.constants.js";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string | null;
}

export class UserRepository {
  async create(data: CreateUserInput): Promise<HydratedDocument<IUser>> {
    return UserModel.create(data);
  }

  async findByEmail(
    email: string,
    includePassword = false,
  ): Promise<HydratedDocument<IUser> | null> {
    const query = UserModel.findOne({ email: email.toLowerCase().trim() });

    if (includePassword) {
      query.select("+password");
    }

    return query.exec();
  }

  async findById(
    id: string | Types.ObjectId,
    includePassword = false,
  ): Promise<HydratedDocument<IUser> | null> {
    const query = UserModel.findById(id);

    if (includePassword) {
      query.select("+password");
    }

    return query.exec();
  }

  async findActiveById(
    id: string | Types.ObjectId,
  ): Promise<HydratedDocument<IUser> | null> {
    return UserModel.findOne({ _id: id, is_active: true }).exec();
  }

  async updateLastLogin(id: string | Types.ObjectId): Promise<void> {
    await UserModel.updateOne({ _id: id }, { $set: { last_login: new Date() } });
  }

  async updatePassword(
    id: string | Types.ObjectId,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findById(id, true);

    if (!user) {
      return;
    }

    user.password = newPassword;
    await user.save();
  }
}

export default new UserRepository();
