const opciones = ['3-D Man', 'A-Bomb (HAS)', 'A.I.M.', 'Aaron Stack', 'Abomination (Emil Blonsky)', 'Abomination (Ultimate)', 'Absorbing Man', 'Abyss', 'Adam Destine',
  'Adam Warlock', 'Aegis (Trey Rollins)', 'Aero (Aero)', 'Agatha Harkness', 'Agent Brand', 'Agent X (Nijo)', 'Agent Zero', 'Agents of Atlas', 'Aginar, Air-Walker (Gabriel Lan)', 'Balder', 'Banshee', 'Baron', 'Bart Rozum', 'Bastion', 'Batroc the Leaper', 'Battering Ram', 'Battlestar', 'Beak', 'Beast', 'Beast', 'Becatron', 'Bedlam', 'Cable', 'Calamity', 'Caliban', 'Callisto', 'Callisto (Age of Apocalypse)', 'Calypso', 'Cammi', 'Cannonball', 'Capn Oz', 'Captain America', 'DKen Neramani', 'Dagger', 'Daily Bugle', 'Daken', 'Dakota North', 'Damage Control', 'Dani Moonstar', 'Danny Rand', 'Daredevil', 'Dargo Ktor', 'Dark Avengers', 'Dark Beast', 'Dark Phoenix', 'Hulk', 'Dark X-Men', 'Darkhawk', 'Darkstar', 'Spider-man',];

async function inici() {
  const input = document.getElementById("cadena");

  // Añade las opciones de autocompletar al input
  input.setAttribute("autocomplete", "off");
  input.setAttribute("list", "opciones");
  const datalist = document.createElement("datalist");
  datalist.setAttribute("id", "opciones");
  opciones.forEach(opcion => {
    const option = document.createElement("option");
    option.setAttribute("value", opcion);
    datalist.appendChild(option);
  });
  input.after(datalist);

  // Agrega el evento de click al botón
  document.getElementById("boto").onclick = function () {
    ajaxFunction(input.value);
  };
}

async function ajaxFunction(cadena) {
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
      const data2 = await response2.json();
      const resultats2 = data2.data.results;

      document.getElementById("resultats").innerHTML = "";

      resultats2.forEach((comic, index) => {
        console.log(comic.title);
        let linkPortada = comic.thumbnail.path + "." + comic.thumbnail.extension;
        let linkComic = comic.urls[0].url;
        let portada = document.createElement("div");
        portada.style.display = "inline-block";
        portada.style.margin = "10px";
        var a = document.createElement("a");
        a.href = linkComic;
        var h4 = document.createElement("h4");
        h4.innerText = comic.title;
        h4.style.width = "160px";
        var imatgePortada = document.createElement("img");
        a.appendChild(imatgePortada);
        a.appendChild(h4);
        if (!linkPortada.includes("image_not_available")) {
          imatgePortada.src = linkPortada;
          imatgePortada.width = 150;
          imatgePortada.height = 230;
          portada.appendChild(a);
          portada.appendChild(h4);
          document.getElementById("resultats").appendChild(portada);
        }
      });
    } 
  } else {
    document.getElementById("resultats").innerHTML = "<h2>La cerca no ha retornat resultats.</h2>"; // per què no funciona?
  }
}
