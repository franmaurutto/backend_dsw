import { Repository } from "../Shared/repository.js";
import { Tp } from "./tps.entity.js";

const tps = [
    new Tp(
      'En este trabajo práctico, se debera desarrollar un programa en Python para gestionar el inventario de una pequeña tienda. El programa deberá leer los datos de los productos desde un archivo, permitir la manipulación del inventario (añadir, eliminar, y modificar productos), y guardar los cambios en el archivo',
      
      'a02b91bc-3769-4221-beb1-d7a3aeba7der'//VERr
    ),
]

export class TpRepository implements Repository <Tp>{ 
    public findAll(): Tp[] | undefined {
        return tps
    }
    public findOne(item: { identificador: string; }): Tp | undefined {
        return tps.find((tp) => tp.nroTp === item.identificador)
    }
    public add(item: Tp): Tp | undefined {
        tps.push(item)
        return item
    }
    public update(item: Tp): Tp | undefined {
        const tpNro = tps.findIndex((tp) => tp.nroTp === item.nroTp)

        if (tpNro !== -1) {
          tps[tpNro] = { ...tps[tpNro], ...item }
        }
        return tps[tpNro]
    }
    public delete(item: { identificador: string; }): Tp | undefined {
        const tpNro = tps.findIndex((tp) => tp.nroTp === item.identificador)

        if (tpNro !== -1) {
          const deletedAlumnos = tps[tpNro]
          tps.splice(tpNro, 1)
          return deletedAlumnos}
    }
}