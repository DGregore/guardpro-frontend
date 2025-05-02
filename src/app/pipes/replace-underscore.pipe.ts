// guardpro-frontend/src/app/pipes/replace-underscore.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceUnderscore',
  standalone: true // Make the pipe standalone
})
export class ReplaceUnderscorePipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    // Replace underscores with spaces
    // Optionally, you could add logic here to capitalize words if needed
    return value.replace(/_/g, ' ');
  }

}
