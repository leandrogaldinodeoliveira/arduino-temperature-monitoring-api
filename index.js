require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const conectaNaDatabase = require('./src/config/dbConnect');
const rotas = require('./src/express/rota_medicao');
const {iniciarSerial, encerrarSerial} = require('./src/serial/serial');

const app = express();
const portExpress = 3000;

app.set('view engine', 'ejs');
app.set ('views', './src/views')
rotas(app);

async function iniciarAplicacao() {
  try {
   
    await conectaNaDatabase();

    app.listen(portExpress, () => {
        console.log(
        `Servidor Express funcionando em http://localhost:${portExpress}`
      );
    });

    iniciarSerial();

  } catch (erro) {
    console.error(
      'Não foi possível iniciar a aplicação:',
      erro.message
    );

    
  }
}

async function encerrarAplicacao() {
  try {
    await encerrarSerial();
    await mongoose.disconnect();

    console.log('Aplicação encerrada.');
    process.exit(0);
    
  } catch (erro) {
    console.error(
      'Erro ao encerrar a aplicação:',
      erro.message
    );

    process.exit(1);
  }
}

process.on('SIGINT', encerrarAplicacao);

iniciarAplicacao();
