import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Pipe({ name: 'safeBg', standalone: true })
export class SafeBgPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string | null | undefined): SafeStyle {
    if (!url) return 'none';
    return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
  }
}
