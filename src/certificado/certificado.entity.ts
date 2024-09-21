import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade, OneToOne } from "@mikro-orm/core";
import { BaseEntity } from "../Shared/baseEntity.entity.js";
import { Inscripcion } from "../inscripcion/inscripciones.entity.js";

@Entity()
export class Certificado extends BaseEntity{
   
    @Property({ nullable: false })
    descripcion!: string
  
    @Property({ nullable: false })
   fechaEmision!: string
  
    /*@OneToOne(() => Inscripcion, inscripcion => inscripcion.certificado)
    inscripcion!: Inscripcion;*/
    // en inscripcion va owner: true??
}
