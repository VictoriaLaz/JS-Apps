/**
 * Created by Vicky on 7/30/2017.
 */
function attachEvents() {
    let url = 'https://messenger-2c5d6.firebaseio.com/messenger/';
    $('#submit').click(function () {
        let newMessage = {
            author: $('#author').val(),
            content: $('#content').val(),
            timestamp: Date.now()
        };
        $('#content').val('');
        let req = {
            url: url + '.json',
            method: 'POST',
            data: JSON.stringify(newMessage),
            success: refreshMessages,
        };
        $.ajax(req);
    });

    $('#refresh').click(refreshMessages);
    function refreshMessages() {
        let req = {
            url: url + '.json',
            success: displayMessages,
        };
        $.ajax(req);
    }
    function displayMessages(data) {
        $('#messages').text('');
        let messages = [];
        for (let message in data) {
            messages.push(data[message]);
        }
        let sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
        let text = '';
        for (let obj of sortedMessages) {
            text += `${obj.author}: ${obj.content}\n`
        }
        $('#messages').text(text);
    }
}