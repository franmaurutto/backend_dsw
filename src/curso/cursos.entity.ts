import { Entity, Property, ManyToMany,OneToOne, ManyToOne, Collection, Cascade, Rel, OneToMany, TimeType } from '@mikro-orm/core'
import { BaseEntity } from '../Shared/baseEntity.entity.js'
import { Tp } from '../tp/tps.entity.js'
import { Parcial } from '../parcial/parcial.entity.js'
import { Inscripcion } from '../inscripcion/inscripciones.entity.js'
import { Material } from '../material/material.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'

@Entity()
export class Curso extends BaseEntity{
    @Property()
    descripcion!:string
    @Property({ nullable: false, unique: true }) 
    nombre!:string
    @Property({ nullable: false})
    cantCupos!:number
    @Property({ nullable: false})
    duracion!:string
    @Property({ type:'date',nullable: false})
    fechaInicio!:Date
    @Property({ type:'date',nullable: false})
    fechaFin!:Date
    @Property({ nullable: false})
    horaInicio!: string
    @Property({ nullable: false})
    horaFin!: string
    @Property({ nullable: false}) 
    dias!: string 
    @ManyToOne(()=> Usuario, {nullable: false})
    profesor?: Rel<Usuario>
    @OneToMany(()=> Inscripcion,(inscripcion)=> inscripcion.curso,{
    cascade:[Cascade.ALL]})
    inscripciones?: Collection<Inscripcion>;
    @OneToOne(() => Parcial, { nullable: true })
    parcial?:Rel<Parcial>
    @OneToMany(() => Material, (material) => material.curso, { 
    cascade: [Cascade.ALL]})
    materiales?: Collection<Material>; 
    @OneToOne(() => Tp, { nullable: true })
    tp?:Rel<Tp>
   
} 