// Модель класса Услуга
export class Note {
  public id_note: number;
  public name: string;
  public description: string;
  public id_user: number;
  constructor(
    id_service: number,
    name: string,
    description: string,
    id_user: number
  ) {
    this.id_note = id_service;
    this.name = name;
    this.description = description;
    this.id_user = id_user;
  }
}
