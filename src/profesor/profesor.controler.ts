import { Request, Response, NextFunction } from "express";
import { Profesor } from "./profesores.entity.js";
import { orm } from "../Shared/orm.js";

const em = orm.em

function sanitizeProfesorInput(
    req: Request,
    res: Response,
    next: NextFunction) {
    req.body.sanitizedInput = {
        nombre_y_apellido: req.body.nombre_y_apellido,
        mail: req.body.mail,
        telefono: req.body.telefono,
        contrasenia: req.body.contrasenia,
    };

    Object.keys(req.body.sanitizedInput).forEach(key => {
        if (req.body.sanitizedInput[key] === undefined) 
           { delete req.body.sanitizedInput[key]};       
    });

    next();
}
async function findAll(req: Request, res: Response){
    res.status(500).json({ message:'No implementado'})
}
async function findOne(req: Request, res: Response){
    res.status(500).json({ message:'No implementado'})
}
async function add(req: Request, res: Response){
    res.status(500).json({ message:'No implementado'})
}
async function update(req: Request, res: Response){
    res.status(500).json({ message:'No implementado'})
}
async function remove(req: Request, res: Response){
    res.status(500).json({ message:'No implementado'})
}
export {sanitizeProfesorInput, findAll, findOne, add, update, remove}