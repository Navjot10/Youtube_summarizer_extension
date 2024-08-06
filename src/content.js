document.addEventListener('mouseover', function(event) {
  let target = event.target.closest('a#thumbnail');
  if (target && isExtensionValid()) {
    let videoId = new URL(target.href).searchParams.get('v');
    if (videoId) {
      console.log(`Video ID: ${videoId}`);
      
      chrome.runtime.sendMessage({type: "GET_SUMMARY", videoId: videoId}, function(response) {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError.message);
          showTooltip(target, "Error fetching summary. Please try refreshing the page.");
        } else {
          console.log(`Summary: ${response.summary}`);
          showTooltip(target, response.summary);
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

function showTooltip(target, summary) {
  let tooltip = document.createElement('div');
  tooltip.innerText = summary;
  tooltip.style.position = 'absolute';
  tooltip.style.background = '#000';
  tooltip.style.color = '#fff';
  tooltip.style.padding = '10px';
  tooltip.style.borderRadius = '5px';
  tooltip.style.zIndex = '1000';
  document.body.appendChild(tooltip);

  let rect = target.getBoundingClientRect();
  tooltip.style.top = `${rect.top + window.scrollY + rect.height}px`;
  tooltip.style.left = `${rect.left + window.scrollX}px`;

  target.addEventListener('mouseleave', function() {
    tooltip.remove();
  }, {once: true});
}
