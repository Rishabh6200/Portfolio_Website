import * as userService from '../services/user.service.js'

const loginUser = async (userName, password) => {
   const user = await userService.getUserByUserName(userName);
   if (!user || !(await user.isPasswordMatch(password))) {
      return {
         status: false,
         message: "User and Password not match!"
      }
   }
   return {
      status: true,
      _id: user._id,
      userName: user.userName,
   };
};

export { loginUser }
