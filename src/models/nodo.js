const mongoose = require('mongoose');
const { Schema } = mongoose;

const NodoSchema = new Schema({
  indice: { type: Number, required: true },
  valor: { type: Number, required: true }
});

module.exports = mongoose.model('Nodo', NodoSchema);