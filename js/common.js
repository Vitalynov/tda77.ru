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

/*Header*/



/*Перенос блока*/
(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');

				const daPlace = daArray[1] ? daArray[1].trim() : 'last';

				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim());

				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов 
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя 
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) {
				return -1
			} else {
				return 1
			}
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) {
				return 1
			} else {
				return -1
			}
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// ## Примеры

// ```html
// <div data-da="content__column_garden" class="content__block">Я Коля</div>
// <div data-da="content__column_garden,2" class="content__block">Я Коля</div>
// <div data-da="content__column_garden,2,992" class="content__block">Я Коля</div>
// <div data-da="content__column_garden,2,992,min" class="content__block">Я Коля</div>
// ```
// e.x. data-da="item,2,992"


(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');

				const daPlace = daArray[1] ? daArray[1].trim() : 'last';

				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim());

				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов 
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя 
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) {
				return -1
			} else {
				return 1
			}
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) {
				return 1
			} else {
				return -1
			}
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());
/*Header*/
// Смена классов БУРГЕРА
const burger = function () {

    let burger = document.querySelector('.header-burger'),
        menu = document.querySelector('.header-menu'),
        links = document.querySelectorAll('.header-list__link'),
        body = document.querySelector('body');

    burger.addEventListener('click', function () {
        burger.classList.toggle('active');
        menu.classList.toggle('active');
        body.classList.toggle('lock');
    });

    //Закрытие Хедер с сылками по клику на ссылку 
    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            if (e.target) {
                e.preventDefault();
            }
            burger.classList.toggle('active');
            menu.classList.toggle('active');
            body.classList.toggle('lock');
        });
    });

};
burger();

//при скоулинге сайта header делается маленьким и прижимается к верху.

const scrollHeader = function () {
    let header = document.querySelector('.header-body');

    window.addEventListener('scroll', function () {
        if (window.scrollY || window.pageYOffset >= 5) {
            header.classList.add('block');
        } else {
            header.classList.remove('block');
        }
    });
};

scrollHeader();

//Окрашивание ссылок Link выбранного раздела
const lineActive = function () {
    let header = document.querySelector('.header-menu'),
        active = document.querySelectorAll('.header-list__link');

    function hideActive() {
        active.forEach(function (item) {
            item.classList.remove('activeNav');
        });
    }

    function showActive(i = 0) {
        active[i].classList.add('activeNav');
    }

    header.addEventListener('click', function (e) {
        const target = e.target;

        if (target && (target.classList.contains('header-list__link'))) {

            active.forEach(function (item, i) {
                if (target == item || target.parentNode == item) {
                    hideActive();
                    showActive(i);
                }
            });
        }
    });

    /*-Вешает активный элемент ссылки Link при скроулинге-*/
    //на все секции, куда ссылаются ссылки NAV BAR Link, устанавливаем класс: '.contentActiv'
    //пример: <section id="about" class="about contentActiv">

    let contents = document.querySelectorAll('.contentActiv');

    function scrollActiv() {
        contents.forEach(function (content, i) {
            let contentOfsetTop = content.offsetTop;
            if (window.scrollY >= contentOfsetTop + -20) {
                hideActive();
                showActive(i);
            }
        });
    }
    window.addEventListener('scroll', scrollActiv);

};
/*Main block*/


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
/*- Медленный скроулинг по документу-*/
const scrolling = () => {
    // Scrolling with raf

    let links = document.querySelectorAll('[href^="#"]'),
        speed = 0.3;

    links.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            let widthTop = document.documentElement.scrollTop,
                hash = this.hash,
                toBlock = document.querySelector(hash).getBoundingClientRect().top,
                start = null;

            requestAnimationFrame(step);

            function step(time) {
                if (start === null) {
                    start = time;
                }

                let progress = time - start,
                    r = (toBlock < 0 ? Math.max(widthTop - progress / speed, widthTop + toBlock) : Math.min(widthTop + progress / speed, widthTop + toBlock));

                document.documentElement.scrollTo(0, r);

                if (r != widthTop + toBlock) {
                    requestAnimationFrame(step);
                } else {
                    location.hash = hash;
                }
            }
        });
    });
};
/*-- Анимация элементов при скроулинге сайта--*/
$(function () {
    let windowHeigt = $(window).height(),
        windowScrollPosTop = $(window).scrollTop(),
        windowScrollPosBottom = windowHeigt + windowScrollPosTop;
    console.log(windowScrollPosBottom);
    /*Бокс анимации*/
    $.fn.revealOnScroll = function (direction) {

        return this.each(function () {

            let objectOffset = $(this).offset(),
                objectOffsetTop = objectOffset.top;
            //console.log(objectOffset);
            console.log(objectOffsetTop);

            if (!$(this).hasClass('hidden')) {
                if (direction == "right") {
                    $(this).css({
                        "opacity": 0,
                        "transform": "translateX(200px)",
                        "transition": '2s'
                    });
                } else if (direction == "left") {
                    $(this).css({
                        "opacity": 0,
                        "transform": "translateX(-200px)",
                        "transition": '2s'
                    });
                } else if (direction == "down") {
                    $(this).css({
                        "opacity": 0,
                        "transform": "translateY(-50px)",
                        "transition": '2s'
                    });
                } else if (direction == "up") {
                    $(this).css({
                        "opacity": 0,
                        "transform": "translateY(50px)",
                        "transition": '2s'
                    });
                } else {
                    $(this).css({
                        "opacity": 0,
                        "transition": "3s"
                    });
                }

                $(this).addClass('hidden');
            }

            if (!$(this).hasClass('animationComplit')) {
                if (windowScrollPosBottom > objectOffsetTop) {
                    if (direction == "appear") {
                        $(this).css({
                            "opacity": 1,
                        }, 2000).addClass('animationComplit');
                        setTimeout(() => {
                            $(this).css({
                                "transition": "0.5s"
                            }, 2000);
                        });

                    } else {
                        $(this).css({
                            "opacity": 1,
                            "transform": "translateX(0)"
                        }, 2000).addClass('animationComplit');
                        /*$(this).animate({"opacity" : 1, "right" : 0}, 2000).addClass('animationComplit');*/
                    }

                }
            }
        });
    };

    $(window).scroll(function () {
        windowHeigt = $(window).height();
        windowScrollPosTop = $(window).scrollTop();
        windowScrollPosBottom = windowHeigt + windowScrollPosTop;
        /*-- Применяются классы анимации ("left", "right", "down", "up", "appear")-*/
        $('.about-content__titele').revealOnScroll("right");
        $('.titele-h2').revealOnScroll("left");
        $('.footer-production').revealOnScroll("left");
        $('.footer-address').revealOnScroll("up");
        $('.footer-contacts').revealOnScroll("right");
        $('.text').revealOnScroll("appear");
        $('.tribunes-content__item').revealOnScroll("appear");
        $('.seats-content__item').revealOnScroll("appear");
        $('.armchairs-content__item').revealOnScroll("appear");
        $('.gallery-item').revealOnScroll("appear");
        $('.contacts-form').revealOnScroll("appear");
        $('.mymap').revealOnScroll("appear");
        $('.form').revealOnScroll("right");
    });

});
/*Footer*/
