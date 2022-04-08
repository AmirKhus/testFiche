// Adding nametag labels to all popup-able leaflet layers
const sourceTypes = ['Layer','Circle','CircleMarker','Marker','Polyline','Polygon','ImageOverlay','VideoOverlay','SVGOverlay','Rectangle','LayerGroup','FeatureGroup','GeoJSON']

var messageApi ='http://127.0.0.1:8080/marker';

var arrayDataInformationFromMarkers;

sourceTypes.forEach( type => {
    L[type].include({
        nametag: type.toLowerCase()
    })
})

//  Adding new options to the default options of a popup
L.Popup.mergeOptions({
    removable: false,
    editable: false,
})

// Modifying the popup mechanics
L.Popup.include({

    // modifying the _initLayout method to include edit and remove buttons, if those options are enabled

    //  ----------------    Source code  ---------------------------- //
    // original from https://github.com/Leaflet/Leaflet/blob/master/src/layer/Popup.js
    _initLayout: function () {
        var prefix = 'leaflet-popup',
            container = this._container = L.DomUtil.create('div',
                prefix + ' ' + (this.options.className || '') +
                ' leaflet-zoom-animated');

        var wrapper = this._wrapper = L.DomUtil.create('div', prefix + '-content-wrapper', container);
        this._contentNode = L.DomUtil.create('div', prefix + '-content', wrapper);

        L.DomEvent.disableClickPropagation(wrapper);
        L.DomEvent.disableScrollPropagation(this._contentNode);
        L.DomEvent.on(wrapper, 'contextmenu', L.DomEvent.stopPropagation);

        this._tipContainer = L.DomUtil.create('div', prefix + '-tip-container', container);
        this._tip = L.DomUtil.create('div', prefix + '-tip', this._tipContainer);

        if (this.options.closeButton) {
            var closeButton = this._closeButton = L.DomUtil.create('a', prefix + '-close-button', container);
            closeButton.href = '#close';
            closeButton.innerHTML = '&#215;';

            L.DomEvent.on(closeButton, 'click', this._onCloseButtonClick, this);
        }

        //  ----------------    Source code  ---------------------------- //


        //  ---------------    My additions  --------------------------- //

        var nametag

        if (this.options.nametag){
            nametag = this.options.nametag
        } else if (this._source) {
            nametag =  this._source.nametag
        } else {
            nametag = "popup"
        }

        if (this.options.removable && !this.options.editable){
            var userActionButtons = this._userActionButtons = L.DomUtil.create('div', prefix + '-useraction-buttons', wrapper);
            var removeButton = this._removeButton = L.DomUtil.create('a', prefix + '-remove-button', userActionButtons);
            removeButton.href = '#close';
            removeButton.innerHTML = `Remove this ${nametag}`;
            this.options.minWidth = 110;

            L.DomEvent.on(removeButton, 'click', this._onRemoveButtonClick, this);
        }
        // testFiche\public\maps\buttonInMarkers\leaflet-popup-modifier.js
        if (this.options.editable && !this.options.removable){
            var userActionButtons = this._userActionButtons = L.DomUtil.create('div', prefix + '-useraction-buttons', wrapper);
            var editButton = this._editButton = L.DomUtil.create('a', prefix + '-edit-button', userActionButtons);
            editButton.href = '#edit';
            editButton.innerHTML = 'Edit';

            L.DomEvent.on(editButton, 'click', this._onEditButtonClick, this);
        }

        if (this.options.editable && this.options.removable){
            var userActionButtons = this._userActionButtons = L.DomUtil.create('div', prefix + '-useraction-buttons', wrapper);
            var removeButton = this._removeButton = L.DomUtil.create('a', prefix + '-remove-button', userActionButtons);
            removeButton.href = '#close';
            removeButton.innerHTML = `Удалить маркер`;
            var editButton = this._editButton = L.DomUtil.create('a', prefix + '-edit-button', userActionButtons);
            editButton.href = '#edit';
            editButton.innerHTML = 'Изменить';
            this.options.minWidth = 160;

            L.DomEvent.on(removeButton, 'click', this._onRemoveButtonClick, this);
            L.DomEvent.on(editButton, 'click', this._onEditButtonClick, this);
        }
    },

    _onRemoveButtonClick: function (e) {
        this._source.remove();
        L.DomEvent.stop(e);
        var event = new CustomEvent("removeMarker", {
            detail: {
                marker: this._source
            }
        });
        document.dispatchEvent(event);
    },

    _onEditButtonClick: function (e) {
        //Needs to be defined first to capture width before changes are applied
        var inputFieldWidth = this._inputFieldWidth = this._container.offsetWidth - 2*19;

        this._contentNode.style.display = "none";
        this._userActionButtons.style.display = "none";

        var wrapper = this._wrapper;
        var editScreen = this._editScreen = L.DomUtil.create('div', 'leaflet-popup-edit-screen', wrapper)
        var inputField = this._inputField = L.DomUtil.create('div', 'leaflet-popup-input', editScreen);
        // делаем так чтобы у нас была возможность 
        // inputField.setAttribute("contenteditable", "true");
        inputField.innerHTML = this.getContent()
        console.log(inputField);

        //  -----------  Making the input field grow till max width ------- //
        inputField.style.width = inputFieldWidth + 'px';
        var inputFieldDiv = L.DomUtil.get(this._inputField);


        // create invisible div to measure the text width in pixels
        var ruler = L.DomUtil.create('div', 'leaflet-popup-input-ruler', editScreen);

        let thisStandIn = this;

        // Padd event listener to the textinput to trigger a check
        this._inputField.addEventListener("keydown", function(){
            // Check to see if the popup is already at its maxWidth
            // and that text doesnt take up whole field
            if (thisStandIn._container.offsetWidth < thisStandIn.options.maxWidth + 38
                && thisStandIn._inputFieldWidth + 5 < inputFieldDiv.clientWidth){
                ruler.innerHTML = inputField.innerHTML;

                if (ruler.offsetWidth + 20 > inputFieldDiv.clientWidth){
                    console.log('expand now');
                    inputField.style.width = thisStandIn._inputField.style.width = ruler.offsetWidth + 10 + 'px';
                    thisStandIn.update();
                }
            }
        }, false)


        var inputActions = this._inputActions = L.DomUtil.create('div', 'leaflet-popup-input-actions', editScreen);
        var cancelButton = this._cancelButton = L.DomUtil.create('a', 'leaflet-popup-input-cancel', inputActions);
        cancelButton.href = '#cancel';
        cancelButton.innerHTML = 'Отмена';
        var saveButton = this._saveButton = L.DomUtil.create('a', 'leaflet-popup-input-save', inputActions);
        saveButton.href = "#save";
        saveButton.innerHTML = 'Сохранить';

        L.DomEvent.on(cancelButton, 'click', this._onCancelButtonClick, this)
        L.DomEvent.on(saveButton, 'click', this._onSaveButtonClick, this)

        arrayDataInformationFromMarkers = inputField.innerHTML.split('<tr>\n');
        // console.log(arrayDataInformationFromMarkers)
        arrayDataInformationFromMarkers[2] = arrayDataInformationFromMarkers[2].replace('<td>Идентификатор</td>\n', '')
        arrayDataInformationFromMarkers[3] = arrayDataInformationFromMarkers[3].replace('<td>Тип экологической проблемы</td>\n', '')
        arrayDataInformationFromMarkers[4] = arrayDataInformationFromMarkers[4].replace('<td>Описание</td>\n', '')
        arrayDataInformationFromMarkers[5] = arrayDataInformationFromMarkers[5].replace('<td>Дата публикации</td>\n', '')
        arrayDataInformationFromMarkers[6] = arrayDataInformationFromMarkers[6].replace('<td>Лайки</td>\n', '')
        arrayDataInformationFromMarkers[7] = arrayDataInformationFromMarkers[7].replace('<td>Дизлайки</td>\n', '')
        arrayDataInformationFromMarkers[8] = arrayDataInformationFromMarkers[8].replace('<td>Долгота</td>\n', '')
        arrayDataInformationFromMarkers[9] = arrayDataInformationFromMarkers[9].replace('<td>Широта</td>\n', '')

        arrayDataInformationFromMarkers[2] = arrayDataInformationFromMarkers[2].replace('<td>', '')
        arrayDataInformationFromMarkers[3] = arrayDataInformationFromMarkers[3].replace('<td>', '')
        arrayDataInformationFromMarkers[4] = arrayDataInformationFromMarkers[4].replace('<td>', '')
        arrayDataInformationFromMarkers[5] = arrayDataInformationFromMarkers[5].replace('<td>', '')
        arrayDataInformationFromMarkers[6] = arrayDataInformationFromMarkers[6].replace('<td>', '')
        arrayDataInformationFromMarkers[7] = arrayDataInformationFromMarkers[7].replace('<td>', '')
        arrayDataInformationFromMarkers[8] = arrayDataInformationFromMarkers[8].replace('<td>', '')
        arrayDataInformationFromMarkers[9] = arrayDataInformationFromMarkers[9].replace('<td>', '')


        arrayDataInformationFromMarkers[2] = arrayDataInformationFromMarkers[2].replace('</td>\n</tr>\n', '')
        arrayDataInformationFromMarkers[3] = arrayDataInformationFromMarkers[3].replace('</td>\n</tr>\n', '')
        arrayDataInformationFromMarkers[4] = arrayDataInformationFromMarkers[4].replace('</td>\n</tr>\n', '')
        arrayDataInformationFromMarkers[5] = arrayDataInformationFromMarkers[5].replace('</td>\n</tr>\n', '')
        arrayDataInformationFromMarkers[6] = arrayDataInformationFromMarkers[6].replace('</td>\n</tr>\n', '')
        arrayDataInformationFromMarkers[7] = arrayDataInformationFromMarkers[7].replace('</td>\n</tr>\n', '')
        arrayDataInformationFromMarkers[8] = arrayDataInformationFromMarkers[8].replace('</td>\n</tr>\n', '')
        arrayDataInformationFromMarkers[9] = arrayDataInformationFromMarkers[9].replace('</td>\n</tr>\n', '')

        arrayDataInformationFromMarkers[9] = arrayDataInformationFromMarkers[9].replace('</tbody></table>', '')


        // создаём модальное окно
        var modal = $modal({ 
            footerButtons: [
                { class: 'btn__like', text: 'Лайк', handler: 'modalHandlerLike' },
                { class: 'btn__dislike', text: 'Дизлайк', handler: 'modalHandlerDislike' },
                { class: 'btn__edit', text: 'Редактировать маркер', handler: 'modalHandlerEdit' },
                { class: 'fill', text: 'ОК', handler: 'modalHandlerOk' }
                // {class: 'hearth'}
            ]
        });
        modal.setTitle('Описание маркера');
        modal.setContent('<label for="author">Кто добавил метку</label>\n' + 'ПОка нет, но вы держитесь <br>' +
        '<label for="dateOfPublication">Дата публикации</label>\n' + arrayDataInformationFromMarkers[3] + '<br>'+
        '<label for="typeOfEnvironmentalProblem">Тип экологической проблемы</label>\n' + arrayDataInformationFromMarkers[4]+ '<br>'+
        '<label for="description">Описание</label>\n' + arrayDataInformationFromMarkers[5]+ '<br>'+
        '<label for="likeMarker">Лайки</label>\n' + arrayDataInformationFromMarkers[6]+ '<br>'+
        '<label for="dislikeMarker">Диздайки</label>'+arrayDataInformationFromMarkers[7]+'<br>'+
        '<label for="longitude">Долгота</label>'+arrayDataInformationFromMarkers[8]+'<br>'+
        '<label for="latitude">Широта</label>'+arrayDataInformationFromMarkers[9]+
        '<label class="like"> <input type="checkbox"/> <div class="hearth"/> </label>');
        // отобразим модальное окно
        modal.show();

        document.querySelector('.btn__edit').onclick = function(){
            var modal = $modal({ 
                footerButtons: [
                    { class: 'btn__cancel', text: 'Отмена', handler: 'modalHandlerCancel' },
                    { class: 'btn__save', text: 'Сохранить', handler: 'modalHandlerSave' }
                ]   
            });
            modal.setTitle('Редактирование маркера');
            modal.setContent(
                    '<label for="author">Кто добавил метку</label>\n' + 'ПОка нет, но вы держитесь <br>' +
                    '<label for="typeOfEnvironmentalProblem">Тип экологической проблемы</label>\n' + 
                    `<textarea name="textarea" id="typeOfEnvironmentalProblem">${arrayDataInformationFromMarkers[3]}</textarea><br>`+
                    '<label for="description">Описание</label>\n' + 
                    `<textarea name="textarea" id="description">${arrayDataInformationFromMarkers[4]}</textarea><br>`+
                    `<label for="dateOfPublication">Дата публикации</label> `+arrayDataInformationFromMarkers[5]+'<br>'+
                    // `<textarea>${arrayDataInformationFromMarkers[5]}</textarea><br>`+
                    '<label for="likeMarker">Лайки</label>\n' + arrayDataInformationFromMarkers[6]+'<br>'+
                    // `<input type="typeOfEnvironmentalProblemInput" value="${arrayDataInformationFromMarkers[6]}"><br>`+
                    '<label for="dislikeMarker">Диздайки</label>'+arrayDataInformationFromMarkers[7]+'<br>'+
                    '<label for="longitude">Долгота</label>\n' + arrayDataInformationFromMarkers[8]+'<br>'+
                    '<label for="latitude">Широта</label>\n' + arrayDataInformationFromMarkers[9]+'<br>'
                    // `<input type="typeOfEnvironmentalProblemInput" value="${arrayDataInformationFromMarkers[7]}"><br>`
            );            
            // отобразим модальное окно
            modal.show();
            // функция для гибкости полей для ввода текста
            function fixTextareaSize(textarea) {
                textarea.style.height = 'auto'
                textarea.style.height = textarea.scrollHeight + 2 + "px"
            }
              
            ~function () {
            var textarea = document.querySelector('textarea')
            textarea.addEventListener('input', function (e) { fixTextareaSize(e.target) })
            fixTextareaSize(textarea)
            }()

            document.querySelector('.btn__save').onclick = function(){
                alert(document.getElementById("typeOfEnvironmentalProblem").value)
                const obj = {
                    typeOfEnvironmentalProblem: arrayDataInformationFromMarkers[3],
                    description: arrayDataInformationFromMarkers[4],
                    dateOfPublication: arrayDataInformationFromMarkers[5],
                    likeMarker: Number(arrayDataInformationFromMarkers[6]),
                    dislikeMarker: Number(arrayDataInformationFromMarkers[7]),
                    longitude: Number(arrayDataInformationFromMarkers[8]),
                    latitude: Number(arrayDataInformationFromMarkers[9])
                };
                
                fetch(`${messageApi}/${Number(arrayDataInformationFromMarkers[2])}`,{
                    method:'put',
                    headers:{
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(obj),
                })
                .catch((err)=> {
                    console.error('Пацан ошибку исправь немедленно. Подсказка ->',err)
                });

                            console.log('obj',JSON.stringify(obj))
            };

          };


        this.update();
        L.DomEvent.stop(e);
    },
    _onCancelButtonClick: function (e) {
        L.DomUtil.remove(this._editScreen);
        this._contentNode.style.display = "block";
        this._userActionButtons.style.display = "flex";

        this.update();
        L.DomEvent.stop(e);
    },

    _onSaveButtonClick: function (e) {
        var inputField = this._inputField;
        if (inputField.innerHTML.length > 0){
            // arrayDataInformationFromMarkers = inputField.innerHTML.split('<tr>\n');
            // console.log(arrayDataInformationFromMarkers)
            // arrayDataInformationFromMarkers[2] = arrayDataInformationFromMarkers[2].replace('<td>Идентификатор</td>\n', '')
            // arrayDataInformationFromMarkers[3] = arrayDataInformationFromMarkers[3].replace('<td>Тип экологической проблемы</td>\n', '')
            // arrayDataInformationFromMarkers[4] = arrayDataInformationFromMarkers[4].replace('<td>Описание</td>\n', '')
            // arrayDataInformationFromMarkers[5] = arrayDataInformationFromMarkers[5].replace('<td>Дата публикации</td>\n', '')
            // arrayDataInformationFromMarkers[6] = arrayDataInformationFromMarkers[6].replace('<td>Лайки</td>\n', '')
            // arrayDataInformationFromMarkers[7] = arrayDataInformationFromMarkers[7].replace('<td>Дизлайки</td>\n', '')

            // arrayDataInformationFromMarkers[2] = arrayDataInformationFromMarkers[2].replace('<td>', '')
            // arrayDataInformationFromMarkers[3] = arrayDataInformationFromMarkers[3].replace('<td>', '')
            // arrayDataInformationFromMarkers[4] = arrayDataInformationFromMarkers[4].replace('<td>', '')
            // arrayDataInformationFromMarkers[5] = arrayDataInformationFromMarkers[5].replace('<td>', '')
            // arrayDataInformationFromMarkers[6] = arrayDataInformationFromMarkers[6].replace('<td>', '')
            // arrayDataInformationFromMarkers[7] = arrayDataInformationFromMarkers[7].replace('<td>', '')


            // arrayDataInformationFromMarkers[2] = arrayDataInformationFromMarkers[2].replace('</td>\n</tr>\n', '')
            // arrayDataInformationFromMarkers[3] = arrayDataInformationFromMarkers[3].replace('</td>\n</tr>\n', '')
            // arrayDataInformationFromMarkers[4] = arrayDataInformationFromMarkers[4].replace('</td>\n</tr>\n', '')
            // arrayDataInformationFromMarkers[5] = arrayDataInformationFromMarkers[5].replace('</td>\n</tr>\n', '')
            // arrayDataInformationFromMarkers[6] = arrayDataInformationFromMarkers[6].replace('</td>\n</tr>\n', '')
            // arrayDataInformationFromMarkers[7] = arrayDataInformationFromMarkers[7].replace('</td>\n</tr>\n', '')

            // arrayDataInformationFromMarkers[7] = arrayDataInformationFromMarkers[7].replace('</tbody></table>', '')

            // console.log('obj',obj)
            this.setContent(inputField.innerHTML)
        } else {
            alert('Введите что-нибудь');
        };

        L.DomUtil.remove(this._editScreen);
        this._contentNode.style.display = "block";
        this._userActionButtons.style.display = "flex";

        this.update();
        L.DomEvent.stop(e);

        //  ---------------------End my additions --------------------------------------- //


    }
})