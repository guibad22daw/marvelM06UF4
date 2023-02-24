const express = require('express');
const app = express();
const http = require('http').Server(app);

app.use(express.static('public'));
app.use(express.static('assets'));

http.listen(8888, () => {
    console.log('Escoltant en http://localhost:8888');
});