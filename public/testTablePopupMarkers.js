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

var popup = '<table border="1" bordercolor="grey">\n' +
    // '  <colgroup>\n' +
    // '    <col span="2" style="background:Khaki"><!-- С помощью этой конструкции задаем цвет фона для первых двух столбцов таблицы-->\n' +
    // '    <col style="background-color:LightCyan"><!-- Задаем цвет фона для следующего (одного) столбца таблицы-->\n' +
    // '  </colgroup>\n' +
    '  <tr>\n' +
    '    <th>№ п/п</th>\n' +
    '    <th>Наименование</th>\n' +
    '    <th>Цена, руб.</th>\n' +
    '  </tr>\n' +
    '  <tr>\n' +
    '    <td>1</td>\n' +
    '    <td>Карандаш цветной</td>\n' +
    '    <td>20,00</td>\n' +
    '  </tr>\n' +
    '  <tr>\n' +
    '    <td>2</td>\n' +
    '    <td>Линейка 20 см</td>\n' +
    '    <td>30,00</td>\n' +
    '  </tr>\n' +
    '</table>'
    var m = L.marker([51.30,0.07]).bindPopup(popup
    ).addTo(map);