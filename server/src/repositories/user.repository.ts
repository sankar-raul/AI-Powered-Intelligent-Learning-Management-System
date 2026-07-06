import IUser from "@/@types/interface/user.interface.js";
import UserModel from "@/models/user/user.model.js";

export const userRepository = {
  findByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() });
  },
  findById(id: string) {
    return UserModel.findById(id);
  },
  create(user: IUser) {
    return UserModel.create(user);
  },
};

export default userRepository;
