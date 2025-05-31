import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { NavComponent } from './shared/components/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Gestion des Cours';
  showNavbar = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Vérifier l'URL actuelle au démarrage
    this.showNavbar = !this.router.url.includes('/auth/');

    // Écouter les changements de route pour masquer/afficher la navbar
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Masquer la navbar sur les pages d'authentification
        this.showNavbar = !event.url.includes('/auth/');
      });
  }
}
