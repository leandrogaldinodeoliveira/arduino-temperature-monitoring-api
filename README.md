# Arduino Temperature Monitoring API

Sistema de monitoramento de temperatura que integra **Arduino**, **Node.js**, **MongoDB** e uma interface web renderizada com **Express** e **EJS**.

A aplicação recebe duas leituras de temperatura pela porta serial, valida os dados, registra uma sessão de coleta, persiste as medições no MongoDB e apresenta o histórico em uma tabela acessível pelo navegador.

---

## Visão geral

```text
Sensores
   ↓
Arduino
   ↓
JSON pela porta serial
   ↓
Node.js + SerialPort
   ↓
Validação e persistência
   ↓
MongoDB + Mongoose
   ↓
Express + EJS
   ↓
Tabela de medições no navegador
```

Este projeto demonstra a integração entre **hardware, back-end, banco de dados e interface web** em uma aplicação modular e orientada a eventos.

---

## Principais funcionalidades

- leitura de duas temperaturas enviadas pelo Arduino;
- recebimento dos dados em formato JSON pela porta serial;
- validação das informações antes da persistência;
- criação automática de uma sessão ao abrir a porta serial;
- associação de cada medição à sessão correspondente;
- armazenamento das leituras no MongoDB;
- consulta ordenada das medições;
- renderização dinâmica de uma tabela HTML com EJS;
- encerramento organizado da porta serial e da conexão com o banco.

---

## Desafios técnicos resolvidos

- integração entre Arduino e Node.js por comunicação serial;
- processamento assíncrono de eventos de abertura, leitura, erro e fechamento;
- separação de responsabilidades em módulos;
- modelagem de relacionamento entre sessões e medições;
- validação de dados recebidos de um dispositivo externo;
- persistência assíncrona com Mongoose;
- renderização server-side com Express e EJS;
- tratamento de encerramento da aplicação com `SIGINT`;
- proteção de credenciais por variáveis de ambiente.

---

## Tecnologias

### Back-end

- Node.js
- Express
- EJS
- Mongoose
- SerialPort
- dotenv

### Banco de dados

- MongoDB Atlas

### Hardware

- Arduino
- sensores de temperatura
- comunicação serial USB

### Linguagens

- JavaScript
- C++

---

## Arquitetura

```text
arduino-temperature-monitoring-api/
├── index.js
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
├── .env.example
├── arduino/
│   └── arduino.ino
└── src/
    ├── config/
    │   └── dbConnect.js
    ├── express/
    │   └── routers.js
    ├── models/
    │   ├── medicao.js
    │   └── sessao.js
    ├── serial/
    │   └── serial.js
    └── views/
        └── pagina.ejs
```

| Camada | Responsabilidade |
|---|---|
| `index.js` | Orquestra a inicialização e o encerramento da aplicação |
| `src/config` | Centraliza a conexão com o MongoDB |
| `src/express` | Registra as rotas HTTP |
| `src/models` | Define os schemas e models do Mongoose |
| `src/serial` | Gerencia a comunicação com o Arduino |
| `src/views` | Contém os templates EJS |
| `arduino` | Contém o código executado na placa |

---

## Fluxo de execução

### Inicialização

```text
index.js
   ↓
carrega as variáveis de ambiente
   ↓
conecta ao MongoDB
   ↓
inicia o servidor Express
   ↓
abre a porta serial
   ↓
cria uma nova sessão
```

### Registro de uma medição

```text
Arduino envia uma linha JSON
   ↓
ReadlineParser identifica a linha completa
   ↓
JSON.parse converte o texto em objeto
   ↓
os campos são validados
   ↓
Mongoose cria uma medição
   ↓
MongoDB armazena o documento
```

### Consulta pelo navegador

```text
GET /medicoes
   ↓
Medicao.find()
   ↓
ordenação por DataRegistro
   ↓
res.render()
   ↓
EJS percorre o array
   ↓
HTML final é enviado ao navegador
```

---

## Formato dos dados enviados pelo Arduino

O Arduino deve enviar uma linha JSON por leitura:

```json
{
  "temperatura1": 24.5,
  "temperatura2": 25.1
}
```

Cada mensagem deve terminar com uma quebra de linha, pois o parser utiliza:

```javascript
delimiter: '\n'
```

---

## Modelagem dos dados

### Sessão

Representa um período de funcionamento da comunicação serial.

Campos principais:

```text
usuario
porta
iniciadaEm
encerradaEm
```

### Medição

Representa uma leitura de temperatura.

Campos principais:

```text
sessao
temperatura1
temperatura2
DataRegistro
```

Cada medição possui uma referência para a sessão em que foi registrada.

---

## Como executar

### Pré-requisitos

- Node.js instalado;
- npm instalado;
- acesso a um banco MongoDB;
- Arduino conectado ao computador;
- código Arduino carregado na placa.

### 1. Clonar o repositório

```bash
git clone https://github.com/leandrogaldinodeoliveira/arduino-temperature-monitoring-api.git
```

```bash
cd arduino-temperature-monitoring-api
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DB_CONNECTION=sua_string_de_conexao_com_o_mongodb
```

Exemplo de estrutura:

```env
DB_CONNECTION=mongodb+srv://USUARIO:SENHA@CLUSTER.mongodb.net/?appName=APLICACAO
```

O arquivo `.env` não deve ser enviado ao GitHub.

O `.gitignore` deve conter:

```gitignore
node_modules/
.env
```

Um arquivo `.env.example` pode ser mantido no repositório:

```env
DB_CONNECTION=sua_string_de_conexao_com_o_mongodb
```

### 4. Configurar a porta serial

No arquivo:

```text
src/serial/serial.js
```

ajuste a porta utilizada pelo Arduino:

```javascript
const porta = new serialport.SerialPort({
  path: 'COM3',
  baudRate: 9600,
  autoOpen: false
});
```

A taxa de transmissão deve corresponder à configuração do Arduino:

```cpp
Serial.begin(9600);
```

### 5. Iniciar a aplicação

```bash
node index.js
```

### 6. Acessar as medições

Abra no navegador:

```text
http://localhost:3000/
```

---

## Rota disponível

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Consulta as medições e renderiza a tabela HTML |

A rota executa uma consulta ao MongoDB:

```javascript
const medicoes = await Medicao.find()
  .sort({
    DataRegistro: -1
  });
```

Depois envia o array ao template:

```javascript
res.render('pagina', {
  medicoes
});
```

O EJS cria uma linha da tabela para cada documento:

```ejs
<% medicoes.forEach((medicao) => { %>
  <tr>
    <td>
      <%= new Date(medicao.DataRegistro).toLocaleString('pt-BR') %>
    </td>

    <td>
      <%= medicao.temperatura1 %> °C
    </td>

    <td>
      <%= medicao.temperatura2 %> °C
    </td>
  </tr>
<% }); %>
```

---
<img width="418" height="574" alt="image" src="https://github.com/user-attachments/assets/294f89b2-a508-4116-b025-2c9f8e4d9460" />

Figura - Exemplo dos dados impressos no navegador.

---

## Encerramento seguro

Ao pressionar `Ctrl + C`, o Node.js recebe o sinal `SIGINT`.

A aplicação tenta:

1. registrar o encerramento da sessão;
2. salvar a sessão no MongoDB;
3. fechar a porta serial;
4. desconectar do banco;
5. finalizar o processo.

Esse fluxo reduz o risco de conexões abertas ou sessões incompletas.

---

## Decisões de projeto

### Separação por responsabilidade

O `index.js` funciona apenas como orquestrador. A comunicação serial, as rotas, os models e a conexão com o banco ficam em módulos próprios.

### Estado interno encapsulado

O módulo serial mantém internamente objetos como a porta, o parser e a sessão atual. Apenas as funções necessárias são exportadas:

```javascript
module.exports = {
  iniciarSerial,
  encerrarSerial
};
```

### Arquitetura orientada a eventos

A aplicação registra callbacks para os eventos:

```text
open
data
error
close
SIGINT
```

Isso permite que cada comportamento seja executado no momento adequado.

---

## Próximas evoluções

- atualização em tempo real com Socket.IO;
- gráficos dinâmicos com Chart.js;
- filtros por data e sessão;
- paginação dos registros;
- download de dados em CSV;
- configuração da porta serial pelo `.env`;
- tratamento visual para banco vazio;
- criação de uma API REST completa;
- autenticação de usuários;
- testes automatizados;
- deploy da interface e da API.

---

## Competências demonstradas

Este projeto evidencia conhecimentos em:

- desenvolvimento back-end com Node.js;
- rotas e renderização server-side com Express;
- persistência de dados com MongoDB e Mongoose;
- programação assíncrona;
- arquitetura orientada a eventos;
- comunicação serial;
- integração entre hardware e software;
- modularização e separação de responsabilidades;
- modelagem de dados;
- tratamento de erros;
- segurança básica de credenciais;
- organização e documentação de projetos.

---

## Status

Projeto funcional em desenvolvimento.

A versão atual realiza todo o fluxo principal:

```text
Arduino
   ↓
Node.js
   ↓
MongoDB
   ↓
EJS
   ↓
Navegador
```

---

## Autor

**Leandro Galdino de Oliveira**

Professor de Física em transição para desenvolvimento de software, com foco em back-end, integração de sistemas e aplicações educacionais.
