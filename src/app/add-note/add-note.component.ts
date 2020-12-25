import { Component, OnInit } from "@angular/core";
import { MainService } from "../shared/services/main.service";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-add-note",
  templateUrl: "./add-note.component.html",
  styleUrls: ["./add-note.component.css"],
})
export class AddNoteComponent implements OnInit {
  form: FormGroup;
  // Логическая переменная, определяющая наличие или отсутсвие прелоадера
  loading = false;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях
  isEmpty = true;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения об успешном добавлении заметки
  succes = false;

  constructor(private mainService: MainService) {}

  async ngOnInit() {
    // Инициализация FormGroup, создание FormControl, и назначение Validators
    this.form = new FormGroup({
      name: new FormControl("", [Validators.required]),
      status: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
    });
  }

  // Функция добавления информации о заметке, полученной с формы, в базу данных
  async onAddService() {
    if (this.form.value.name == "" || this.form.value.description == "") {
      this.isEmpty = false;
    } else {
      this.loading = true;
      this.isEmpty = true;
      let note = {
        name: this.form.value.name,
        description: this.form.value.description,
        id_user: localStorage.getItem("id")
      };
      console.log(note);
      try {
        let result = await this.mainService.post(
          JSON.stringify(note),
          "/addNote"
        );
      } catch (err) {
        console.log(err);
      }
      this.form.reset();
      this.loading = false;
      this.succes = true;
    }
  }
  // Функция, скрывающая сообщения о незаполненности полей и успешном добавлении заметки (вызвается при фокусировке на одном из полей формы)
  onSucces() {
    this.succes = false;
    this.isEmpty = true;
  }
}
