import crypto from 'node:crypto' 

export class Profesor{
    constructor(
        public nombre_y_apellido:string,
        public mail:string,
        public telefono:number,
        public contrasenia:string,
        public identificador= crypto.randomUUID()){}
}