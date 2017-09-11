// establish connection with content.js and listen
chrome.runtime.onConnect.addListener(function(port) {
    if (port.name == 'cPort') {
      port.onMessage.addListener(function(msg) {
        if (msg.connection === true) {
          port.postMessage({ sender: 'background', connection: true });
        }
        if (msg.path) requestMix(port, msg.path);
        if (msg.match) updatePopupState(msg, tracklist);
      });
    }
    if (port.name == 'pPort') {
      port.onMessage.addListener(function(msg) {
        if (msg.connection === true) {
          port.postMessage({ sender: 'background', connection: true });
        }
        if (msg.state) {
          port.postMessage({ state: renderPopup(popupState.state) });
        }
      });
    }
});

let apihost = 'http://localhost:3000'
let tracklist = [];

function requestMix(port, path) {
  // - recieve path from content.js
  // - perform API query using url: /:user/:mix
  // - return tracklist to popup and update content.js
  axios.get(`${apihost}/api/mixes${path}`)
    .then(function(response) {
      console.log(response);
      if (response.data.Response === 'no results found') {
        console.log('no results found');
        // move popup state to 'add mix'
      }
      else {
        tracklist = response.data.Response.tracks;
        const times = tracklist.map(function(e) {
          if (e.start) return e.start;
        });
        // Send tracklist times to content.js
        port.postMessage({ tracklist: times })
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

// The following functions deal with the state and rendering of the popup
let popupState = {
  state: null
}

function updatePopupState(msg, tracklist){
  popupState.state = tracklist.find(function(e) {
    if (msg.match >= e.start && msg.match <= e.end) return e;
  });
}

function renderPopup(state){
  console.log(state)
  if (!state) return `<div>Current track missing.</div>`
  else return `<div>${state.track.title}</div>`
}
