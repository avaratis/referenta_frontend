// Array of hints
const hints = ["+486% durchschnittliche Produktivitätssteigerung im Test", "100.000+ verschiedene Textarten", "1-1000+ Geeignet für Einzelpersonen oder große Teams", "An den Nutzer angepasste und trainierte Large Language Models mit Hugging Transformers", "Trainiert auf 100.000 deutschen Reden"];

function showLoadingScreen() {
  const modal = document.createElement('div');
  modal.className = 'loading-modal';  // assign a new class
  modal.innerHTML = `
    <div class="loading-screen">
      <div class="loading-spinner"></div>
      <p id="hint-text"></p>
    </div>
  `;

  // Display the modal
  document.body.appendChild(modal);

  // Start cycling through hints
  let hintIndex = 0;
  document.getElementById('hint-text').innerText = hints[hintIndex];
  setInterval(() => {
    hintIndex = (hintIndex + 1) % hints.length; // Loop back to the start when reaching the end
    document.getElementById('hint-text').innerText = hints[hintIndex];
  }, 5000); // Change hint every 5 seconds
}

function hideLoadingScreen() {
  const modal = document.querySelector('.loading-modal');
  if (modal) {
    document.body.removeChild(modal);
  }
}


  function showChatReply(tabId) {
    // Hide all chat replies
    const chatReplies = document.querySelectorAll('.chat-reply');
    chatReplies.forEach((reply) => (reply.style.display = 'none'));
  
    // Show the clicked chat reply
    const selectedReply = document.getElementById(tabId);
    if (selectedReply) {
      selectedReply.style.display = 'block';
    }
  }
