function showLoadingScreen() {
  ['chatTabs', 'chatTabs2', 'chatTabs3'].forEach((chatboxId) => {
    const chatbox = document.getElementById(chatboxId);
    chatbox.style.overflow = 'hidden';  // disable scrolling
    
    const loadingScreen = document.createElement('div');
    loadingScreen.innerHTML = '<div class="loading-screen"><div class="loading-spinner"></div></div>';
    loadingScreen.className = 'loading-overlay';  // assign the new class
  
    // Display the loading screen
    chatbox.appendChild(loadingScreen);
  });
}

function hideLoadingScreen() {
  ['chatTabs', 'chatTabs2', 'chatTabs3'].forEach((chatboxId) => {
    const chatbox = document.getElementById(chatboxId);
    const loadingOverlay = chatbox.querySelector('.loading-overlay');
    if (loadingOverlay) {
      chatbox.removeChild(loadingOverlay);
    }
    
    chatbox.style.overflow = 'auto';  // enable scrolling
  });
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
