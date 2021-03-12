console.log("index1.js");
const auth = firebase.auth();
const db = firebase.firestore();
const fStorage = firebase.storage();

const UDATA = false;

auth.onAuthStateChanged((user) => {
  if (user) {
    window.location.replace("./Dashbord/dashboard.html");
  } else {
    
  }
});

