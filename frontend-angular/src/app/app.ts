import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  title = 'WikiMultiApi';

  readonly images = [
    '/img/background/pexels-felix-mittermeier-956981_1_11zon_60.jpg',
    '/img/background/pexels-krisof-1252890_2_11zon_60.jpg',
    '/img/background/pexels-philippedonn-1257860_3_11zon_60.jpg',
  ];

  currentIndex = signal(0);
  nextIndex = signal(1);
  transitioning = signal(false);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    // Cambiar imagen cada 2 minutos
    this.intervalId = setInterval(() => this.cycleImage(), 120_000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private cycleImage(): void {
    const total = this.images.length;
    this.nextIndex.set((this.currentIndex() + 1) % total);
    this.transitioning.set(true);
    setTimeout(() => {
      this.currentIndex.set(this.nextIndex());
      this.transitioning.set(false);
    }, 1500);
  }
}
