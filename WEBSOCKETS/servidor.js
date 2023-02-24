const express = require('express');
const app = express();
const server = app.listen(8888, () => {
    console.log("Escoltant al port " + 8888);
});
const io = require('socket.io')(server);

function enviarMissatges(socket, data) {
    socket.emit('rgb', {
        r: data.r,
        g: data.g,
        b: data.b
    });
    socket.broadcast.emit('rgb', {
        r: data.r,
        g: data.g,
        b: data.b
    });
}

io.on('connection', function (socket) {
    console.log('usuari connectat')
    socket.on('entrada', async function (data) {
        console.log("dades rebudes al servidor");
        let value = data.entrada;
        const response3 = await fetch(
            `http://gateway.marvel.com/v1/public/characters?nameStartsWith=${value}&ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5`
        );

        if (response3.ok) {
            const data3 = await response3.json();
            socket.emit('sugestions', {
                data: data3
            });
        }
        console.log('SERVIDOR -> dades rebudes del client->' + value);
    });
});

app.use(express.static('public'));
app.use(express.static('assets'));

