 ymaps.ready(init);

 function init() {
     // Создание карты.    
     var myMap = new ymaps.Map("map", {
         // Координаты центра карты.
         // Порядок по умолчнию: «широта, долгота».
         // Чтобы не определять координаты центра карты вручную,
         // воспользуйтесь инструментом Определение координат.
         center: [56.146072, 40.397672],
         // Уровень масштабирования. Допустимые значения:
         // от 0 (весь мир) до 19.
         zoom: 15,
         controls: ['smallMapDefaultSet']
     });

     myMap.behaviors.disable('drag')
     myMap.behaviors.disable('scrollZoom')
     myMap.controls
         .remove('geolocationControl')
         .remove('searchControl')
         .remove('trafficControl')
         .remove('rulerControl');

     var myPin = new ymaps.GeoObjectCollection({}, {
         iconLayout: 'default#image',
         iconImageHref: 'img/ymap.png',
         iconImageSize: [80, 82],
         iconImageOffset: [-20, -65]
     });
     var myPlacemark1 = new ymaps.Placemark([56.146072, 40.397672], {
         // Хинт показывается при наведении мышкой на иконку метки.
         hintContent: '<span class="map__red">Трибуны</span>',
         // Балун откроется при клике по метке.
         balloonContentHeader: '<img src="img/logo.png" class="map__pic"/><span class="map__red">ТД Арена (ООО "Сервис-сварка 33")</span>',
         balloonContentBody: 'Производство трибун для зрителей, заборов, ограждений, навесов.',
         balloonContentFooter: 'г. Владимир, ул. Александра Матросова, дом 28б <br><strong>Отдел продаж:</strong><br> Телефон: <strong>8 800 200-61-96</strong>;E-mail: <strong>td.arena@mail.ru</strong>',


     });
     // После того как метка была создана, ее
     // можно добавить на карту.
     myPin.add(myPlacemark1);
     myMap.geoObjects.add(myPin);

 }