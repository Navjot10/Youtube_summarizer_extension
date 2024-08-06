chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_SUMMARY") {
    let videoId = message.videoId;
    console.log(`Received video ID: ${videoId}`);
    fetchTranscript(videoId).then(transcript => {
      return getSummary(transcript);
    }).then(summary => {
      sendResponse({summary: summary});
    }).catch(error => {
      console.error("Error in GET_SUMMARY listener:", error);
      sendResponse({error: error.toString()});
    });
    return true;  
  }
});

async function fetchTranscript(videoId) {
  try {
    console.log(`Fetching transcript for video ID: ${videoId}`);
    let response = await fetch(`http://localhost:5001/get_transcript?video_id=${videoId}`);
    let data = await response.json();
    if (data.error) {
      console.error("Error fetching transcript:", data.error);
      return "Error fetching transcript.";
    }
    console.log(`Transcript: ${data.transcript}`);
    return data.transcript;
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return "Error fetching transcript.";
  }
}

async function getSummary(transcript) {
  try {
    console.log("Fetching summary from Node.js server");

    let response = await fetch('http://localhost:5002/get_summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ transcript })
    });

    if (!response.ok) {
      console.error("Error in server response:", response.status, response.statusText);
      throw new Error(`Server request failed with status ${response.status}`);
    }

    let data = await response.json();
    console.log(`Summary: ${data.summary}`);
    return data.summary;
  } catch (error) {
    console.error("Error fetching summary:", error);
    return "Error fetching summary.";
  }
}
