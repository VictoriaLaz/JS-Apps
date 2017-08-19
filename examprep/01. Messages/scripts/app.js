/**
 * Created by Vicky on 8/18/2017.
 */
function startApp() {

    const app = Sammy('#app', function () {
        this.use('Handlebars', 'hbs');

        $(document).on({
            ajaxStart: function () {
                $("#loadingBox").show();
            },
            ajaxStop: function () {
                $("#loadingBox").hide();
            }
        });

        //home
        this.get('messages.html', displayHome);
        this.get('#/home', displayHome);
        function displayHome(context) {
            context.isAnonymous = sessionStorage.getItem('username') === null;
            context.user = sessionStorage.getItem('username');

            context.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                home: './templates/home/home.hbs'
            }).then(function () {
                this.partial('./templates/home/homePage.hbs')
            })
        }
        //login
        this.get('#/login',function (context) {
            context.isAnonymous = sessionStorage.getItem('username') === null;
            context.user = sessionStorage.getItem('username');
            context.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                loginForm: './templates/login/loginForm.hbs'
            }).then(function () {
                this.partial('./templates/login/loginPage.hbs')
            })
        });
        this.post('#/login', function (context) {
            context.isAnonymous = sessionStorage.getItem('username') === null;
            context.user = sessionStorage.getItem('username');
            let username = context.params.username;
            let password = context.params.password;
            auth.login(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo('Login successful.');
                    displayHome(context);
                }).catch(auth.handleError)
        })
        //register
        this.get('#/register', function (context) {
            context.isAnonymous = sessionStorage.getItem('username') === null;
            context.user = sessionStorage.getItem('username');
            context.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                registerForm: './templates/register/registerForm.hbs'
            }).then(function () {
                this.partial('./templates/register/registerPage.hbs')
            })
        })
        this.post('#/register', function (context) {
            context.isAnonymous = sessionStorage.getItem('username') === null;
            context.user = sessionStorage.getItem('username');
            let username = context.params.username;
            let password = context.params.password;
            let name = context.params.name;
            auth.register(username, password, name)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo('User registration successful.');
                    displayHome(context)
                }).catch(auth.handleError);
        })
        //logout
        this.get('#/logout', function (context) {
            auth.logout()
                .then(function () {
                    auth.showInfo("Logout successful.");
                    sessionStorage.clear();
                    displayHome(context)
                }).catch(auth.handleError);
        })
        //mymessages
        this.get('#/myMessages', function (context) {
            context.isAnonymous = sessionStorage.getItem('username') === null;
            context.user = sessionStorage.getItem('username');
            messageService.getMyMessages()
                .then(function (messages) {
                    for (let message of messages) {
                        message.timestamp = formatDate(message._kmd.lmt);
                        let username = message.sender_username;
                        let name = message.sender_name;
                        message.sender = formatName(name, username)
                    }
                    context.messages = messages;
                    context.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        message: './templates/messages/message.hbs'
                    }).then(function () {
                        this.partial('./templates/messages/myMessages.hbs')
                    })
                }).catch(auth.handleError);

        })
        //archivesent
        this.get('#/sent', displaySent);
        function displaySent(context) {
            context.isAnonymous = sessionStorage.getItem('username') === null;
            context.user = sessionStorage.getItem('username');
            messageService.getSentMessages()
                .then(function (messages) {
                    for (let message of messages) {
                        message.timestamp = formatDate(message._kmd.lmt);
                    }
                    context.messages = messages;
                    context.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        message: './templates/messages/sentMessage.hbs'
                    }).then(function () {
                        this.partial('./templates/messages/sentMessages.hbs')
                            .then(function () {
                                $('button').click(function () {
                                    let messageId = $(this).attr('data-id');
                                    messageService.deleteMessage(messageId)
                                        .then(function () {
                                            auth.showInfo('Message deleted');
                                            displaySent(context);
                                        })
                                })
                            })
                    })
                }).catch(auth.handleError);
        }
        //send message
        this.get('#/sendMessage', function (context) {
            context.isAnonymous = sessionStorage.getItem('username') === null;
            context.user = sessionStorage.getItem('username');
            messageService.getAllUsers()
                .then(function (receivers) {
                    for (let receiver of receivers) {
                        let name = receiver.name;
                        let username = receiver.username;
                        receiver.receiverName = formatName(name, username);
                    }
                    context.receivers = receivers;
                    context.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        receiver: './templates/messages/receiver.hbs'
                    }).then(function () {
                        this.partial('./templates/messages/sendMessagePage.hbs')
                    })
                }).catch(auth.handleError);
        });
        this.post('#/sendMessage', function (context) {
            context.isAnonymous = sessionStorage.getItem('username') === null;
            context.user = sessionStorage.getItem('username');
            let recipient = context.params.recipient;
            let text = context.params.text;
            messageService.sendMessage(recipient, text)
                .then(function () {
                    auth.showInfo('Message sent.')
                    displaySent(context)
                }).catch(auth.handleError);
        })
        function formatName(name, username) {
            if (!name)
                return username;
            else
                return username + ' (' + name + ')';
        }
        function formatDate(dateISO8601) {
            let date = new Date(dateISO8601);
            if (Number.isNaN(date.getDate()))
                return '';
            return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
                "." + date.getFullYear() + ' ' + date.getHours() + ':' +
                padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());

            function padZeros(num) {
                return ('0' + num).slice(-2);
            }
        }
    });

    app.run()
}