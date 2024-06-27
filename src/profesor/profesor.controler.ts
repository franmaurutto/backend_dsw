import { Request, Response, NextFunction } from "express";
import { ProfesorRepository } from "./profesor.repository.js";
import { Profesor } from "./profesores.entity.js";
const repository = new ProfesorRepository()

function sanitizeProfesorInput(req: Request, res: Response, next: NextFunction) {
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
function findAll(req: Request, res: Response){
    res.json({data:repository.findAll()})
}
function findOne(req: Request, res: Response, next: NextFunction) {
    const profesor = repository.findOne({identificador:req.params.id})

    if(!profesor){
       return res.status(404).send({message:'Profesor no encontrado'})
    }
    res.json({data:profesor})
}
function add(req: Request, res: Response, next: NextFunction) {
    const input = req.body.sanitizedInput;
    const profesorInput = new Profesor(input.nombre_y_apellido, input.mail, input.telefono, input.contrasenia);
    const profesor = repository.add(profesorInput)
    return res.status(201).send({ message: 'Profesor creado', data: profesor });
}

function update(req: Request, res: Response) {

    req.body.sanitizedInput.id=req.params.id
    const profesor= repository.update(req.body.sanitizedInput)

    if (!profesor) {
        return res.status(404).send({ message: 'Profesor no encontrado' })
    }
    return res.status(200).send({ message: 'Profesor actualizado con éxito', data: profesor });
}



function remove(req: Request, res: Response) {

    const identificador= req.params.id
    const profesor = repository.delete({identificador})

    if (!profesor) {
        res.status(404).send({ message: 'Profesor no encontrado' })
    } else{
        res.status(200).send({ message: 'Profesor borrado con éxito'})
    }
   
}
export {sanitizeProfesorInput, findAll, findOne, add, update, remove}