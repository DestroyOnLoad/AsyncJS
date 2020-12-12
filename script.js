'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

///
//old way of making ajax calls and consuming promises
///


/* const getCountryData = function(country) {
const request = new XMLHttpRequest();
request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
request.send();

request.addEventListener('load', function(){
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    const html = `
    <article class="country">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)}</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        </div>
    </article>`;

    countriesContainer.insertAdjacentHTML('beforeend', html);

    countriesContainer.style.opacity = 1;
})
}

getCountryData('philippines');
getCountryData('united states of america'); */


///
//simulate async callback that can lead to callback hell
///

const renderCountry = function(data, className = '') {

        const html = `
        <article class="country ${className}">
            <img class="country__img" src="${data.flag}" />
            <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)}</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
            </div>
        </article>`;
    
        countriesContainer.insertAdjacentHTML('beforeend', html);

}

/*const getCountryDataAndNeighbor = function(country) {
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
    request.send();
    
    request.addEventListener('load', function(){
        const [data] = JSON.parse(this.responseText);

        //get country
        renderCountry(data);

        //get neighbor country
        const [neighbor] = data.borders;

        if(!neighbor) return;

        const request2 = new XMLHttpRequest();
        request2.open('GET', `https://restcountries.eu/rest/v2/alpha/${neighbor}`);
        request2.send();

        request2.addEventListener('load', function(){
            const data2 = JSON.parse(this.responseText);
            
            renderCountry(data2, 'neighbour');
        })

    })
}

getCountryDataAndNeighbor('germany'); */



///
//using promises to control flow of async callbacks
///


//const request = new XMLHttpRequest();
//request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);

//const request = fetch(`https://restcountries.eu/rest/v2/name/portugal`);

/* const getJson = function(url, errorMsg = 'Something went wrong.') {
    return fetch(url)
    .then(response => {
        if(!response.ok) throw new Error(`${errorMsg}`);

        return response.json();
    });
}

const getCountryData = function(country) {
    getJson(`https://restcountries.eu/rest/v2/name/${country}`, "Country not found.")
    .then(data => {
        renderCountry(data[0])
        const neighbor = data[0].borders[0];

        if(!neighbor) throw new Error("Country does not have bordering neighbor.");

        return getJson(`https://restcountries.eu/rest/v2/alpha/${neighbor}`, "Neighbor country not found.");
        
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => alert(err.message))
    .finally(() => countriesContainer.style.opacity = 1);
}

getCountryData('philippines'); */


///
//Using async and await from new versions of ES (JS).
//

const getPosition = function() {
    return new Promise( function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

const getLocation = async function(){
    try {const pos = await getPosition();
    const {latitude: lat, longitude: lng} = pos.coords;

    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    if(!resGeo.ok) throw new Error("Problem with getting country for location.")
    const dataGeo = await resGeo.json();

    const res = await fetch(`https://restcountries.eu/rest/v2/name/${dataGeo.prov}`);
    if(!res.ok) throw new Error("Problem getting data for country specified.");
    const data = await res.json();

    renderCountry(data[0]);} catch(err){
        console.error(err);
    } finally {
    countriesContainer.style.opacity = 1;
    }
};

getLocation();