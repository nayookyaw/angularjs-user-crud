import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

type UserForm = {
  id: string | null;
  name: string;
  email: string;
  role: string;
};

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  users: User[] = [];
  searchText = '';
  form: UserForm = { id: null, name: '', email: '', role: '' };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.users = this.userService
      .getAll()
      .sort((a, b) => b.createdAtUtc.localeCompare(a.createdAtUtc));
  }

  reset(): void {
    this.form = { id: null, name: '', email: '', role: '' };
  }

  edit(u: User): void {
    this.form = { id: u.id, name: u.name, email: u.email, role: u.role };
  }

  save(): void {
    const email = this.form.email.trim().toLowerCase();
    const dup = this.users.some(u => u.email.toLowerCase() === email && u.id !== this.form.id);
    if (dup) {
      alert('Email already exists!');
      return;
    }

    if (!this.form.id) {
      this.userService.create({
        name: this.form.name,
        email: this.form.email,
        role: this.form.role,
      });
    } else {
      this.userService.update(this.form.id, {
        name: this.form.name,
        email: this.form.email,
        role: this.form.role,
      });
    }

    this.reset();
    this.load();
  }

  remove(id: string): void {
    if (confirm('Delete this user?')) {
      this.userService.delete(id);
      this.load();
      if (this.form.id === id) this.reset();
    }
  }

  clearAll(): void {
    if (confirm('Clear all users?')) {
      this.userService.clearAll();
      this.reset();
      this.load();
    }
  }

  filtered(): User[] {
    const s = this.searchText.trim().toLowerCase();
    if (!s) return this.users;
    return this.users.filter(u =>
      u.name.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s) ||
      (u.role || '').toLowerCase().includes(s)
    );
  }
}