async function inici() {
    document.getElementById("boto").onclick = function() {
      ajaxFunction(document.getElementById("cadena").value);
    };
  }
  
  async function ajaxFunction(cadena) {
    try {
      const response = await fetch(`http://gateway.marvel.com/v1/public/characters?nameStartsWith=${cadena}&ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5`);
      const data = await response.json();
      const resultats = data.data.results;
      document.getElementById("resultats").innerHTML = "Loading...";
      const response2 = await fetch(`http://gateway.marvel.com/v1/public/characters/${resultats[0].id}/comics?ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5&limit=100`);
      const data2 = await response2.json();
      const resultats2 = data2.data.results;
      document.getElementById("resultats").innerHTML = "";
      resultats2.forEach(comic => {
        console.log(comic.title);
        let linkPortada = comic.thumbnail.path + "." + comic.thumbnail.extension;
        let portada = document.createElement("div");
        var imatgePortada = document.createElement("img");
        if (!linkPortada.includes("image_not_available")) {
          imatgePortada.src = linkPortada;
          imatgePortada.width = 150;
          imatgePortada.height = 230;
          portada.appendChild(imatgePortada);
          document.body.append(portada);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  