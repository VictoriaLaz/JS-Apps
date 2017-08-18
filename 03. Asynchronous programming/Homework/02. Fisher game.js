/**
 * Created by Vicky on 8/5/2017.
 */
function attachEvents() {
    const baseUrl = 'https://baas.kinvey.com/appdata/kid_Bk452e8DZ/biggestCatches';
    const kinveyUsername = 'vicky';
    const kinveyPassword = 'v';
    const base64auth = btoa(kinveyUsername + ":" + kinveyPassword);
    const authHeaders = { "Authorization": "Basic " + base64auth };

    $('#aside').find('.load').click(loadCatches);
    $('#addForm').find('.add').click(addCatch);
    function addCatch() {
        let newCatch = returnJSONObject($('#addForm'))

        $.ajax(makeRequest('POST', newCatch, ''))
            .then(loadCatches)
    }
    function loadCatches() {
        $.ajax(makeRequest('GET', '', ''))
            .then(displayCatches);
    }
    function displayCatches(data) {
        for (let fishCatch of data) {
            let container = $('#catches');
            let divCatch = $('<div></div>').addClass('catch').attr('data-id', `${fishCatch._id}`)
                .append('<label>Angler</label>',
                    `<input type="text" class="angler" value="${fishCatch.angler}"/>`,
                    `<label>Weight</label>`,
                    `<input type="number" class="weight" value="${fishCatch.weight}"/>`,
                    `<label>Species</label>`,
                    `<input type="text" class="species" value="${fishCatch.species}"/>`,
                    `<label>Location</label>`,
                    `<input type="text" class="location" value="${fishCatch.location}"/>`,
                    `<label>Bait</label>`,
                    `<input type="text" class="bait" value="${fishCatch.bait}"/>`,
                    `<label>Capture Time</label>`,
                    `<input type="number" class="captureTime" value="${fishCatch.captureTime}"/>`)
                .append('<button class="update">Update</button>').click(updateCatch)
                .append('<button class="delete">Delete</button>').click(deleteCatch);

            container.append(divCatch);
        }
    }
    function updateCatch() {
        let catchDiv = $(this);
        console.log(catchDiv);
        let id = catchDiv.attr('data-id');
        let updatedCatch = returnJSONObject(catchDiv);
        $.ajax(makeRequest("PUT", updatedCatch, `/${id}`))
            .then(loadCatches)
    }
    function deleteCatch() {
        
    }
    function returnJSONObject(baseSelector) {
        return {
            angler: baseSelector.find('.angler').val(),
            weight: Number(baseSelector.find('.weight').val()),
            species: baseSelector.find('.species').val(),
            location: baseSelector.find('.location').val(),
            bait: baseSelector.find('.bait').val(),
            captureTime: Number(baseSelector.find('.captureTime').val())
        };
    }
    function makeRequest(method1, bodyText, url1) {
        return {
            url: baseUrl + url1,
            headers: authHeaders,
            method: method1,
            contentType: 'application/json',
            data: JSON.stringify(bodyText)
        }
    }
}