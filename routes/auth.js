// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const conn = require('../db');

// ROTA DE CADASTRO
router.post('/cadastro', async (req, res) => {
  const { nome, email, senha, tipo_usuario, idade, origem } = req.body;

  if (!nome || !email || !senha || !tipo_usuario) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    // Verifica se email já existe
    conn.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({ mensagem: 'Email já cadastrado.' });
      }

      // Criptografa a senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // Insere no banco
      const sql = 'INSERT INTO usuarios (nome, email, senha, tipo_usuario, idade, origem) VALUES (?, ?, ?, ?, ?, ?)';
      conn.query(sql, [nome, email, senhaHash, tipo_usuario, idade, origem], (err, result) => {
        if (err) {
          return res.status(500).json({ mensagem: 'Erro ao cadastrar.', erro: err });
        }
        return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
      });
    });
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
});

// ROTA DE LOGIN
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
  }

  conn.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (results.length === 0) {
      return res.status(401).json({ mensagem: 'Email não encontrado.' });
    }

    const usuario = results[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha incorreta.' });
    }

    // Login OK
    res.json({
      mensagem: 'Login bem-sucedido!',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        tipo: usuario.tipo_usuario,
        origem: usuario.origem
      }
    });
  });
});

module.exports = router;
