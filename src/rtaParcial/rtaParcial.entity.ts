import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade, OneToOne, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "../Shared/baseEntity.entity.js";
import { Inscripcion } from "../inscripcion/inscripciones.entity.js";
import { Parcial } from "../parcial/parcial.entity.js"

@Entity()
export class RtaParcial extends BaseEntity{
   
    @Property({ nullable: false })
    rtaConsignaParcial!: string

    /*@ManyToOne(() => Inscripcion)
    inscripcion!: Inscripcion;

    @ManyToOne(() => Parcial)
    parcial!: Parcial; */


}