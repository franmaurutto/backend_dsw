import crypto from 'node:crypto' 


export class Tp{
    constructor(public consigna:string, public nroTp= crypto.randomUUID()){}
}