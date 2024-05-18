import crypto from 'node:crypto' 


export class Curso{
    constructor(public descripcion:string, public nombre:string, public cantCupos:number, public duracion:string, public fechaInicio:string, public fechaFin:string, public horaInicio: string, public horaFin: string, public dias: string [], public identificador= crypto.randomUUID()){}
} //ver tema fecha