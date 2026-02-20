importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js")

firebase.initializeApp({
  apiKey: "AIzaSyAQoHQsjtLO3uuhcBVdA-UbA4t0qhq8mSw",
  authDomain: "nextteams-e9a45.firebaseapp.com",
  projectId: "nextteams-e9a45",
  storageBucket: "nextteams-e9a45.firebasestorage.app",
  messagingSenderId: "822130706738",
  appId: "1:822130706738:web:2e132c4c6b08d2c7f0ef2b"
})

const messaging = firebase.messaging()
