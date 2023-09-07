import { Router } from "express";;
import { messageModel } from "../models/message.models.js";

const messageRouter = Router();

messageRouter.get('/', async (req, res) => {
    const {limit} = req.query
    try {
        const message = await messageModel.find().limit(limit);
        res.status(200).send({respuesta: 'ok', mensaje: message})
    } catch (error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
})

messageRouter.post('/', async (req, res) => {
    const {email, message} = req.body
    try {
        const respuesta = await messageModel.create({email, message});
        res.status(200).send({respuesta: 'OK message send', mensaje: respuesta})
    } catch (error){
        res.status(400).send({respuesta: 'Error sending message', mensaje: error})
    }
})

export default messageRouter;