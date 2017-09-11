// establish connection with background.js
var port = chrome.runtime.connect({ name: 'cPort' });
if (port) port.postMessage({ sender: 'content',  connection: true });
port.onMessage.addListener(function(msg) {
  console.log(msg);
  if (msg.connection === true) {
    port.postMessage({ path: targetPath });
  }
  if (msg.tracklist) {
    tracklist = msg.tracklist
    observer.observe(timePassed, observerConfig)
  }
});

// Declare tracklist & config for observer
var tracklist = [];
var observerConfig = {
  attributes: true,
  childList: true,
  characterData: true,
  subtree: true,
};

var observer = new MutationObserver(function(mutations){
  mutations.forEach(function(mutation){
    var time = mutation.addedNodes[1].innerText;
    console.log(time);
      if (tracklist.includes(time)){
      console.log('match');
      port.postMessage({ match: time});
    }
  });
});

// Declare nodes to watch
var targetUrl = document.getElementsByClassName('playbackSoundBadge__title')[0].firstElementChild.href;
var targetPath = targetUrl.slice(22, targetUrl.length);
var targetText = document.getElementsByClassName('playbackSoundBadge__title')[0].firstElementChild.title;

var timePassed = document.getElementsByClassName('playbackTimeline__timePassed')[0];
var timeDuration = document.getElementsByClassName('playbackTimeline__duration')[0].lastChild.innerText;
