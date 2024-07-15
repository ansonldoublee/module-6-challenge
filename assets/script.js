document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'd647f7e0e46da5f75d469c4b98864fb4';
    const searchForm = document.getElementById('searchForm');
    const cityInput = document.getElementById('cityInput');
    const currentWeather = document.getElementById('currentWeather');
    const forecastSection = document.getElementById('forecastSection');
    const forecast = document.getElementById('forecast');
    const noCityMessage = document.getElementById('noCityMessage');
    const history = document.getElementById('history');

    const weatherColors = {
        Clear: 'bg-yellow-200',
        Clouds: 'bg-gray-200',
        Rain: 'bg-blue-200',
        Drizzle: 'bg-blue-300',
        Thunderstorm: 'bg-purple-200',
        Snow: 'bg-white',
        Mist: 'bg-gray-300',
        Smoke: 'bg-gray-400',
        Haze: 'bg-gray-300',
        Dust: 'bg-yellow-300',
        Fog: 'bg-gray-400',
        Sand: 'bg-yellow-400',
        Ash: 'bg-gray-500',
        Squall: 'bg-blue-500',
        Tornado: 'bg-red-500'
    };

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
            const weatherCondition = day.weather[0].main;
            const bgColor = weatherColors[weatherCondition] || 'bg-gray-100'; // Default color if condition not found

            forecast.innerHTML += `
                <div class="p-4 ${bgColor} rounded-lg">
                    <h3 class="font-bold">${new Date(day.dt * 1000).toLocaleDateString()}</h3>
                    <p>Temp: ${day.main.temp} °C</p>
                    <p>Humidity: ${day.main.humidity} %</p>
                    <p>Wind Speed: ${day.wind.speed} m/s</p>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
                </div>
            `;
        }

        // Show the forecast section and hide the no city message
        forecastSection.classList.remove('hidden');
        noCityMessage.classList.add('hidden');

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

