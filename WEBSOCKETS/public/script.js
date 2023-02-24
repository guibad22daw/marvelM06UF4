const socket = io();

async function inici() {
    const suggestions = document.querySelector("datalist");

    document.getElementById("boto").onclick = function () {
        fetchFunction(document.getElementById("cadena").value);
    };

    document.onmousedown = function () {
        document.getElementById("mySidepanel").style.width = "0";
        document.getElementById("resultats").style.marginRight = "0";
    }

    document.getElementById("cadena").onkeyup = async function () {
        const value = this.value;

        socket.emit('entrada', {
            entrada: value
        });

        if (!value) {
            while (suggestions.firstChild) {
                suggestions.removeChild(suggestions.firstChild);
            }
            return;
        }
        socket.on('sugestions', function (data) {
            console.log("dades rebudes al client.")
            const data3 = data.data;
            const resultats3 = data3.data.results;
            const newSuggestions = resultats3;

            while (suggestions.firstChild) {
                suggestions.removeChild(suggestions.firstChild);
            }

            newSuggestions.forEach(suggestion => {
                const option = document.createElement("option");
                option.value = suggestion.name;
                option.innerHTML = suggestion.name;
                suggestions.appendChild(option);
            });
        });
    }
}

async function fetchFunction(cadena) {
    document.getElementById("resultats").innerHTML = "";
    document.getElementById("carregant").innerHTML = `<img src="../assets/ironman.gif"/>`;

    let peticioComics = fetch(`https://gateway.marvel.com:443/v1/public/comics?ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5`);
    let peticioPersonatges = fetch(`https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5`);

    Promise.race([peticioComics, peticioPersonatges])
        .then(response => {
            if (response.url === peticioComics.url) {
                console.log("La sol·licitud per obtenir comics s'ha completat abans que la d'obtenir personatges.");
            } else {
                console.log("La sol·licitud per obtenir personatges s'ha completat abans que la d'obtenir comics.");
            }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error(error));

    const response = await fetch(
        `http://gateway.marvel.com/v1/public/characters?nameStartsWith=${cadena}&ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5`
    );

    if (response.ok) {
        const data = await response.json();
        const resultats = data.data.results;
        document.getElementById("carregant").innerHTML = `<img src="../assets/ironman.gif"/>`;

        if (resultats[0] == undefined) {
            document.getElementById("carregant").innerHTML = "<h2>La cerca no ha retornat resultats.</h2>";
        }
        const response2 = await fetch(
            `http://gateway.marvel.com/v1/public/characters/${resultats[0].id}/comics?ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5&limit=100`
        );

        if (response2.ok) {
            document.getElementById("carregant").innerHTML = "";
            document.getElementById("resultats").innerHTML = "";
            const data2 = await response2.json();
            const resultats2 = data2.data.results;

            if (resultats2[0] == undefined) document.getElementById("carregant").innerHTML = "<h2>La cerca no ha retornat resultats.</h2>";

            resultats2.forEach((comic, index) => {
                let linkPortada = comic.thumbnail.path + "." + comic.thumbnail.extension;
                let linkComic = comic.urls[0].url;
                let portada = document.createElement("div");
                portada.setAttribute("class", "portada");
                portada.style.cssText = "display: inline-block; margin: 10px";
                let a = document.createElement("a");
                let h4 = document.createElement("h4");
                h4.innerText = comic.title;
                let imatgePortada = document.createElement("img");
                a.append(imatgePortada, h4);
                if (!linkPortada.includes("image_not_available")) {
                    imatgePortada.src = linkPortada;
                    imatgePortada.style.cssText = "width:150px; height: 230px; box-shadow: 0 6px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);"
                    portada.append(a, h4);
                    document.getElementById("resultats").appendChild(portada);
                }
                a.onclick = function openNav() {  // Panel lateral on es mostra la informació del comic seleccionat.
                    document.getElementById("mySidepanel").innerHTML = '';
                    let divPanel = document.createElement("div");
                    let detalls = document.createElement("div");
                    divPanel.setAttribute("class", "divPanel");
                    detalls.setAttribute("class", "detalls");

                    let imatgePanel = document.createElement("img");
                    let imatgefonsPanel = document.createElement("div");
                    imatgePanel.setAttribute("class", "imatgePanel");
                    imatgefonsPanel.setAttribute("class", "imatgeFonsPanel");
                    imatgePanel.src = linkPortada;
                    imatgefonsPanel.style.cssText = `background-image: url(${linkPortada});`;

                    let titol = document.createElement("h2");
                    titol.innerText = comic.title;

                    let textPub = document.createElement("p");
                    let dataPub = comic.dates[0].date.split("T")[0];
                    textPub.innerHTML = `<b>Publicació:</b> <br> ${dataPub}`;

                    let textAutor = document.createElement("p");
                    let textIlustrador = document.createElement("p");
                    comic.creators.items.forEach(async function (autor, index) {
                        if (autor.role == "writer") {
                            textAutor.innerHTML = `<b>Autor:</b> <br> ${autor.name}`;
                        } else if (autor.role == "penciller" || autor.role == "penciler" || autor.role == "penciler (cover)" || autor.role == "penciller (cover)" || autor.role == "inker") {
                            textIlustrador.innerHTML = `<b>Il·lustrador:</b> <br> ${autor.name}`;
                        }
                    })

                    let description = document.createElement("p");
                    description.setAttribute("class", "descripcio");
                    if (comic.description != null) description.innerHTML = `<b>Descripció:</b> <br> ${comic.description}`; // Afegim la descripcio del comic

                    detalls.append(titol, textPub, textAutor, textIlustrador, description)
                    divPanel.append(imatgePanel, detalls);
                    document.getElementById("mySidepanel").append(imatgefonsPanel, divPanel);
                    document.getElementById("mySidepanel").style.width = "43%";
                    document.getElementById("resultats").style.cssText = "margin-right: 43%; transition: all 0.5s ease 0s";
                };
            });
        } else {
            document.getElementById("carregant").innerHTML = "<h2>Error cercant informació.</h2>";
        }
    } else {
        document.getElementById("carregant").innerHTML = "<h2>Error cercant informació.</h2>";
    }
}