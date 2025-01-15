import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-usuario',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './lista-usuario.component.html',
  styleUrl: './lista-usuario.component.css'
})
export class ListaUsuarioComponent {
  users: any[] = [];
  roles: any[] = [];
  selectedRole: string = '';
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private userService: UserService, private router:Router) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (response: any) => {
        this.roles = response.data.map((role: any) => role.nombre); // Solo nombres de roles
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
      }
    });
  }


  viewUser(id:number){
    this.router.navigate(['/gestion-usuarios'],{queryParams:{id:id}})
  }
  loadUsers(): void {
    this.userService.getPaginatedUsers(this.currentPage, this.selectedRole).subscribe({
      next: (response: any) => {
        this.users = response.data;
        this.totalPages = response.pagination.totalPages;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1; // Reiniciar a la primera página al cambiar el filtro
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }


}
