import { Entity, Property, ManyToMany,OneToOne, ManyToOne, Collection, Cascade, Rel, OneToMany, TimeType } from '@mikro-orm/core'
import { BaseEntity } from '../Shared/baseEntity.entity.js'
import { Profesor } from '../profesor/profesores.entity.js'
import { Alumno } from '../alumno/alumnos.entity.js'
import { Tp } from '../tp/tps.entity.js'
import { Parcial } from '../parcial/parcial.entity.js'

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
    @ManyToOne(()=> Profesor, {nullable: false})
    profesor?: Rel<Profesor>
    
    @OneToOne(() => Parcial, { cascade: [Cascade.ALL], nullable: true })
    parcial?: Rel<Parcial>;
    /*@OneToOne(()=> Tp)
    tp!: Tp*/  //esta linea la hice con el profe, la de abajo es de regi

   @OneToMany(()=> Tp,(tp)=> tp.curso,{
    cascade:[Cascade.ALL]})
   tps?: Collection<Tp>;
   
} //ver tema fecha