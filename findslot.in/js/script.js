/**
 * Company - WifiDabba India Pvt Ltd 
 * Author: Channaveer Hakari 
 * */

/**
 * Get the list of all Indian states
 */
function getStates() {
    $('.state_status').html('Loading...');

    $.ajax({
        'url': 'api/getStatesApi.php',
        'type': 'GET',
        'dataType': 'JSON',
        'success': function(retObj) {
            option = '<option value="">Select State</option>';

            $.each(retObj.states, function(stateKey, state) {
                option += '<option value="' + state.state_id + '">' + state.state_name + '</option>'
            });

            $('#state_id').html(option);

            $('.state_status').html('');
        }
    });
}

/**
 * Get the list of districts based on state
 * 
 * @param {integer} stateId 
 */
function getDistricts(stateId) {
    $('.district_status').html('Loading...');

    $.ajax({
        'url': 'api/getDistrictsByStateIdApi.php?state_id=' + stateId,
        'type': 'GET',
        'dataType': 'JSON',
        'success': function(retObj) {
            option = '<option value="">Select Districts</option>';

            $.each(retObj.districts, function(districtKey, district) {
                option += '<option value="' + district.district_id + '">' + district.district_name + '</option>'
            });

            $('#district_id').html(option);

            $('.district_status').html('');
        }
    });
}

/**
 * Get vaccine centers based on district wise search
 * 
 * @param {integer} districtId 
 * @param {string} districtName 
 */
function getDistrictWiseVaccineCenters(districtId, districtName) {
    $('.search-result-locations').html('');
    $('.center-loading').addClass('alert alert-success').html("<h4>Finding slots for you...</h4>");
    var age = $('#age').val();

    $.ajax({
        'url': 'api/getDistrictWiseVaccineCentersApi.php?district_id=' + districtId,
        'type': 'GET',
        'dataType': 'JSON',
        'success': function(retObj) {
            var tr = '';
            var searchLocationCount = 0;
            var earlyDate = '';
            var availableCapacity = 0;

            $.each(retObj.centers, function(vaccineCenterKey, vaccineCenter) {
                var shouldInclude = true;

                $.each(vaccineCenter.sessions, function(sessionKey, session) {
                    if (age == 'below_45' && session.min_age_limit != 18) {
                        shouldInclude = false;
                        return; //Its like continue;
                    } else {
                        shouldInclude = true;
                    }

                    if (session.available_capacity < 1) {
                        shouldInclude = false;
                        return; //Its like continue;
                    }

                    earlyDate = session.date;
                    availableCapacity = session.available_capacity;
                    return false; //Its like break;
                });

                if (shouldInclude == false) {
                    return;
                }

                searchLocationCount++;

                tr += '<tr>' +
                    '<td>' + vaccineCenter.name + '</td>' +
                    '<td>' + vaccineCenter.block_name + '</td>' +
                    '<td>' + vaccineCenter.pincode + '</td>' +
                    '<td>' + earlyDate + '</td>' +
                    '<td>' + availableCapacity + '</td>' +
                    '<td><a href="https://selfregistration.cowin.gov.in/" target="_blank" class="btn btn-primary" data-toggle="popover" rel="tooltip" title="This will redirect you to CoWin portal for booking your slot. #StaySafe #MaskUp" data-content="This will redirect you to CoWin portal for booking your slot. #StaySafe #MaskUp">Book Slot</a></td>' +
                    '</tr>';
            });

            $('.search-result-locations').html(searchLocationCount + ' locations found for <span class="text-capitalize">' + districtName + '</span>');

            $('#vaccine_details').DataTable().clear().destroy();
            $('#vaccine_details tbody').html(tr);
            $('#vaccine_details').DataTable();

            $('.center-loading').removeClass('alert alert-success').html("");
        },
        'error': function() {
            showCowinOutageError();
        }
    });
}

/**
 * Get vaccine centers based on pincode search
 * 
 * @param {string} pincode 
 * @param {string} age 
 */
function getPincodeWiseVaccineCenters(pincode, age) {
    $('.search-result-locations').html('');
    $('.center-loading').addClass('alert alert-success').html("<h4>Finding slots for you...</h4>");

    $.ajax({
        'url': 'api/getPincodeWiseVaccineCentersApi.php?pincode=' + pincode,
        'type': 'GET',
        'dataType': 'JSON',
        'success': function(retObj) {
            var tr = '';
            var searchLocationCount = 0;

            $.each(retObj.centers, function(vaccineCenterKey, vaccineCenter) {
                var shouldInclude = true;
                console.log(age + ' | ' + vaccineCenter.min_age_limit);
                if (age == 'below_45' && vaccineCenter.min_age_limit != 18) {
                    shouldInclude = false;
                    return; //Its like continue;
                }

                searchLocationCount++;
                tr += '<tr>' +
                    '<td>' + vaccineCenter.name + '</td>' +
                    '<td>' + vaccineCenter.block_name + '</td>' +
                    '<td>' + vaccineCenter.pincode + '</td>' +
                    '<td>' + vaccineCenter.date + '</td>' +
                    '<td>' + vaccineCenter.available_capacity + '</td>' +
                    '<td><a href="https://selfregistration.cowin.gov.in/" target="_blank" class="btn btn-primary" data-toggle="popover" rel="tooltip" title="This will redirect you to CoWin portal for booking your slot. #StaySafe #MaskUp" data-content="This will redirect you to CoWin portal for booking your slot. #StaySafe #MaskUp">Book Slot</a></td>' +
                    '</tr>';
            });


            $('.search-result-locations').html(searchLocationCount + ' locations found for <span class="text-capitalize">' + pincode + '</span>');

            $('#vaccine_details').DataTable().clear().destroy();
            $('#vaccine_details tbody').html(tr);
            $('#vaccine_details').DataTable();

            $('.center-loading').removeClass('alert alert-success').html("");
        },
        'error': function() {
            showCowinOutageError();
        }
    });
}

/**
 * Get vaccine centers based on city wise search
 * 
 * @param {string} city 
 * @param {string} age 
 */
function getCityWiseVaccineCenters(city, age) {
    $('.search-result-locations').html('');
    $('.center-loading').addClass('alert alert-success').html("<h4>Finding slots for you...</h4>");

    $.ajax({
        'url': 'api/getCityWiseVaccineCentersApi.php?city=' + city,
        'type': 'GET',
        'dataType': 'JSON',
        'success': function(retObj) {
            var tr = '';
            var searchLocationCount = 0;
            var earlyDate = '';
            var availableCapacity = 0;

            $.each(retObj.centers, function(vaccineCenterKey, vaccineCenter) {
                var shouldInclude = true;

                $.each(vaccineCenter.sessions, function(sessionKey, session) {
                    if (age == 'below_45' && session.min_age_limit != 18) {
                        shouldInclude = false;
                        return; //Its like continue;
                    } else {
                        shouldInclude = true;
                    }

                    if (session.available_capacity < 1) {
                        shouldInclude = false;
                        return; //Its like continue;
                    }

                    earlyDate = session.date;
                    availableCapacity = session.available_capacity;
                    return false; //Its like break;
                });

                if (shouldInclude == false) {
                    return;
                }

                searchLocationCount++;

                tr += '<tr>' +
                    '<td>' + vaccineCenter.name + '</td>' +
                    '<td>' + vaccineCenter.block_name + '</td>' +
                    '<td>' + vaccineCenter.pincode + '</td>' +
                    '<td>' + earlyDate + '</td>' +
                    '<td>' + availableCapacity + '</td>' +
                    '<td><a href="https://selfregistration.cowin.gov.in/" target="_blank" class="btn btn-primary" data-toggle="popover" rel="tooltip" title="This will redirect you to CoWin portal for booking your slot. #StaySafe #MaskUp" data-content="This will redirect you to CoWin portal for booking your slot. #StaySafe #MaskUp">Book Slot</a></td>' +
                    '</tr>';
            });

            $('.search-result-locations').html(searchLocationCount + ' locations found for <span class="text-capitalize">' + city + '</span>');

            $('#vaccine_details').DataTable().clear().destroy();
            $('#vaccine_details tbody').html(tr);
            $('#vaccine_details').DataTable();

            $('.center-loading').removeClass('alert alert-success').html("");
        },
        'error': function() {
            showCowinOutageError();
        }
    });
}

/**
 * Function to scroll to search results
 */
function scrollToSearchResults() {
    var target = $('#search-result-locations');

    if (target.length) {

        $('html,body').animate({
            scrollTop: target.offset().top
        }, 1000);

        return false;
    }
}

function showCowinOutageError() {
    $('.center-loading').addClass('alert alert-danger').html("<h4>CoWin API is facing heavy usage please try again. <a href='https://findslot.in' class='btn btn-danger'><span class='glyphicon glyphicon-refresh'></span> Refresh</a></h4>");
}

/**
 * Load districts on change of state
 */
$('#state_id').on('change', function() {
    $('.state_status').html('');
    var stateId = $(this).val();

    if (stateId == '') {
        $('.state_status').html('Invalid state');
    }

    getDistricts(stateId)
});

/**
 * Load vaccine centers based on district or age group change
 */
$('#district_id, #age').on('change', function() {
    $('.district_status').html('');
    var districtId = $('#district_id').val();
    var districtName = $('#district_id option:selected').text();

    if (districtId == '') {
        $('.district_status').html('Invalid district');
    }

    getDistrictWiseVaccineCenters(districtId, districtName);

    scrollToSearchResults();
});

/**
 * Load vaccine centers based on city and age search
 */
$('#city_id, #city_age_group').on('change', function() {
    var city = $('#city_id').val();
    var age = $('#city_age_group').val();

    getCityWiseVaccineCenters(city, age);

    scrollToSearchResults();
});

/**
 * Load vaccine centers based on pincode and age search
 */
$('#filter-by-pincode').on('click', function() {
    var pincode = $('#pincode').val();
    var age = $('#pincode_age_group').val();

    getPincodeWiseVaccineCenters(pincode, age);

    scrollToSearchResults();
});

/** 
 * On DOM ready perform various initializations
 */
$(document).ready(function() {
    /** 
     * Init datatables
     */
    $('#vaccine_details').DataTable();

    /**
     * Init tooltip
     */
    $('[data-toggle="tooltip"]').tooltip();
    $('body').tooltip({
        selector: '[rel=tooltip]'
    });

    /**
     * Load states
     */
    getStates();
});