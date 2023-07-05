// Array of hints
const hints = [
  "Empfangen des API-Aufrufs vom Client",
  "Entgegennahme und Verarbeitung der angeforderten Daten",
  "Generierung des Modellkontexts aus den Daten",
  "Ausführung der Inferenz mittels des Language Modells",
  "Erstellung der generierten Antwort",
  "Rücksendung der Antwort an den Client"
];

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
