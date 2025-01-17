const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");

function searchCondition() {
    const input = document.getElementById("searchText").value.toLowerCase();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = '';

    fetch("../travel_recommendation.json")
      .then(response => response.json())
      .then(data => {
        // Verificar si el input es una de las palabras clave
        if (['beach', 'temple', 'city'].includes(input)) {
          // Buscar las ciudades de la categoría correspondiente
          let results = [];
          if (input === 'beach') {
            results = data.beaches;
          } else if (input === 'temple') {
            results = data.temples;
          } else if (input === 'city') {
            results = data.countries.flatMap(country => country.cities);
          }

          // Mostrar los resultados encontrados
          if (results.length > 0) {
            results.forEach(place => {
              const card = document.createElement('div');
              card.className = 'result-card';
              
              card.innerHTML = `
                <img src="${place.imageUrl}" alt="${place.name}" class="result-image">
                <div class="result-info">
                    <h2>${place.name}</h2>
                    <p>${place.description}</p>
                    <button class="visit-btn">Visit</button>
                </div>
              `;
              resultDiv.appendChild(card);
            });
          } else {
            resultDiv.innerHTML = 'No results found for this category.';
          }

        } else {
          // Buscar país o ciudades que coincidan con el input
          const place = data.countries.find(item => 
              item.name.toLowerCase() === input || // Coincidencia exacta con el nombre del país
              item.cities.some(city => city.name.toLowerCase().includes(input)) // Coincidencia con una ciudad
          );

          if (place) {
            // Mostrar todas las ciudades del país si el input es el nombre del país
            if (place.name.toLowerCase() === input) {
              place.cities.forEach(city => {
                const card = document.createElement('div');
                card.className = 'result-card';

                card.innerHTML = `
                    <img src="${city.imageUrl}" alt="${city.name}" class="result-image">
                    <div class="result-info">
                        <h2>${city.name}</h2>
                        <p>${city.description}</p>
                        <button class="visit-btn">Visit</button>
                    </div>
                  `;
                resultDiv.appendChild(card);
              });
            } else {
              // Mostrar la ciudad específica si el input coincide con una ciudad
              const city = place.cities.find(city => city.name.toLowerCase().includes(input));
              const card = document.createElement('div');
              card.className = 'result-card';
              
              card.innerHTML = `
                  <img src="${city.imageUrl}" alt="${city.name}" class="result-image">
                  <div class="result-info">
                      <h2>${city.name}</h2>
                      <p>${city.description}</p>
                      <button class="visit-btn">Visit</button>
                  </div>
              `;
              resultDiv.appendChild(card);
            }
          } else {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `<h2>Place not found.<h2>`;
            resultDiv.appendChild(card);
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
      });
}

function clearResults(){
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = '';
}

searchBtn.addEventListener("click", () => {
    searchCondition();
});

resetBtn.addEventListener("click", () => {
    clearResults();
})