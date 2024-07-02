import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
<<<<<<< HEAD
    importProvidersFrom(ReactiveFormsModule),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
  ],
});
=======
    importProvidersFrom(ReactiveFormsModule), provideAnimationsAsync(), provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
],
});
>>>>>>> 1c8d705 ("Added service worker configuration and updated angular.json, package-lock.json, and package.json files" (ng add @angular/pwa))
