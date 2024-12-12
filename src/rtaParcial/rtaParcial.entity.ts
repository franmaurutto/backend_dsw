import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade, OneToOne, ManyToOne ,Rel} from "@mikro-orm/core";
import { BaseEntity } from "../Shared/baseEntity.entity.js";
import { Inscripcion } from "../inscripcion/inscripciones.entity.js";
import { Parcial } from "../parcial/parcial.entity.js"

@Entity()
export class RtaParcial extends BaseEntity{
   
    @Property({ nullable: false })
    rtaConsignaParcial!: string

    @OneToOne(()=>Inscripcion,{nullable:true})
    inscripcion?: Inscripcion | null;

    @ManyToOne(() => Parcial, { nullable: true })  // Relación ManyToOne con Parcial
    parcial!: Parcial | null;

}