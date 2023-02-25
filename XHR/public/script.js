async function inici() {
   let xhr = new XMLHttpRequest();

   xhr.open('GET', '/Marvel_Logo.svg.png', true);
   xhr.responseType = 'arraybuffer';

   xhr.onload = function (e) {
      if (this.status == 200) {
         var uInt8Array = new Uint8Array(this.response);
         var i = uInt8Array.length;
         var binaryString = new Array(i);
         while (i--) {
            binaryString[i] = String.fromCharCode(uInt8Array[i]);
         }
         var data = binaryString.join('');
         var base64 = window.btoa(data);
         document.getElementById("logoMarvel").src = "data:image/png;base64," + base64;
      }
   };
   xhr.send(null);

   const suggestions = document.querySelector("datalist");

   document.getElementById("boto").onclick = function () {
      ajaxFunction(document.getElementById("cadena").value);
   };

   document.onmousedown = function () {
      document.getElementById("mySidepanel").style.width = "0";
      document.getElementById("resultats").style.marginRight = "0";
   }

   document.getElementById("cadena").onkeyup = async function () {
      let xhr = new XMLHttpRequest();

      const value = this.value;

      if (!value) {
         while (suggestions.firstChild) {
            suggestions.removeChild(suggestions.firstChild);
         }
         return;
      }

      xhr.open("GET", `http://gateway.marvel.com/v1/public/characters?nameStartsWith=${value}&ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5`, true);
      xhr.send(null);
      xhr.onreadystatechange = function () {
         if (xhr.readyState == 4) {
            if (xhr.status == 200) {
               const data3 = JSON.parse(xhr.responseText);
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
            } else{
               document.getElementById("resultats").innerHTML = "";
               document.getElementById("carregant").innerHTML = `<h2>Error de connexió.</h2>`;
            } 
         }
      }
   }

   function ajaxFunction(cadena) {
      let xhr = new XMLHttpRequest();

      document.getElementById("resultats").innerHTML = "";
      document.getElementById("carregant").innerHTML = `<img src="ironman.gif"/>`;
      xhr.open("GET", `http://gateway.marvel.com/v1/public/characters?nameStartsWith=${cadena}&ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5`, true);
      xhr.send(null);
      xhr.onreadystatechange = function () {
         if (xhr.readyState == 4) {
            if (xhr.status == 200) {
               let xhr2 = new XMLHttpRequest();
               let data = JSON.parse(xhr.responseText);
               let resultats = data.data.results;

               if (resultats[0] != undefined) {
                  xhr2.open('GET', `http://gateway.marvel.com/v1/public/characters/${resultats[0].id}/comics?ts=1&apikey=385f8a62426d0d8535c4604f77fcb45a&hash=2a696d921628585788f612c34de291f5&limit=100`, true);
                  xhr2.send(null);

                  xhr2.onreadystatechange = async function () {
                     if (xhr2.readyState == 4) {
                        document.getElementById("carregant").innerHTML = "";
                        const data2 = JSON.parse(xhr2.responseText);
                        const resultats2 = data2.data.results;

                        resultats2.forEach((comic, index) => {
                           // console.log(comic.title);
                           let linkPortada = comic.thumbnail.path + "." + comic.thumbnail.extension;
                           let linkComic = comic.urls[0].url;
                           let portada = document.createElement("div");
                           portada.setAttribute("class", "portada");
                           portada.style.cssText = "display: inline-block; margin: 10px";
                           let a = document.createElement("a");
                           //a.href = linkComic;
                           let h4 = document.createElement("h4");
                           h4.innerText = comic.title;
                           let imatgePortada = document.createElement("img");
                           a.append(imatgePortada, h4);
                           if (!linkPortada.includes("image_not_available")) {
                              imatgePortada.src = linkPortada;
                              imatgePortada.onload = function () {
                                 imatgePortada.style.cssText = "width:150px; height: 230px; box-shadow: 0 6px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);"
                                 portada.append(a, h4);
                                 document.getElementById("resultats").appendChild(portada);
                              }
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
                     }
                  }
               } else {
                  document.getElementById("resultats").innerHTML = "";
                  document.getElementById("carregant").innerHTML = "<h2>La cerca no ha retornat resultats.</h2>"
               }
            } else document.getElementById("carregant").innerHTML = `<h2>Error de connexió.</h2>`;

         }
      }
   };
}