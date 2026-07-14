(() => {
  const fallbackLocations = {
    Kalisz: [51.7611, 18.0910],
    Krotoszyn: [51.6952, 17.4374],
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function geocodeAddress(address) {
    const endpoint = new URL('https://nominatim.openstreetmap.org/search');
    endpoint.searchParams.set('format', 'jsonv2');
    endpoint.searchParams.set('limit', '1');
    endpoint.searchParams.set('countrycodes', 'pl');
    endpoint.searchParams.set('q', address);

    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'pl',
      },
    });

    if (!response.ok) throw new Error(`Geocoding failed: ${response.status}`);
    const results = await response.json();
    if (!Array.isArray(results) || !results.length) return null;

    const lat = Number(results[0].lat);
    const lon = Number(results[0].lon);
    return Number.isFinite(lat) && Number.isFinite(lon) ? [lat, lon] : null;
  }

  function createFallback(wrapper, directionsUrl) {
    wrapper.innerHTML = '';
    const fallback = document.createElement('div');
    fallback.className = 'leaflet-map-fallback';
    fallback.innerHTML = `
      <strong>Mapa jest chwilowo niedostępna.</strong>
      <a href="${directionsUrl}" target="_blank" rel="noreferrer">Otwórz lokalizację w Google Maps ↗</a>
    `;
    wrapper.appendChild(fallback);
  }

  async function initializeMap(card, index) {
    const wrapper = card.querySelector('.map-card__map');
    const iframe = wrapper?.querySelector('iframe');
    const city = card.querySelector('h3')?.textContent?.trim();
    const addressNode = card.querySelector('.map-card__meta > span');
    const directionsUrl = card.querySelector('header > a')?.href || '#';

    if (!wrapper || !city || !addressNode || !window.L) return;

    const fallback = fallbackLocations[city] || [52.0692, 19.4803];
    const address = addressNode.textContent.replace(/\s+/g, ' ').trim();

    iframe?.remove();
    wrapper.innerHTML = '';

    const mapNode = document.createElement('div');
    mapNode.className = 'leaflet-map';
    mapNode.setAttribute('role', 'application');
    mapNode.setAttribute('aria-label', `Interaktywna mapa biura Zimmermann ${city}`);
    wrapper.appendChild(mapNode);

    let map;
    let marker;

    try {
      map = window.L.map(mapNode, {
        center: fallback,
        zoom: 15,
        scrollWheelZoom: false,
        tap: true,
        zoomControl: true,
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      marker = window.L.circleMarker(fallback, {
        radius: 9,
        color: '#ffffff',
        weight: 3,
        fillColor: '#dc2430',
        fillOpacity: 1,
      }).addTo(map);

      marker.bindPopup(`<strong>Zimmermann — ${city}</strong><br>${address}`).openPopup();
      setTimeout(() => map.invalidateSize(), 150);
      setTimeout(() => map.invalidateSize(), 700);
    } catch (error) {
      console.warn('Nie udało się uruchomić mapy:', error);
      createFallback(wrapper, directionsUrl);
      return;
    }

    try {
      await wait(index * 1100);
      const preciseLocation = await geocodeAddress(address);

      if (preciseLocation && map && marker) {
        marker.setLatLng(preciseLocation);
        map.setView(preciseLocation, 17, { animate: true });
      }
    } catch (error) {
      console.info('Dokładne położenie adresu nie zostało pobrane. Pozostawiono mapę miasta.', error);
    }
  }

  function bootMaps() {
    const cards = [...document.querySelectorAll('.map-card')];
    if (!cards.length) return;

    if (!window.L) {
      let attempts = 0;
      const timer = setInterval(() => {
        attempts += 1;
        if (window.L) {
          clearInterval(timer);
          cards.forEach(initializeMap);
        } else if (attempts >= 40) {
          clearInterval(timer);
          cards.forEach((card) => {
            const wrapper = card.querySelector('.map-card__map');
            const directionsUrl = card.querySelector('header > a')?.href || '#';
            if (wrapper) createFallback(wrapper, directionsUrl);
          });
        }
      }, 125);
      return;
    }

    cards.forEach(initializeMap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootMaps, { once: true });
  } else {
    bootMaps();
  }
})();
