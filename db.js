// db.js: arquivo responsável por conectar ao banco de dados MySQL
const mysql = require('mysql2'); // mysql2: biblioteca para conectar ao MySQL
require('dotenv').config(); // dotenv: biblioteca para carregar variáveis de ambiente do arquivo .env

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

conn.connect((err) => { //faz a conexão com o banco e mostra se deu certo ou erro
  if (err) {
    console.error('Erro ao conectar no MySQL:', err.message);
  } else {
    console.log('Conectado ao banco de dados MySQL com sucesso!');
  }
});

module.exports = conn;
