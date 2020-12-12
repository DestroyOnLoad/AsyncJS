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
    
        console.log(data);
    
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
    
        countriesContainer.style.opacity = 1;
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

const getCountryData = function(country) {
    fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(response => response.json())
    .then(data => {
        renderCountry(data[0])
        const neighbor = data[0].borders[0];

        if(!neighbor) return;

        return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbor}`);
        
    })
    .then(response => response.json())
    .then(data => renderCountry(data, 'neighbour'));
}

getCountryData('portugal');