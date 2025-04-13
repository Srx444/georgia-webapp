const params = new URLSearchParams(window.location.search);
const userId = params.get('userId');

fetch(`/api/get-route/${userId}`)
  .then(response => response.json())
  .then(data => {
    const itineraryData = data || {};

    document.getElementById('city').textContent = `Ваш маршрут по ${itineraryData.city || 'Батуми'}`;

    const carouselInner = document.getElementById('carousel-inner');
    const photos = itineraryData.photos || ['https://source.unsplash.com/1600x400/?Batumi'];
    photos.forEach((photo, index) => {
      carouselInner.innerHTML += `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <img src="${photo}" class="d-block w-100" alt="Город">
        </div>
      `;
    });

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
                <a href="https://maps.google.com/?q=${a.lat},${a.lon}" target="_blank" class="btn btn-primary mb-3">Открыть на карте</a>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    });

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

window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();
window.Telegram.WebApp.MainButton.hide();
