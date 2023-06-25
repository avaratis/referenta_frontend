function showLoadingScreen() {
  ['chatTabs', 'chatTabs2', 'chatTabs3'].forEach((chatboxId) => {
    const chatbox = document.getElementById(chatboxId);
    const rect = chatbox.getBoundingClientRect();
    const loadingScreen = document.createElement('div');
    
    loadingScreen.style.position = 'fixed';
    loadingScreen.style.top = `${rect.top}px`;
    loadingScreen.style.left = `${rect.left}px`;
    loadingScreen.style.width = `${rect.width}px`;
    loadingScreen.style.height = `${rect.height}px`;
    loadingScreen.style.backgroundColor = 'rgba(211, 211, 211, 0.5)';
    loadingScreen.style.zIndex = 9999;
    loadingScreen.style.display = 'flex';
    loadingScreen.style.alignItems = 'center';
    loadingScreen.style.justifyContent = 'center';
    
    loadingScreen.innerHTML = '<div class="loading-screen"><div class="loading-spinner"></div></div>';
    loadingScreen.className = 'loading-overlay';
  
    document.body.appendChild(loadingScreen);
  });
}



function hideLoadingScreen() {
  const loadingOverlays = document.querySelectorAll('.loading-overlay');
  loadingOverlays.forEach((loadingOverlay) => {
    document.body.removeChild(loadingOverlay);
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
