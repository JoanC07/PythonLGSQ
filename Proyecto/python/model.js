export interface Universidad {
    id_universidad: number;
    anio_fundacion: string | null;
    pais_origen?: string | null;
    continente?: string | null;
    estudiante_nombre?: string;
    profesor_nombre?: string;
}
export type UniversidadCreate = Omit<Universidad, 'id_universidad'>;

