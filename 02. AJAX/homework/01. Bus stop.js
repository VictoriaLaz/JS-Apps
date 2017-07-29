/**
 * Created by Vicky on 7/29/2017.
 */
function getInfo() {
    let stopToDisplay = $('#stopId').val();
    $('#buses').empty();
    let req = {
        url: `https://judgetests.firebaseio.com/businfo/${stopToDisplay}.json`,
        method: "GET",
        success: displayBusses,
        error: displayError
    }
    $.ajax(req)
    function displayBusses(stop) {
        $('#stopName').text(stop.name);
        for (let bus in stop.buses) {
            let li = $(`<li>Bus ${bus} arrives in ${stop.buses[bus]} minutes</li>`);
            $('#buses').append(li);
        }
    }
    function displayError() {
        $('#stopName').text('Error');
    }
}