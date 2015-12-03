/**
 * Created by jeremy on 26/11/2015.
 */


var $ = require('jquery');
require('jquery-ui');

var mrtWidgetName = '#mrt_journey';

// Get parameters
var mrtRunId = $(mrtWidgetName).attr('run');
if (typeof mrtRunId === "undefined" ) {
    runId = 1;
}

var mrtApiKey = $(mrtWidgetName).attr('run');
if (typeof mrtApiKey === "undefined" ) {
    mrtApiKey = '';
}

var mrtRunUrl = "http://localhost:9615/api/run/" + mrtRunId;
$.ajax({
    url: mrtRunUrl,
    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",
    // Work with the response
    success: function( response ) {
        // Define var for distance calculation
        var mrtDestinationPoint = response.address_start;
        var mrtStartPoint = '';

        var mrtGlobalFormDiv = $('<div id="mrtForm">');

        var mrtTitleDiv = $('<div id="mrtTitleForm">');

        var mrtTitleControl = $('<h3>').append('Création d\'un trajet pour la course ' + response.name);
        mrtTitleDiv.append(mrtTitleControl);

        mrtGlobalFormDiv.append(mrtTitleDiv);

        // Init Google Map
        // Define Gecoder
        var geocoder = new google.maps.Geocoder();

        // Div for search destination
        var mrtDestinationDiv = $('<div id="mrtDestinationForm">');

        // Create the search box
        var controlSearchBox = document.createElement('input');
        controlSearchBox.id = 'search_address';
        controlSearchBox.size = '80';
        controlSearchBox.type = 'text';
        controlSearchBox.placeholder = 'Lieu de départ';
        mrtDestinationDiv.append(controlSearchBox);

        mrtGlobalFormDiv.append(mrtDestinationDiv);

        // create read-only inputs for distance and duration display
        var mrtJourneyInfoDiv = $('<div id="mrtJourneyInfoForm">');

        var mrtDistanceControl = document.createElement('input');
        mrtDistanceControl.placeholder = 'Distance estimée';
        mrtDistanceControl.id = 'mrtDistanceCtrl';
        mrtDistanceControl.readOnly = true;
        var mrtDurationControl = document.createElement('input');
        mrtDurationControl.placeholder = 'Durée estimée';
        mrtDurationControl.id = 'mrtDurationCtrl';
        mrtDurationControl.readOnly = true;
        mrtJourneyInfoDiv.append(mrtDistanceControl);
        mrtJourneyInfoDiv.append(mrtDurationControl);

        mrtGlobalFormDiv.append(mrtJourneyInfoDiv);

        // create select to define type of journey
        var mrtJourneyTypeDiv = $('<div id="mrtJourneyTypeForm">');

        var arr = [
            {val : 'aller-retour', text: 'Aller-Retour'},
            {val : 'aller', text: 'Aller'},
            {val : 'retour', text: 'Retour'}
        ];

        var mrtTypeJourneyControl = $('<select id="mrtTypeJourneyCtrl">').appendTo(mrtJourneyTypeDiv);
        $(arr).each(function() {
            mrtTypeJourneyControl.append($("<option>").attr('value',this.val).text(this.text));
        });

        mrtGlobalFormDiv.append(mrtJourneyTypeDiv);

        // create div for outward
        var mrtOutwardFormDiv = $('<div id="mrtOutwardForm">');

        // add label for outward
        var mrtLabelOutwardControl = $('<p>').append('Aller');
        mrtOutwardFormDiv.append(mrtLabelOutwardControl);

        // add input for date outward
        var mrtDateOutwardControl = $('<input type="text" id="mrtDateOutward" placeholder="Date">');
        mrtOutwardFormDiv.append(mrtDateOutwardControl);

        // add input for time outward
        var mrtTimeOutwardControl = $('<input type="text" id="mrtTimeOutward" placeholder="Heure">');
        mrtOutwardFormDiv.append(mrtTimeOutwardControl);

        // add input for space outward
        var mrtSpaceOutwardControl = $('<input type="number" id="mrtSpaceOutward" placeholder="Nombre de place">');
        mrtOutwardFormDiv.append(mrtSpaceOutwardControl);

        mrtOutwardFormDiv.appendTo(mrtGlobalFormDiv);

        // create div for return
        var mrtReturnFormDiv = $('<div id="mrtReturnForm">');

        // add label for outward
        var mrtLabelReturnControl = $('<p>').append('Retour');
        mrtReturnFormDiv.append(mrtLabelReturnControl);

        // add input for date outward
        var mrtDateReturnControl = $('<input type="text" id="mrtDateReturn" placeholder="Date">');
        mrtReturnFormDiv.append(mrtDateReturnControl);

        // add input for time outward
        var mrtTimeReturnControl = $('<input type="text" id="mrtTimeReturn" placeholder="Heure">');
        mrtReturnFormDiv.append(mrtTimeReturnControl);

        // add input for space outward
        var mrtSpaceReturnControl = $('<input type="number" id="mrtSpaceReturn" placeholder="Nombre de place">');
        mrtReturnFormDiv.append(mrtSpaceReturnControl);

        mrtReturnFormDiv.appendTo(mrtGlobalFormDiv);

        // create div for auto / price info
        var mrtPriceFormDiv = $('<div id="mrtPriceForm">');

        var arrCar = [
            {val : 'citadine', text: 'Citadine'},
            {val : 'berline', text: 'Berline'},
            {val : 'break', text: 'Break'},
            {val : 'monospace', text: 'Monospace'},
            {val : 'suv', text: '4x4, SUV'},
            {val : 'coupe', text: 'Coupé'},
            {val : 'cabriolet', text: 'Cabriolet'}
        ];

        var mrtTypeCarControl = $('<select id="mrtTypeCarCtrl">').appendTo(mrtPriceFormDiv);
        $(arrCar).each(function() {
            mrtTypeCarControl.append($("<option>").attr('value',this.val).text(this.text));
        });

        var mrtPriceControl = $('<input type="number" id="mrtAmount" placeholder="Montant par place">');
        mrtPriceFormDiv.append(mrtPriceControl);

        mrtPriceFormDiv.appendTo(mrtGlobalFormDiv);

        // create div for auto / price info
        var mrtSubmitFormDiv = $('<div id="mrtSubmitForm">');

        var mrtSubmitButtonControl = $('<button class="btn btn-primary">');
        mrtSubmitButtonControl.text('Publier');
        mrtSubmitFormDiv.append(mrtSubmitButtonControl);

        mrtSubmitFormDiv.appendTo(mrtGlobalFormDiv);

        $(mrtWidgetName).append(mrtGlobalFormDiv);

        // Activate datepicker
        $('#mrtDateOutward').datepicker();
        $('#mrtDateReturn').datepicker();

        $('#mrtTypeJourneyCtrl').change(function () {
            var selectedType = $('#mrtTypeJourneyCtrl').val();
            if (selectedType === 'aller') {
                $('#mrtOutwardForm').show();
                $('#mrtReturnForm').hide();
            } else if (selectedType === 'retour') {
                $('#mrtOutwardForm').hide();
                $('#mrtReturnForm').show();

            } else if (selectedType === 'aller-retour') {
                $('#mrtOutwardForm').show();
                $('#mrtReturnForm').show();
            }
        });

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
                mrtStartPoint = ui.item.value;
                var mrtDistanceService = new google.maps.DistanceMatrixService();
                mrtDistanceService.getDistanceMatrix(
                    {
                        origins: [mrtStartPoint],
                        destinations: [mrtDestinationPoint],
                        travelMode: google.maps.TravelMode.DRIVING,
                        avoidHighways: false,
                        avoidTolls: false
                    }, function (response, status) {
                        if (status === google.maps.DistanceMatrixStatus.OK) {
                            $('#mrtDistanceCtrl').val(response.rows[0].elements[0].distance.text);
                            $('#mrtDurationCtrl').val(response.rows[0].elements[0].duration.text);
                        }
                    });
            }
        });

    }
});
