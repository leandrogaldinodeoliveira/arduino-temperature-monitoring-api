const Medicao = require('../models/medicao');
const app = require('express')();

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


module.exports = app;
