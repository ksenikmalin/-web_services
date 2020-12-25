import { Component, OnInit } from "@angular/core";
import { MainService } from "../shared/services/main.service";
import { Note } from "../shared/models/note.model";

@Component({
  selector: "app-notebook",
  templateUrl: "./notebook.component.html",
  styleUrls: ["./notebook.component.css"],
})
export class NotebookComponent implements OnInit {
  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях
  loading = false;
  // Логическая переменная, определяющая наличие или отсутсвие ссылки на страницу добавления новой заметки
  hide1 = true;

  // Логическая переменная, определяющая наличие или отсутсвие сообщения о ненайденных заметках
  notfound = false;
  id_user = null;
  user: any = {
    id_user: localStorage.getItem("id"),
  };
  notes: Note[] = [];
  constructor(private mainService: MainService) {}

  async ngOnInit() {
    // Получение списка всех заметок,  имеющихся в БД
    this.loading = true;
    try {
      let result = await this.mainService.post(
        JSON.stringify(this.user),
        "/notes"
      );
      if (Object.keys(result).length == 0) {
        console.log("пусто");
        result = undefined;
      }
      if (typeof result !== "undefined") {
        this.notfound = false;
        console.log(result);
        for (const one in result) {
          this.notes.push(
            new Note(
              result[one].id_note,
              result[one].name,
              result[one].description,
              result[one].id_user
            )
          );
        }
      } else {
        this.notfound = true;
      }
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
  }

  // Хук жизненного цикла по изменению
  // Проверяет наличие в LocalStorage элемента роли, чтобы понять авторизирован пользователь или нет
  ngDoCheck() {
    this.hide1 = true;
    if (localStorage.getItem("role") == "1") {
      this.hide1 = false;
    }
  }

  // Удаление из локального массива заметок определенного товара по id
  onDeleteNote(id_note) {
    let index = this.notes.findIndex((el) => {
      return el.id_note == id_note;
    });
    this.notes.splice(index, 1);
    if (this.notes.length == 0) {
      this.notfound = true;
    }
  }
}
