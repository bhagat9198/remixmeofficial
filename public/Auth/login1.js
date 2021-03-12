console.log("login.js");
const auth = firebase.auth();
const db = firebase.firestore();
const signinFormHTML = document.querySelector("#signin-form");

let USER_ID = false;
auth.onAuthStateChanged(async (user) => {
  if (user) {
    if (USER_ID) {
      let dbRef = await db.collection("users").doc(USER_ID);
      dbRef
        .get()
        .then(async (snap) => {
          let snapData = snap.data();
          console.log(snapData);
          console.log(snapData.logInHistory, typeof snapData.logInHistory);
          snapData.logInHistory.push(new Date().valueOf().toString());
          console.log(snapData.logInHistory);
          await dbRef.update(snapData);
          window.location.replace("./../Dashbord/dashboard.html");
        })
        .catch((error) => {
          let errorMessage = error.message;
          console.log(errorMessage);
        });
    } else {
      console.log("aaaaaa");
      window.history.back();
    }
  }
});

const signinForm = (e) => {
  e.preventDefault();
  const email = signinFormHTML["email"].value;
  const password = signinFormHTML["password"].value;
  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      USER_ID = userCredential.user.uid;
    })
    .catch((error) => {
      // let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorMessage);
    });
};

signinFormHTML.addEventListener("submit", signinForm);
