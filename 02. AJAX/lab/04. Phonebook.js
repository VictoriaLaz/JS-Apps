/**
 * Created by Vicky on 7/29/2017.
 */
$(() => {
    let url = "https://phonebook-f809a.firebaseio.com/phonebook";
    let ul = $('#phonebook');
    $('#btnLoad').click(loadContacts);
    function loadContacts() {
        let req = {
            url: url + '.json',
            success: displayContacts,
        };
        $.ajax(req)
    }
    function displayContacts(contacts) {
        $('#phonebook').empty();
        for (let contact in contacts) {
            let li = $(`<li>${contacts[contact].name}: ${contacts[contact].phone}</li>`);
            li.append($(`<button>[Delete]</button>`).click(()=>deleteContact(contact)));
            ul.append(li);
        }
    }
    $('#btnCreate').click(createContact)

    function createContact() {
        let newPerson = {
            name: $('#person').val(),
            phone: $('#phone').val()
        };
        let req = {
            url: url + ".json",
            method: "POST",
            data: JSON.stringify(newPerson),
            success: loadContacts
        }
        $.ajax(req);
    }
    function deleteContact(id) {
        let req ={
            url: `${url}/${id}.json`,
            method: "DELETE",
            success: loadContacts,
        }
        $.ajax(req);
    }
});