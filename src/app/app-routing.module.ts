import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RegistrationComponent } from "./registration/registration.component";
import { AuthorizationComponent } from "./authorization/authorization.component";
import { NotebookComponent } from "./notebook/notebook.component";
import { AddNoteComponent } from "./add-note/add-note.component";
import { ViewNoteComponent } from "./view-note/view-note.component";

const routes: Routes = [
  { path: "", component: NotebookComponent },
  { path: "registration", component: RegistrationComponent },
  { path: "login", component: AuthorizationComponent },

  { path: "addNote", component: AddNoteComponent },
  { path: "notes/:id_note", component: ViewNoteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
