export interface Animal {
    id_animal: number;
    id_zoo: number;
    id_especie: number;
    identificacion: string;
    sexo: string;
    anio_nacimiento: string | null;
    pais_origen?: string | null;
    continente?: string | null;
    zoo_nombre?: string;
    especie_nombre?: string;
}
export type AnimalCreate = Omit<Animal, 'id_animal'>;