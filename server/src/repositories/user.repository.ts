import IUser from "@/@types/interface/user.interface.js";
import UserModel from "@/models/user/user.model.js";

class UserRepository {
  public static async getUserByEmail(email: string) {
    try {
      return await UserModel.findOne({ email }).exec();
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  }

  public static async getUserById(userId: string) {
    try {
      return await UserModel.findById(userId).exec();
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  public static async createUser(userData: Partial<IUser>) {
    try {
      const newUser = new UserModel(userData);
      return await newUser.save();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export default UserRepository;
