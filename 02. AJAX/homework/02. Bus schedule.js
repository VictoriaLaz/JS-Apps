/**
 * Created by Vicky on 7/29/2017.
 */
function solve() {
    let currentStopId = 'depot';
    let url = 'https://judgetests.firebaseio.com/schedule/';
    let currentStopName = '';
    function depart() {
        $('#depart').prop('disabled', true);
        $('#arrive').prop('disabled', false);
        let req = {
            url: `${url}/${currentStopId}.json`,
            success: displayNextStop,
            error: showError
        };
        $.ajax(req);
    }
    function displayNextStop(data) {
        console.log(data);
        $('#info .info').text(`Next stop ${data.name}`)
        currentStopId = data.next;
        currentStopName = data.name;

    }
    function arrive() {
        $('#depart').prop('disabled', false);
        $('#arrive').prop('disabled', true);
        $('#info .info').text(`Arriving at ${currentStopName}`)
    }

    function showError() {
        $('#depart').prop('disabled', true);
        $('#arrive').prop('disabled', true);
        $('#info .info').text('Error')
    }
    return {
        depart,
        arrive
    };
}
