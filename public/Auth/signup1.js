console.log("signup1.js");
const auth = firebase.auth();
const db = firebase.firestore();
const createAccountFormHTML = document.querySelector("#create-account-form");
let COUNTER = 0;
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

auth.onAuthStateChanged(async (user) => {
  if (user) {
    if (COUNTER === 0) {
      window.history.back();
    }
  }
});

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let soloRadioHTML = createAccountFormHTML.querySelector("#solo-radio");
let duoRadioHTML = createAccountFormHTML.querySelector("#duo-radio");
let listenerRadioHTML = createAccountFormHTML.querySelector("#listener-radio");

const changePlaceholders = (e) => {
  e.preventDefault();

  if (soloRadioHTML.checked) {
    createAccountFormHTML["userName"].placeholder = "Stage Name / DJ Name";
  }

  if (duoRadioHTML.checked) {
    createAccountFormHTML["userName"].placeholder = "Stage Name / DJ Name";
  }

  if (listenerRadioHTML.checked) {
    createAccountFormHTML["userName"].placeholder = "User Name";
  }
};

soloRadioHTML.addEventListener("change", changePlaceholders);
duoRadioHTML.addEventListener("change", changePlaceholders);
listenerRadioHTML.addEventListener("change", changePlaceholders);

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const createAccountForm = (e) => {
  e.preventDefault();
  console.log(document.getElementById("terms").checked);
  if (!document.getElementById("terms").checked) {
    alert("Please accept the terms and conditions to continue");
    return;
  }
  const password = createAccountFormHTML["password"].value;
  const cpassword = createAccountFormHTML["cpassword"].value;
  if (password != cpassword) {
    alert("Passoword & Confirm password do not match");
    return;
  }
  document.getElementById("loader").style.display = "none";

  const userIs = createAccountFormHTML["userIs"].value;
  const name = createAccountFormHTML["name"].value;
  const userName = createAccountFormHTML["userName"].value;
  const email = createAccountFormHTML["email"].value;
  const dd = createAccountFormHTML["dd"].value;
  const mm = createAccountFormHTML["mm"].value;
  const yyyy = createAccountFormHTML["yyyy"].value;
  const country = createAccountFormHTML["country"].value;

  let data = {
    name: name,
    userName: userName,
    email: email,
    userIs: userIs,
    dob: {
      dd: dd,
      mm: mm,
      yyyy: yyyy,
    },
    country: country,
    logInHistory: [],
    albumUploaded: false,
    votes: [],
  };

  COUNTER++;
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      data.logInHistory.push(new Date().valueOf().toString());
      await db
        .collection("users")
        .doc(userCredential.user.uid)
        .set(data)
        .then(() => {
          document.getElementById("loader").style.display = "none";
          window.location.replace("./../Dashboard/dashboard.html");
        });
    })
    .catch((error) => {
      // let errorCode = error.code;
      let errorMessage = error.message;
      alert(errorMessage)
      document.getElementById("loader").style.display = "none";
      // console.log(error, errorCode, errorMessage);
    });
};

createAccountFormHTML.addEventListener("submit", createAccountForm);

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
