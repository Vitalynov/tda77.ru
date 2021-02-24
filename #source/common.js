window.addEventListener('DOMContentLoaded', function () {
    'use strict';
    // const loadContent = document.querySelector('.wrapper');
    // loadContent.style = "opacity:1";

    /*- Создание карточек товаров при загрузке сайта-*/
    createItems('../tribunes.json', 'tribunes');
    createItems('../seats.json', 'seats');
    createItems('../armchairs.json', 'armchairs');

    /*- Работа с модальными окнами товаров при нажатии кнопки ПОДРОБНЕЕ -*/
    modalsProduct('.tribunes-content');
    modalsProduct('.seats-content');
    modalsProduct('.armchairs-content');

    scrolling();

    lineActive();

    let modalState = {}; // Объект для массива характеристик трибун.
    modals('.js-btnBaner', '.js-popupСhooseTribune', '.js-clouseСhooseTribune');
    modals('.js-btnTribune', '.js-popupInputData', '.js-clouseInputData', false);
    modals('.js-btnData', '.js-popupFormContacts', '.js-clouseContactForm', false);
    changeModalState(modalState);
    form('#calcForm', '../mailCalc.php', '.js-popupFormContacts', '.js-btnContact', modalState);
    form('#form', '../mail.php', '.js-popupFormContacts', '.js-btnCallBack', modalState);

});


/* Polyfill foreEach */
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

//@prepros-append header/header.js
//@prepros-append main/main.js
//@prepros-append footer/footer.js