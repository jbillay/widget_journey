/**
 * Created by jeremy on 26/11/2015.
 */


var $ = require('jquery');
require('jquery-ui');

var mrtWidgetName = '#mrt_journey';

// Get parameters
var mrtRunId = $(mrtWidgetName).attr('run');
if (typeof mrtRunId === "undefined" ) {
    mrtRunId = 1;
}

var mrtApiKey = $(mrtWidgetName).attr('run');
if (typeof mrtApiKey === "undefined" ) {
    mrtApiKey = null;
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

        var mrtGlobalFormDiv = $('<div id="mrtForm" class="col-xs-12 col-sm-12 col-md-6">');

        var mrtTitleDiv = $('<div id="mrtTitleForm" class="col-xs-12 col-sm-12 col-md-12">');

        var mrtTitleControl = $('<p>').append($('<strong>').append('Création d\'un trajet pour la course ' + response.name));
        mrtTitleDiv.append(mrtTitleControl);

        mrtGlobalFormDiv.append(mrtTitleDiv);

        // Init Google Map
        // Define Gecoder
        var geocoder = new google.maps.Geocoder();

        // Div for search destination
        var mrtDestinationDiv = $('<div class="col-xs-12 col-sm-12 col-md-12">');
        var mrtDestinationGroupDiv = $('<div id="mrtDestinationForm" class="form-group">');
        // Create the search box
        var controlSearchBox = $('<input type="text" id="mrtSearchAddress" placeholder="Lieu de départ" class="form-control">');
        mrtDestinationDiv.append(mrtDestinationGroupDiv.append(controlSearchBox));

        mrtGlobalFormDiv.append(mrtDestinationDiv);

        // create read-only inputs for distance and duration display
        var mrtDistanceDiv = $('<div class="col-xs-6 col-sm-6 col-md-6">');
        var mrtDistanceGroupDiv = $('<div class="form-group">');
        var mrtDistanceControl = $('<input type="text" id="mrtDistanceCtrl" placeholder="Distance estimée" class="form-control" readonly>');
        mrtDistanceDiv.append(mrtDistanceGroupDiv.append(mrtDistanceControl));

        var mrtDurationDiv = $('<div class="col-xs-6 col-sm-6 col-md-6">');
        var mrtDurationGroupDiv = $('<div class="form-group">');
        var mrtDurationControl = $('<input type="text" id="mrtDurationCtrl" placeholder="Durée estimée" class="form-control" readonly>');
        mrtDurationDiv.append(mrtDurationGroupDiv.append(mrtDurationControl));

        mrtGlobalFormDiv.append(mrtDistanceDiv);
        mrtGlobalFormDiv.append(mrtDurationDiv);

        // create select to define type of journey
        var mrtJourneyTypeDiv = $('<div class="col-xs-6 col-sm-6 col-md-6">');
        var mrtJourneyTypeGroupDiv = $('<div class="form-group">');
        var arrJourneyType = [
            {val : 'aller-retour', text: 'Aller-Retour'},
            {val : 'aller', text: 'Aller'},
            {val : 'retour', text: 'Retour'}
        ];
        var mrtTypeJourneyControl = $('<select id="mrtTypeJourneyCtrl" class="form-control">').appendTo(mrtJourneyTypeGroupDiv);
        $(arrJourneyType).each(function() {
            mrtTypeJourneyControl.append($("<option>").attr('value',this.val).text(this.text));
        });
        mrtJourneyTypeDiv.append(mrtJourneyTypeGroupDiv);
        mrtGlobalFormDiv.append(mrtJourneyTypeDiv);

        // create div for outward
        var mrtOutwardFormDiv = $('<div class="row-fluid" id="mrtOutwardForm">');

        // add label for outward
        var mrtLabelOutwardDiv = $('<div class="col-xs-12 col-sm-12 col-md-12">');
        var mrtLabelOutwardControl = $('<p>').append('Aller');
        mrtOutwardFormDiv.append(mrtLabelOutwardDiv.append(mrtLabelOutwardControl));

        // add input for date outward
        var mrtDateOutwardDiv = $('<div class="col-xs-12 col-sm-4 col-md-4">');
        var mrtDateOutwardInputGroup = $('<div class="input-group">');
        var mrtDateOutwardInputGroupBtn = $('<span class="input-group-btn">');
        mrtDateOutwardInputGroupBtn.append($('<button type="button" class="btn btn-default">')
                    .append($('<i class="glyphicon glyphicon-calendar"></i>')));
        mrtDateOutwardInputGroup.append(mrtDateOutwardInputGroupBtn);
        mrtDateOutwardInputGroup.append($('<div class="form-group">')
            .append($('<input type="text" id="mrtDateOutward" class="form-control" placeholder="Date">')));
        mrtOutwardFormDiv.append(mrtDateOutwardDiv.append(mrtDateOutwardInputGroup));

        // add input for time outward
        var mrtTimeOutwardDiv = $('<div class="col-xs-12 col-sm-4 col-md-4">');
        var mrtTimeOutwardFormGroupDiv = $('<div class="form-group">');
        var mrtTimeOutwardInputGroupDiv = $('<div class="input-group">');
        var mrtTimeOutwardControl = $('<input type="text" id="mrtTimeOutward" placeholder="Heure" class="form-control">');
        var mrtTimeOutwardSpan = $('<span class="input-group-addon">').append($('<span class="glyphicon glyphicon-time">'));
        mrtTimeOutwardInputGroupDiv.append(mrtTimeOutwardControl);
        mrtTimeOutwardInputGroupDiv.append(mrtTimeOutwardSpan);
        mrtOutwardFormDiv.append(mrtTimeOutwardDiv
            .append(mrtTimeOutwardFormGroupDiv
                .append(mrtTimeOutwardFormGroupDiv
                    .append(mrtTimeOutwardInputGroupDiv))));

        // add input for space outward
        var mrtSpaceOutwardDiv = $('<div class="col-xs-12 col-sm-4 col-md-4">');
        var mrtSpaceOutwardControl = $('<input type="number" id="mrtSpaceOutward" placeholder="Nombre de place" class="form-control">');
        mrtOutwardFormDiv.append(mrtSpaceOutwardDiv.append(mrtSpaceOutwardControl));

        mrtOutwardFormDiv.appendTo(mrtGlobalFormDiv);

        // create div for return
        var mrtReturnFormDiv = $('<div class="row-fluid" id="mrtReturnForm">');

        // add label for return
        var mrtLabelReturnDiv = $('<div class="col-xs-12 col-sm-12 col-md-12">');
        var mrtLabelReturnControl = $('<p>').append('Retour');
        mrtReturnFormDiv.append(mrtLabelReturnDiv.append(mrtLabelReturnControl));

        // add input for date return
        var mrtDateReturnDiv = $('<div class="col-xs-12 col-sm-4 col-md-4">');
        var mrtDateReturnInputGroup = $('<div class="input-group">');
        var mrtDateReturnInputGroupBtn = $('<span class="input-group-btn">');
        mrtDateReturnInputGroupBtn.append($('<button type="button" class="btn btn-default">')
            .append($('<i class="glyphicon glyphicon-calendar"></i>')));
        mrtDateReturnInputGroup.append(mrtDateReturnInputGroupBtn);
        mrtDateReturnInputGroup.append($('<div class="form-group">')
            .append($('<input type="text" id="mrtDateReturn" class="form-control" placeholder="Date">')));
        mrtReturnFormDiv.append(mrtDateReturnDiv.append(mrtDateReturnInputGroup));

        // add input for time return
        var mrtTimeReturnDiv = $('<div class="col-xs-12 col-sm-4 col-md-4">');
        var mrtTimeReturnFormGroupDiv = $('<div class="form-group">');
        var mrtTimeReturnInputGroupDiv = $('<div class="input-group">');
        var mrtTimeReturnControl = $('<input type="text" id="mrtTimeReturn" placeholder="Heure" class="form-control">');
        var mrtTimeReturnSpan = $('<span class="input-group-addon">').append($('<span class="glyphicon glyphicon-time">'));
        mrtTimeReturnInputGroupDiv.append(mrtTimeReturnControl);
        mrtTimeReturnInputGroupDiv.append(mrtTimeReturnSpan);
        mrtReturnFormDiv.append(mrtTimeReturnDiv
            .append(mrtTimeReturnFormGroupDiv
                .append(mrtTimeReturnFormGroupDiv
                    .append(mrtTimeReturnInputGroupDiv))));

        // add input for space return
        var mrtSpaceReturnDiv = $('<div class="col-xs-12 col-sm-4 col-md-4">');
        var mrtSpaceReturnControl = $('<input type="number" id="mrtSpaceReturn" placeholder="Nombre de place" class="form-control">');
        mrtReturnFormDiv.append(mrtSpaceReturnDiv.append(mrtSpaceReturnControl));

        mrtReturnFormDiv.appendTo(mrtGlobalFormDiv);

        // create div for auto info
        var mrtCarTypeMainDiv = $('<div class="row-fuild">');
        var mrtCarTypeFormDiv = $('<div class="col-xs-12 col-sm-6 col-md-6">');
        var mrtCarTypeGroupDiv = $('<div class="form-group">');

        var arrCar = [
            {val : 'citadine', text: 'Citadine'},
            {val : 'berline', text: 'Berline'},
            {val : 'break', text: 'Break'},
            {val : 'monospace', text: 'Monospace'},
            {val : 'suv', text: '4x4, SUV'},
            {val : 'coupe', text: 'Coupé'},
            {val : 'cabriolet', text: 'Cabriolet'}
        ];

        var mrtTypeCarControl = $('<select id="mrtTypeCarCtrl" class="form-control">').appendTo(mrtCarTypeGroupDiv);
        $(arrCar).each(function() {
            mrtTypeCarControl.append($("<option>").attr('value',this.val).text(this.text));
        });
        mrtCarTypeMainDiv.append(mrtCarTypeFormDiv.append(mrtCarTypeGroupDiv));
        mrtCarTypeMainDiv.appendTo(mrtGlobalFormDiv);

        // Create div for price info
        var mrtPriceFormDiv = $('<div class="col-xs-12 col-sm-6 col-md-6">');
        var mrtPriceFormGroupDiv = $('<div class="form-group">');

        var mrtPriceControl = $('<input type="number" id="mrtAmount" class="form-control" placeholder="Montant par place">');
        mrtPriceFormDiv.append(mrtPriceFormGroupDiv.append(mrtPriceControl));

        mrtPriceFormDiv.appendTo(mrtGlobalFormDiv);

        // create div for auto / price info
        var mrtSubmitFormDiv = $('<div class="col-xs-12 col-sm-12 col-md-12">');

        var mrtSubmitButtonControl = $('<button class="btn btn-primary" id="createJourney">');
        mrtSubmitButtonControl.text('Publier');
        mrtSubmitFormDiv.append(mrtSubmitButtonControl);

        mrtSubmitFormDiv.appendTo(mrtGlobalFormDiv);

        $(mrtWidgetName).append(mrtGlobalFormDiv);

        // Form for authentification
        var mrtGlobalAuthDiv = $('<div id="mrtAuth" class="col-xs-12 col-sm-12 col-md-6">');

        var mrtTitleConnectAuthDiv = $('<div id="mrtTitleConnectAuth" class="col-xs-12 col-sm-12 col-md-12">');

        var mrtTitleConnectAuthControl = $('<p>').append($('<strong>').append('Se connecter avec votre compte My Run Trip'));
        mrtTitleConnectAuthDiv.append(mrtTitleConnectAuthControl);

        var mrtLoginAuthDiv = $('<div class="col-xs-10 col-sm-10 col-md-10">');
        var mrtLoginAuthInputGroupDiv = $('<div class="input-group">');
        var mrtLoginAuthSpan = $('<span class="input-group-addon">').append($('<span class="glyphicon glyphicon-time">'));
        var mrtLoginAuthControl = $('<input type="text" id="mrtLoginAuth" placeholder="Email" class="form-control">');
        mrtLoginAuthInputGroupDiv.append(mrtLoginAuthSpan);
        mrtLoginAuthInputGroupDiv.append(mrtLoginAuthControl);
        mrtTitleConnectAuthDiv.append(mrtLoginAuthDiv
            .append(mrtLoginAuthInputGroupDiv));


        var mrtPasswordAuthDiv = $('<div class="col-xs-10 col-sm-10 col-md-10">');
        var mrtPasswordAuthInputGroupDiv = $('<div class="input-group">');
        var mrtPasswordAuthSpan = $('<span class="input-group-addon">').append($('<span class="glyphicon glyphicon-time">'));
        var mrtPasswordAuthControl = $('<input type="password" id="mrtPasswordAuth" placeholder="Mot de passe" class="form-control">');
        mrtPasswordAuthInputGroupDiv.append(mrtPasswordAuthSpan);
        mrtPasswordAuthInputGroupDiv.append(mrtPasswordAuthControl);
        mrtTitleConnectAuthDiv.append(mrtPasswordAuthDiv
            .append(mrtPasswordAuthInputGroupDiv));

        var mrtSubmitAuthDiv = $('<div class="col-xs-12 col-sm-12 col-md-12">');

        var mrtSubmitAuthButtonControl = $('<button class="btn btn-primary" id="connectMRT">');
        mrtSubmitAuthButtonControl.text('Se connecter');
        mrtSubmitAuthDiv.append(mrtSubmitAuthButtonControl);

        mrtSubmitAuthDiv.appendTo(mrtTitleConnectAuthDiv);

        mrtGlobalAuthDiv.append(mrtTitleConnectAuthDiv);

        var mrtSplitAuthControl = $('<hr class="col-xs-12 col-sm-12 col-md-12">');

        mrtGlobalAuthDiv.append(mrtSplitAuthControl);

        var mrtTitleCreateAuthDiv = $('<div id="mrtTitleConnectAuth" class="col-xs-12 col-sm-12 col-md-12">');

        var mrtTitleCreateAuthControl = $('<p>').append($('<strong>').append('Créer un compte'));
        mrtTitleCreateAuthDiv.append(mrtTitleCreateAuthControl);

        mrtGlobalAuthDiv.append(mrtTitleCreateAuthDiv);

        $(mrtWidgetName).append(mrtGlobalAuthDiv);

        // Hide Auth form in a first step
        //$('#mrtAuth').hide();

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

        var verifyMandatoryFields = function () {
            var valid = true;
            // Check if destination field completed
            if (!$('#mrtSearchAddress').val()) {
                $('#mrtSearchAddress').parent().addClass('has-error');
                valid = false;
            } else {
                $('#mrtSearchAddress').parent().removeClass('has-error');
            }

            if ($( "#mrtTypeJourneyCtrl option:selected" ).val() === 'aller-retour') {
                if (!$('#mrtDateOutward').val()) {
                    $('#mrtDateOutward').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtDateOutward').parent().removeClass('has-error');
                }
                if (!$('#mrtTimeOutward').val()) {
                    $('#mrtTimeOutward').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtTimeOutward').parent().removeClass('has-error');
                }
                if (!$('#mrtSpaceOutward').val()) {
                    $('#mrtSpaceOutward').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtSpaceOutward').parent().removeClass('has-error');
                }
                if (!$('#mrtDateReturn').val()) {
                    $('#mrtDateReturn').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtDateReturn').parent().removeClass('has-error');
                }
                if (!$('#mrtTimeReturn').val()) {
                    $('#mrtTimeReturn').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtTimeReturn').parent().removeClass('has-error');
                }
                if (!$('#mrtSpaceReturn').val()) {
                    $('#mrtSpaceReturn').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtSpaceReturn').parent().removeClass('has-error');
                }
            } else if ($( "#mrtTypeJourneyCtrl option:selected" ).val() === 'aller') {
                if (!$('#mrtDateOutward').val()) {
                    $('#mrtDateOutward').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtDateOutward').parent().removeClass('has-error');
                }
                if (!$('#mrtTimeOutward').val()) {
                    $('#mrtTimeOutward').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtTimeOutward').parent().removeClass('has-error');
                }
                if (!$('#mrtSpaceOutward').val()) {
                    $('#mrtSpaceOutward').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtSpaceOutward').parent().removeClass('has-error');
                }
            } else if ($( "#mrtTypeJourneyCtrl option:selected" ).val() === 'retour') {
                if (!$('#mrtDateReturn').val()) {
                    $('#mrtDateReturn').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtDateReturn').parent().removeClass('has-error');
                }
                if (!$('#mrtTimeReturn').val()) {
                    $('#mrtTimeReturn').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtTimeReturn').parent().removeClass('has-error');
                }
                if (!$('#mrtSpaceReturn').val()) {
                    $('#mrtSpaceReturn').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtSpaceReturn').parent().removeClass('has-error');
                }
            }

            // Check if amount field completed
            if (!$('#mrtAmount').val()) {
                $('#mrtAmount').parent().addClass('has-error');
                valid = false;
            } else {
                $('#mrtAmount').parent().removeClass('has-error');
            }

            return valid;
        };

        $('#createJourney').click(function () {
            var newJourney = {
                address_start: null,
                distance: null,
                duration: null,
                journey_type: null,
                date_start_outward: null,
                time_start_outward: null,
                nb_space_outward: null,
                date_start_return: null,
                time_start_return: null,
                nb_space_return: null,
                car_type: null,
                amount: null,
                token: null,
                Run: {
                    id: null
                }
            };

            if (verifyMandatoryFields()) {
                newJourney.address_start = $('#mrtSearchAddress').val();
                newJourney.distance = $('#mrtDistanceCtrl').val();
                newJourney.duration = $('#mrtDurationCtrl').val();
                newJourney.journey_type = $('#mrtTypeJourneyCtrl').val();
                var selectedType = $('#mrtTypeJourneyCtrl').val();
                if (selectedType === 'aller') {
                    newJourney.date_start_outward = $('#mrtDateOutward').val();
                    newJourney.time_start_outward = $('#mrtTimeOutward').val();
                    newJourney.nb_space_outward = $('#mrtSpaceOutward').val();
                } else if (selectedType === 'retour') {
                    newJourney.date_start_return = $('#mrtDateReturn').val();
                    newJourney.time_start_return = $('#mrtTimeReturn').val();
                    newJourney.nb_space_return = $('#mrtSpaceReturn').val();
                } else if (selectedType === 'aller-retour') {
                    newJourney.date_start_outward = $('#mrtDateOutward').val();
                    newJourney.time_start_outward = $('#mrtTimeOutward').val();
                    newJourney.nb_space_outward = $('#mrtSpaceOutward').val();
                    newJourney.date_start_return = $('#mrtDateReturn').val();
                    newJourney.time_start_return = $('#mrtTimeReturn').val();
                    newJourney.nb_space_return = $('#mrtSpaceReturn').val();
                }
                newJourney.car_type = $('#mrtTypeCarCtrl').val();
                newJourney.amount = $('#mrtAmount').val();
                newJourney.token = mrtApiKey;
                newJourney.Run.id = mrtRunId;

                var url = 'http://localhost:9615/api/journey';

                $.ajax({
                    type: "POST",
                    //dataType: "jsonp",
                    url: url,
                    data: {journey: newJourney},
                    success: function( response ) {
                        var mrtDraftId = response.journeyKey;
                        alert('Journey saved as draft : ' + mrtDraftId);
                        $('#mrtForm').hide();
                        $('#mrtAuth').show();
                        $('#connectMRT').click(function () {
                            var loginUrl = 'http://localhost:9615/login';
                            var confirmUrl = 'http://localhost:9615/api/journey/confirm';
                            var credential = {
                                email: null,
                                password: null
                            };
                            credential.email = $('#mrtLoginAuth').val();
                            credential.password= $('#mrtPasswordAuth').val();
                            $.ajax({
                                type: "POST",
                                //dataType: "jsonp",
                                url: loginUrl,
                                data: credential,
                                success: function (response) {
                                    console.log(response);
                                    var userToken = response.token;
                                    $.ajax({
                                        type: "POST",
                                        url: confirmUrl,
                                        data: {key: mrtDraftId, token: userToken},
                                        success: function (response) {
                                            console.log(response);
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            } else {
                alert('Some fields are missing');
            }
        });
    }
});
