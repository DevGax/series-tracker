import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  await supabase.sessionList;

  if (supabase.user()) {
    return true;
  }

  return router.parseUrl('/auth');
};

export const authRedirectGuard = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);
  await supabase.sessionList;
  if (supabase.user()) {
    return router.parseUrl('/');
  }

  return true;
};
