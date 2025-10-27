const jwt = require('jsonwebtoken');
const db = require('../config/database');

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  // O cabeçalho vem no formato "Bearer <token>"
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token malformado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret');

    // Anexa o payload do utilizador ao pedido
    req.user = decoded.user;

    // Opcional: Verificar se o utilizador ainda existe na base de dados
    const userExists = await db('usuarios').where({ id: req.user.id }).first();
    if (!userExists) {
      return res.status(401).json({ message: 'Token inválido - utilizador não encontrado.' });
    }

    next();
  } catch (ex) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};
