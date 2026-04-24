import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { from, Observable } from 'rxjs';

// Función que desactiva el navigator lock
const noOpLock = async (
  _name: string,
  _acquireTimeout: number,
  fn: () => Promise<any>,
): Promise<any> => {
  return await fn();
};

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  // Signal reactivo con el usuario actual
  user = signal<User | null>(null);
  loadAuth = signal(true);

  private sessionListResolve!: () => void;
  readonly sessionList = new Promise<void>((resolve) => {
    this.sessionListResolve = resolve;
  });

  constructor() {
    // this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: localStorage,
        lock: noOpLock,
      },
    });
    // Escuchar cambios de sesión
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.user.set(session?.user ?? null);
      this.loadAuth.set(false);
      this.sessionListResolve();
    });

    // Cargar sesión existente
    // this.supabase.auth.getSession().then(({ data }) => {
    //   this.user.set(data.session?.user ?? null);
    //   this.loadAuth.set(false);
    //   this.sessionListResolve();
    // });
  }

  get client() {
    return this.supabase;
  }

  // Auth
  signUp(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password });
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  // Helper para el user_id actual
  get userId(): string | undefined {
    return this.user()?.id;
  }

  // ACTIONS POSTERS
  async uploadPoster(file: File, serieId: string): Promise<string> {
    const userId = this.userId;
    if (!userId) throw new Error('No autenticado');

    const filePath = `${userId}/${serieId}.webp`;

    const { error } = await this.supabase.storage.from('posters').upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

    if (error) throw error;

    // Obtener URL pública
    const { data } = this.supabase.storage.from('posters').getPublicUrl(filePath);

    return data.publicUrl;
  }

  async deletePoster(serieId: string): Promise<void> {
    const userId = this.userId;
    if (!userId) return;

    const filePath = `${userId}/${serieId}.webp`;

    await this.supabase.storage.from('posters').remove([filePath]);
  }
}
