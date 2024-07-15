document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'd647f7e0e46da5f75d469c4b98864fb4';
    const searchForm = document.getElementById('searchForm');
    const cityInput = document.getElementById('cityInput');
    const currentWeather = document.getElementById('currentWeather');
    const forecast = document.getElementById('forecast');
    const history = document.getElementById('history');

    const saveToHistory = (city) => {
        let history = JSON.parse(localStorage.getItem('history')) || [];
        if (!history.includes(city)) {
            history.push(city);
            localStorage.setItem('history', JSON.stringify(history));
            renderHistory();
        }
    };

    const renderHistory = () => {
        history.innerHTML = '';
        const historyItems = JSON.parse(localStorage.getItem('history')) || [];
        historyItems.forEach(city => {
            const button = document.createElement('button');
            button.textContent = city;
            button.classList.add('bg-gray-300', 'text-gray-700', 'px-4', 'py-2', 'rounded', 'hover:bg-gray-400');
            button.addEventListener('click', () => fetchWeather(city));
            history.appendChild(button);
        });
    };

    const fetchWeather = async (city) => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (data.cod !== '200') {
            alert('City not found');
            return;
        }

        const current = data.list[0];
        currentWeather.innerHTML = `
            <div class="p-4 bg-blue-100 rounded-lg">
                <h2 class="text-2xl font-bold">${data.city.name} (${new Date(current.dt * 1000).toLocaleDateString()})</h2>
                <p>Temperature: ${current.main.temp} °C</p>
                <p>Humidity: ${current.main.humidity} %</p>
                <p>Wind Speed: ${current.wind.speed} m/s</p>
                <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" alt="${current.weather[0].description}">
            </div>
        `;

        forecast.innerHTML = '';
        for (let i = 0; i < data.list.length; i += 8) {
            const day = data.list[i];
            forecast.innerHTML += `
                <div class="p-4 bg-gray-100 rounded-lg">
                    <h3 class="font-bold">${new Date(day.dt * 1000).toLocaleDateString()}</h3>
                    <p>Temp: ${day.main.temp} °C</p>
                    <p>Humidity: ${day.main.humidity} %</p>
                    <p>Wind Speed: ${day.wind.speed} m/s</p>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
                </div>
            `;
        }

        saveToHistory(city);
    };

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
            cityInput.value = '';
        }
    });

    renderHistory();
});
