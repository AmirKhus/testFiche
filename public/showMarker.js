// See post: http://asmaloney.com/2015/06/code/clustering-markers-on-leaflet-maps


var myURL = jQuery('script[src$="showMarker.js"]')
  .attr('src')
  .replace('showMarker.js', '')

var messageApi ='http://127.0.0.1:8080/marker';

let markersJson = [];

async function foo(){
  var data = await fetch(messageApi); // Notice the await
  // code here only executes _after_ the request is done
  return data.json(); // 'data' is defined
}

var map = L.map('map', {
  center: [10.0, 5.0],
  minZoom: 2,
  zoom: 2,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: ['a', 'b', 'c'],
}).addTo(map)

// L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
//     {    attribution:
//             '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//         subdomains: ['a', 'b', 'c'],
//     }).addTo(map);


var myIcon = L.icon({
  iconUrl: myURL + '../maps/images/pin24.png',
  iconRetinaUrl: myURL + '../maps/images/pin48.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14],
})


var musorIcon = L.icon({
  iconUrl: myURL + '../maps/images/musor.png',
  iconRetinaUrl: myURL + '../maps/images/musor.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14],
})

var filterIcon = L.icon({
  iconUrl: myURL + 'public/maps/images/filter.png',
  iconRetinaUrl: myURL + 'public/maps/images/filter.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14],
})


var markerClusters = L.markerClusterGroup()

let arrVidMusora = [];

foo().then(function (data) {
    for (var i = 0; i < data.length; ++i) {
      //заполнение массива с видами мусора
      if (arrVidMusora.indexOf(markers[i].typeOfEnvironmentalProblem) === -1)
        arrVidMusora.push(markers[i].typeOfEnvironmentalProblem)
      console.log(data);
      // console.log(markers);
      if (data[i].id > 0) {
        var popup =
            '<table border="1" bordercolor="grey">\n' +
                // '  <colgroup>\n' +
                // '    <col span="2" style="background:Khaki"><!-- С помощью этой конструкции задаем цвет фона для первых двух столбцов таблицы-->\n' +
                // '    <col style="background-color:LightCyan"><!-- Задаем цвет фона для следующего (одного) столбца таблицы-->\n' +
                // '  </colgroup>\n' +

              '</tr>\n'+
                // '<tr>\n' +
                // '<td>Автор</td>\n' +
                // '<td>'+data[i].author+'</td>\n' +
                '<tr>\n' +
                  '<th>№ п/п</th>\n' +
                  '<th>Наименование</th>\n' +
                '</tr>\n' +
                '<tr>\n' +
                  '<td>Идентификатор</td>\n'   +
                  '<td>'+ data[i].id +'</td>\n' +
                '</tr>\n' +
                '<tr>\n' +
                  '<td>Тип экологической проблемы</td>\n' +
                  '<td>'+data[i].typeOfEnvironmentalProblem+'</td>\n' +
                '</tr>\n' +
                '<tr>\n' +
                  '<td>Описание</td>\n'   +
                  '<td>'+ data[i].description +'</td>\n' +
                '</tr>\n' +
                '<tr>\n' +
                  '<td>Дата публикации</td>\n'   +
                  '<td>'+ data[i].dateOfPublication +'</td>\n' +
                '</tr>\n' +
                '<tr>\n' +
                  '<td>Лайки</td>\n' +
                  '<td>'+data[i].likeMarker+'</td>\n' +
                '</tr>\n' +
                '<tr>\n' +
                  '<td>Дизлайки</td>\n' +
                  '<td>'+data[i].dislikeMarker+'</td>\n' +
                '</tr>\n'+
                '<tr>\n' +
                  '<td>Долгота</td>\n' +
                  '<td>'+data[i].longitude+'</td>\n' +
                '</tr>\n'+
                '<tr>\n' +
                  '<td>Широта</td>\n' +
                  '<td>'+data[i].latitude+'</td>\n' +
                '</tr>\n'
            '</table>'

        // 1
        // mo(laura, saira).
        // fa(bill,saira).
        // fa(tom,bill).
        // fa(peter,tom).
        // pa(Person1, Person2):-fa(Person1, Person2).
        // pa(Person1, Person2):-mo(Person1, Person2).
        // Zapra pa(X,saira).

        // 2
        // sumnat(N,F):-N=0,F is 0.
        // sumnat(N,F):-N>0,N1 is N-1,sumnat(N1,F1),F is F1+N.

        // sumnat(3,V).

            // markers[i].name +
            // '<br/>' +
            // markers[i].typeOfEnvironmentalProblem +
            // '<br/>' +
            // markers[i].city +
            // '<br/><b>IATA/FAA:</b> ' +
            // markers[i].iata_faa +
            // '<br/><b>ICAO:</b> ' +
            // markers[i].icao +
            // '<br/><b>Altitude:</b> ' +
            // Math.round(markers[i].alt * 0.3048) +
            // ' m' +
            // '<br/><b>Timezone:</b> ' +
            // markers[i].tz
          // data[i].name +
          // '<br/>' +
          // data[i].typeOfEnvironmentalProblem +
          // '<br/>' +
          // data[i].description +
          // '<br/><b>IATA/FAA:</b> ' +
          // data[i].dateOfPublication +
          // '<br/><b>ICAO:</b> ' +
          // data[i].likeMarker +
          // '<br/><b>Altitude:</b> ' +
          // Math.round(data[i].dislikeMarker * 0.3048) +
          // ' m' +
          // '<br/><b>Timezone:</b> ' +
          // data[i].tz

        if (data[i].id % 2 === 0) {
          var m = L.marker([data.longitude, data.latitude], {
            icon: musorIcon,
            tags: [data[i].typeOfEnvironmentalProblem],
          }).bindPopup(popup,
            {removable: true, editable: true, tags: [data[i].typeOfEnvironmentalProblem]}
          );
          markerClusters.addLayer(m)
        } else {
          var m = L.marker([data[i].longitude, data[i].latitude], {
            icon: myIcon,
            tags: [data[i].typeOfEnvironmentalProblem],
          }).bindPopup(popup,
            {
              // className: "custom-popup",
              removable: true, editable: true, tags: [data[i].typeOfEnvironmentalProblem]}
          )

          markerClusters.addLayer(m)
        }
      }
    }
  }
)

// for (var i = 0; i < markers.length; ++i) {
//     //заполнение массива с видами мусора
//     if (arrVidMusora.indexOf(markers[i].typeOfEnvironmentalProblem) === -1)
//         arrVidMusora.push(markers[i].typeOfEnvironmentalProblem)
//     if (markers[i].id > 0) {
//         var popup =
//             '<table border="1" bordercolor="grey">\n' +
//             // '  <colgroup>\n' +
//             // '    <col span="2" style="background:Khaki"><!-- С помощью этой конструкции задаем цвет фона для первых двух столбцов таблицы-->\n' +
//             // '    <col style="background-color:LightCyan"><!-- Задаем цвет фона для следующего (одного) столбца таблицы-->\n' +
//             // '  </colgroup>\n' +
//             '<tr>\n' +
//             '<th>№ п/п</th>\n' +
//             '<th>Наименование</th>\n' +
//             '</tr>\n' +
//             '<tr>\n' +
//             '<td>Название</td>\n' +
//             '<td>'+markers[i].name+'</td>\n' +
//             '</tr>\n' +
//
//             '<tr>\n' +
//             '<td>Проблема</td>\n'   +
//             '<td>'+ markers[i].typeOfEnvironmentalProblem +'</td>\n' +
//             '</tr>\n' +
//             '<tr>\n' +
//             '<td>город</td>\n' +
//             '<td>'+ markers[i].city+'</td>\n' +
//             '</tr>\n' +
//             '<tr>\n' +
//             '<td>Непонятно</td>\n' +
//             '<td>'+markers[i].iata_faa+'</td>\n' +
//             '</tr>\n' +
//             '<tr>\n' +
//             '<td>Непонятно2</td>\n' +
//             '<td>'+markers[i].icao+'</td>\n' +
//             '</tr>\n' +
//             '</table>'
//             // markers[i].name +
//             // '<br/>' +
//             // markers[i].typeOfEnvironmentalProblem +
//             // '<br/>' +
//             // markers[i].city +
//             // '<br/><b>IATA/FAA:</b> ' +
//             // markers[i].iata_faa +
//             // '<br/><b>ICAO:</b> ' +
//             // markers[i].icao +
//             // '<br/><b>Altitude:</b> ' +
//             // Math.round(markers[i].alt * 0.3048) +
//             // ' m' +
//             // '<br/><b>Timezone:</b> ' +
//             // markers[i].tz
//
//         if (markers[i].id%2 === 0 ) {
//             var m = L.marker([markers[i].lat, markers[i].lng], {
//                 icon: musorIcon,
//                 tags: [markers[i].typeOfEnvironmentalProblem],
//             }).bindPopup(popup,
//                 {removable: true, editable: true,tags: [markers[i].typeOfEnvironmentalProblem]}
//                 );
//             markerClusters.addLayer(m)
//         }else {
//             var m = L.marker([markers[i].lat, markers[i].lng], {
//                 icon: myIcon,
//                 tags: [markers[i].typeOfEnvironmentalProblem],
//             }).bindPopup(popup,
//                 {removable: true, editable: true,tags: [markers[i].typeOfEnvironmentalProblem]}
//             );
//
//             markerClusters.addLayer(m)
//         }
//     }
// }

map.addLayer(markerClusters)
// функция кнопки с фильрацией
L.control.tagFilterButton({
  data: arrVidMusora,
  icon: '<img src = "maps/images/filter.png">',
  filterOnEveryClick: true
}).addTo(map);

//find button

// --------------------------------------------------------------
// create seearch button

// add "random" button
const buttonTemplate = `<div class="leaflet-search"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"></path></svg></div><div class="auto-search-wrapper max-height"><input type="text" id="marker" autocomplete="off"  aria-describedby="instruction" aria-label="Search ..." /><div id="instruction" class="hidden">When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.</div></div>`;

// create custom button
const customControl = L.Control.extend({
  // button position
  // button position
  options: {
    position: "topleft",
    className: "leaflet-autocomplete",
  },

  // method
  onAdd: function () {
    return this._initialLayout();
  },

  _initialLayout: function () {
    // create button
    const container = L.DomUtil.create(
      "div",
      "leaflet-bar " + this.options.className
    );

    L.DomEvent.disableClickPropagation(container);

    container.innerHTML = buttonTemplate;

    return container;
  },
});

// adding new button to map controll
map.addControl(new customControl());

// --------------------------------------------------------------

// input element
const root = document.getElementById("marker");

function addClassToParent() {
  const searchBtn = document.querySelector(".leaflet-search");
  searchBtn.addEventListener("click", (e) => {
    // toggle class
    e.target
      .closest(".leaflet-autocomplete")
      .classList.toggle("active-autocomplete");

    // add placeholder
    root.placeholder = "Search ...";

    // focus on input
    root.focus();

    // click on clear button
    clickOnClearButton();
  });
}

// function click on clear button
function clickOnClearButton() {
  document.querySelector(".auto-clear").click();
}

addClassToParent();

// function clear input
map.on("click", () => {
  document
    .querySelector(".leaflet-autocomplete")
    .classList.remove("active-autocomplete");

  clickOnClearButton();
});

// autocomplete section
// more config find in https://github.com/tomik23/autocomplete
// --------------------------------------------------------------

new Autocomplete("marker", {
  delay: 1000,
  selectFirst: true,
  howManyCharacters: 2,

  onSearch: function ({ currentValue }) {
    const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&q=${encodeURI(
      currentValue
    )}`;

    /**
     * Promise
     */
    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          resolve(data.features);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },

  onResults: ({ currentValue, matches, template }) => {
    const regex = new RegExp(currentValue, "i");
    // checking if we have results if we don't
    // take data from the noResults method
    return matches === 0
      ? template
      : matches
        .map((element) => {
          return `
              <li role="option">
                <p>${element.properties.display_name.replace(
            regex,
            (str) => `<b>${str}</b>`
          )}</p>
              </li> `;
        })
        .join("");
  },

  onSubmit: ({ object }) => {
    const { display_name } = object.properties;
    const cord = object.geometry.coordinates;
    // custom id for marker
    // const customId = Math.random();

    // remove last marker
    map.eachLayer(function (layer) {
      if (layer.options && layer.options.pane === "markerPane") {
        if (layer._icon.classList.contains("leaflet-marker-locate")) {
          map.removeLayer(layer);
        }
      }
    });

    // add marker
    const marker = L.marker([cord[1], cord[0]], {
      title: display_name,
    });

    // add marker to map
    marker.addTo(map).bindPopup(display_name,
      {removable: true, editable: true,tags: ['fast']});

    // set marker to coordinates
    map.setView([cord[1], cord[0]], 8);

    // add class to marker
    L.DomUtil.addClass(marker._icon, "leaflet-marker-locate");
  },

  // the method presents no results
  noResults: ({ currentValue, template }) =>
    template(`<li>No results found: "${currentValue}"</li>`),
});

// Добавление маркера ручками
// add marker on click

const addMarkerButton = document.getElementById('addMarkerButton');
addMarkerButton.addEventListener('click', function() {
   if (addMarkerButton.innerHTML === 'Добавить маркер'){
     addMarkerButton.innerHTML = '<span style=\'text-align: center\'>Отменить</span>'
     map.on("click", addMarker);
   } else
     {
     addMarkerButton.innerHTML ='Добавить маркер'
       map.off("click", addMarker);
  }
})

function addMarker(e) {
  // Add marker to map at click location
  const markerPlace = document.querySelector(".marker-position");
  // markerPlace.textContent = `new marker: ${e.latlng.lat}, ${e.latlng.lng}`;

  const marker = new L.marker(e.latlng, {
    draggable: true,
  })
    .addTo(map)
    .bindPopup(buttonRemove);

  // event remove marker
  marker.on("popupopen", removeMarker);

  // event draged marker
  marker.on("dragend", dragedMaker);
}

const buttonRemove =
  '<button type="button" class="remove">delete marker</button>';

const markerPlace = document.querySelector(".marker-position");

// remove marker
function addComenMarker() {
  const marker = this;
  const btn = document.querySelector(".remove");
  btn.addEventListener("click", function () {
    map.removeLayer(marker);
  });
}




function removeMarker() {
  const marker = this;
  const btn = document.querySelector(".remove");
  btn.addEventListener("click", function () {
    map.removeLayer(marker);
  });
}

// draged
function dragedMaker() {
  markerPlace.textContent = `change position: ${this.getLatLng().lat}, ${
    this.getLatLng().lng
  }`;
}
//add govno s nadpisiu
function commentdMaker() {
  markerPlace.textContent = `change position: ${this.getLatLng().lat}, ${
      this.getLatLng().lng
  }`;
}
