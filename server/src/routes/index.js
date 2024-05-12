import express from 'express'
import { authRouter } from './auth.route.js'
import { userRouter } from './userRoutes.js'
const router = express.Router();

const defaultRoutes = [
   {
      path: '/',
      route: authRouter,
   },
   {
      path: '/',
      route: userRouter,
   },
];

defaultRoutes.map((route, i) => {
   router.use(route.path, route.route);
});

export { router }