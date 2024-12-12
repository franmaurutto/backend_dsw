import { Entity,Property,OneToOne,Rel} from "@mikro-orm/core"
import { BaseEntity } from "../Shared/baseEntity.entity.js"
import { Curso } from "../curso/cursos.entity.js"

@Entity()
export class Tp extends BaseEntity{

  @Property({nullable: false})
  consigna!: string

  @Property({nullable: false})
  fechaLimite!: Date

  @OneToOne(() => Curso, (curso) => curso.tp)
  curso?: Rel<Curso>; 
  
}