import { bootstrapApplication } from '@angular/platform-browser';
/**Se agrega los dos provider */
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
/**se importa la routes */
import { routes } from './app/app.routes';
/**se elimina el AppModule */
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()],
});
