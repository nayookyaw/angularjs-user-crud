import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '../models/user';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly key = "users_v1";
  private readonly isBrowser: boolean = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getAll(): User[] {
    return this.read();
  }

  getById(id: string): User | undefined {
    return this.read().find(u => u.id === id);
  }

  create(input: Omit<User, 'id' | 'createdAtUtc'>): User {
    const users = this.read();
    const newUser : User = {
      id: crypto.randomUUID(),
      name: input?.name?.trim(),
      email: input?.email?.trim(),
      role: input?.role?.trim() ?? "",
      createdAtUtc: new Date()?.toISOString()
    };

    users.push(newUser);
    this.write(users);
    return newUser;
  }

  update(id: string, input: Omit<User, 'id' | 'createdAtUtc'>): User | null {
    const users = this.read();
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex < 0) return null;

    const existUser = users[userIndex];
    users[userIndex] = {
      ...existUser,
      name: input?.name?.trim(),
      email: input?.email?.trim(),
      role: input?.role?.trim() ?? ''
    };
    this.write(users);
    return users[userIndex];
  }

  delete (id: string): void {
    const users = this.read()?.filter(u => u.id !== id);
    this.write(users);
  }

  clearAll(): void {
    localStorage.removeItem(this.key);
  }

  private read(): User[] {
    if (!this.isBrowser) return [];
    const raw = localStorage.getItem(this.key);
    return raw ? (JSON.parse(raw)) : [];
  }

  private write(users: User[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.key, JSON.stringify(users));
  }
}
