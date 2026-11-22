import { Component, OnInit, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  imports: [JsonPipe],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);

  profile = signal<any>(null);

  ngOnInit() {
    this.auth.getProfile().subscribe({
      next: p => this.profile.set(p),
      error: () => this.logout(),   // token invalid or expired: back to login
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}