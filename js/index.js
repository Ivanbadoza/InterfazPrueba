document.getElementById('searchBtn').addEventListener('click', () => {
  const apiKey = 'H64SMxnmcqU2WaipkwlAQivmqJipn3ApUbMLkgIg';  // Sustituye con tu API Key
  const foodItem = document.getElementById('food').value;
  const cantidadGramos = parseFloat(document.getElementById('cantidad').value) || 100; // Cantidad en gramos
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodItem}&api_key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = ''; // Limpiar resultados anteriores

      // Mostrar hasta las 10 primeras opciones
      if (data.foods && data.foods.length > 0) {
        const topFoods = data.foods.slice(0, 10); // Limitar a las primeras 10 opciones
        topFoods.forEach(food => {
          const foodNutrients = food.foodNutrients || [];
          
          // Obtener los nutrientes deseados
          const calories = foodNutrients.find(nutrient => nutrient.nutrientName === 'Energy');
          const carbs = foodNutrients.find(nutrient => nutrient.nutrientName === 'Carbohydrate, by difference');
          const protein = foodNutrients.find(nutrient => nutrient.nutrientName === 'Protein');
          const fat = foodNutrients.find(nutrient => nutrient.nutrientName === 'Total lipid (fat)');

          // Calcular los macronutrientes según la cantidad ingresada
          const caloriasPorGramos = calories ? (calories.value * cantidadGramos / 100).toFixed(2) : 'N/A';
          const carbsPorGramos = carbs ? (carbs.value * cantidadGramos / 100).toFixed(2) : 'N/A';
          const proteinasPorGramos = protein ? (protein.value * cantidadGramos / 100).toFixed(2) : 'N/A';
          const grasasPorGramos = fat ? (fat.value * cantidadGramos / 100).toFixed(2) : 'N/A';

          // Crear un div para cada alimento con su información
          const foodDiv = document.createElement('div');
          foodDiv.classList.add('food-item');
          foodDiv.innerHTML = `
            <h3>${food.description}</h3>
            <p><strong>Calorías:</strong> ${caloriasPorGramos} kcal</p>
            <p><strong>Carbohidratos:</strong> ${carbsPorGramos} g</p>
            <p><strong>Proteínas:</strong> ${proteinasPorGramos} g</p>
            <p><strong>Grasas:</strong> ${grasasPorGramos} g</p>
            <button class="selectBtn">Seleccionar</button>
          `;

          // Agregar evento para el botón de seleccionar
          const selectBtn = foodDiv.querySelector('.selectBtn');
          selectBtn.addEventListener('click', () => {
            const mealType = document.getElementById('mealSelect').value;
            // Guardar la comida en el json-server (base de datos simulada)
            const comida = {
              descripcion: food.description,
              calorias: caloriasPorGramos,
              proteinas: proteinasPorGramos,
              carbs: carbsPorGramos,
              grasas: grasasPorGramos,
              meal: mealType
            };

            fetch('http://localhost:3000/comidas', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(comida)
            })
            .then(response => response.json())
            .then(() => {
              alert(`Alimento agregado a ${mealType}`);
            })
            .catch(error => {
              console.error('Error al agregar el alimento:', error);
            });
          });

          resultDiv.appendChild(foodDiv); // Agregar el div de cada comida al resultDiv
        });
      } else {
        resultDiv.innerHTML = `<p>No se encontró información para el alimento: ${foodItem}</p>`;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('result').innerHTML = '<p>Ocurrió un error al buscar el alimento.</p>';
    });
});


 // Evento para regresar al summary
 document.getElementById('verResumenBtn').addEventListener('click', () => {
  window.location.href = 'summary.html';
});