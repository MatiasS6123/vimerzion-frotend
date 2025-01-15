import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { GamesComponent } from './pages/games/games.component';
import { TecnologiaComponent } from './pages/tecnologia/tecnologia.component';
import { ServicioComponent } from './pages/servicio/servicio.component';
import { MostrarServiciosComponent } from './pages/mostrar-servicios/mostrar-servicios.component';
import { MostrarTecnologiasComponent } from './pages/mostrar-tecnologias/mostrar-tecnologias.component';
import { CatalogoJuegoComponent } from './pages/catalogo-juego/catalogo-juego.component';
import { TiendaComponent } from './pages/tienda/tienda.component';
import { LoginComponent } from './pages/login/login.component';
import { PaquetesComponent } from './pages/paquetes/paquetes.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { RegistroAdministradoresComponent } from './pages/registro-administradores/registro-administradores.component';
import { authRoleGuard } from './guard/auth-role.guard';
import { CheckoutComponent } from './shared/components/checkout/checkout.component';
import { RespuestaPagoComponent } from './shared/components/respuesta-pago/respuesta-pago.component';
import { OrdenesComponent } from './pages/ordenes/ordenes.component';
import { ListaJuegosComponent } from './shared/components/lista-juegos/lista-juegos.component';
import { ListaServiciosComponent } from './shared/components/lista-servicios/lista-servicios.component';
import { ListaPaquetesComponent } from './shared/components/lista-paquetes/lista-paquetes.component';
import { ListaTecnologiaComponent } from './shared/components/lista-tecnologia/lista-tecnologia.component';
import { DetalleOrdenComponent } from './shared/components/detalle-orden/detalle-orden.component';
import { DetalleServicioComponent } from './shared/components/detalle-servicio/detalle-servicio.component';
import { ListaUsuarioComponent } from './shared/components/lista-usuario/lista-usuario.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'inicio', // Redirige a la ruta 'inicio'
        pathMatch: 'full', // Coincidencia completa para evitar conflictos con rutas parciales
    },
    {
        path:'inicio',
        component:HomeComponent,
        data: { public: true },

    },
    {
        path:'contacto',
        component:ContactComponent,
        data: { public: true },
    },
    {
        path:'servicios',
        component:MostrarServiciosComponent,
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
        data: { public: true },

    },
    {
        path:'detalle-servicio',
        component:DetalleServicioComponent,
        data: { public: true },

    },
    {

        path:'tecnologias',
        component:MostrarTecnologiasComponent,
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
        data: { public: true },
    },
    {
        path:'catalogo',
        component:CatalogoJuegoComponent,
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
        data: { public: true },
    },
    {
        path:'tienda',
        component:TiendaComponent,
        data: { public: true },
    },
    {
        path:'gestion-juegos',
        component:GamesComponent,
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] },
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
    },
    {
        path:'gestion-tecnologias',
        component:TecnologiaComponent,
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] },
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
    },
    {
        path:'gestion-usuarios',
        component:RegistroAdministradoresComponent,
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] }
        
    },
    {
        path:'gestion-servicios',
        component:ServicioComponent,
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] },
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
    },
    {
        path:'gestion-paquetes',
        component:PaquetesComponent,
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] },
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
    },
    {
        path:'lista-juegos',
        component:ListaJuegosComponent,
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] },
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
    },
    {
        path:'lista-servicios',
        component:ListaServiciosComponent,
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] },
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
    },
    {
        path:'lista-paquetes',
        component:ListaPaquetesComponent,
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] },
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
    },
    {
        path:'lista-tecnologias',
        component:ListaTecnologiaComponent,
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] },
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
    },
    {
        path:'lista-usuarios',
        component:ListaUsuarioComponent,
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR'] },
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
    },
    {
        path:'login',
        component:LoginComponent,
        data: { public: true },
    },{
        path:'registro',
        component:RegistroComponent,
        data: { public: true }
    },
    {
        path:'checkout',
        component:CheckoutComponent,
        canActivate: [authRoleGuard],
        data: { roles: ['ADMINISTRADOR','CLIENTE'] }

    },
    {
        path: 'webpay/return', // Ruta para manejar la respuesta de Webpay
        component: RespuestaPagoComponent, // Componente de respuesta
        canActivate: [authRoleGuard], // Asegúrate de que solo usuarios autenticados puedan acceder
        data: { roles: ['CLIENTE'] }, // Opcional: Solo los clientes pueden procesar pagos
    },
    {
        path: 'ordenes', // Ruta para manejar la respuesta de Webpay
        component: OrdenesComponent, // Componente de respuesta
        canActivate: [authRoleGuard], // Asegúrate de que solo usuarios autenticados puedan acceder
        data: { roles: ['CLIENTE','ADMINISTRADOR'] }, // Opcional: Solo los clientes pueden procesar pagos
    },
    {
        path:'detalle-orden',
        component:DetalleOrdenComponent,
        canActivate: [authRoleGuard], // Asegúrate de que solo usuarios autenticados puedan acceder
        data: { roles: ['CLIENTE','ADMINISTRADOR'] }, // Opcional: Solo los clientes pueden procesar pagos
    }, // Tus demás rutas
    {
        path: '**',
        redirectTo: 'inicio', // Redirige a 'inicio' si no coincide con ninguna ruta
    },

    
];
