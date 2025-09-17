import express from 'express'
import ControllerAuth from '../controller/controllerAuth'
import authMiddlerware from '../middlewares/authMiddlerware'
import { Request, Response } from 'express'
import { error } from 'console'

const router = express.Router()
const controller = new ControllerAuth()

router
    .post('/login', async(req:Request, res:Response) =>{
        try {
            const usuario = await controller.login(req.body)
            res.status(200).json(usuario)
        } catch (erro:any) {
            res.status(500).json({error: erro.message})
        }
    })
    .post('/logout', async(req:Request, res:Response) =>{
        try{
            await authMiddlerware.handle(req, res)
            const usuario = await controller.logout(req, res)
            res.status(200).json(usuario)
        }catch(erro:any){
            res.status(500).json({error: erro.message})
        }
    })

export default router