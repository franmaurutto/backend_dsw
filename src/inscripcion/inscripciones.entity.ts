import { Entity, Property, ManyToMany,OneToOne, ManyToOne, Collection, Cascade, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../Shared/baseEntity.entity.js'
/*import { Certificado } from '../certificado/certificados.entity.js'
import { Parcial } from '../parcial/parciales.entity.js'
import { TP } from '../tp/tps.entity.js'
import { RtaParcial } from '../rtaparcial/rtaparciales.entity.js'
import { RtaTP } from '../rtatp/rtatps.entity.js'*/

@Entity()
export class Inscripcion extends BaseEntity{
    @Property({ nullable: false})
    fechaInscripcion!:string
    @Property()
    cancelado!:boolean
    /*@OneToOne(()=>Certificado)
    certificado!: Certificado
    @ManyToMany(()=>Parcial, (parcial)=>parcial.inscripciones){
        cascade:[Cascade.ALL],
        PONER OWNER A PARCIAL
    }
    parciales = new Collection<Parcial>(this)
    @ManyToMany(()=>TP, (tp)=>tp.inscripciones){
        cascade:[Cascade.ALL],
        PONER OWNER A TP
    }
    tps = new Collection<TP>(this)
    @OneToOne(()=>RtaParcial)
    rtaparcial!: RtaParcial
    @OneToOne(()=>RtaTP)
    rtatp!: RtaTP
    PREGUNTAR SI LAS ASOCIATIVAS SE HACEN ASI
    */
}
