import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MainService } from "../shared/services/main.service";
import { Note } from "../shared/models/note.model";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-view-note",
  templateUrl: "./view-note.component.html",
  styleUrls: ["./view-note.component.css"],
})
export class ViewNoteComponent implements OnInit {
  @Output() del = new EventEmitter<number>();
  // Логическая переменная, определяющая наличие или отсутсвие прелоадера
  loading = false;
  // Лoгическая переменная, определяющая режим чтения или редактирования включен
  editOrNot = true;
  res;
  hide1 = true;
  formNote: FormGroup;
  note: any = {
    id_note: "",
    name: "",
    description: "",
  };
  item = {
    id: 0,
  };
  // Получение параметра роута id
  constructor(
    private router: Router,
    private activateRouter: ActivatedRoute,
    private mainService: MainService
  ) {
    this.activateRouter.params.subscribe((param) => {
      this.item.id = +param.id_note;
    });
  }

  async ngOnInit() {
    this.loading = true;
    // Отправка на сервер запроса для получения заметки по id
    try {
      this.res = await this.mainService.post(
        JSON.stringify(this.item),
        "/oneNote"
      );
    } catch (error) {
      console.log(error);
    }
    this.note = this.res[0];
    console.log(this.note);
    this.loading = false;
    if (this.note.id_note != "") {
      // Инициализация FormGroup, создание FormControl, и назанчение Validators
      this.formNote = new FormGroup({
        name: new FormControl(`${this.note.name}`, [Validators.required]),
        description: new FormControl(`${this.note.description}`, [
          Validators.required,
        ]),
      });
    }
  }

  // Хук жизненного цикла по изменению
  // Проверяет наличие в LocalStorage элемента роли, чтобы понять авторизирован пользователь или нет
  ngDoCheck() {
    this.hide1 = true;
    if (localStorage.getItem("role") == "1") {
      this.hide1 = false;
    }
  }
  // Отправляет запрос удаления заметки на сервер
  async onDeleteNote() {
    try {
      let result = await this.mainService.delete(
        `/deleteNote/${this.note.id_note}`
      );
    } catch (error) {
      console.log(error);
    }
    this.del.emit(this.note.id);
    this.router.navigate(["/notebook"]);
  }
  // Оправляет запрос изменения информации заметки на сервер или включает режим редактирования
  async onChangeNote() {
    if (!this.editOrNot) {
      let newNote = new Note(
        this.note.id_note,
        this.formNote.value.name,
        this.formNote.value.description,
        this.note.id_user
      );
      console.log(this.note.id_note);

      try {
        let res = await this.mainService.put(
          JSON.stringify(newNote),
          `/notes/${this.note.id_note}`
        );
      } catch (error) {
        console.log(error);
      }
      this.note.name = this.formNote.value.name;
      this.note.description = this.formNote.value.description;
    }
    this.editOrNot = !this.editOrNot;
  }
}
