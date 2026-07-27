const mongoose = require('mongoose');

const sessaoSchema = new mongoose.Schema({
  usuario: {
    type: String,
    default: 'Usuário genérico'
  },

  porta: {
    type: String,
    required: true
  },

  iniciadaEm: {
    type: Date,
    default: Date.now
  },

  encerradaEm: {
    type: Date,
    default: null
  }
});

const Sessao = mongoose.model ("Sessao", sessaoSchema, "sessoes")

module.exports = Sessao;
