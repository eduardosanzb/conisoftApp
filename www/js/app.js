// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
// 'firebase' will inject all the firebase and angularFire functions to our app

angular.module('conisoft16', ['ionic', 'ngCordova', 'conisoft16.controllers', 'firebase', 'conisoft16.services', 'conisoft16.filters', 'angular.filter', 'pascalprecht.translate', 'jett.ionic.scroll.sista', 'ion-affix', 'ion-sticky', 'ion-floating-menu', 'jett.ionic.filter.bar', 'ngMap', 'angular-clipboard', 'monospaced.qrcode', 'angularMoment'])


.constant('FirebaseUrl', "https://conisoft16.firebaseio.com/")



.run(function($ionicPlatform, $localStorage, $rootScope, $ionicPopup, Auth, $state, $ionicHistory) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLight();
        }


        //Device language
        var locale = 'en';
        if (navigator.language) {
            if (navigator.language.split('-')[0] == "es" || navigator.language.split('-')[0] == "en") {
                locale = navigator.language.split('-')[0];
                $localStorage.set('locale', locale);
                $rootScope.locale = locale;

            }
        }


        //     var backButton = $ionicPlatform.registerBackButtonAction(function(event) {
        //     if (true) {
        //         switch($state.current.name){
        //             case "app.schedule":
        //                 ionic.Platform.exitApp();
        //             break;
        //             case "app.mySchedule":
        //                 $state.go('app.schedule');
        //             break;
        //             case "detailEvent":

        //             break;
        //         }
        //     }
        // }, 100);
        //$scope.$on('$destroy', backButton);


    });
})

.config(function($stateProvider, $ionicConfigProvider, $urlRouterProvider, $translateProvider) {
    $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-thin-left');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl',
            resolve: {
                /* controller will not be loaded until $waitForAuth resolves*/
                "currentAuth": function(Auth, $localStorage, Users, $state) {
                    /* $waitForAuth returns a promise so the resolve waits for it to complete */

                    return Auth.$requireAuth().then(function(data) {
                        /*  In the existence of a valid Auth in the phone.
                         *  1. We will create/update the $localStorage userProfile
                         *  2. Then we will redirect to app.schedule
                         */
                        console.log(data);
                        if (data.password.isTemporaryPassword) {
                            $state.go('resetPassword');
                        }
                        if (($localStorage.get('userProfile')) == null) {
                            Users.get(data.auth.uid).$loaded().then(function(data) {
                                console.log(data);
                                var user = {
                                    uid: data.$id,
                                    name: data.name,
                                    email: data.email,
                                    password: data.password,
                                    afiliation: data.afiliation,
                                    payment: data.payment,
                                    location: data.location
                                }
                                if (data.conferences) {
                                    user.conferences = data.conferences;
                                }
                                console.log(user);
                                $localStorage.setObject('userProfile', user);
                                return user;

                            });
                        }
                        $state.go('home');

                    }, function(error) {
                        console.log("Error from app.js resolve login: " + error);
                        if ($localStorage.getObject('userProfile') != null) {
                            var user = $localStorage.getObject('userProfile');
                            console.log(user);
                            Auth.$authWithPassword({
                                email: user.email,
                                password: user.password
                            }).then(function(authData) {
                                console.log("Logged in as:", authData.uid);
                                $state.go('home');
                            }).catch(function(error) {
                                console.error("Authentication failed:", error);
                            });
                        }
                    });
                }
            }
        })

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'

    })




    .state('resetPassword', {
        url: '/reset',
        templateUrl: 'templates/resetPassword.html',
        controller: 'ResetCtrl',
        resolve: {
            "cacheUser": function($localStorage, Auth, Users) {
                var data = Auth.$getAuth();
                if (data) {
                    console.log(data);
                    if (!($localStorage.get('userProfile'))) {
                        Users.get(data.auth.uid).$loaded().then(function(data) {
                            console.log(data);
                            var user = {
                                uid: data.$id,
                                name: data.name,
                                email: data.email,
                                password: data.password,
                                afiliation: data.afiliation,
                                payment: data.payment,
                                location: data.location
                            }
                            if (data.conferences) {
                                user.conferences = data.conferences;
                            }
                            console.log(user);
                            $localStorage.setObject('userProfile', user);
                            return user;

                        });
                    }
                } else {
                    $state.go('login');
                }
            }
        }
    })

    .state('app.schedule', {
        url: '/schedule',
        views: {
            'menuContent': {
                templateUrl: 'templates/schedule.html',
                controller: 'ScheduleCtrl',
                resolve: {
                    "currentAuth": function(Auth, $state, $ionicPopup) {
                        Auth.$requireAuth().then(function(data) {
                            //console.log(data);
                            if (data.password.isTemporaryPassword) {
                                $state.go('resetPassword');
                            }
                        }).catch(function(error) {
                            console.log(error);
                        });
                    },
                    "agenda": function(Conferences) {
                        var conferences = Conferences.all()
                        return conferences;
                    },
                    "userAgenda": function($localStorage, Users) {
                        if ($localStorage.getObject('userProfile') != null)
                            return Users.get($localStorage.getObject('userProfile').uid);
                    }
                }
            }
        }
    })

    .state('detailEvent', {
        url: "/app/:prevState/event/:id",
        templateUrl: "templates/detail/detailEvent.html",
        controller: "DetailEventCtrl"
    })

    .state('detailSpeaker', {
        url: "/app/:prevState/speaker/:id",
        templateUrl: "templates/detail/detailSpeaker.html",
        controller: "DetailSpeakerCtrl"
    })



    .state('app.speakers', {
        url: '/speakers',
        views: {
            'menuContent': {
                templateUrl: 'templates/speakers.html',
                controller: 'SpeakersCtrl',
                resolve: {
                    "speakersList": function(Speakers, $ionicLoading) {

                        return Speakers.all();
                    }
                }

            }
        }
    })

    .state('app.contact', {
        url: '/contact',
        views: {
            'menuContent': {
                templateUrl: 'templates/contact.html',
                controller: 'ContactCtrl',
                resolve: {
                    "currentAuth": function(Auth, $state, $ionicPopup) {
                        Auth.$requireAuth().then(function(data) {
                            console.log(data);
                        }).catch(function(error) {
                            $ionicPopup.confirm({
                                title: 'No login',
                                content: 'You need to be logged in to access'
                            });
                            $state.go('login');
                            console.log(error);
                        });
                    }
                }
            }
        }
    })

    .state('app.register', {
        url: '/register',
        views: {
            'menuContent': {
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl',
                resolve: {
                    "currentAuth": function(Auth, $state, $ionicPopup) {
                        Auth.$requireAuth().then(function(data) {
                            console.log("WE have");
                            //$state.go('app.register');
                        }).catch(function(error) {
                            $ionicPopup.confirm({
                                title: 'No login',
                                content: 'You need to be logged in to access'
                            });
                            $state.go('login');
                            console.log(error);
                        });
                    },
                    "referenceNumber": function(Users, $localStorage, $state, $ionicLoading) {
                        console.log("wtf");
                        console.log(Users.get($localStorage.getObject('userProfile').uid));
                        Users.get($localStorage.getObject('userProfile').uid).$loaded().then(function(user) {
                            console.log(user)
                            console.log("Looking for the user info");
                            if (!user.payment.referenceNumber) {
                                /*There is a new user thus doesnt have a reference number*/
                                console.log("=(");
                                $ionicLoading.hide();
                                $state.go('uploadReference')
                            } else {
                                /* There is a reference number so we should check the status of it in the upaep api
                                 *
                                 *  And update the value of user.payment.paymentStatus with the value of the http request
                                 *  Dont forget to $save()
                                 */
                                console.log("we have reference");
                                //$ionicLoading.hide();
                                console.log(user)
                                return user;
                            }

                        });
                    }
                }
            }
        }
    })

    .state('uploadReference', {
        url: '/reference',
        templateUrl: 'templates/reference.html',
        controller: 'ReferenceCtrl',
        resolve: {
            "referencesList": function(References) {
                return References.all();
            }
        }

    })

    .state('app.about', {
        url: '/about',
        views: {
            'menuContent': {
                templateUrl: 'templates/about.html',
                controller: 'AboutCtrl',
                resolve: {
                    "currentAuth": function(Auth, $state, $ionicPopup) {
                        Auth.$requireAuth().then(function(data) {
                            console.log(data);
                            if (data.password.isTemporaryPassword) {
                                $state.go('resetPassword');
                            }
                        }).catch(function(error) {
                            console.log(error);
                        });
                    }
                }
            }
        }
    })

    .state('app.recomendations', {
        url: '/recomendations',
        views: {
            'menuContent': {
                templateUrl: 'templates/recomendations.html',
                controller: 'RecomendationsCtrl',
                resolve: {
                    "currentAuth": function(Auth, $state, $ionicPopup) {
                        Auth.$requireAuth().then(function(data) {
                            console.log(data);
                            if (data.password.isTemporaryPassword) {
                                $state.go('resetPassword');
                            }
                        }).catch(function(error) {
                            console.log(error);
                        });
                    }
                }
            }
        }
    })

    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

    $translateProvider.translations('en', {
        menu: {
            schedule: "Schedule",
            favorites: "Favorites",
            speakers: "Speakers",
            contact: "Contact",
            about: "About",
            register: "Register",
            recomendations: "Recomendations"
        },
        login: {
            loading: "Loading",
            header_label: "Login",
            close_nutton: "Close",
            email_label: "ENTER EMAIL",
            email_placeholder: "example@mail.com",
            password_label: "ENTER PASSWORD",
            password_placeholder: "PASSWORD",
            login_button: "Login",
            register_button: "create an account",
            first_modal_header: "Register",
            or_label: "or",
            required: "REQUIRED",
            name_header: "Name",
            name_placeholder: "NAME",
            surname_header: "Surname",
            surname_placeholder: "Doe",
            country_label: "COUNTRY",
            country_placeholder: "Mexico",
            state_header: "State",
            state_label: "State",
            afiliation_label: "Afiliation (ex: UPAEP)",
            afiliation_placeholder: "UPAEP",
            modality_label: "Modality",
            modality_placeholder: "Student",
            country_header: "Countries",
            states_header: "States",
            modality_header: "Modalities",
            recovery_header: "Recover Password",
            recovery_button: "Reset Password"

        },
        reset: {
            reset_header: "Reset Password",
            new_password: "ENTER NEW PASSWORD",
            repeat: "REPEAT NEW PASSWORD",
            reset_button: "Create new Password"
        },
        schedule: {
            schedule_header: "Schedule",
            month: "April",
            by_speaker: "by",
            wednesday: "Wednesday",
            thursday: "Thursday",
            friday: "Friday"
        },
        mySchedule: {
            name: "Favorites",
            myschedule_header: "Favorites",
            by_speaker: "by"
        },
        speakers: {
            header: "Speakers"
        },
        detailSpeaker: {
            header: "Detail Speaker"
        },
        detailEvent: {
            header: "Detail Event",
            speaker_divider: "Speaker",
            remove_button: "Remove from Favorites",
            add_button: "Add to Favorites",
            review_button: "Review this Event",
            description: "Description",
            sessions: "Sessions"
        },
        contact: {
            header: "Contact",
            button_mail: "Contact Us",
            button_call: "Call us"
        },
        about: {
            header: "About",
            button_drive: "Drive to UPAEP",
            button_wifi: "Wifi Connection",
            button_devs: "Developers info",
            developers_header: "Developers",
            leader: "Team Leader",
            member: "Team Member",
            design: "The UX expert"
        },
        register: {
            scholarship: "Scholarship",
            header: "Register",
            status: "Payment Status",
            number: "Reference Number",
            kit: "Kit Delivered",
            button: "Agregar"
        },
        recomendations: {},
        review: {
            header: "Review",
            comment: "COMMENTS",
            placeholder: "ENTER THE COMMENTS",
            button: "Review this Event"
        }
    });

    $translateProvider.translations('es', {
        menu: {
            schedule: "Agenda",
            favorites: "Favoritos",
            speakers: "Conferencistas",
            contact: "Contacto",
            about: "Acerca de",
            register: "Registro",
            recomendations: "Recomendaciones"
        },
        login: {
            loading: "Cargando",
            header_label: "Login",
            close_nutton: "Cerrar",
            email_label: "CORREO ELECTRONICO",
            email_placeholder: "ejemplo@mail.com",
            password_label: "CONTRASEÑA",
            password_placeholder: "CONTRASEÑA",
            login_button: "Login",
            register_button: "Crear una cuenta",
            or_label: "o",
            required: "NECESARIO",
            first_modal_header: "Registro",
            name_header: "Nombre",
            name_placeholder: "Juan",
            surname_header: "Perez",
            surname_placeholder: "Perez",
            country_label: "PAIS",
            country_placeholder: "Mexico",
            state_header: "Estados",
            state_label: "Estado",
            afiliation_label: "Organización",
            afiliation_placeholder: "UPAEP",
            modality_label: "Modalidad",
            modality_placeholder: "Estudiante",
            country_header: "Paises",
            states_header: "Estados",
            modality_header: "Modalidades",
            recovery_header: "Recuperar Contraseña",
            recovery_button: "Resetear"

        },
        reset: {
            reset_header: "Resetear Contraseña",
            new_password: "NUEVA CONTRASEÑA",
            repeat: "REPETIR CONTRASEÑA",
            reset_button: "Crear nueva Contraseña"
        },
        schedule: {
            schedule_header: "Agenda",
            month: "Abril",
            by_speaker: "por",
            wednesday: "Miercoles",
            thursday: "Jueves",
            friday: "Viernes"
        },
        mySchedule: {
            name: "Favoritos",
            myschedule_header: "Favoritos",
            by_speaker: "por"
        },
        speakers: {
            header: "Conferencistas"
        },
        detailSpeaker: {
            header: "Detalle Conferencistas"
        },
        detailEvent: {
            header: "Detalle Evento",
            speaker_divider: "Conferencista",
            add_button: "Agregar Favoritos",
            remove_button: "Remover Favoritos",
            review_button: "Calificar",
            description: "Descripción",
            sessions: "Sesiones"
        },
        contact: {
            header: "Contacto",
            button_mail: "Contactanos",
            button_call: "Llamanos"
        },
        about: {
            header: "Acerca",
            button_drive: "Navega a UPAEP",
            button_wifi: "Wifi Configuración",
            button_devs: "Desarrolladores",
            developers_header: "Desarrolladores",
            leader: "Lider Equipo",
            memnber: "Miembro Equipo",
            design: "Experto en UX"
        },
        register: {
            scholarship: "Becas",
            header: "Registro",
            status: "Estado del Pago",
            number: "Numero Referencia",
            kit: "Kit entregado",
            button: "Agregar"
        },
        recomendations: {},
        review: {
            header: "Calificar",
            comment: "COMENTARIOS",
            placeholder: "ESCRIBE LOS COMENTARIOS",
            button: "Calificar este EVENTO"
        }
    });

    var locale = 'en';

    if (navigator.language) {
        if (navigator.language.split('-')[0] == "es" || navigator.language.split('-')[0] == "en") {
            locale = navigator.language.split('-')[0];
        }
    }

    $translateProvider.preferredLanguage(locale);
    $translateProvider.fallbackLanguage(locale);
    $translateProvider.useSanitizeValueStrategy('');


});
