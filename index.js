require('dotenv').config();

const mongoose = require('mongoose');
const conectaNaDatabase = require('./src/config/dbConnect');
const {iniciarSerial, encerrarSerial} = require('./src/serial/serial');

const app = require('./src/express/routers')
const portExpress = 3000;

app.set('view engine', 'ejs');
app.set ('views', './src/views')

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
      'Nao foi posssivel iniciar a aplicacao:',
      erro.message
    );

    
  }
}

async function encerrarAplicacao() {
  try {
    await encerrarSerial();
    await mongoose.disconnect();

    console.log('Aplicacao encerrada.');
    process.exit(0);
    
  } catch (erro) {
    console.error(
      'Erro ao encerrar a aplicacao:',
      erro.message
    );

    process.exit(1);
  }
}

process.on('SIGINT', encerrarAplicacao);

iniciarAplicacao();
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
