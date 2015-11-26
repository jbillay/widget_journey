/**
 * Created by jeremy on 26/11/2015.
 */

var $ = require('jquery');
require('jquery-ui');

var widgetName = '#mrt_journey';

// Get parameters
var runId = $(widgetName).attr('run');
if (typeof runId === "undefined" ) {
    runId = 1;
}

var apiKey = $(widgetName).attr('run');
if (typeof apiKey === "undefined" ) {
    apiKey = '';
}

var jsonp_url = "http://localhost:9615/api/run/" + runId;
$.ajax({
    url: jsonp_url,
    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",
    // Work with the response
    success: function( response ) {
        console.log(response.name);
        var titleControl = document.createElement('h1');
        titleControl.text('Création d\'un trajet pour la course ' + response.name);
        $(widgetName).append(titleControl);
    }
});

// Init Google Map
// Define Gecoder
var geocoder = new google.maps.Geocoder();

// Create the search box
var controlSearchBox = document.createElement('input');
controlSearchBox.id = 'search_address';
controlSearchBox.size = '80';
controlSearchBox.type = 'text';

$(controlSearchBox).autocomplete({
    source: function (request, response) {

        if (geocoder == null) {
            geocoder = new google.maps.Geocoder();
        }

        geocoder.geocode({
            'address': request.term
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var searchLoc = results[0].geometry.location;
                var lat = results[0].geometry.location.lat();
                var lng = results[0].geometry.location.lng();
                var latlng = new google.maps.LatLng(lat, lng);
                var bounds = results[0].geometry.bounds;

                geocoder.geocode({
                    'latLng': latlng
                }, function (results1, status1) {
                    if (status1 == google.maps.GeocoderStatus.OK) {
                        if (results1[1]) {
                            response($.map(results1, function (loc) {
                                return {
                                    label: loc.formatted_address,
                                    value: loc.formatted_address,
                                    bounds: loc.geometry.bounds
                                }
                            }));
                        }
                    }
                });
            }
        });
    },
    select: function (event, ui) {
        alert('Location selected');
    }
});

$(widgetName).append(controlSearchBox);