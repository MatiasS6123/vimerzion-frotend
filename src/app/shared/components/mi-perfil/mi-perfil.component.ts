import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { LoginResponse } from '../../../models/user';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // también recomendable

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {
  perfilForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUserData();
    this.perfilForm = this.fb.group({
      id: [{ value: user?.id || '', disabled: true }],
      email: [user?.email || '', [Validators.required, Validators.email]],
      role: [{ value: user?.role || '', disabled: true }],
      puntos: [{ value: user?.puntos || 0, disabled: true }],
      username: [user?.username || '', Validators.required],
    });
  }
}
