import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyB20Ve7X7p16mTTbBzpHavd8l0TyYYaAEI",
    authDomain: "uhack-4896d.firebaseapp.com",
    databaseURL: "https://uhack-4896d.firebaseio.com",
    projectId: "uhack-4896d",
    storageBucket: "uhack-4896d.appspot.com",
    messagingSenderId: "236984738516"
};
firebase.initializeApp(config);

export default firebase;