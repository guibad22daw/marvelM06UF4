var xhr, data, resultats;

function inici() {
    xhr = new XMLHttpRequest();
    xhr2 = new XMLHttpRequest();
    document.getElementById("boto").onclick = function () {
        ajaxFunction(document.getElementById("cadena").value);
    };
}

function ajaxFunction(cadena) {
    xhr.open("GET", `http://gateway.marvel.com/v1/public/characters?nameStartsWith=${cadena}&ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5`, true);
    // http://gateway.marvel.com/v1/public/comics?ts=1000&apikey=123456&hash=df2bb84c21b3b7f0fa9ba59899c21b9b
    xhr.send(null);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 3) {
            document.getElementById("resultats").innerHTML = "Carregant...";
        }
        else if (xhr.readyState == 4) {
            data = JSON.parse(xhr.responseText);
            resultats = data.data.results;
            //document.getElementById("resultats").innerHTML = JSON.stringify(resultats[0]); // resultat[0].comics mostraria els comics en els que apareix aquell personatge	
            xhr2.open('GET', `http://gateway.marvel.com/v1/public/characters/${resultats[0].id}/comics?ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5&limit=100`, true);
            xhr2.send(null);
            if (resultats[0].id) {
                xhr2.onreadystatechange = function () {
                    if (xhr2.readyState == 3) console.log("Carregant...");
                    else if (xhr2.readyState == 4) {
                        document.getElementById("resultats").innerHTML = '';
                        let data2 = JSON.parse(xhr2.responseText);
                        let resultats2 = data2.data.results;
                        //console.table(resultats2);
                        resultats2.forEach(comic => {
                            console.log(comic.title);
                            // document.getElementById("resultats").innerHTML += comic.title + "<br>";
                            let linkPortada = comic.thumbnail.path + "." + comic.thumbnail.extension;
                            let portada = document.createElement("div");
                            var imatgePortada = document.createElement("img");
                            if (!(linkPortada.includes("image_not_available"))) {
                                imatgePortada.src = linkPortada;
                                imatgePortada.width = 150;
                                imatgePortada.height = 230;
                                portada.appendChild(imatgePortada);
                                document.body.append(portada);
                            }
                            //var imatge = document.getElementById("imatge").src = portada;
                        });
                    }
                }
            }
        }
    };

}