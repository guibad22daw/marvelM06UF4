let opciones = [];

async function inici() {
  const suggestions = document.querySelector("datalist");

  document.getElementById("boto").onclick = function () {
    ajaxFunction(document.getElementById("cadena").value);
  };

  document.onmousedown = function() {
    document.getElementById("mySidepanel").style.width = "0";
    document.getElementById("resultats").style.marginRight = "0";
  }

  document.getElementById("cadena").onkeyup = async function () {
    const value = this.value;

    if (!value) {
      while (suggestions.firstChild) {
        suggestions.removeChild(suggestions.firstChild);
      }
      return;
    }

    const response3 = await fetch(
      `http://gateway.marvel.com/v1/public/characters?nameStartsWith=${value}&ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5`
    );

    if (response3.ok) {
      const data3 = await response3.json();
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
    }

  }
}

async function ajaxFunction(cadena) {
  document.getElementById("resultats").innerHTML = "<h2>Carregant...</h2>";
  const response = await fetch(
    `http://gateway.marvel.com/v1/public/characters?nameStartsWith=${cadena}&ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5`
  );
  if (response.ok) {
    const data = await response.json();
    const resultats = data.data.results;

    const response2 = await fetch(
      `http://gateway.marvel.com/v1/public/characters/${resultats[0].id}/comics?ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5&limit=100`
    );

    if (response2.ok) {
      document.getElementById("resultats").innerHTML = "";
      const data2 = await response2.json();
      const resultats2 = data2.data.results;
      if (data2.data.count == 0) document.getElementById("resultats").innerHTML = "<h2>La cerca no ha retornat resultats.</h2>";

      resultats2.forEach((comic, index) => {
        console.log(comic.title);
        let linkPortada = comic.thumbnail.path + "." + comic.thumbnail.extension;
        let linkComic = comic.urls[0].url;
        let portada = document.createElement("div");
        portada.style.display = "inline-block";
        portada.style.margin = "10px";
        let a = document.createElement("a");
        //a.href = linkComic;
        let h4 = document.createElement("h4");
        h4.innerText = comic.title;
        let imatgePortada = document.createElement("img");
        a.append(imatgePortada,h4);
        if (!linkPortada.includes("image_not_available")) {
          imatgePortada.src = linkPortada;
          imatgePortada.width = 150;
          imatgePortada.height = 230;
          portada.append(a,h4);
          document.getElementById("resultats").appendChild(portada);
        }
        a.onclick = function openNav() {  // Panel lateral on es mostra la informació del comic seleccionat.
          document.getElementById("mySidepanel").innerHTML = '';
          let divPanel = document.createElement("div");
          divPanel.setAttribute("class","divPanel");
          let imatgePanel = document.createElement("img");
          imatgePanel.src = linkPortada;
          imatgePanel.setAttribute("class","imatgePanel");
          let titol = document.createElement("h4");
          titol.innerText = comic.title;
          let description = document.createElement("p");
          description.setAttribute("class","descripcio");
          description.innerText = comic.description; // Afegim la descripcio del comic
          divPanel.append(imatgePanel,titol, description);
          document.getElementById("mySidepanel").appendChild(divPanel);
          document.getElementById("mySidepanel").style.width = "43%";
          document.getElementById("resultats").style.marginRight = "43%";
          document.getElementById("resultats").style.transition = "all 0.5s ease 0s";
        };
      });
    }
  } else {
    document.getElementById("resultats").innerHTML = "<h2>Error cercant informació.</h2>";
  }
}

/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {

}