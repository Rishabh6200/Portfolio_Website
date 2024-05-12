import express from 'express';
import { getAbout, getAddress, getResume, getSkill, postSkill, updateAbout, updateAddress } from '../controller/users.js';

const userRouter = express.Router();

/* -------------------------About Route------------------------------ */
userRouter.get('/about', async (req, res) => {
    await getAbout(req, res);
})
userRouter.patch('/about', async (req, res) => {
    await updateAbout(req, res);
})


/* -------------------------Address Route------------------------------ */
userRouter.get('/address', async (req, res) => {
    await getAddress(req, res);
})
userRouter.patch('/address', async (req, res) => {
    await updateAddress(req, res)
})


/* -------------------------Resume Route------------------------------ */
userRouter.get('/education', async (req, res) => {
    await getResume(req, res);
})


/* -------------------------Skill Route------------------------------ */
userRouter.get('/skill', async (req, res) => {
    await getSkill(req, res);
})
userRouter.post('/skill', async (req, res) => {
    await postSkill(req, res);
})

export { userRouter };