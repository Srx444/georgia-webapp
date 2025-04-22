// Получение userId из URL
const params = new URLSearchParams(window.location.search);
const userId = params.get('userId');

// Запрос данных с сервера
fetch(`/api/save-route?userId=${userId}`)
  .then(response => response.json())
  .then(data => {
    const itineraryData = data || {};

    // Заголовок
    document.getElementById('city').textContent = `Ваш маршрут по ${itineraryData.city || 'Батуми'}`;

    // Слайдер
    const carouselInner = document.getElementById('carousel-inner');
    const photos = itineraryData.photos || ['https://images.pexels.com/photos/164631/pexels-photo-164631.jpeg'];
    photos.forEach((photo, index) => {
      carouselInner.innerHTML += `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <img src="${photo}" class="d-block w-100" alt="${itineraryData.city || 'Батуми'}">
        </div>
      `;
    });

    // Аккордеон
    const accordion = document.getElementById('itineraryAccordion');
    (itineraryData.itinerary || []).forEach((day, index) => {
      accordion.innerHTML += `
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#day${index}">
              День ${day.day}
            </button>
          </h2>
          <div id="day${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" data-bs-parent="#itineraryAccordion">
            <div class="accordion-body">
              ${day.activities.map(a => `
                <h5>${a.name}</h5>
                <p>${a.description}</p>
                <div class="mb-3">
                  <a href="https://maps.google.com/?q=${a.lat},${a.lon}" target="_blank" class="btn btn-outline-primary btn-sm me-2">
                    Открыть в Google Картах
                  </a>
                  <a href="https://yandex.com/maps/?ll=${a.lon},${a.lat}&z=16" target="_blank" class="btn btn-outline-secondary btn-sm">
                    Открыть в Яндекс Картах
                  </a>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    });

    // Карта
    ymaps.ready(() => {
      const map = new ymaps.Map('map', {
        center: [41.650, 41.639],
        zoom: 12
      });
      itineraryData.itinerary?.forEach(day => {
        day.activities.forEach(a => {
          const placemark = new ymaps.Placemark([a.lat, a.lon], {
            hintContent: a.name,
            balloonContent: `${a.name}<br>${a.description}`
          });
          map.geoObjects.add(placemark);
        });
      });
    });
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('city').textContent = 'Ошибка загрузки маршрута';
  });

// Telegram Web App
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();
window.Telegram.WebApp.MainButton.hide();
