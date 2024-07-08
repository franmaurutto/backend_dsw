import { Request, Response, NextFunction } from "express"
import { TpRepository } from "./tps.repository.js"
import { Tp } from "./tps.entity.js"


const repository = new TpRepository()

function sanitizeCertificadoInput(req: Request, res: Response, next: NextFunction){
    
    req.body.sanitizedInput = {
        consigna: req.body.descripcion,
        nroTp: req.body.nroTp,
        
    }
    
    Object.keys(req.body.sanitizedInput).forEach(key=>{
        if (req.body.sanitizedInput[key]===undefined){
        delete req.body.sanitizedInput[key]
        }
    })
    next()
} //funcion q actua como un middleware, hay q hacer mas validaciones

function findAll(req:Request,res:Response) {
    res.json({data: repository.findAll()})
}

function findOne(req:Request,res:Response) {
    const identificador = req.params.id
    const tp = repository.findOne({identificador})
    if (!tp){
        return res.status(404).send({ message: 'Trabajo practico no encontrado'})
    }
    res.json({data: tp}) // ver return
}

function add(req:Request,res:Response) {
    const input = req.body.sanitizedInput

    const tpInput = new Tp(
        input.consigna,
        input.nroTp,
    )

    const tp = repository.add(tpInput)
    return res.status(201).send({message:'Trabajo practico creado', data: tp})
}

function update(req:Request,res:Response) {
    req.body.sanitizedInput.id = req.params.id
    const tp = repository.update(req.body.sanitizedInput)

    if (!tp){
        return res.status(404).send({message: 'Trabajo practico no enontrado'})
    }

    return res.status(200).send({message: 'Trabajo practico actualizado con éxito', data:tp})
}

function remove(req:Request,res:Response) {
    const identificador= req.params.id
    const tp = repository.delete ({identificador})

    if(!tp){
        res.status(404).send({message: 'Trabajo practico no enontrado'})
    } else{
        res.status(200).send({message: 'Trabajo practico eliminado correctamente'}) // resource not found?
    }
}

export {sanitizeCertificadoInput, findAll, findOne, add, update, remove}