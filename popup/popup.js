// MDN link: https://developer.mozilla.org/en-US/Add-ons/Code_snippets/QuerySelector
function $ (selector, el) {
     if (!el) {el = document;}
     return el.querySelector(selector);
}

// Eventlistening for popup content
document.addEventListener('DOMcontentLoaded', function() {
  $('#status').addEventListener('click', function() {

  });
});

const pPort = chrome.runtime.connect({ name: 'pPort' });
pPort.postMessage({ sender: 'popup', connection: true });
pPort.onMessage.addListener(function(msg) {
  if (msg.state) $('#status').innerHTML = msg.state;
});

window.onload = function() {
  pPort.postMessage({ state: true })
};
