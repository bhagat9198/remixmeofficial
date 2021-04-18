console.log("dashboard1.js");
const auth = firebase.auth();
const db = firebase.firestore();
const fStorage = firebase.storage();
let IMAGE = null;
let VERIFY_LINK = false;
let U_REF = false;
let UDATA = null;

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

auth.onAuthStateChanged((user) => {
  if (user) {
    U_REF = db.collection("users").doc(user.uid);
    U_REF.get().then((snap) => {
      UDATA = { ...snap.data(), docId: user.uid };
      displayLeaderBoard();
    });
  } else {
    window.location.replace("./../index.html");
  }
});

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const logoutBtnHTML = document.querySelector("#logout-btn");

const logout = (e) => {
  auth
    .signOut()
    .then(() => {
      window.location.replace("./../index.html");
    })
    .catch((error) => {
      let errorMessage = error.message;
      console.log(errorMessage);
    });
};

logoutBtnHTML.addEventListener("click", logout);

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getRank = (allAlbumsData) => {
  if (allAlbumsData.length === 0) {
    return 1;
  }
  let maxVotes = allAlbumsData[0].votes;
  let rank = 1;
  allAlbumsData.map((album, index) => {
    if (album.votes < maxVotes) {
      rank++;
      maxVotes = album.votes;
    }
  });
  return rank;
};

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
