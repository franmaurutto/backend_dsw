import { Entity, Property, OneToMany, ManyToMany, Collection, Cascade, OneToOne, ManyToOne,Rel } from "@mikro-orm/core";
import { BaseEntity } from "../Shared/baseEntity.entity.js";
import { Inscripcion } from "../inscripcion/inscripciones.entity.js";
import { Tp } from "../tp/tps.entity.js";

@Entity()
export class RtaTp extends BaseEntity{
   
    @Property({ nullable: false })
    rtaConsignaTP!: string

    @OneToOne(()=>Inscripcion,{nullable:true})
    inscripcion?: Inscripcion | null;

    @ManyToOne(() => Tp, { nullable: true })
    tp!: Tp | null; 

}