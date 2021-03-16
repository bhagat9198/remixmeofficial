console.log("user1.js");
const auth = firebase.auth();
const db = firebase.firestore();
// const fStorage = firebase.storage();

let ALBUM_DATA = null;
let DOC_ID = null;
let U_REF = null;
let UDATA = null;

const getUrl = async () => {
  let windowUrl = window.location.href;
  let quries = windowUrl.split("?");
  DOC_ID = quries[1].split("=")[1];
};
getUrl()
  .then(() => {
    return db.collection("miscellaneous").doc("allAlbums").get();
  })
  .then(async (albumSnap) => {
    let allAlbums = albumSnap.data().allAlbums;
    let indexOf = allAlbums.map((el) => el.userDocId).indexOf(DOC_ID);
    ALBUM_DATA = allAlbums[indexOf];
    displayAlbumData();

    let context = null;
    await auth.onAuthStateChanged((user) => {
      if (!user) {
        // throw new Error("User is not loggedIn");
        throw "User is not loggedIn";
      } else {
        context = user;
      }
    });
    // console.log(context);
    if (context) {
      U_REF = db.collection("users").doc(context.uid);
      return U_REF.get();
    }
  })
  .then((userSnap) => {
    UDATA = userSnap.data();
    UDATA.uId = userSnap.id;
    // console.log(UDATA);
    return;
  })
  .catch((error) => {
    let errorMessage = error.message;
    console.log(errorMessage);
    // display error message
  });

let albumPicHTML = document.querySelector("#album-pic");
let utubePlayerHTML = document.querySelector("#utube-player");
let albumNameHTML = document.querySelector("#album-name");
let ablumUsernameHTML = document.querySelector("#ablum-username");
let albumDescriptionHTML = document.querySelector("#album-description");
let albumSignHTML = document.querySelector("#album-sign");

const displayAlbumData = () => {
  // console.log(ALBUM_DATA);
  albumPicHTML.src = ALBUM_DATA.img.url;
  utubePlayerHTML.src = `https://www.youtube.com/embed/${ALBUM_DATA.link.substring(
    17
  )}`;
  albumNameHTML.innerHTML = `Manchale[ ${ALBUM_DATA.name} Remix]`;
  let d = new Date(Number(ALBUM_DATA.uploadedAt.seconds) * 1000).toString();
  d = d.substring(0, 15);
  ablumUsernameHTML.innerHTML = `${ALBUM_DATA.userName}  ${d}`;
  albumDescriptionHTML.innerHTML = `<p>${ALBUM_DATA.description}</p>`;
  albumSignHTML.innerHTML = ALBUM_DATA.name;
};

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let ALL_COMMENTS = [];

db.collection("comments")
  .doc(DOC_ID)
  .onSnapshot((cSnap) => {
    if (cSnap.exists) {
      ALL_COMMENTS = cSnap.data().comments;
      displayComments();
    }
  });

let allCommentsHolderHTML = document.querySelector("#all-comments-holder");
const displayComments = () => {
  let li = "";
  ALL_COMMENTS.map((c) => {
    let d = new Date(c.commentAt).toString();
    d = d.substring(0, 24);
    li += `
    <li class="list-group-item" >
      <div class="row">
        <div class="col-xs-2 col-md-1">
          <img
            src="http://placehold.it/80"
            class="img-circle img-responsive"
            alt=""
          />
        </div>
        <div class="col-xs-10 col-md-11">
          <div>
            <div class="mic-info">
              By: ${c.byName} ${d}
            </div>
          </div>
          <div class="comment-text">${c.comment}</div>
        </div>
      </div>
    </li>
    `;
  });
  allCommentsHolderHTML.innerHTML = li;
};

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let commentBoxHTML = document.querySelector("#comment-box");
let sendMessageButtonHTML = document.querySelector("#sendMessageButton");

const enterComment = (e) => {
  e.preventDefault();
  if (e.keyCode === 13) {
    // console.log(comment);
    if (commentBoxHTML.value) {
      if (UDATA) {
        submitComment();
      } else {
        // display redirect message
        window.location.href = `./../Auth/login.html`;
      }
    }
  }
};

commentBoxHTML.addEventListener("keyup", enterComment);

const clickComment = (e) => {
  e.preventDefault();
  if (commentBoxHTML.value) {
    if (UDATA) {
      submitComment();
    } else {
      // display redirect message
      window.location.href = `./../Auth/login.html`;
    }
  }
};

sendMessageButtonHTML.addEventListener("click", clickComment);

const submitComment = async () => {
  // console.log("submitComment");
  let cRef = db.collection("comments").doc(DOC_ID);
  let cData = {
    comment: commentBoxHTML.value,
    byId: UDATA.uId,
    byName: UDATA.name,
    commentAt: new Date().valueOf(),
  };
  await cRef
    .get()
    .then((cSnap) => {
      if (cSnap.exists) {
        let cSnapData = cSnap.data();
        cSnapData.comments.unshift(cData);
        cRef
          .update(cSnapData)
          .then(() => {
            commentBoxHTML.value = "";
            console.log("comment added");
          })
          .catch((error) => {
            let errorMessage = error.message;
            console.log(errorMessage);
            // display error message
          });
      } else {
        cRef
          .set({ comments: [cData] })
          .then(() => {
            commentBoxHTML.value = "";
            console.log("comment added");
          })
          .catch((error) => {
            let errorMessage = error.message;
            console.log(errorMessage);
            // display error message
          });
      }
    })
    .catch((error) => {
      let errorMessage = error.message;
      console.log(errorMessage);
      // display error message
    });
};
