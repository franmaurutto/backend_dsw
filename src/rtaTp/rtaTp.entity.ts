import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade, OneToOne, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "../Shared/baseEntity.entity.js";
import { Inscripcion } from "../inscripcion/inscripciones.entity.js";
import { Tp } from "../tp/tps.entity.old.js";

@Entity()
export class RtaTp extends BaseEntity{
   
    @Property({ nullable: false })
    rtaConsignaTP!: string

    /*@ManyToOne(() => Inscripcion)
    inscripcion!: Inscripcion;

    @ManyToOne(() => Tp)
    tp!: Tp; */

    //ver si esta bien hacer la asociativa asi
}