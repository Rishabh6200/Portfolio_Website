import express from 'express';
import { getAbout, getAddress, getResume, getSkill, postSkill, updateAbout, updateAddress } from '../controller/users.js';

const router = express.Router();

/* -------------------------About Route------------------------------ */
router.get('/about', async (req, res) => {
    await getAbout(req, res);
})
router.patch('/about', async (req, res) => {
    await updateAbout(req, res);
})


/* -------------------------Address Route------------------------------ */
router.get('/address', async (req, res) => {
    await getAddress(req, res);
})
router.patch('/address', async (req, res) => {
    await updateAddress(req, res)
})


/* -------------------------Resume Route------------------------------ */
router.get('/education', async (req, res) => {
    await getResume(req, res);
})


/* -------------------------Skill Route------------------------------ */
router.get('/skill', async (req, res) => {
    await getSkill(req, res);
})
router.post('/skill', async (req, res) => {
    await postSkill(req, res);
})

export { router };