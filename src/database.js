const mongoose = require('mongoose');

const URI = 'mongodb://localhost/arbolDB';

mongoose.connect(URI,{ useNewUrlParser: true })
  .then(db => console.log('Conexión exitosa a MongoDB'))
  .catch(error => console.error(error));

module.exports = mongoose;
