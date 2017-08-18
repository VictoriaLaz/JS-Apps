$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html', displayHome);

        this.get('#/home', displayHome);

        this.get('#/about', function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            this.loadPartials({
                footer: ('./templates/common/footer.hbs'),
                header: ('./templates/common/header.hbs')
            }).then(function () {
                this.partial('./templates/about/about.hbs')
            });
        });

        this.get('#/login', function () {
            this.loadPartials({
                footer: ('./templates/common/footer.hbs'),
                header: ('./templates/common/header.hbs'),
                loginForm: ('./templates/login/loginForm.hbs')
            }).then(function () {
                this.partial('./templates/login/loginPage.hbs')
            });
        });

        this.post('#/login', function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;
            auth.login(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo('loggedIn');
                    displayHome(ctx)
                })
                .catch(auth.handleError)
        });
        
        this.get('#/logout', function (ctx) {
            auth.logout()
                .then( function () {
                    sessionStorage.clear();
                    displayHome(ctx)
                })
                .catch(auth.handleError);
        });

        this.get('#/register', function () {
            this.loadPartials({
                footer: ('./templates/common/footer.hbs'),
                header: ('./templates/common/header.hbs'),
                registerForm: ('./templates/register/registerForm.hbs')
            }).then(function () {
                this.partial('./templates/register/registerPage.hbs')
            });
        });

        this.post('#/register', function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatPassword = ctx.params.repeatPassword;
            if(password !== repeatPassword){
                auth.showError("passwords don't match");
            } else {
                auth.register(username, password)
                    .then(function (userInfo) {
                                auth.saveSession(userInfo);
                        auth.showInfo('registered');
                                displayHome(ctx)
                    })

                    .catch(auth.handleError)
            }
        });

        this.get('#/catalog', displayCatalog);

        this.get('#/create', function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                footer: ('./templates/common/footer.hbs'),
                header: ('./templates/common/header.hbs'),
                createForm: './templates/create/createForm.hbs'
            }).then(function () {
                this.partial('./templates/create/createPage.hbs')
            })
        });

        this.post('#/create', function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            let teamName = ctx.params.name;
            let comment = ctx.params.comment;
            teamsService.createTeam(teamName, comment)
                .then(function (team) {
                    teamsService.joinTeam(team._id)
                        .then(function (userInfo) {
                            auth.saveSession(userInfo);
                            auth.showInfo('team created');
                            displayCatalog(ctx);
                        })
                })
        });

        this.get('#/catalog/:id', function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            let teamId = ctx.params.id.substr(1);
            teamsService.loadTeamDetails(teamId)
                .then(function (team) {
                    ctx.isAuthor = team._acl.creator === sessionStorage.getItem('userId');
                    ctx.isOnTeam = sessionStorage.getItem('teamId') === team._id;
                    ctx.name = team.name;
                    ctx.comments = team.comments;
                    ctx.teamId = team._id;
                    ctx.loadPartials({
                        footer: ('./templates/common/footer.hbs'),
                        header: ('./templates/common/header.hbs'),
                        teamControls: ('./templates/catalog/teamControls.hbs')
                    }).then(function () {
                        this.partial('./templates/catalog/details.hbs')
                    })
                })
        });

        this.get("#/join/:id", function (ctx) {
            let teamId = ctx.params.id.substr(1);
            teamsService.joinTeam(teamId)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    displayCatalog(ctx);
                })
        });

        this.get('#/leave', function (ctx) {
            teamsService.leaveTeam()
                .then(function (userInfo) {
                    auth.saveSession(userInfo)
                    displayCatalog(ctx)
                })
        });

        this.get("#/edit/:id", function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            let teamId = ctx.params.id.substr(1);
            teamsService.loadTeamDetails(teamId)
                .then(function (teamInfo) {
                    ctx.teamId = teamId;
                    ctx.name = teamInfo.name;
                    ctx.comment = teamInfo.comment;

                    ctx.loadPartials({
                        footer: ('./templates/common/footer.hbs'),
                        header: ('./templates/common/header.hbs'),
                        editForm: './templates/edit/editForm.hbs'
                    }).then(function () {
                        this.partial('./templates/edit/editPage.hbs')
                    })
                })

        });

        this.post("#/edit/:id", function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.teamId = ctx.params.id;
            let id = ctx.params.id;
            let name = ctx.params.name;
            let description = ctx.params.comment;
            teamsService.edit(id, name, description)
                .then(function () {
                    displayCatalog(ctx)
                })
        })
        function displayHome(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.hasTeam = sessionStorage.getItem('teamId') !== null && sessionStorage.getItem('teamId') !== 'undefined';
            ctx.username = sessionStorage.getItem('username');
            ctx.teamId = sessionStorage.getItem('teamId');
            ctx.loadPartials({
                footer: ('./templates/common/footer.hbs'),
                header: ('./templates/common/header.hbs')
            }).then(function () {
                this.partial('./templates/home/home.hbs')
            })
        }
        function displayCatalog(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            teamsService.loadTeams()
                .then(function (teams) {
                    ctx.hasNoTeam = sessionStorage.getItem('teamId') === null
                        || sessionStorage.getItem('teamId') === 'undefined';
                    ctx.teams = teams;
                    ctx.loadPartials({
                        footer: ('./templates/common/footer.hbs'),
                        header: ('./templates/common/header.hbs'),
                        team: './templates/catalog/team.hbs'
                    }).then(function () {
                        this.partial('./templates/catalog/teamCatalog.hbs')
                    });
                });
        }
        

    });

    app.run();
});