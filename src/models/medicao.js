const mongoose = require('mongoose')

const medicaoSchema = new mongoose.Schema({
  sessao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sessao',
    required: true
  },

  temperatura1: {
    type: Number,
    required: true
  },

  temperatura2: {
    type: Number,
    required: true
  },

  DataRegistro: {
    type: Date,
    default: Date.now
  }
});
const Medicao = mongoose.model("Medicao", medicaoSchema, "medicoes") // Medicao === mongoose.models.Medicao
module.exports = Medicao;
