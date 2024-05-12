import * as authService from '../services/auth.service.js'

const login = async (req, res) => {
   const { userName, password } = req.body;
   const user = await authService.loginUser(userName, password);
   res.send(user);
};

export { login }