import bcrypt from "bcryptjs";
import { PASSWORD_SECURITY } from "../constants/auth.constants.js";

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, PASSWORD_SECURITY.SALT_ROUNDS);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
