console.log("common1.js");

let ALL_ALBUMS = [];

db.collection("miscellaneous")
  .doc("allAlbums")
  .onSnapshot((snap) => {
    ALL_ALBUMS = [];
    let snapData = snap.data();
    console.log(snapData.allAlbums);
    ALL_ALBUMS = snapData.allAlbums;
    console.log(ALL_ALBUMS, typeof ALL_ALBUMS);
    if (typeof ALL_ALBUMS !== "undefined") {
      // sortAlbums();
      displayLeaderBoard();
    }
  });

const sortAlbums = () => {
  function descreacingOrder(a, b) {
    return b.votes - a.votes;
  }
  ALL_ALBUMS.sort(descreacingOrder);
};

let allAlbumsListHTML = document.querySelector("#all-albums-list");

const displayLeaderBoard = () => {
  // console.log(ALL_ALBUMS);
  let li = "";
  let rank = 1;
  let maxVotes = ALL_ALBUMS[0].votes;
  ALL_ALBUMS.forEach((album, index) => {
    if (album.votes < maxVotes) {
      maxVotes = album.votes;
      rank++;
    }
    let inc = false;
    let dec = false;

    if (album.currentRank > rank) {
      inc = album.currentRank - rank;
    } else {
      dec = rank - album.maxRank;
    }

    let rankStatus = "";
    if (inc) {
      rankStatus = `<i style="color: green" class="fa fa-arrow-up">${inc}</i>`;
    } else {
      if (dec === 0) {
        rankStatus = `<i style="color: green" class="fa fa-arrow-right">${dec}</i>`;
      } else {
        rankStatus = `<i style="color: green" class="fa fa-arrow-down">${dec}</i>`;
      }
    }
    
    li += `
    <li style="background-color: #420202a2">
      <div class="row">
        <div class="col-xs-12 col-sm-2 col-lg-2 date">
          <h1>#${rank}</h1>
          <span>${album.userName}</span>
          <h5>
            ${rankStatus}
          </h5>
        </div>
        <div class="col-xs-12 col-sm-2 col-lg-3">
          <a href="#"
            ><img
              src="${album.img.url}"
              class="img-responsive resImg"
              alt="${album.userName} remixe"
          /></a>
        </div>
        <div class="col-xs-12 col-sm-4 col-lg-4">
          <h5>
            <a
              href="#"
              data-toggle="modal"
              data-target="#blogdetail"
              >Manchale[ ${album.name} Remix]</a
            >
          </h5>
          <p>
            ${album.description}
          </p>
          <iframe
            width="100%"
            height="95"
            src="https://www.youtube.com/embed/${album.link.substring(17)}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            gesture="media"
            allow="encrypted-media"
          ></iframe>
        </div>
        <div
          class="voting col-xs-12 col-sm-3 col-lg-3 date"
          style="background-color: transparent !important"
        >
          <h2 >
            <div>
              <i data-index="${index}" onclick="voteClick(event, this)"
                class="heart fa fa-heart-o "
                style="
                  background-color: transparent !important ;
                  padding: 12px;
                  border-radius: 0px;
                  cursor: pointer;
                  font-size: 15px;
                  border: 1px solid white;
                  margin-bottom: 2%;
                "
                >&nbsp;Vote
              </i>
            </div>
          </h2>
          <span
          id="shareMe${index}"
          onclick=showIcon("shareMe${index}",${index})
            ><i
              class="star fa fa-share"
              style="
                background-color: transparent !important ;
                padding: 12px;
                border-radius: 0px;
                cursor: pointer;
                font-size: 15px;
                border: 1px solid white;
                margin-bottom: 2%;
              "
          
              >&nbsp;Share</i
            ></span
          >
          <span style="visibility:hidden" id="socialIcons${index}">
          <br>

        
          <a href="https://api.whatsapp.com/send?text=https://remixmeofficial.web.app#blockblack" data-action="share/whatsapp/share"> <i  style="color:green" class="hoverIcon fa fa-whatsapp"></i> </a>
        
          <a href="https://twitter.com/intent/tweet?text=https://remixmeofficial.web.app#blockblack"><i  style="color:blue " class="hoverIcon fa fa-twitter"></i> </a>
          <a onclick="copyWebLink()" style="cursor:pointer"><i  style="color:black "  class="hoverIcon fa fa-link"></i> </a>
          <div class="fb-share-button"  id="fb${index}" style="visibility:hidden" 
          data-href="https://remixmeofficial.web.app#blockblack" 
          data-layout="button_count">
          </div>
          </span>
        </div>
      </div>
    </li>
    <br />
    `;
  });


  allAlbumsListHTML.innerHTML = "";
  allAlbumsListHTML.innerHTML += li;
};
var counter=0;
var count=0
function showIcon(id,index){

  
      document.getElementById("socialIcons"+index).style.visibility="visible"
      document.getElementById("fb"+index).style.visibility="visible"
      setTimeout(function(){
        document.getElementById("socialIcons"+index).style.visibility="hidden"
        document.getElementById("fb"+index).style.visibility="hidden"
      },5000)
    
  
    

}
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const copyWebLink = (e) => {
  let tempInput = document.createElement("input");
  tempInput.style = "position: absolute; left: -1000px; top: -1000px";
  tempInput.value = "https://remixmeofficial.web.app#blockblack";
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
};


// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const voteClick = (e, current) => {
  if(UDATA) {
  current.classList.toggle("fa-heart");
  current.classList.toggle("fa-heart-o");
  let index = Number(e.target.dataset.index);
  if (current.classList[2] === "fa-heart") {
    // add the vote
    ALL_ALBUMS[index].votes++;
    // console.log(ALL_ALBUMS[index].votes);
  } else {
    // decrement the vote
    if (ALL_ALBUMS[index].votes >= 1) {
      ALL_ALBUMS[index].votes--;
    }
  }
  reCallRank();

  console.log(ALL_ALBUMS);

  let albumRef = db.collection("miscellaneous").doc("allAlbums");
  albumRef
    .get()
    .then((snap) => {
      let snapData = snap.data();
      snapData.allAlbums = ALL_ALBUMS;

      return albumRef.update(snapData);
    })
    .then(() => {
      console.log("votes updated");
      // display success message
    })
    .catch((error) => {
      let errorMessage = error.message;
      console.log(errorMessage);
      // display error, vote not updated
    });
  } else {
    // display redirect message, user not signed in.
    // console.log("redirect");
    window.location = './Auth/login.html';
  }
};

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const reCallRank = () => {
  sortAlbums();
  let maxRank = 1;
  let maxVotes = ALL_ALBUMS[0].votes;

  ALL_ALBUMS.map((album) => {
    if (album.votes < maxVotes) {
      maxRank++;
      maxVotes = album.votes;
    }
    if (maxRank < album.maxRank) {
      album.maxRank = maxRank;
    } else {
      album.currentRank = maxRank;
    }
  });
};

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let getInTouchHTML = document.querySelector("#getInTouch");

const getInTouchSubmit = (e) => {
  e.preventDefault();
  let name = getInTouchHTML["name"].value;
  let email = getInTouchHTML["email"].value;
  let message = getInTouchHTML["message"].value;
  let userId = false;

  if (UDATA) {
    userId = UDATA.docId;
  }

  db.collection("message")
    .add({
      name: name,
      email: email,
      message: message,
      userId: userId,
    })
    .then(() => {
      getInTouchHTML.reset();
      // console.log("message saved");
      // display success
    })
    .catch((error) => {
      let errorMessage = error.message;
      console.log(errorMessage);
      // display error
    });
};

getInTouchHTML.addEventListener("submit", getInTouchSubmit);
