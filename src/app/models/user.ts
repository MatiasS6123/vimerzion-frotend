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
  export interface LoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
    role: string;
    puntos: number;
    username: string;
  };
}

  export type RegistroUsuario = Cliente | UserAdminRegiter; // Unión discriminada