export interface Repository<T> { 
    findAll(): T[] | undefined 
    findOne(item: { identificador: string }): T | undefined 
    add(item: T): T | undefined 
    update(item: T): T | undefined
    delete(item: { identificador: string }): T | undefined
  }