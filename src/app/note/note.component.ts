import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { MainService } from "../shared/services/main.service";

@Component({
  selector: "app-note",
  templateUrl: "./note.component.html",
  styleUrls: ["./note.component.css"],
})
export class NoteComponent implements OnInit {
  // Логическая переменная определяющая наличие или отсуствие кнопки Удалить в заметке
  hide1 = true;
  demonstrateNote = true;
  @Input() note;
  @Output() del = new EventEmitter<number>();

  constructor(private router: Router, private mainService: MainService) {}

  async ngOnInit() {
    if (this.note == undefined) {
      this.demonstrateNote = false;
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

  // Функция, которая переводит на страницу карточки заметки по клику
  onLinkNote(id_note) {
    this.router.navigate(["/notes", id_note]);
  }
  // Функция удаления заметки из БД
  async onDeleteNote(id_note) {
    try {
      let result = await this.mainService.delete(`/deleteNote/${id_note}`);
    } catch (error) {
      console.log(error);
    }
    this.del.emit(id_note);
  }
}
