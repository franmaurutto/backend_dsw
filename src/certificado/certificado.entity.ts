import crypto from 'node:crypto'

export class Certificado{    
    constructor(
        public descripcion: string, 
        public fechaEmision: string, 
        public id = crypto.randomUUID()
    ) {}
}