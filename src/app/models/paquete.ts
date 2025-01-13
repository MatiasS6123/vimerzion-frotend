export interface Paquete{
    id:number;
    nombre:string;
    descripcion:string;
    precio:number;
    foto:string;
    stock:string
}


export interface PaqueteCrud{
    id?:number;
    nombre:string;
    descripcion:string;
    precio:number;
    stock:number;
    foto:string;
    activo:boolean;

}