//import { Repository } from "../Shared/repository.js";
import { Certificado } from "./certificado.entity.old.js";

const certificados = [
    new Certificado(
        'Se otorga el siguiente certificado acreditando que el alumno ha asistido al curso de Python y ha alcanzado los requisitos exigidos por el mismo',
        '30 de julio de 2024',
        'a678gdab-d307-4221-be5e-f14e43hj5981'
    )
]

export class CertificadoRepository {//implements Repository <Certificado>{

    public findAll(): Certificado[] | undefined {
        return certificados
    }

    public findOne(item: { identificador: string; }): Certificado | undefined {
        return certificados.find((certificado)=> certificado.id === item.identificador)
    }

    public add(item: Certificado): Certificado | undefined {
        certificados.push(item)
        return item
    }

    public update(item: Certificado): Certificado | undefined {
        const certificadoIdx = certificados.findIndex((certificado)=> certificado.id === item.id)

        if(certificadoIdx !== -1) {
            certificados[certificadoIdx]= { ...certificados[certificadoIdx], ...item}
        }
        return certificados[certificadoIdx]
    }

    public delete(item: { identificador: string; }): Certificado | undefined {
        const certificadoIdx= certificados.findIndex((certificado)=> certificado.id === item.identificador)

        if (certificadoIdx !== -1) {
            const deletedCertificados = certificados[certificadoIdx]
            certificados.splice(certificadoIdx, 1)
            return deletedCertificados
        }
    }
}