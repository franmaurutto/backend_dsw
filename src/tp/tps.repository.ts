import { Repository } from "../Shared/repository.js";
import { Tp } from "./tps.entity.js";

const tps = [
    new Tp(
        'El objetivo de este trabajo práctico es desarrollar un programa en Python que permita gestionar el inventario de una pequeña tienda. El sistema debe proporcionar funcionalidades básicas como agregar, modificar, eliminar y buscar productos dentro del inventario, facilitando así la administración de los productos disponibles en la tienda.',
        1,
        'a678gdab-d307-4221-be5e-f14e43hj5982'
    )
]

export class TpRepository implements Repository <Tp>{

    public findAll(): Tp[] | undefined {
        return tps
    }

    public findOne(item: { identificador: string; }): Tp | undefined {
        return tps.find((tp)=> tp.id === item.identificador)
    }

    public add(item: Tp): Tp | undefined {
        tps.push(item)
        return item
    }

    public update(item: Tp): Tp | undefined {
        const tpIdx = tps.findIndex((tp)=> tp.id === item.id)

        if(tpIdx !== -1) {
            tps[tpIdx]= { ...tps[tpIdx], ...item}
        }
        return tps[tpIdx]
    }

    public delete(item: { identificador: string; }): Tp | undefined {
        const tpIdx= tps.findIndex((tp)=> tp.id === item.identificador)

        if (tpIdx !== -1) {
            const deletedTps = tps[tpIdx]
            tps.splice(tpIdx, 1)
            return deletedTps
        }
    }
}