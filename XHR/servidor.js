const app = require('express')();
const http = require('http').Server(app);

let ruta = __dirname.replace("XHR",'');

app.get('/', (req, res) => {
    res.sendFile(ruta + 'XHR/index.html');
});

app.get('/script.js', (req, res) => {
    res.sendFile(ruta +'XHR/script.js');
});

app.get('/css.css', (req, res) => {
    res.sendFile(ruta +'XHR/css.css');
});

app.get('/assets/Marvel_Logo.svg.png', (req, res) => {
    res.sendFile(ruta + 'assets/Marvel_Logo.svg.png');
});

app.get('/assets/183984.jpg', (req, res) => {
    res.sendFile(ruta +'assets/183984.jpg');
});

app.get('/assets/ironman.gif', (req, res) => {
    res.sendFile(ruta +'assets/ironman.gif');
});

http.listen(8888, () => {
    console.log('escoltant en *:8888');
});