import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

function createCountryList(countries) {
  const endpoint = countries
    .map(country => {
      return `<li class = country-list__item>
      <img src="${country.flags.svg}" alt="${country.name.common} flag" width=20 height=20/>
      <p class = country-list__input>Name: ${country.name.common}</p>
      </li>`;
    })
    .join('');
  return (countryList.innerHTML = endpoint);
}

function createCountryCard(countries) {
  const card = countries
    .map(country => {
      return `
    <p class = country-info__input>Name: ${country.name.common}</p>
    <p class = country-info__input>Capital: ${country.capital}</p>
    <p class = country-info__input>Population: ${country.population}</p>
    <img src="${country.flags.svg}" alt="flag of ${
        country.name.common
      }" height = 30 width = 30>
    <p class = country-info__input>Languages: ${Object.values(
      country.languages
    )}</p>`;
    })
    .join('');
  return (countryInfo.innerHTML = card);
}

searchBox.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry() {
  const trimInput = searchBox.value.trim();
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';

  fetchCountries(trimInput)
    .then(countries => {
      console.log(countries);
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        createCountryList(countries);
      } else {
        createCountryCard(countries);
      }
    })
    .catch(err => {
      Notiflix.Notify.failure('DAMN, boy, there is no country with that name');
    });
}
