const express = require('express');
const app = express();
const server = app.listen(8888, () => {
    console.log("Escoltant al port " + 8888);
});
const io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('usuari connectat')
    socket.on('entrada', async function (data) {
        console.log("dades rebudes al servidor");
        let value = data.entrada;
        try {
            const response = await fetch(
                `http://gateway.marvel.com/v1/public/characters?nameStartsWith=${value}&ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5`
            );

            if (response.ok) {
                const data = await response.json();
                socket.emit('sugestions', {
                    data: data
                });
            }
        } catch (err) {
            console.log(err);
            socket.emit('sugestions',
                "error"
            );
        }

        console.log('SERVIDOR -> dades rebudes del client->' + value);
    });

    socket.on('cercaPersonatge', async function (data) {
        console.log('SERVIDOR -> dades rebudes del client->' + JSON.stringify(data));
        let cadena = data.cadena;
        try {
            const response = await fetch(
                `http://gateway.marvel.com/v1/public/characters?nameStartsWith=${cadena}&ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5`
            );

            if (response.ok) {
                let data = await response.json();
                try {
                    let resultats = data.data.results;

                    const response2 = await fetch(
                        `http://gateway.marvel.com/v1/public/characters/${resultats[0].id}/comics?ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5&limit=100`
                    );

                    if (response2.ok) {
                        let data2 = await response2.json();
                        socket.emit('dades', {
                            data: data2
                        });
                        console.log("dades enviades");
                    }
                } catch (err) {
                    socket.emit('dades', "noresults");
                    console.log("resultats buits enviats");
                }
            }

        } catch (err) {
            socket.emit('dades', "error");
        }
    });
});

app.use(express.static('public'));
app.use(express.static('assets'));

