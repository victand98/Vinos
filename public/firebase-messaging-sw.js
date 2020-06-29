importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
//firebase message
firebase.initializeApp({
    'messagingSenderId': '478511155326'
});
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {

});
