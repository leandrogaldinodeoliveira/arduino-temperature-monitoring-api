require('dotenv').config();
const express = require('express');


const {app, iniciarAplicacao, encerrarAplicacao} = require('./src/express/routers');
const portExpress = 3000;

app.set('view engine', 'ejs');
app.set ('views', './src/views')

 
iniciarAplicacao();

process.on('SIGINT', ()=> {
     process.exit(0);
});
