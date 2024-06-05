const container = document.querySelector('.container');
const search = document.querySelector('.searchbox button');
const weatherBox = document.querySelector('.weatherbox');
const weather1 = document.querySelector('.weather1');
const weather2 = document.querySelector('.weather2');
const weather3 = document.querySelector('.weather3');
const error404 = document.querySelector('.notfound');

search.addEventListener('click', () => {
    const APIKey = 'f66fcbbd17f570522aa38a0499a64350';
    const city = document.querySelector('.searchbox input').value;



    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {

            if (json.cod == '404') {
                container.style.height = '480px';
                weatherBox.classList.remove('active')
                weather1.classList.remove('active')
                weather2.classList.remove('active')
                weather3.classList.remove('active')
                error404.classList.add('active')
                return;
            }

            container.style.height = '700px';
            weatherBox.classList.add('active')
            weather1.classList.add('active')
            weather2.classList.add('active')
            weather3.classList.add('active')
            error404.classList.remove('active')

            const date = weatherBox.querySelector('p');
            const image = document.querySelector('.weather img');
            const temperature = document.querySelector('.weatherbox .temp');
            const description = document.querySelector('.weatherbox .description');

            if (!json.weather || !json.weather[0]) {
                console.error("Weather data not found.");
                return;
            }

            switch (json.weather[0].main) {
                case 'Clouds':
                    image.src = 'Assets/cloud.png';
                    break;
                case 'Mist':
                    image.src = 'Assets/mist.png';
                    break;
                case 'Rain':
                    image.src = 'Assets/rain.png';
                    break;
                case 'Snow':
                    image.src = 'Assets/snow.png';
                    break;
                default:
                    image.src = 'Assets/clear.png';
                    break;
            }

            temperature.textContent = `${json.main.temp}°C`;
            description.textContent = json.weather[0].description;

            weatherBox.style.display = 'block';
            weatherDetail.style.display = 'block';
        })
        .catch(err => console.error('Error fetching weather data:', err));

    // Fetch 5-day forecast data
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if (!json.list || json.list.length === 0) {
                console.error("Forecast data not found.");
                return;
            }

            function updateWeatherBox(weatherBox, weatherData) {
                const image = weatherBox.querySelector('img');
                const temperature = weatherBox.querySelector('.temp');
                const date = weatherBox.querySelector('p');

                switch (weatherData.weather[0].main) {
                    case 'Clouds':
                        image.src = 'Assets/cloud.png';
                        break;
                    case 'Mist':
                        image.src = 'Assets/mist.png';
                        break;
                    case 'Rain':
                        image.src = 'Assets/rain.png';
                        break;
                    case 'Snow':
                        image.src = 'Assets/snow.png';
                        break;
                    default:
                        image.src = 'Assets/clear.png';
                        break;
                }

                temperature.textContent = `${weatherData.main.temp}°C`;
                const options = { weekday: 'long', month: 'long', day: 'numeric' };
                const dateTime = new Date(weatherData.dt_txt);
                date.textContent = dateTime.toLocaleDateString(undefined, options);
            }

            
            updateWeatherBox(weather1, json.list[8]); 
            updateWeatherBox(weather2, json.list[16]); 
            updateWeatherBox(weather3, json.list[24]);

            weatherContainer.style.display = 'flex';
        })
        .catch(err => console.error('Error fetching forecast data:', err));
});
