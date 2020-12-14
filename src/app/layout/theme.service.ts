import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type Theme = 'primary' | 'secondary' | 'tertiary' | 'light' | 'medium' | 'dark';

export const themes: Theme[] = ['dark', 'secondary', 'tertiary', 'light', 'medium', 'primary'];

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    themes: Theme[] = themes;
    theme: Subject<Theme> = new Subject<Theme>();
    constructor() {
        setTimeout(() => {
            this.theme.next(this.themes[0]);
        }, 1000);
    }
}
