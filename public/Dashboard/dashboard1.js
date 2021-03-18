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

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let uploadImgBtnHTML = document.querySelector("#upload-img-btn");

const uploadImg = (e) => {
  IMAGE = e.target.files[0];
};

uploadImgBtnHTML.addEventListener("change", uploadImg);

let myImg = document.querySelector("#album-cover-img");
myImg.addEventListener("load", function () {
  let realWidth = myImg.naturalWidth;
  let realHeight = myImg.naturalHeight;
  if (realWidth <= 450 && realHeight <= 450) {
    if (!(IMAGE.size <= 350000)) {
      uploadImgBtnHTML.value = "";
      myImg.src = "#";
      IMAGE = null;
    }
  } else {
    uploadImgBtnHTML.value = "";
    myImg.src = "#";
    IMAGE = null;
  }
});

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let urlLinkHTML = document.querySelector("#urlLink");
let UTUBE_ID = null;
const urlLinkVerify = async (e) => {
  e.preventDefault();
  document.getElementById("embed").style.display = "inline-block";
  let url = document.getElementById("getLink").value;
  let urlIds = url.split("/");
  let urlId = urlIds[urlIds.length - 1];
  db.collection("miscellaneous")
    .doc("youtubeIDs")
    .get()
    .then((snapsIds) => {
      let snapsIdsData = snapsIds.data().youtubeIDs;
      let idPresent = snapsIdsData.indexOf(urlId);
      if (idPresent >= 0) {
        console.log("display msg: id already taken, try another");
        // display msg: id already taken, try another
      } else {
        UTUBE_ID = urlId;
        document.getElementById("embed").src =
          "https://www.youtube.com/embed/" + url.substring(17);
        VERIFY_LINK = true;
      }
    });
};

urlLinkHTML.addEventListener("click", urlLinkVerify);

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const uploadAlbumFormHTML = document.querySelector("#upload-album-form");

const uploadAlbumFormSubmit = async (e) => {
  document.getElementById("loader").style.display = "inline-block";
  e.preventDefault();

  if (!VERIFY_LINK) {
    // display error message, link not verified
    return;
  }

  // setTimeout(async function(){
  if (!UDATA.albumUploaded) {
    document.getElementById("loader").style.display = "inline-block";
    let imgName, imgLink;
    if (IMAGE) {
      imgName = `${new Date().valueOf()}__${Math.random()}__${IMAGE.name}`;
      await fStorage
        .ref(`album-pics/${imgName}`)
        .put(IMAGE)
        .then(() => {
          // image Upload
          $("#exampleModal").modal("show");
          document.getElementById("loader").style.display = "none";
        })
        .catch((error) => {
          let errorMessage = error.message;
          // display error message
        });

      await fStorage
        .ref(`album-pics/${imgName}`)
        .getDownloadURL()
        .then((url) => {
          // console.log(url);
          imgLink = url;
        })
        .catch((error) => {
          let errorMessage = error.message;
          // display error message
        });
    } else {
      imgName = null;
      imgLink = null;
    }

    
    let description = uploadAlbumFormHTML["description"].value;
    let utubeLink = uploadAlbumFormHTML["utubeLink"].value;
    if (!utubeLink) {
      alert("Please insert your youtube link");
      document.getElementById("loader").style.display = "none";
    }

    let album_data = {
      description: description,
      link: utubeLink,
      img: {
        name: imgName,
        url: imgLink,
      },
      uploadedAt: new Date().valueOf(),
    };

    let indexOfAlbum = -1;
    let allAlbumRef = db.collection("miscellaneous").doc("allAlbums");
    allAlbumRef
      .get()
      .then((allAlbumSnap) => {
        let allAlbumSnapData = allAlbumSnap.data();
        allAlbumSnapData.allAlbums.sort(function (a, b) {
          return b.votes - a.votes;
        });
        let rank = getRank(allAlbumSnapData.allAlbums);

        allAlbumSnapData.allAlbums.push({
          ...album_data,
          votes: 0,
          maxRank: rank,
          currentRank: rank,
          name: UDATA.name,
          userName: UDATA.userName,
          userDocId: UDATA.docId,
        });
        indexOfAlbum = allAlbumSnapData.allAlbums.length - 1;
        return allAlbumRef.update(allAlbumSnapData);
      })
      .then(() => {
        return U_REF.get();
      })
      .then((snap) => {
        let snapData = snap.data();
        snapData.albumUploaded = true;
        snapData.album = album_data;
        snapData.album.indexOfAlbum = indexOfAlbum;
        // console.log(snapData);
        return U_REF.update(snapData);
      })
      .then(() => {
        return db.collection("miscellaneous").doc("youtubeIDs").get();
      })
      .then((uidsnap) => {
        let uidsnapData = uidsnap.data();
        uidArr = uidsnapData.youtubeIDs;
        uidArr.push(UTUBE_ID);
        return db
          .collection("miscellaneous")
          .doc("youtubeIDs")
          .update(uidsnapData);
      })
      .then(() => {
        $("#blogdetail").modal("hide");
        console.log("updated");
        // success message
      })
      .catch((error) => {
        let errorMessage = error.message;
        console.log(errorMessage);
        // display error, album didnt not get upladed
      });
  } else {
    // error, album already uploaded
    alert("You have already uploaded a track ");
    document.getElementById("loader").style.display = "none";
  }
};

uploadAlbumFormHTML.addEventListener("submit", uploadAlbumFormSubmit);

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
