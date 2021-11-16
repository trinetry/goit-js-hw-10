import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const BASE_URL = 'https://restcountries.com/v3.1';
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(showCountry, DEBOUNCE_DELAY));

function fetchCountries(name) {
    return fetch(`${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`)
      .then(response => {
       if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  });
  }
    
function showCountry() {
    fetchCountries(searchBox.value.trim())
     .then(country => {
      countryInfo.innerHTML = '';
      countryList.innerHTML = '';

         if (country.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name.');
         }
         else if (country.length >= 2 && country.length <= 10) {
            listCountry(country);
         }
         else if (country.length === 1) {
            infoCountry(country);
       
         }
        
     })
    .catch(showError);
}


function listCountry(country) {
  const markup = country
    .map(({ flags, name }) => {
        return `<li class="country-list"> 
      <img class="flag-list" src ="${flags.svg}" alt="Flag of ${name.common}"  width="50"/>
      <span class = "name-list">${name.common}</span></li>`;
    })
    .join('');
   countryList.innerHTML = markup;
}


function infoCountry([{ name, flags, capital, population, languages }]) {
    countryInfo.innerHTML = `<img src ="${flags.svg}" class="flags"  alt="Flag of ${name.official}" width="50"/>
         <span class="country-name">${name.official}</span>
       <p class = "info"> Capital: <span class = "info-span">${capital}</span></p>
       <p class = "info"> Population: <span class = "info-span">${population}</span></p>
       <p class = "info"> Languages: <span class = "info-span">${Object.values(languages)
        .join(', ')}
        </span></p>`;
   
 }

function showError(error) {
    Notify.failure('Oops, there is no country with that name')
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
}