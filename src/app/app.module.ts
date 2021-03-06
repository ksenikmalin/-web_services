import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormGroup } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AngularFileUploaderModule } from "angular-file-uploader";
import { RegistrationComponent } from "./registration/registration.component";
import { AuthorizationComponent } from "./authorization/authorization.component";

import { NotebookComponent } from "./notebook/notebook.component";
import { NoteComponent } from "./note/note.component";
import { AddNoteComponent } from "./add-note/add-note.component";
import { ViewNoteComponent } from "./view-note/view-note.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RegistrationComponent,
    AuthorizationComponent,
    NotebookComponent,
    NoteComponent,
    AddNoteComponent,
    ViewNoteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    AngularFileUploaderModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
