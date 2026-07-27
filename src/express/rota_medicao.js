const Medicao = require('../models/medicao');

function rotas(app) {
  app.get('/', async (req, res) => {
    try {
      const medicoes = await Medicao.find()
        .sort({
          DataRegistro: -1 //pega os dados em ordem descrecente (atual para último dao do banco)
        });

      let texto = 'MEDIÇÕES NO DB\n\n';


   /* res.render(nomeDaView, dados);*/
      res.render('medicoes', {medidas: medicoes});
//res.render("medicoes"); -> ./src/views/medicoes.ejs
   

    } catch (erro) {
      console.log(
        'Houve um erro na rota medição:',
        erro.message
      );

      res.status(500).send(
        'Não foi possível consultar as medições'
      );
    }
  });
}

module.exports = rotas;
