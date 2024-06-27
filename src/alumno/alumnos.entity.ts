import crypto from 'node:crypto' 


export class Alumno{
    constructor(public nombre_y_apellido:string, public mail:string, public telefono:number, public contrasenia:string, public id= crypto.randomUUID()){}
}