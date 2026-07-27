
# Arduino Temperature Monitoring API

Aplicação em **Node.js** para receber dados de temperatura enviados por um Arduino pela porta serial, armazenar as medições no **MongoDB** e exibi-las em uma página HTML renderizada com **Express** e **EJS**.

O projeto foi desenvolvido com foco didático, buscando separar claramente as responsabilidades de conexão com o banco de dados, comunicação serial, models, rotas e interface.

---

## Funcionalidades

- leitura de duas temperaturas enviadas pelo Arduino;
- comunicação serial com a biblioteca `serialport`;
- criação de uma sessão sempre que a porta serial é aberta;
- armazenamento das medições no MongoDB;
- associação de cada medição à sessão correspondente;
- consulta das medições por uma rota HTTP;
- ordenação das medições da mais recente para a mais antiga;
- renderização dos dados em uma tabela HTML com EJS;
- encerramento organizado da porta serial e da conexão com o MongoDB.

---

## Tecnologias utilizadas

- Arduino
- C++
- Node.js
- Express
- EJS
- MongoDB Atlas
- Mongoose
- SerialPort
- dotenv

---

## Arquitetura do projeto

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
    │   └── rota_medicao.js
    ├── models/
    │   ├── medicao.js
    │   └── sessao.js
    ├── serial/
    │   └── serial.js
    └── views/
        └── medicoes.ejs
```

### Responsabilidade de cada parte

| Arquivo ou pasta | Responsabilidade |
|---|---|
| `index.js` | Inicializa e encerra a aplicação |
| `src/config` | Configuração da conexão com o MongoDB |
| `src/express` | Registro das rotas HTTP |
| `src/models` | Schemas e models do Mongoose |
| `src/serial` | Comunicação com o Arduino pela porta serial |
| `src/views` | Templates EJS renderizados pelo Express |
| `arduino` | Código executado na placa Arduino |

---

## Fluxo da aplicação

```text
Sensores de temperatura
        ↓
Arduino
        ↓
dados JSON pela porta serial
        ↓
SerialPort + ReadlineParser
        ↓
validação dos dados
        ↓
Mongoose
        ↓
MongoDB
        ↓
rota GET /medicoes
        ↓
EJS
        ↓
tabela HTML no navegador
```

O Arduino envia uma linha JSON semelhante a:

```json
{
  "temperatura1": 24.5,
  "temperatura2": 25.1
}
```

O módulo serial interpreta essa linha, valida os valores e cria um documento na collection `medicoes`.

---

## Pré-requisitos

Antes de executar o projeto, instale:

- Node.js;
- npm;
- Arduino IDE;
- acesso a um banco MongoDB;
- uma placa Arduino conectada ao computador;
- sensores de temperatura compatíveis com o código Arduino.

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/leandrogaldinodeoliveira/arduino-temperature-monitoring-api.git
```

Entre na pasta:

```bash
cd arduino-temperature-monitoring-api
```

Instale as dependências:

```bash
npm install
```

---

## Configuração das variáveis de ambiente

Crie um arquivo chamado `.env` na raiz do projeto:

```env
DB_CONNECTION=sua_string_de_conexao_com_o_mongodb
```

Exemplo de estrutura:

```env
DB_CONNECTION=mongodb+srv://USUARIO:SENHA@CLUSTER.mongodb.net/?appName=APLICACAO
```

O arquivo `.env` contém credenciais privadas e não deve ser enviado ao GitHub.

O `.gitignore` deve conter:

```gitignore
node_modules/
.env
```

O arquivo `.env.example` pode ser publicado sem credenciais reais:

```env
DB_CONNECTION=sua_string_de_conexao_com_o_mongodb
```

---

## Configuração da porta serial

No arquivo:

```text
src/serial/serial.js
```

ajuste a propriedade `path` para a porta utilizada pelo Arduino:

```javascript
const porta = new serialport.SerialPort({
  path: 'COM3',
  baudRate: 9600,
  autoOpen: false
});
```

No Windows, exemplos comuns são:

```text
COM3
COM4
COM5
```

A taxa `baudRate` deve ser igual à configurada no Arduino:

```cpp
Serial.begin(9600);
```

---

## Execução

Com o Arduino conectado e o código carregado na placa, execute:

```bash
node index.js
```

Caso exista um script `start` no `package.json`, também pode ser usado:

```bash
npm start
```

Quando a aplicação iniciar corretamente, o terminal deverá informar que:

- a conexão com o MongoDB foi estabelecida;
- o servidor Express está funcionando;
- a porta serial foi aberta;
- uma sessão foi criada.

---

## Visualização das medições

Abra no navegador:

```text
http://localhost:3000/medicoes
```

A rota consulta o MongoDB e envia o array de medições para o template EJS:

```javascript
res.render('medicoes', {
  medicoes
});
```

No EJS, o array é percorrido com `forEach()`:

```ejs
<% medicoes.forEach((medicao) => { %>
  <tr>
    <td><%= new Date(medicao.DataRegistro).toLocaleString('pt-BR') %></td>
    <td><%= medicao.temperatura1 %> °C</td>
    <td><%= medicao.temperatura2 %> °C</td>
  </tr>
<% }); %>
```

O navegador recebe o HTML já renderizado com uma linha para cada documento encontrado no banco.

---

## Models

### Sessão

Cada abertura da porta serial cria uma sessão com informações como:

- usuário;
- porta serial utilizada;
- data e horário de início;
- data e horário de encerramento.

### Medição

Cada medição contém:

- referência à sessão;
- temperatura 1;
- temperatura 2;
- data e horário do registro.

---

## Rota disponível

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/medicoes` | Consulta as medições e renderiza a tabela HTML |

Neste estágio, o projeto possui uma rota de leitura e ainda não implementa um CRUD REST completo.

---

## Encerramento da aplicação

Ao pressionar:

```text
Ctrl + C
```

o Node.js recebe o sinal `SIGINT`.

A aplicação tenta:

1. registrar o encerramento da sessão;
2. fechar a porta serial;
3. desconectar do MongoDB;
4. encerrar o processo.

---

## Possíveis evoluções

- atualização da tabela em tempo real com Socket.IO;
- gráficos de temperatura com Chart.js;
- filtros por sessão e intervalo de datas;
- paginação das medições;
- rotas REST para criação, consulta, atualização e exclusão;
- autenticação de usuários;
- download das medições em CSV;
- configuração da porta serial por variável de ambiente;
- tratamento visual para ausência de medições;
- publicação da aplicação em um servidor.

---

## Objetivo didático

Este projeto também funciona como estudo de integração entre diferentes partes de uma aplicação:

```text
hardware
    ↓
comunicação serial
    ↓
back-end
    ↓
banco de dados
    ↓
template no servidor
    ↓
navegador
```

Ele permite estudar, em uma aplicação concreta:

- módulos CommonJS;
- escopo léxico e encapsulamento;
- programação orientada a eventos;
- callbacks;
- operações assíncronas;
- rotas Express;
- Mongoose;
- renderização EJS;
- organização modular de projetos Node.js.

---

## Autor

**Leandro Galdino de Oliveira**

Projeto desenvolvido para estudo de Node.js, Express, MongoDB, comunicação serial e integração entre Arduino e aplicações web.
