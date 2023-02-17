const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/marvel.html');

});

app.get('/marvel.js', (req, res) => {
    res.sendFile(__dirname + '/marvel.js');
});

app.get('/marvel.css', (req, res) => {
    res.sendFile(__dirname + '/marvel.css');
});

app.get('/assets/Marvel_Logo.svg.png', (req, res) => {
    res.sendFile(__dirname + '/assets/Marvel_Logo.svg.png');
});

app.get('/assets/183984.jpg', (req, res) => {
    res.sendFile(__dirname + '/assets/183984.jpg');
});

app.get('/assets/ironman.gif', (req, res) => {
    res.sendFile(__dirname + '/assets/ironman.gif');
});

http.listen(8888, () => {
    console.log('escoltant en *:8888');
});