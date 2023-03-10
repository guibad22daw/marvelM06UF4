const socket = io();
let obert, comptador;

async function inici() {
    const suggestions = document.querySelector("datalist");

    document.getElementById("boto").onclick = function () {
        fetchFunction(document.getElementById("cadena").value);
    };

    document.onmousedown = function () {
        document.getElementById("mySidepanel").style.width = "0";
        document.getElementById("resultats").style.marginRight = "0";
        if (obert) {
            if (comptador == 1) document.getElementById("comptador").innerHTML = `<h6 style="color: white; text-align: center; margin-top: 1em">Mostrant ${comptador} resultat</h6><br>`;
            else document.getElementById("comptador").innerHTML = `<h6 style="color: white; text-align: center; margin-top: 1em">Mostrant ${comptador} resultats</h6><br>`;
        }
        obert = 0;
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
            if (data != "error") {
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
            } else {
                document.getElementById("resultats").innerHTML = "";
                document.getElementById("carregant").innerHTML = "<h2>Error de connexi??.</h2>";
            }

        });
    }
}

async function fetchFunction(cadena) {
    document.getElementById("resultats").innerHTML = "";
    document.getElementById("carregant").innerHTML = `<img src="ironman.gif"/>`;
    document.getElementById("comptador").innerHTML = "";

    socket.emit('cercaPersonatge', {
        cadena: cadena
    });

    socket.on('dades', function (data) {
        comptador = 0;
        if (data != "error" && data != "noresults") {
            document.getElementById("carregant").innerHTML = "";
            document.getElementById("resultats").innerHTML = "";
            document.getElementById("comptador").innerHTML = "";
            let data2 = data.data;
            let resultats2 = data2.data.results;

            if (resultats2[0] == undefined) document.getElementById("carregant").innerHTML = "<h2>La cerca no ha retornat resultats.</h2>";
            console.log("dades rebudes al client");
            console.log(resultats2);

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
                    comptador++;
                    imatgePortada.src = linkPortada;
                    portada.append(a, h4);
                    document.getElementById("resultats").appendChild(portada);
                    imatgePortada.style.cssText = "width:150px; height: 230px; box-shadow: 0 6px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);"
                }

                a.onclick = function openNav() {
                    obert = 1;  // Panel lateral on es mostra la informaci?? del comic seleccionat.
                    if (comptador == 1) document.getElementById("comptador").innerHTML = `<h6 style="color: white; text-align: left; margin: 1em 0 0 3em">Mostrant ${comptador} resultat</h6><br>`;
                    else document.getElementById("comptador").innerHTML = `<h6 style="color: white; text-align: left; margin: 1em 0 0 3em">Mostrant ${comptador} resultats</h6><br>`;
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
                    textPub.innerHTML = `<b>Publicaci??:</b> <br> ${dataPub}`;

                    let textAutor = document.createElement("p");
                    let textIlustrador = document.createElement("p");
                    comic.creators.items.forEach(async function (autor, index) {
                        if (autor.role == "writer") {
                            textAutor.innerHTML = `<b>Autor:</b> <br> ${autor.name}`;
                        } else if (autor.role == "penciller" || autor.role == "penciler" || autor.role == "penciler (cover)" || autor.role == "penciller (cover)" || autor.role == "inker") {
                            textIlustrador.innerHTML = `<b>Il??lustrador:</b> <br> ${autor.name}`;
                        }
                    })

                    let description = document.createElement("p");
                    description.setAttribute("class", "descripcio");
                    if (comic.description != null) description.innerHTML = `<b>Descripci??:</b> <br> ${comic.description}`; // Afegim la descripcio del comic

                    detalls.append(titol, textPub, textAutor, textIlustrador, description)
                    divPanel.append(imatgePanel, detalls);
                    document.getElementById("mySidepanel").append(imatgefonsPanel, divPanel);
                    document.getElementById("mySidepanel").style.width = "43%";
                    document.getElementById("resultats").style.cssText = "margin-right: 43%; transition: all 0.5s ease 0s";
                }
            });
            if (comptador == 1) document.getElementById("comptador").innerHTML = `<h6 style="color: white; text-align: center">Mostrant ${comptador} resultat</h6><br>`;
            else document.getElementById("comptador").innerHTML = `<h6 style="color: white; text-align: center">Mostrant ${comptador} resultats</h6><br>`;
        } else {
            document.getElementById("resultats").innerHTML = "";
            document.getElementById("comptador").innerHTML = "";
            if (data == "noresults") document.getElementById("carregant").innerHTML = "<h2>La cerca no ha retornat resultats.</h2>";
            else document.getElementById("carregant").innerHTML = "<h2>Error de connexi??.</h2>";
        }
    });
}
