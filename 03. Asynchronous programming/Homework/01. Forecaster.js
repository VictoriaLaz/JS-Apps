/**
 * Created by Vicky on 8/5/2017.
 */
function attachEvents() {
    const weatherSymbols = {
        Sunny: "&#x2600",
        'Partly sunny':	"&#x26C5",
        Overcast:"&#x2601",
        Rain:"&#x2614",
    };
    const degree = '&#176;';

    const url = 'https://judgetests.firebaseio.com/';
    $('#submit').click(getLocation);
    function getLocation() {
        $('#forecast').css('display', 'block');
        $.get(url + 'locations.json')
            .then(getWeather)
            .catch(displayError)
    }
    function getWeather(data) {
        let location = data.filter(d => d.name === $('#location').val());
        if(location.length === 0){
            displayError();
        } else {
            let locationCode = location[0].code;
            let getCurrent = $.get(`${url}forecast/today/${locationCode}.json`);
            let getThreeDay = $.get(`${url}forecast/upcoming/${locationCode}.json`);
            Promise.all([getCurrent, getThreeDay])
                .then(displayWeather)
                .catch(displayError)
        }
    }
    function displayWeather([current, threeDay]) {
        let currentWrapper = $('#current');
        let currentSymbol = $(`<span class="condition symbol">${weatherSymbols[current.forecast.condition]}</span>`);
        let currentCondition = $('<span></span>').addClass('condition');
        currentCondition.append($(`<span class="forecast-data">${current.name}</span>`));
        currentCondition.append($(`<span class="forecast-data">${current.forecast.low}${degree}/${current.forecast.high}${degree}</span>`));
        currentCondition.append($(`<span class="forecast-data">${current.forecast.condition}</span>`));
        currentWrapper.append(currentSymbol);
        currentWrapper.append(currentCondition);

        let upcomingWeather = $('#upcoming');
        for(let i = 0; i<=2; i++){
            let wrapSpan = $('<span class="upcoming"></span>');
            wrapSpan.append($(`<span class="symbol">${weatherSymbols[threeDay.forecast[i].condition]}</span>`));
            wrapSpan.append($(`<span class="forecast-data">${threeDay.forecast[i].low}${degree}/${threeDay.forecast[i].high}${degree}</span>`))
            wrapSpan.append($(`<span class="forecast-data">${threeDay.forecast[i].condition}</span>`))
            upcomingWeather.append(wrapSpan);
        }

    }
    function displayError() {
        $('#forecast').text('Error');
    }
}