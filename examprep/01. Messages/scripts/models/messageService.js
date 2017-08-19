/**
 * Created by Vicky on 8/18/2017.
 */
let messageService = (()=>{
    "use strict";
    function getMyMessages(){
        let username = sessionStorage.getItem('username');
        return requester.get('appdata', `messages?query={"recipient_username":"${username}"}`, 'kinvey')
    }
    function getSentMessages() {
        let username = sessionStorage.getItem('username');
        return requester.get('appdata', `messages?query={"sender_username":"${username}"}`, 'kinvey')
    }
    function deleteMessage(messageId) {
        return requester.remove('appdata', 'messages/' + messageId, 'kinvey')
    }
    function getAllUsers() {
        return requester.get('user','','kinvey')
    }
    function sendMessage(recipientUsername, text) {
        let data ={
            "sender_username":sessionStorage.getItem('username'),
            "sender_name":sessionStorage.getItem('name'),
            "recipient_username":recipientUsername,
            "text":text
        };
        return requester.post('appdata', 'messages', 'kinvey', data)
    }
    return{
        getMyMessages,
        getSentMessages,
        deleteMessage,
        getAllUsers,
        sendMessage
    }
})();