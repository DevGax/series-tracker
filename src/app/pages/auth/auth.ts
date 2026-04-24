import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  private fb = inject(FormBuilder);
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  mode: 'login' | 'register' = 'login';
  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  changeMode(): void {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.error.set(null);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.value;

    try {
      if (this.mode === 'login') {
        const { error } = await this.supabase.signIn(email!, password!);
        if (error) throw error;
      } else {
        const { error } = await this.supabase.signUp(email!, password!);
        if (error) throw error;
      }

      this.router.navigate(['/']);
    } catch (err: any) {
      this.error.set(err.message || 'Error de autenticación');
    } finally {
      this.loading.set(false);
    }
  }
}
