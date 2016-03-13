const locationInfo = window.location.search.split('=')[2].split('|');
const client = locationInfo[0];
const os = locationInfo[1];
const version = locationInfo[2];
const locale = locationInfo[3];

Office.initialize = () => {
    $('body').addClass(client.toLowerCase());
};

