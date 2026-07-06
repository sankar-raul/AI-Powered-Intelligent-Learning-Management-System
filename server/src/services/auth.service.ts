import ROLE from "@/constants/role.constant.js";
import appConfig from "@/config/config.js";
import { hashText, matchHash, signAccessToken, verifyAccessToken } from "@/utils/security.js";
import userRepository from "@/repositories/user.repository.js";
import { IUserToken } from "@/@types/interface/userToken.interface.js";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: (typeof ROLE)[keyof typeof ROLE];
}

export interface LoginInput {
  email: string;
  password: string;
}

const authService = {
  async register(input: RegisterInput) {
    const email = input.email.toLowerCase().trim();
    const existing = await userRepository.findByEmail(email);

    if (existing) {
      throw new Error("Email already registered");
    }

    const password = await hashText(input.password);

    const user = await userRepository.create({
      name: input.name.trim(),
      email,
      password,
      role: input.role,
    });

    const token = signAccessToken(
      {
        userId: String(user._id),
        role: user.role,
        name: user.name,
        email: user.email,
      },
      appConfig.ACCESS_TOKEN_AGE,
    );

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async login(input: LoginInput) {
    const email = input.email.toLowerCase().trim();
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const matched = await matchHash(input.password, user.password);
    if (!matched) {
      throw new Error("Invalid credentials");
    }

    const token = signAccessToken(
      {
        userId: String(user._id),
        role: user.role,
        name: user.name,
        email: user.email,
      },
      appConfig.ACCESS_TOKEN_AGE,
    );

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  verify(token: string): IUserToken {
    return verifyAccessToken(token);
  },
};

export default authService;
