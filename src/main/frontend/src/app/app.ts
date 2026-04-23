import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule, MatCardModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('boats');
  readonly themeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.initTheme();
  }
}
