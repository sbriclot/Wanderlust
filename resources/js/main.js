// Foursquare API Info
const clientId = 'CMMEVGELBCIGWKFHSPIQ0VAPTHCJMIVZ5SRYHQDK2LU5GSPL';
const clientSecret = 'B3MWYVHPXKM4BCW4CN4GWFYN1GZZSZOIYCXOKIZLZ5WXOP4C';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';
const returnedVenues = 20;
const displayedVenues = 5;
let venueContent = "";

// OpenWeather Info
const openWeatherKey = 'c62124a2d7d63b3b6b8d1e3a88579a9a';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = $("#venues");
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Add AJAX functions here:
const getVenues = async () => {
  const city = $input.val();
  const d = new Date();
  var currDate = d.toISOString().slice(0,10).replace(/-/g,"");
  const urlToFetch = `${url}${city}&limit=${returnedVenues}&client_id=${clientId}&client_secret=${clientSecret}&v=${currDate}`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
      return venues;
    };
  } catch(error) {
    console.log(error);
  }
}

const getForecast = async () => {
  const urlToFetch = `${weatherUrl}?&q=${$input.val()}&APPID=${openWeatherKey}`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    };
  } catch(error) {
    console.log(error);
  }
}


// Render functions
const renderVenues = (venues) => {
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
  for (i = 0; i < displayedVenues; i++) {
    const randomVenue = Math.floor(Math.random() * (returnedVenues-i));
    const venue = venues[randomVenue];
    const venueIcon = venue.categories[0].icon;
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
    venueContent += createVenueHTML(venue.name, venue.location, venueImgSrc);
    venues.splice(randomVenue, 1);
  }
  $venueDivs.append(venueContent);
}

const renderForecast = (day) => {
  // Add your code here:
  console.log(day);
	let weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
  $venueDivs.empty();
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(venues => {
    renderVenues(venues);
  })
  getForecast().then(forecast => {
    renderForecast(forecast);
  })
  return false;
}

$submit.click(executeSearch)