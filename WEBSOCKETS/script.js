//const socket = new WebSocket("ws://localhost:8080");

let opciones = [];

async function inici() {
  const suggestions = document.querySelector("datalist");

  socket.onopen = function () {
    console.log("Conexión WebSockets ha sigut oberta");
  };

  document.getElementById("cadena").onkeyup = async function () {
    const value = this.value;

    if (!value) {
      while (suggestions.firstChild) {
        suggestions.removeChild(suggestions.firstChild);
      }
      return;
    }

    socket.send(value);
  }

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const newSuggestions = data.results;

    while (suggestions.firstChild) {
      suggestions.removeChild(suggestions.firstChild);
    }

    newSuggestions.forEach(suggestion => {
      const option = document.createElement("option");
      option.value = suggestion.name;
      option.innerHTML = suggestion.name;
      suggestions.appendChild(option);
    });
  };

  socket.onclose = function () {
    console.log("Conexión WebSockets tancada");
  };
}

const socket = new WebSocket("ws://gateway.marvel.com/v1/public");

async function sendMessage(cadena) {
  document.getElementById("resultats").innerHTML = "<h2>Carregant...</h2>";

  const message = {
    type: "getCharacters",
    data: {
      nameStartsWith: cadena,
      ts: 1,
      apikey: "385f8a62426d0d8535c4604f77fcb45a",
      hash: "2a696d921628585788f612c34de291f5"
    }
  };

  socket.send(JSON.stringify(message));
}

// Funció que s'executa quan es rep un missatge del servidor WebSocket
socket.onmessage = async function (event) {
  const data = JSON.parse(event.data);

  switch (data.type) {
    case "characters":
      const resultats = data.data.results;
      if (resultats.length === 0) {
        document.getElementById("resultats").innerHTML = "<h2>La cerca no ha retornat resultats.</h2>";
        break;
      }

      const message = {
        type: "getComics",
        data: {
          id: resultats[0].id,
          ts: 1,
          apikey: "385f8a62426d0d8535c4604f77fcb45a",
          hash: "2a696d921628585788f612c34de291f5",
          limit: 100
        }
      };

      socket.send(JSON.stringify(message));
      break;

      case "comics":
        document.getElementById("resultats").innerHTML = "";
        const resultats2 = data.data.results;
        if (data.data.count === 0) {
          document.getElementById("resultats").innerHTML = "<h2>La cerca no ha retornat resultats.</h2>";
          break;
        }
        
        resultats2.forEach((comic, index) => {
          // console.log(comic.title);
        let linkPortada = comic.thumbnail.path + "." + comic.thumbnail.extension;
        let linkComic = comic.urls[0].url;
        let portada = document.createElement("div");
        portada.setAttribute("class", "portada");
        portada.style.cssText = "display: inline-block; margin: 10px";
        let a = document.createElement("a");
        a.setAttribute("href", "https://www.google.com");
        a.style.cssText = "text-decoration: none";
        let img = document.createElement("img");
        img.setAttribute("src", url);
        img.setAttribute("width", "200px");
        img.setAttribute("height", "300px");
        a.appendChild(img);
        portada.appendChild(a);
        contenedor.appendChild(portada);
        let titulo = document.createElement("h3");
        titulo.innerHTML = nombre;
        titulo.style.cssText = "margin: 10px 0px";
        portada.appendChild(titulo);
        let descripcion = document.createElement("p");
        descripcion.innerHTML = desc;
        descripcion.style.cssText = "margin: 10px 0px";
        portada.appendChild(descripcion);
        }

  )}

}