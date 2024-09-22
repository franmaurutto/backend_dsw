import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade, OneToOne } from "@mikro-orm/core";
import { BaseEntity } from "../Shared/baseEntity.entity.js";
import { Inscripcion } from "../inscripcion/inscripciones.entity.js";

@Entity()
export class Certificado extends BaseEntity{
   
    @Property({ nullable: false })
    descripcion!: string
  
    @Property({ nullable: false })
   fechaEmision!: string
  
    /*@OneToOne(() => Inscripcion, inscripcion => inscripcion.certificado{ cascade:[Cascade.ALL] })
    inscripcion!: Inscripcion;*/
    // en inscripcion va  @JoinColumn() o lo ponemos en certificado???
    ////@JoinColumn({ name: 'nnn_id' })

}
