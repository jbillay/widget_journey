/**
 * Created by jeremy on 26/11/2015.
 */


var $ = require('jquery');
require('jquery-ui');
//DEV: 'http://localhost:9615',
//TEST: 'https://myruntrip-staging.herokuapp.com',
//PROD: 'https://www.myruntrip.com'
var mrtSettings = {
    domain: '/* @echo MRTDomain */'
};

var mrtWidgetName = '#mrt_journey';

// Get parameters
var mrtRunId = $(mrtWidgetName).attr('run');
if (typeof mrtRunId === 'undefined' ) {
    mrtRunId = 1;
}

var mrtApiKey = $(mrtWidgetName).attr('api-key');
if (typeof mrtApiKey === 'undefined' ) {
    mrtApiKey = null;
}

var mrtWidgetSize = $(mrtWidgetName).attr('size');
if (typeof mrtWidgetSize === 'undefined' ) {
    mrtWidgetSize = 1;
}

var mrtWidgetSizeMd = 6 * mrtWidgetSize;

var mrtRunUrl = mrtSettings.domain + '/api/run/' + mrtRunId;

$.ajax({
    url: mrtRunUrl,
    success: function( response ) {
        var mrtDestinationPoint = response.address_start;
        var mrtStartPoint = '';
        var geocoder = new google.maps.Geocoder();

        var mrtGlobalFormDiv = $('<div id="mrtForm" class="col-xs-12 col-sm-12 col-md-' + mrtWidgetSizeMd + '">');

        var mrtTitleDiv = $('<div id="mrtTitleForm" class="col-xs-12 col-sm-12 col-md-12">');

        var mrtTitleControl = $('<p>').append($('<strong>').append('Création d\'un trajet pour la course ' + response.name));
        mrtTitleDiv.append(mrtTitleControl);

        mrtGlobalFormDiv.append(mrtTitleDiv);

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

        var mrtSubmitButtonControl = $('<button class="btn btn-primary pull-right" id="createJourney">');
        mrtSubmitButtonControl.text('Suivant');
        mrtSubmitFormDiv.append(mrtSubmitButtonControl);

        mrtSubmitFormDiv.appendTo(mrtGlobalFormDiv);

        $(mrtWidgetName).append(mrtGlobalFormDiv);

        // Activate datepicker
        $('#mrtDateOutward').datepicker();
        $('#mrtDateReturn').datepicker();

        var mrtAuth = {
            mrtGlobalAuthDiv: $('<div id="mrtAuth" class="col-xs-12 col-sm-12 col-md-' + mrtWidgetSizeMd + '">'),
            connection: function () {
                var mrtTitleConnectAuthDiv = $('<div id="mrtTitleConnectAuth" class="col-xs-12 col-sm-12 col-md-12">');

                var mrtTitleConnectAuthControl = $('<p>').append($('<strong>').append('Se connecter avec votre compte My Run Trip'));
                mrtTitleConnectAuthDiv.append(mrtTitleConnectAuthControl);

                var mrtLoginAuthDiv = $('<div class="col-xs-10 col-sm-10 col-md-10">');
                var mrtLoginAuthFormGroup = $('<div class="form-group">');
                var mrtLoginAuthInputGroupDiv = $('<div class="input-group">');
                var mrtLoginAuthSpan = $('<span class="input-group-addon">').append($('<i class="fa fa-envelope-o fa-fw">'));
                var mrtLoginAuthControl = $('<input type="text" id="mrtLoginAuth" placeholder="Email" class="form-control">');
                mrtLoginAuthFormGroup.append(mrtLoginAuthInputGroupDiv);
                mrtLoginAuthInputGroupDiv.append(mrtLoginAuthSpan);
                mrtLoginAuthInputGroupDiv.append(mrtLoginAuthControl);
                mrtTitleConnectAuthDiv.append(mrtLoginAuthDiv
                    .append(mrtLoginAuthFormGroup));


                var mrtPasswordAuthDiv = $('<div class="col-xs-10 col-sm-10 col-md-10">');
                var mrtPasswordAuthFormGroup = $('<div class="form-group">');
                var mrtPasswordAuthInputGroupDiv = $('<div class="input-group">');
                var mrtPasswordAuthSpan = $('<span class="input-group-addon">').append($('<i class="fa fa-key fa-fw">'));
                var mrtPasswordAuthControl = $('<input type="password" id="mrtPasswordAuth" placeholder="Mot de passe" class="form-control">');
                mrtPasswordAuthFormGroup.append(mrtPasswordAuthInputGroupDiv);
                mrtPasswordAuthInputGroupDiv.append(mrtPasswordAuthSpan);
                mrtPasswordAuthInputGroupDiv.append(mrtPasswordAuthControl);
                mrtTitleConnectAuthDiv.append(mrtPasswordAuthDiv
                    .append(mrtPasswordAuthFormGroup));

                var mrtSubmitAuthDiv = $('<div class="col-xs-12 col-sm-12 col-md-12">');

                var mrtSubmitAuthButtonControl = $('<button class="btn btn-primary" id="connectMRT">');
                mrtSubmitAuthButtonControl.text('Se connecter');
                mrtSubmitAuthDiv.append(mrtSubmitAuthButtonControl);

                mrtSubmitAuthDiv.appendTo(mrtTitleConnectAuthDiv);

                this.mrtGlobalAuthDiv.append(mrtTitleConnectAuthDiv);
            },
            space: function () {
                var mrtSplitAuthControl = $('<hr class="col-xs-12 col-sm-12 col-md-12">');

                this.mrtGlobalAuthDiv.append(mrtSplitAuthControl);
            },
            creation: function () {
                var mrtCreateAuthDiv = $('<div id="mrtTitleConnectAuth" class="col-xs-12 col-sm-12 col-md-12">');
                // Title of form
                var mrtTitleCreateAuthControl = $('<p>').append($('<strong>').append('Créer un compte My Run Trip'));
                mrtCreateAuthDiv.append(mrtTitleCreateAuthControl);

                // Firstname field
                var mrtFirstnameCreateDiv = $('<div class="col-xs-12 col-sm-6 col-md-6">');
                var mrtFirstnameCreateFormGroup = $('<div class="form-group">');
                var mrtFirstnameCreateInput = $('<input type="text" id="mrtCreateFirstname" placeholder="Prénom" class="form-control">');

                mrtFirstnameCreateDiv.append(mrtFirstnameCreateFormGroup.append(mrtFirstnameCreateInput));
                mrtFirstnameCreateDiv.appendTo(mrtCreateAuthDiv);

                // Surname field
                var mrtSurnameCreateDiv = $('<div class="col-xs-12 col-sm-6 col-md-6">');
                var mrtSurnameCreateFormGroup = $('<div class="form-group">');
                var mrtSurnameCreateInput = $('<input type="text" id="mrtCreateSurname" placeholder="Nom" class="form-control">');

                mrtSurnameCreateDiv.append(mrtSurnameCreateFormGroup.append(mrtSurnameCreateInput));
                mrtSurnameCreateDiv.appendTo(mrtCreateAuthDiv);

                // Town field (to be autocompleted)
                var mrtTownCreateDiv = $('<div class="col-xs-12 col-sm-12 col-md-12">');
                var mrtTownCreateFormGroup = $('<div class="form-group">');
                var mrtTownCreateInput = $('<input type="text" id="mrtCreateTown" placeholder="Ville" class="form-control">');

                mrtTownCreateDiv.append(mrtTownCreateFormGroup.append(mrtTownCreateInput));
                mrtTownCreateDiv.appendTo(mrtCreateAuthDiv);

                // Email field
                var mrtEmailCreateDiv = $('<div class="col-xs-12 col-sm-12 col-md-12">');
                var mrtEmailCreateFormGroup = $('<div class="form-group">');
                var mrtEmailCreateInput = $('<input type="text" id="mrtCreateEmail" placeholder="Email" class="form-control">');

                mrtEmailCreateDiv.append(mrtEmailCreateFormGroup.append(mrtEmailCreateInput));
                mrtEmailCreateDiv.appendTo(mrtCreateAuthDiv);

                // Password field
                var mrtPasswordCreateDiv = $('<div class="col-xs-12 col-sm-6 col-md-6">');
                var mrtPasswordCreateFormGroup = $('<div class="form-group">');
                var mrtPasswordCreateInput = $('<input type="password" id="mrtCreatePassword" placeholder="Mot de passe" class="form-control">');

                mrtPasswordCreateDiv.append(mrtPasswordCreateFormGroup.append(mrtPasswordCreateInput));
                mrtPasswordCreateDiv.appendTo(mrtCreateAuthDiv);

                // Confirm password field
                var mrtConfirmPasswordCreateDiv = $('<div class="col-xs-12 col-sm-6 col-md-6">');
                var mrtConfirmPasswordCreateFormGroup = $('<div class="form-group">');
                var mrtConfirmPasswordCreateInput = $('<input type="password" id="mrtCreateConfirmPassword" placeholder="Confirmation" class="form-control">');

                mrtConfirmPasswordCreateDiv.append(mrtConfirmPasswordCreateFormGroup.append(mrtConfirmPasswordCreateInput));
                mrtConfirmPasswordCreateDiv.appendTo(mrtCreateAuthDiv);

                // Submit button
                var mrtSubmitCreateDiv = $('<div class="col-xs-12 col-sm-12 col-md-12">');

                var mrtSubmitCreateButtonControl = $('<button class="btn btn-primary" id="createMRT">');
                mrtSubmitCreateButtonControl.text('Inscription');
                mrtSubmitCreateDiv.append(mrtSubmitCreateButtonControl);

                mrtSubmitCreateDiv.appendTo(mrtCreateAuthDiv);

                this.mrtGlobalAuthDiv.append(mrtCreateAuthDiv);
            },
            build: function () {
                this.connection();
                this.space();
                this.creation();
                $(mrtWidgetName).append(this.mrtGlobalAuthDiv);

                $('#mrtCreateTown').autocomplete({
                    source:  function (request, response) {
                        googleLocationSearch(request, response);
                    }
                });
            },
            show: function () {
                $('#mrtAuth').show();
            },
            hide: function () {
                $('#mrtAuth').hide();
            },
            validConnect: function () {
                var valid = true;
                // Check if destination field completed
                if (!$('#mrtLoginAuth').val()) {
                    $('#mrtLoginAuth').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtLoginAuth').parent().removeClass('has-error');
                }
                if (!$('#mrtPasswordAuth').val()) {
                    $('#mrtPasswordAuth').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtPasswordAuth').parent().removeClass('has-error');
                }
                return valid;
            },
            validCreation: function () {
                var valid = true;
                // Check if destination field completed
                if (!$('#mrtCreateFirstname').val()) {
                    $('#mrtCreateFirstname').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtCreateFirstname').parent().removeClass('has-error');
                }
                if (!$('#mrtCreateSurname').val()) {
                    $('#mrtCreateSurname').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtCreateSurname').parent().removeClass('has-error');
                }
                if (!$('#mrtCreateTown').val()) {
                    $('#mrtCreateTown').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtCreateTown').parent().removeClass('has-error');
                }
                if (!$('#mrtCreateEmail').val()) {
                    $('#mrtCreateEmail').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtCreateEmail').parent().removeClass('has-error');
                }
                if (!$('#mrtCreatePassword').val()) {
                    $('#mrtCreatePassword').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtCreatePassword').parent().removeClass('has-error');
                }
                if (!$('#mrtCreateConfirmPassword').val()) {
                    $('#mrtCreateConfirmPassword').parent().addClass('has-error');
                    valid = false;
                } else {
                    $('#mrtCreateConfirmPassword').parent().removeClass('has-error');
                }
                return valid;
            }
        };

        var mrtValidation = {
            build: function (id) {
                var mrtGlobalValidDiv = $('<div id="mrtValidation" class="col-xs-12 col-sm-12 col-md-' + mrtWidgetSizeMd + '">');

                var mrtContentValidDiv = $('<div id="mrtTitleForm" class="col-xs-12 col-sm-12 col-md-12">');

                var mrtContentValidTextThanks = $('<h3>').append('Merci, votre a bien été créé sur le site My Run Trip.');
                var mrtContentValidTextLink = $('<h3>').append('Vous pouvez le visualiser en cliquant sur le lien suivant ');
                var mrtContentValidLink = $('<a>').attr('href', mrtSettings.domain + '/journey-' + id).append('Votre voyage');

                mrtContentValidDiv.append(mrtContentValidTextThanks
                    .append(mrtContentValidTextLink
                        .append(mrtContentValidLink)));

                mrtGlobalValidDiv.append(mrtContentValidDiv);

                $(mrtWidgetName).append(mrtGlobalValidDiv);
            },
            show: function () {
                $('#mrtValidation').show();
            },
            hide: function () {
                $('#mrtValidation').hide();
            }
        };

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

        var googleLocationSearch = function (request, response) {

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
        };

        $(controlSearchBox).autocomplete({
            source: function (request, response) {
                googleLocationSearch(request, response);
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

        var verifyMandatoryJourneyFields = function () {
            var valid = true;
            // Check if destination field completed
            if (!$('#mrtSearchAddress').val()) {
                $('#mrtSearchAddress').parent().addClass('has-error');
                valid = false;
            } else {
                $('#mrtSearchAddress').parent().removeClass('has-error');
            }

            if ($("#mrtTypeJourneyCtrl option:selected").val() === 'aller-retour') {
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
            } else if ($("#mrtTypeJourneyCtrl option:selected").val() === 'aller') {
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
            } else if ($("#mrtTypeJourneyCtrl option:selected").val() === 'retour') {
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

            if (verifyMandatoryJourneyFields()) {
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

                var url = mrtSettings.domain + '/api/journey';

                $.ajax({
                    type: "POST",
                    //dataType: "jsonp",
                    url: url,
                    data: {journey: newJourney},
                    success: function( response ) {
                        if (response.type === 'success') {
                            var mrtDraftId = response.journeyKey;
                            console.log('Journey saved as draft : ' + mrtDraftId);
                            $('#mrtForm').hide();
                            mrtAuth.build();
                            $('#connectMRT').click(function () {
                                var loginUrl = mrtSettings.domain + '/login';
                                var confirmUrl = mrtSettings.domain + '/api/journey/confirm';
                                var credential = {
                                    email: null,
                                    password: null
                                };
                                if (mrtAuth.validConnect()) {
                                    credential.email = $('#mrtLoginAuth').val();
                                    credential.password = $('#mrtPasswordAuth').val();
                                    $.ajax({
                                        type: "POST",
                                        url: loginUrl,
                                        data: credential,
                                        success: function (response) {
                                            if (response.type === 'success') {
                                                var userToken = response.token;
                                                $.ajax({
                                                    type: "POST",
                                                    url: confirmUrl,
                                                    data: {key: mrtDraftId, token: userToken},
                                                    success: function (response) {
                                                        if (response.type === 'success') {
                                                            var newJourneyId = response.journey.id;
                                                            mrtAuth.hide();
                                                            mrtValidation.build(newJourneyId);
                                                        } else {
                                                            alert('Malheureusement nous avons rencontré un problème technique');
                                                        }
                                                    }
                                                });
                                            } else {
                                                alert('Malheureusement nous avons rencontré un problème technique');
                                            }
                                        }
                                    });
                                }
                            });
                            $('#createMRT').click(function () {
                                var creationUrl = mrtSettings.domain + '/api/user';
                                var confirmUrl = mrtSettings.domain + '/api/journey/confirm';
                                var user = {
                                    firstname : null,
                                    lastname : null,
                                    address : null,
                                    email : null,
                                    password : null,
                                    password_confirmation : null
                                };
                                if (mrtAuth.validCreation()) {
                                    user.firstname = $('#mrtCreateFirstname').val();
                                    user.lastname = $('#mrtCreateSurname').val();
                                    user.address = $('#mrtCreateTown').val();
                                    user.email = $('#mrtCreateEmail').val();
                                    user.password = $('#mrtCreatePassword').val();
                                    user.password_confirmation = $('#mrtCreateConfirmPassword').val();
                                    $.ajax({
                                        type: "POST",
                                        url: creationUrl,
                                        data: user,
                                        success: function (response) {
                                            if (response.type === 'success') {
                                                var userToken = response.token;
                                                $.ajax({
                                                    type: "POST",
                                                    url: confirmUrl,
                                                    data: {key: mrtDraftId, token: userToken},
                                                    success: function (response) {
                                                        if (response.type === 'success') {
                                                            var newJourneyId = response.journey.id;
                                                            mrtAuth.hide();
                                                            mrtValidation.build(newJourneyId);
                                                        } else {
                                                            alert('Malheureusement nous avons rencontré un problème technique');
                                                        }
                                                    }
                                                });
                                            } else {
                                                alert('Malheureusement nous avons rencontré un problème technique');
                                            }
                                        }
                                    });
                                }
                            });
                        } else {
                            alert('Malheureusement nous avons rencontré un problème technique');
                        }
                    }
                });
            } else {
                alert('Some fields are missing');
            }
        });
    }
});
