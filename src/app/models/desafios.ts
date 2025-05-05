export interface Desafio {
    _id?: string;
    desafio: string;
    experiencia: string;
    valor: string; // 1 punto
    premio: string; // 2 gemas
    tiempoMaximo: number; // en minutos
    intentos: number;
    activo: boolean;   
}
