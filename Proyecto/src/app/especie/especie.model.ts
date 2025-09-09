export interface Especie {
  id_especie: number;
  nombre_vulgar: string;
  nombre_cientifico: string;
  familia_pertenece: string;
  peligro_extincion: string;
}
export type EspecieCreate = Omit<Especie, 'id_especie'>;
