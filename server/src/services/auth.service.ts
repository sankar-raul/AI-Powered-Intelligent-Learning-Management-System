import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserRepository from "@/repositories/user.repository.js";
import appConfig from "@/config/config.js";
import ROLE from "@/constants/role.constant.js";
import IUser from "@/@types/interface/user.interface.js";

class AuthService {
  public static async login(email: string, passwordString: string, roleInput?: "student" | "teacher") {
    try {
      let user = await UserRepository.getUserByEmail(email);

      if (!user) {
        // Auto-registration
        const hashedPassword = await bcrypt.hash(passwordString, 10);
        
        // Derive name from email (e.g. "raul" from "raul@gmail.com")
        const namePart = email.split("@")[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

        const newUserData: Partial<IUser> = {
          name: formattedName,
          email: email,
          password: hashedPassword,
          role: roleInput || ROLE.STUDENT,
        };

        user = await UserRepository.createUser(newUserData);
      } else {
        // Verify password
        const isMatch = await bcrypt.compare(passwordString, user.password as string);
        if (!isMatch) {
          throw new Error("Invalid password credentials.");
        }
      }

      // Generate JWT Token
      const tokenPayload = {
        userId: user._id!.toString(),
        role: user.role,
        name: user.name,
        email: user.email,
      };

      const token = jwt.sign(
        tokenPayload,
        appConfig.auth.accessTokenSecret,
        { expiresIn: "7d" } // Long expiration for convenient local development testing
      );

      return {
        token,
        user: {
          id: user._id!.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      console.error("AuthService Login Error:", error);
      throw error;
    }
  }

  public static async getUserProfile(userId: string) {
    try {
      const user = await UserRepository.getUserById(userId);
      if (!user) {
        throw new Error("User profile not found.");
      }
      return {
        id: user._id!.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      console.error("AuthService getUserProfile Error:", error);
      throw error;
    }
  }
}

export default AuthService;
