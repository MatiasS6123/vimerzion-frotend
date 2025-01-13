import { Cliente } from "./cliente";

export interface userLogin{
    email:string,
    password:string;
}

export interface RoleResponse {
    role: string;
    message: string;
  }


  export interface UserAdminRegiter{
   
    id?:number;
    username:string;
    email:string;
    password:string;
    nombreRol:string
  }

  export type RegistroUsuario = Cliente | UserAdminRegiter; // Unión discriminada