export interface Zoo {
    id_zoo: number;
    nombre: string;
    ciudad: string;
    pais: string;
    tamano: number;
    presupuesto: number;
}
export type ZooCreate = Omit<Zoo, 'id_zoo'>;