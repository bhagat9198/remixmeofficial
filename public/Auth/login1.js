console.log("login.js");
const auth = firebase.auth();
const db = firebase.firestore();

const signinFormHTML = document.querySelector("#signin-form");
let USER_ID = false;
document.getElementById("loader").style.display = "none";

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

auth.onAuthStateChanged(async (user) => {
  if (user) {
    document.getElementById("loader").style.display = "inline-block";
    if (USER_ID) {
      document.getElementById("loader").style.display = "inline-block";
      // let dbRef = await db.collection("users").doc(USER_ID);
      // dbRef
      //   .get()
      //   .then(async (snap) => {
      //     let snapData = snap.data();
      //     console.log(snapData);
      //     console.log(snapData.logInHistory, typeof snapData.logInHistory);
      //     snapData.logInHistory.push(new Date().valueOf().toString());
      //     console.log(snapData.logInHistory);
      //     await dbRef.update(snapData);
      // window.location.replace("./../Dashboard/dashboard.html");
      // })
      // .catch((error) => {
      //   let errorMessage = error.message;
      //   console.log(errorMessage);
      // });

      window.location.replace("./../Dashboard/dashboard.html");
    } else {
      document.getElementById("loader").style.display = "none";
      window.history.back();
    }
  }
});

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
      alert(error);
    });
};

signinFormHTML.addEventListener("submit", signinForm);

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
