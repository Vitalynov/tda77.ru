/*Main block*/
//@prepros-append ../_help_js/_scrolling.js
//@prepros-append ../_help_js/_animation-leftRight.js


/*-создаем карточки товара -*/
let products = {}; //ОБЪЕКТ - группы продуктов (трибуны, сиденья, кресла)

/*-конструктор карточек товара-*/
function createItems(link, product) {
    //создаем ОБЪЕК из файлов .json
    const getJson = async function () {
        /*-async function getJson() {-*/
        let response = await fetch(link);
        products = await response.json();
        //console.log(products);

        //конструктор карточек товара
        let card = " ";
        for (let key in products) {
            if (products[key].price === 0) {
                card +=
                    `<div class="${product}-content__item">
                        <span class="${product}-content__bg"></span>
                        <h3 class="${product}-content__titele titele-h3">${products[key].name}</h3>
                        <div class="${product}-content__item--img">
                            <img src="${products[key].image}" alt="${products[key].name}" />
                        </div>
                        <div class="${product}-content__item--btn btn js-btn" data-art="${key}">
                            Подробнее
                        </div>
                    </div>`;
            } else {
                card +=
                    `<div class="${product}-content__item">
                        <div class="${product}-content__sign">
                            <div class="${product}-content__wrapper">
                                <svg class="${product}-content__free-sign">
                                    <use xlink:href="img/svg/sprite.svg#free" />
                                </svg>
                                <p class="${product}-content__price"><span>от</span> ${products[key].price}<span> руб./м.</span></p>
                            </div>
                        </div>
                        <span class="${product}-content__bg"></span>
                        <h3 class="${product}-content__titele titele-h3">${products[key].name}</h3>
                        <div class="${product}-content__item--img">
                            <img src="${products[key].image}" alt="${products[key].name}" />
                        </div>
                        <div class="${product}-content__item--btn btn js-btn" data-art="${key}">
                            Подробнее
                        </div>
                    </div>`;
            }

        }
        document.querySelector(`.${product}-content`).innerHTML = card;
    };
    getJson();
}

/*Работа с модальными окнами ТОВАРОВ*/

function modalsProduct(classProduct) {
    const paddScr = window.innerWidth - document.querySelector('body').offsetWidth + 'px';
    let articul = "";

    /*Открытие модального окна по клику на кнопку товара*/
    document.querySelector(classProduct).addEventListener('click', function (e) {
        if (e.target.classList.contains('js-btn')) {
            articul = e.target.getAttribute('data-art');

            const openModal = document.querySelector(`.modal-${articul}`),
                closeModal = document.querySelector(`.clouse-${articul}`);

            openModal.style.display = 'block';
            openModal.classList.add('fadeIn');
            document.body.style.paddingRight = paddScr;
            document.body.style.overflow = 'hidden';

            /*Закрытие модального окна по клику на крестик*/
            closeModal.addEventListener('click', function () {
                openModal.style.display = 'none';
                openModal.classList.remove('fadeIn');
                document.body.style.paddingRight = '0px';
                document.body.style.overflow = '';
            });

            /*Закрытие модального окна по клику на подложку*/
            openModal.addEventListener('click', function (e) {
                if (e.target === openModal) {
                    openModal.style.display = 'none';
                    openModal.classList.remove('fadeIn');
                    document.body.style.paddingRight = '0px';
                    document.body.style.overflow = '';
                }
            });
        }
    });
}






/*Работа с модальными окнами ФОРМ ОБРАТНОЙ СВЯЗИ*/

function modals(trigerSelector, modalSelector, clouseSelector, clouseClickOverlay = true) {
    const openBtn = document.querySelectorAll(trigerSelector),
        openModal = document.querySelector(modalSelector),
        closeModal = document.querySelector(clouseSelector),
        windowsModal = document.querySelectorAll('[data-modal]'),
        windowsContent = document.querySelectorAll('[data-content]'),
        paddScr = window.innerWidth - document.querySelector('body').offsetWidth + 'px';

    /*Открытие модального окна по ссылке*/
    openBtn.forEach(function (item) {
        item.addEventListener('click', function (e) {
            if (e.target) {
                e.preventDefault();
            }
            windowsModal.forEach(function (item) {
                item.style.display = 'none';
            });
            // windowsContent.forEach(function (item) {
            //     item.classList.add('fadeInCalc');
            // });
            document.body.style.paddingRight = paddScr;
            openModal.style.display = 'block';
            document.body.style.overflow = 'hidden';


        });
    });

    /*Закрытие модального окна по клику на крестик*/
    closeModal.addEventListener('click', function () {
        windowsModal.forEach(function (item) {
            item.style.display = 'none';
        });
        windowsContent.forEach(function (item) {
            item.classList.remove('fadeInCalc');
        });
        document.body.style.paddingRight = '0px';
        openModal.style.display = 'none';
        document.body.style.overflow = '';

    });


    /*Закрытие модального окна по клику на подложку*/
    openModal.addEventListener('click', function (e) {
        if (e.target === openModal && clouseClickOverlay) {
            windowsModal.forEach(function (item) {
                item.style.display = 'none';
            });
            windowsContent.forEach(function (item) {
                item.classList.remove('fadeInCalc');
            });
            openModal.style.display = 'none';
            document.body.style.paddingRight = '0px';
            document.body.style.overflow = '';
        }
    });

}



/*Функция сбора характеристик трибун */
const changeModalState = function (state) {
    const windowTribune = document.querySelectorAll('.calc-radio'),
        windowRows = document.querySelectorAll('#rows'),
        windowSeats = document.querySelectorAll('#seats'),
        windowRaisin = document.querySelectorAll('#raisin'),
        windowAmount = document.querySelectorAll('#amount');

    checkNumInputs('#rows');
    checkNumInputs('#seats');
    checkNumInputs('#raisin');
    checkNumInputs('#amount');


    function bindActionToElems(event, elem, prop) {
        //state['Трибуна'] = "Без_навеса";
        elem.forEach(function (item, i) {
            item.addEventListener(event, function () {
                switch (item.nodeName) {
                    case 'SPAN':
                        state[prop] = i;
                        break;
                    case 'INPUT':
                        if (item.getAttribute('type') === 'radio') {

                            if (i === 0) {
                                state[prop] = "Без_навеса";
                            } else if (i === 1) {
                                state[prop] = "С_навесом";
                            } else if (i === 2) {
                                state[prop] = "Телескопическая";
                            } else {
                                state[prop] = "Мобильная";
                            }
                        } else {
                            state[prop] = item.value;
                        }
                        break;
                    case 'SELECT':
                        state[prop] = item.value;
                        break;
                }

                //console.log(state);
            });
        });
    }

    bindActionToElems('change', windowTribune, 'tribune');
    bindActionToElems('input', windowRows, 'rows');
    bindActionToElems('input', windowSeats, 'seats');
    bindActionToElems('input', windowRaisin, 'raisin');
    bindActionToElems('input', windowAmount, 'amount');

};







/*Функция контроля ввода только ЧИСЕЛ в поле INPUT*/
const checkNumInputs = function (selectorInput) {
    const numInputs = document.querySelectorAll(selectorInput);

    numInputs.forEach(function (item) {
        item.addEventListener('input', function () {
            item.value = item.value.replace(/\D/, '');
        });
    });
};

/*- Отправка данных формы обратной связи -*/
const form = function (selectorForm, selectorUrl, selectorModal, selectorBtn, state) {

    const forms = document.querySelectorAll(selectorForm),
        inputs = document.querySelectorAll('input'),
        text = document.querySelectorAll('textarea'),
        thankYou = document.querySelector('#js-thankYou'),
        modal = document.querySelector(selectorModal),
        email = document.querySelectorAll('input[name=email]'),
        company = document.querySelectorAll('input[name=company]'),
        textarea = document.querySelectorAll('textarea[name=text]');

    let statusContent = document.querySelector('.popupThankYou-content');


    checkNumInputs('input[name="phone"]');


    const message = {
        loading: 'Загрузка...',
        success: '<img src="/img/form/thanks.png" alt="Фото: Спасибо за заявку!">',
        failure: 'Что-то пошло не так. Попробуйте еше раз!'
    };

    const postData = async function (url, data) {
        thankYou.style = "display:block";
        statusContent.textContent = message.loading;
        let res = await fetch(url, {
            method: "POST",
            body: data
        });

        return await res.text();
    };

    const clearInputs = function () {
        inputs.forEach(function (item) {
            if (item.getAttribute('type') !== 'submit') {
                item.value = '';
            }
        });
        text.forEach(function (item) {
            item.value = '';
        });
    };


    const btnSubmit = document.querySelector(selectorBtn);
    btnSubmit.addEventListener('click', function () {
        if (selectorForm === '#calcForm') {
            company.forEach(function (item) {
                item.removeAttribute('required');
            });
            textarea.forEach(function (item) {
                item.removeAttribute('required');
            });
        } else {
            email.forEach(function (item) {
                item.removeAttribute('required');
            });
            textarea.forEach(function (item) {
                item.removeAttribute('required');
            });
        }

    });




    forms.forEach(function (item) {
        item.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(item);
            if (item.getAttribute('data-calc') === "end") {
                for (let key in state) {
                    formData.append(key, state[key]);
                }
            }
            postData(selectorUrl, formData)
                .then(function (res) {

                    statusContent.innerHTML = message.success;
                })
                .catch(function () {
                    statusContent.innerHTML = message.failure;
                })
                .finally(function () {
                    clearInputs();
                    company.forEach(function (item) {
                        item.setAttribute('required', '');
                    });
                    textarea.forEach(function (item) {
                        item.setAttribute('required', '');
                    });
                    email.forEach(function (item) {
                        item.setAttribute('required', '');
                    });

                    modal.style.display = 'none';

                    setTimeout(function () {
                        thankYou.style = "display:none";
                        document.body.style.paddingRight = '0px';
                        document.body.style.overflow = '';
                    }, 3000);

                });
        });
    });

};