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