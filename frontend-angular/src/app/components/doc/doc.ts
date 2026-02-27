import { Component } from '@angular/core';

@Component({
  selector: 'app-doc',
  imports: [],
  templateUrl: './doc.html',
  styles: ``,
})
export class Doc {

  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
