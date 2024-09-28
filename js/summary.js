let totalCalorias = 0, totalProteinas = 0, totalCarbohidratos = 0, totalGrasas = 0; // Variables globales

fetch('http://localhost:3000/comidas')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor: ' + response.statusText);
    }
    return response.json();
  })
  .then(comidas => {
    const comidasPorTipo = {
      desayuno: [],
      almuerzo: [],
      merienda: [],
      cena: [],
      comidaExtra: [] // Usamos comidaExtra para JSON
    };

    comidas.forEach(comida => {
      totalCalorias += parseFloat(comida.calorias) || 0;
      totalProteinas += parseFloat(comida.proteinas) || 0;
      totalCarbohidratos += parseFloat(comida.carbs) || 0;
      totalGrasas += parseFloat(comida.grasas) || 0;

      const tipoComida = comida.meal.toLowerCase().replace(/\s+/g, ''); // Remover espacios
      if (comidasPorTipo.hasOwnProperty(tipoComida)) {
        comidasPorTipo[tipoComida].push(comida);
      } else {
        console.warn(`El tipo de comida '${tipoComida}' no está definido.`);
      }
    });

    // Mostrar los totales
    document.getElementById('totalCalorias').textContent = totalCalorias.toFixed(2);
    document.getElementById('totalProteinas').textContent = totalProteinas.toFixed(2);
    document.getElementById('totalCarbohidratos').textContent = totalCarbohidratos.toFixed(2);
    document.getElementById('totalGrasas').textContent = totalGrasas.toFixed(2);

    // Crear una sección para mostrar las comidas de cada tipo
    const tiposComida = ['desayuno', 'almuerzo', 'merienda', 'cena'];
    tiposComida.forEach(tipo => {
      const contenedor = document.getElementById(`${tipo}Comidas`);
      contenedor.innerHTML = `<h3>${tipo.charAt(0).toUpperCase() + tipo.slice(1)}:</h3>`;
      comidasPorTipo[tipo].forEach(comida => {
        contenedor.innerHTML += `
          <div class="comida-item" style="border: 1px solid #ccc; padding: 10px; margin: 5px 0;">
            <strong>${comida.descripcion}</strong>: ${comida.calorias} kcal, ${comida.proteinas} g, ${comida.carbs} g, ${comida.grasas} g
            <button class="eliminarBtn" data-id="${comida.id}">Eliminar</button>
          </div>
        `;
      });
    });

    // Agregar la funcionalidad de eliminar
    document.querySelectorAll('.eliminarBtn').forEach(button => {
      button.addEventListener('click', (e) => {
        const comidaId = e.target.getAttribute('data-id');
        eliminarComida(comidaId);
      });
    });

    // Llamar a la función para actualizar el gráfico
    actualizarGrafico(totalCalorias, totalProteinas, totalCarbohidratos, totalGrasas);
  })
  .catch(error => console.error('Error:', error));

function eliminarComida(id) {
  fetch(`http://localhost:3000/comidas/${id}`, {
    method: 'DELETE',
  })
  .then(() => {
    // Recargar el resumen después de eliminar la comida
    location.reload();
  })
  .catch(error => console.error('Error al eliminar la comida:', error));
}

let myChart; // Declare myChart variable outside of the function

function actualizarGrafico(proteinas, carbohidratos, grasas) {
  const ctx = document.getElementById('macrosChart').getContext('2d');

  // Remove previous chart if it exists
  if (myChart) {
    myChart.destroy();
  }
  
  const data = {
    labels: ['Proteínas', 'Carbohidratos', 'Grasas'],
    datasets: [{
      label: 'Macros',
      data: [proteinas, carbohidratos, grasas],
      backgroundColor: [
        'rgba(14, 12, 5, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribución de Macronutrientes',
      },
    },
  };

  // Create the chart
  myChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: options,
  });
}

// Manejar el evento de clic para volver al índice
document.getElementById('volverBtn').addEventListener('click', () => {
  window.location.href = 'index.html'; // Cambia esto según la ubicación de tu archivo index.html
});

// Función para calcular las calorías totales basadas en los macronutrientes
function calcularCaloriasTotales() {
  const proteinasMeta = parseFloat(document.getElementById('proteinasMeta').value) || 0;
  const carbsMeta = parseFloat(document.getElementById('carbsMeta').value) || 0;
  const grasasMeta = parseFloat(document.getElementById('grasasMeta').value) || 0;

  // Calcular el total de calorías (1g de proteínas y carbohidratos = 4 kcal, 1g de grasas = 9 kcal)
  const totalCalorias = (proteinasMeta * 4) + (carbsMeta * 4) + (grasasMeta * 9);
  
  // Mostrar el total de calorías calculadas en el campo correspondiente
  document.getElementById('totalCaloriasMeta').textContent = `Total Calorías: ${totalCalorias.toFixed(2)} kcal`;
}

// Manejar el evento de entrada para calcular las calorías cada vez que cambien los valores de los macros
document.getElementById('proteinasMeta').addEventListener('input', calcularCaloriasTotales);
document.getElementById('carbsMeta').addEventListener('input', calcularCaloriasTotales);
document.getElementById('grasasMeta').addEventListener('input', calcularCaloriasTotales);




