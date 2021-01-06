import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { TabViewModule } from 'primeng/tabview';
import { AngularFireModule } from '@angular/fire';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DragDropModule } from 'primeng/dragdrop';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MarkdownModule } from 'ngx-markdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalComponent } from './global/global.component';
import { CountryComponent } from './country/country.component';
import { environment } from 'src/environments/environment';
import { SummaryComponent } from './summary/summary.component';
import { HeaderComponent } from './header/header.component';
import { SigninComponent } from './signin/signin.component';
import { EditorComponent } from './editor/editor.component';
import { NewsArticleComponent } from './news-article/news-article.component';
import { AdminComponent } from './admin/admin.component';
import { NewsListComponent } from './news-list/news-list.component';

@NgModule({
  declarations: [
    AppComponent,
    GlobalComponent,
    CountryComponent,
    SummaryComponent,
    HeaderComponent,
    SigninComponent,
    EditorComponent,
    NewsArticleComponent,
    AdminComponent,
    NewsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    ChartModule,
    TableModule,
    ProgressSpinnerModule,
    FieldsetModule,
    PanelModule,
    TabViewModule,
    ButtonModule,
    DropdownModule,
    InputTextareaModule,
    InputTextModule,
    DragDropModule,
    HttpClientModule,
    FileUploadModule,
    DialogModule,
    MarkdownModule.forRoot(),
    FormsModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
