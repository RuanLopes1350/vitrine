import express from 'express'
import ControllerAuth from '../controller/controllerAuth'

const router = express.Router()
const controller = new ControllerAuth()

router
    .post('/login', async(req, res) =>{
        try {
            const usuario = await controller.login(req.body)
            res.status(200).json(usuario)
        } catch (erro:any) {
            res.status(500).json({error: erro.message})
        }
    })

export default router