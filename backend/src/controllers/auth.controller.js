const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const registerSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string(),
});

exports.register = async (req, res, next) => {
  try {
    const { nome, email, senha } = registerSchema.parse(req.body);

    const userExists = await db('usuarios').where({ email }).first();
    if (userExists) {
      return res.status(400).json({ message: 'E-mail já registado.' });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const [newUser] = await db('usuarios').insert({
      nome,
      email,
      senha_hash,
    }).returning('*');

    res.status(201).json({ message: 'Utilizador registado com sucesso!', user: { id: newUser.id, nome: newUser.nome, email: newUser.email } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validação falhou', errors: error.errors });
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, senha } = loginSchema.parse(req.body);

    const user = await db('usuarios').where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(senha, user.senha_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_default_secret', {
      expiresIn: '7d',
    });

    res.json({
      message: 'Login bem-sucedido!',
      token,
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validação falhou', errors: error.errors });
    }
    next(error);
  }
};
