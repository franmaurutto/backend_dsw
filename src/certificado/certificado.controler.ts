import { Request, Response, NextFunction } from "express"
import { CertificadoRepository } from "./certificados.repository.js"
import { Certificado } from "./certificado.entity.js"


const repository = new CertificadoRepository()

function sanitizeCertificadoInput(req: Request, res: Response, next: NextFunction){
    
    req.body.sanitizedInput = {
        descripcion: req.body.descripcion,
        fechaEmision: req.body.fechaEmision,
        
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
    const certificado = repository.findOne({identificador})
    if (!certificado){
        return res.status(404).send({ message: 'Certificado no encontrado'})
    }
    res.json({data: certificado}) // ver return
}

function add(req:Request,res:Response) {
    const input = req.body.sanitizedInput

    const certificadoInput = new Certificado(
        input.descripcion,
        input.fechaEmision,
    )

    const certificado = repository.add(certificadoInput)
    return res.status(201).send({message:'Certificado creado', data: certificado})
}

function update(req:Request,res:Response) {
    req.body.sanitizedInput.id = req.params.id
    const certificado = repository.update(req.body.sanitizedInput)

    if (!certificado){
        return res.status(404).send({message: 'Certificado no enontrado'})
    }

    return res.status(200).send({message: 'Certificado actualizado con éxito', data:certificado})
}

function remove(req:Request,res:Response) {
    const identificador= req.params.id
    const certificado = repository.delete ({identificador})

    if(!certificado){
        res.status(404).send({message: 'Certificado no enontrado'})
    } else{
        res.status(200).send({message: 'Certificado eliminado correctamente'}) // resource not found?
    }
}

export {sanitizeCertificadoInput, findAll, findOne, add, update, remove}

