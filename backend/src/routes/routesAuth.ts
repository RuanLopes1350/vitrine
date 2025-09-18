import express from 'express';
import ControllerAuth from '../controller/controllerAuth';
import authMiddlerware from '../middlewares/authMiddleware';

const router = express.Router();
const controller = new ControllerAuth();

router
    .post('/login', controller.login.bind(controller))
    .post('/logout', authMiddlerware, controller.logout.bind(controller));

export default router;