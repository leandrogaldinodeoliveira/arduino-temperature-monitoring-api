const serialport = require('serialport');
const Medicao = require('../models/medicao');
const Sessao = require('../models/sessao');

const porta = new serialport.SerialPort({
  path: 'COM3',
  baudRate: 9600,
  autoOpen: false
});

const parser = new serialport.ReadlineParser({
  delimiter: '\n',
  includeDelimiter: false
});

porta.pipe(parser);

let sessaoAtual = null;

porta.on('open', async () => { // o evento 'open' executa a função quando a porta for aberta
  try {
    console.log('Porta serial aberta.');

    sessaoAtual = await Sessao.create({ //********
      usuario: 'Usuário',
      porta: porta.path 
    });

    console.log(
      'Sessão criada:',
      sessaoAtual._id
    );

  } catch (erro) {
    console.error(
      'Erro ao criar a sessão:',
      erro.message
    );

    porta.close();
  }
});

parser.on('data', async (linha) => { // O parser executa essa callback sempre que encontra uma linha completa.
  try {

    if (!sessaoAtual) {
      console.warn(
        'Leitura ignorada: não existe uma sessão ativa.'
      );

      return;
    }

    const dados = JSON.parse(linha.trim());

    if (
      typeof dados.temperatura1 !== 'number' ||
      typeof dados.temperatura2 !== 'number'
    ) {
      console.warn('Formato inválido:', dados);
      return;
    }

    const medicao = await Medicao.create({
      sessao: sessaoAtual._id,
      temperatura1: dados.temperatura1,
      temperatura2: dados.temperatura2
    });

    console.log(
      'Medição armazenada:',
      medicao
    );

  } catch (erro) {
    console.error(
      'Erro ao processar a leitura:',
      erro.message
    );
  }
});

porta.on('error', (erro) => {
  console.error(
    'Erro na porta serial:',
    erro.message
  );
});

porta.on('close', async () => {
  try {
    console.log('Porta serial fechada.');

    if (!sessaoAtual) {
      return;
    }

    sessaoAtual.encerradaEm = new Date(); 

    await sessaoAtual.save(); //*****

    sessaoAtual = null;

  } catch (erro) {
    console.error(
      'Erro ao encerrar a sessão:',
      erro.message
    );
  }
});

function iniciarSerial() {
  porta.open((err) => { //Se não houve erro: err == null
    if (err) {
      console.error(
        'Não foi possível abrir a porta:',
        err.message
      );
    }
  });
}

async function encerrarSerial() {
  if (sessaoAtual) {
    sessaoAtual.encerradaEm = new Date();

    await sessaoAtual.save();

    sessaoAtual = null;
  }

  if (porta.isOpen) { //porta.isOpen é uma propriedade booleanda (true -> aberta e false ->fechada)
    porta.close();
  }
}

module.exports = {iniciarSerial, encerrarSerial};
