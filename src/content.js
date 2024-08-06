// Create and append sidebar
let sidebar = document.createElement('div');
sidebar.id = 'yt-summary-sidebar';
sidebar.innerHTML = `
  <div id="yt-summary-header">
    <h3>Summary</h3>
    <button id="yt-summary-close">×</button>
  </div>
  <div id="yt-summary-content"></div>
`;
sidebar.style.cssText = `
  position: fixed;
  width: 250px;
  height: auto;
  max-height: 300px;
  background: #000000;
  color: #ffffff;
  box-shadow: -2px 0 5px rgba(0,0,0,0.3);
  transition: opacity 0.3s ease;
  z-index: 2000;
  border-radius: 8px;
  overflow-y: auto;
  opacity: 0;
  cursor: move;
`;
document.body.appendChild(sidebar);

// Style the header and content
let style = document.createElement('style');
style.textContent = `
  #yt-summary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: #222222;
    border-bottom: 1px solid #333333;
    cursor: move;
  }
  #yt-summary-header h3 {
    margin: 0;
    font-size: 16px;
    color: #ffffff;
  }
  #yt-summary-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #ffffff;
  }
  #yt-summary-content {
    padding: 10px;
    font-size: 13px;
    line-height: 1.4;
  }
`;
document.head.appendChild(style);

// Function to show sidebar
function showSidebar(x, y) {
  sidebar.style.left = `${x}px`;
  sidebar.style.top = `${y}px`;
  sidebar.style.opacity = '1';
}

// Function to hide sidebar
function hideSidebar() {
  sidebar.style.opacity = '0';
}

// Close button functionality
document.getElementById('yt-summary-close').addEventListener('click', hideSidebar);

// Update event listener
document.addEventListener('mouseover', function(event) {
  let target = event.target.closest('a#thumbnail');
  if (target && isExtensionValid()) {
    let videoId = new URL(target.href).searchParams.get('v');
    if (videoId) {
      console.log(`Video ID: ${videoId}`);
      showSidebar(event.clientX, event.clientY);
      updateSidebar('Loading summary...');
      
      chrome.runtime.sendMessage({type: "GET_SUMMARY", videoId: videoId}, function(response) {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError.message);
          updateSidebar("Error fetching summary. Please try refreshing the page.");
        } else {
          console.log(`Summary: ${response.summary}`);
          updateSidebar(response.summary);
        }
      });
    }
  } else if (!isExtensionValid()) {
    console.error("Extension context is invalid");
  }
});

function isExtensionValid() {
  return typeof chrome !== 'undefined' && chrome.runtime && !!chrome.runtime.id;
}

function updateSidebar(summary) {
  document.getElementById('yt-summary-content').innerHTML = `<p>${summary}</p>`;
}

// Add drag functionality
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

sidebar.addEventListener('mousedown', function(event) {
  if (event.target.id !== 'yt-summary-close') {
    isDragging = true;
    offsetX = event.clientX - sidebar.getBoundingClientRect().left;
    offsetY = event.clientY - sidebar.getBoundingClientRect().top;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
});

function onMouseMove(event) {
  if (isDragging) {
    sidebar.style.left = `${event.clientX - offsetX}px`;
    sidebar.style.top = `${event.clientY - offsetY}px`;
  }
}

function onMouseUp() {
  isDragging = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}
