import { UserModel } from "../schema/user.model.js";

const getUserByUserName = (userName) => {
   const user = UserModel.findOne({
      userName
   });
   return user
}

export { getUserByUserName }