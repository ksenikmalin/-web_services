const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const dbConfig = require("./db.config.js");
const uniqueFilename = require("unique-filename");
const serveStatic = require("serve-static");
const history = require("connect-history-api-fallback");
const app = express();
const port = 8085;

// Парсинг json
app.use(bodyParser.json());

app.use(history());

// Парсинг запросов по типу: application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Настройка CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PATCH, PUT, POST, DELETE, OPTIONS"
  );
  next();
});

// Создание соединения с базой данных
let connection;
connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port: dbConfig.PORT,
  charset: "utf8_general_ci",
  connectionLimit: 10,
});

connection.getConnection((err, connect) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  } else {
    connect.query('SET NAMES "utf8"');
    connect.query('SET CHARACTER SET "utf8"');
    connect.query('SET SESSION collation_connection = "utf8_general_ci"');
    console.log("Успешно соединено с БД");
  }
  if (connect) connect.release();
});

//Обработка входа
app.post("/api/login", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log("Пришёл POST запрос для входа:");
  console.log(req.body);
  connection.query(
    `SELECT * FROM users WHERE (login="${req.body.login}") AND (password="${req.body.password}")`,
    function (err, results) {
      if (err) {
        res
          .status(500)
          .send("Ошибка сервера при получении пользователя по логину");
        console.log(err);
      }
      console.log("Результаты проверки существования пользователя:");
      if (results !== undefined) {
        if (results[0] === undefined) {
          res.json("not exist");
        } else {
          res.json(results);
        }
      }
    }
  );
});

// Регистрация пользователя
app.post("/api/registration", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log("Пришёл POST запрос для пользователей:");
  console.log(req.body);
  connection.query(
    `SELECT * FROM users WHERE login='${req.body.login}'`,
    function (error, results) {
      if (error) {
        res
          .status(500)
          .send(
            "Ошибка сервера при получении пользователей с таким же логином"
          );
        console.log(error);
      }
      console.log("Результаты проверки существования логина:");
      console.log(results[0]);
      if (results[0] === undefined) {
        connection.query(
          "INSERT INTO `users` (`id`, `login`, `password`, `name`, `role`) VALUES (NULL, ?, ?, ?, ?)",
          [req.body.login, req.body.password, req.body.name, req.body.role],
          function () {
            console.log(
              "Запрос на проверку существования созданной записи в БД"
            );
            connection.query(
              `SELECT * FROM users WHERE login="${req.body.login}"`,
              function (err, result) {
                if (err) {
                  res
                    .status(500)
                    .send(
                      "Ошибка сервера при получении пользователя по логину"
                    );
                  console.log(err);
                } else {
                  console.log(result);
                  res.json(result);
                }
              }
            );
          }
        );
      } else {
        res.json("exist");
      }
    }
  );
});

//------- Запросы для работы с заметками -------//

//Обработка получения списка заметок
app.post("/api/notes", function (req, res) {
  try {
    connection.query(
      `SELECT * FROM note WHERE id_user=${req.body.id_user}`,
      function (error, results) {
        if (error) {
          res.status(500).send("Ошибка сервера при получении заметки");
          console.log(error);
        }
        console.log("Результаты получения заметок по пользователю");
        console.log(results);
        res.json(results);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// Обработка создания заметки
app.post("/api/addNote", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log("Пришёл POST запрос для создания заметки:");
  console.log(req.body);
  connection.query(
    `INSERT INTO note (name, description, id_user) VALUES (?, ?, ?);`,
    [req.body.name, req.body.description, req.body.id_user],
    function (err) {
      if (err) {
        res.status(500).send("Ошибка сервера при cоздании заметки");
        console.log(err);
      }
      console.log("Создание прошло успешно");
      res.json("create");
    }
  );
});

// Обработка удаления заметки
app.delete("/api/deleteNote/:id_note", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log("Пришёл DELETE запрос для удаления заметки:");
  console.log(req.body);
  connection.query(
    `DELETE FROM note WHERE id_note=${req.params.id_note}`,
    function (err) {
      if (err) {
        res.status(500).send("Ошибка сервера при удалении заметки по id");
        console.log(err);
      }
      console.log("Удаление прошло успешно");
      res.json("delete");
    }
  );
});

// Обработка получения информации об одной заметке
app.post("/api/oneNote", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  console.log("Пришёл POST запрос для загрузки страницы о заметке:");
  console.log(req.body);
  connection.query(
    "SELECT * FROM note WHERE id_note=?",
    [req.body.id],
    function (err, results) {
      if (err) {
        res.status(500).send("Ошибка сервера при поиске заметки по id ");
        console.log(err);
      }
      console.log("Заметка найдена успешно");
      console.log("Результаты:");
      console.log(results);
      res.json(results);
    }
  );
});

// Обработка изменения информации о об одной заметке
app.put("/api/notes/:id_note", function (req, res) {
  console.log("PUT /");
  console.log(req.body);
  try {
    connection.query(
      "UPDATE `note` SET `name` = ?, `description` = ? WHERE id_note = ?",
      [req.body.name, req.body.description, req.params.id_note],
      function (error) {
        if (error) {
          res.status(500).send("Ошибка сервера при изменении заметки");
          console.log(error);
        }
        res.json("change");
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// Информирование о запуске сервера и его порте
app.listen(port, () => {
  console.log("Сервер запущен на http://localhost:" + port);
});
