const Medicao = require('../models/medicao');
const app = require('express')();
const mongoose = require('mongoose');
const {iniciarSerial, encerrarSerial} = require ('../serial/serial')
const conectaNaDatabase = require('../config/dbConnect');

const portExpress = 3000;

  app.get('/', async (req, res) => {
    try {
      const medicoes = await Medicao.find()
        .sort({
          DataRegistro: -1 //pega os dados em ordem descrecente (atual para ultimo dao do banco)
        });

    
   /* res.render(nomeDaView, dados);*/
      res.render('pagina', {medidas: medicoes});
    //res.render("medicoes"); -> ./src/views/medicoes.ejs
   

    } catch (erro) {
      console.log(
        'Houve um erro na rota medicao:',
        erro.message
      );

      res.status(500).send('Nao foi possivel consultar as medicoes');
    }
  });

  app.post('/iniciar',(req, res) =>{
  
  iniciarSerial ();
  res.status(200).end();
  
 })

 app.post('/parar',(req, res) =>{
  
  encerrarAplicacao ();
  res.status(200).end();
 })

async function iniciarAplicacao() {
  try {
   
    await conectaNaDatabase();

    app.listen(portExpress, () => {
        console.log(
        `Servidor Express funcionando em http://localhost:${portExpress}`
      );
    });

   
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
   
      
  } catch (erro) {
    console.error(
      'Erro ao encerrar a aplicação:',
      erro.message
    );

    process.exit(1);
  }
}

  

module.exports = {app, iniciarAplicacao, encerrarAplicacao};
