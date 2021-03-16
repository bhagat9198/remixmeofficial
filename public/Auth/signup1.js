console.log("signup1.js");
const auth = firebase.auth();
const db = firebase.firestore();
const createAccountFormHTML = document.querySelector("#create-account-form");

const  currentSignedUser = auth.currentUser;
if (currentSignedUser) {
  window.location.replace('./../index.html');
}

const createAccountForm = (e) => {
  e.preventDefault();
  const password = createAccountFormHTML["password"].value;
  const cpassword = createAccountFormHTML["cpassword"].value;
  if (password === cpassword) {
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
      votes: []
    };

    auth
    .createUserWithEmailAndPassword(email, password)
    .then(async(userCredential) => {
      // console.log(userCredential);
      // let user = userCredential.user;
      let userId = userCredential.user.uid;
      // console.log(userId);
      data.logInHistory.push(new Date().valueOf().toString());
      await db.collection('users').doc(userId).set(data);
      console.log(data, typeof data.logInHistory);
      window.location.replace('./../Dashbord/dashboard.html');
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(error, errorCode, errorMessage);
    });
  }

  
};

createAccountFormHTML.addEventListener("submit", createAccountForm);
