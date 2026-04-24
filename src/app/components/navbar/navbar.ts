import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  supabase = inject(SupabaseService);
  router = inject(Router);
  theme = inject(ThemeService);

  async logout(): Promise<void> {
    await this.supabase.signOut();
    this.router.navigate(['/auth']);
  }
}
