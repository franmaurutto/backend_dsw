import { Entity,Property,ManyToOne,Rel} from "@mikro-orm/core"
import { BaseEntity } from "../Shared/baseEntity.entity.js"
import { Curso } from "../curso/cursos.entity.js"

@Entity()
export class Tp extends BaseEntity{

  @Property({nullable: false})
  nroTp!: number

  @Property({nullable: false})
  consigna!: string

  @ManyToOne(()=> Curso,{nullable:true})//cambiar nullable
  curso!: Rel<Curso>
  
}