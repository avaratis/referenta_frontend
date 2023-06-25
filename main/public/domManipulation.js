function showLoadingScreen() {
  const chatbox = document.getElementById('chatTabs');
  const loadingScreen = document.createElement('div');
  loadingScreen.innerHTML = '<div class="loading-screen"><div class="loading-spinner"></div></div>';
  loadingScreen.className = 'loading-overlay';  // assign the new class
  
    // Display the loading screen
    chatbox.appendChild(loadingScreen);
  
    // Scroll to the bottom of the chatbox
    //chatbox.scrollTop = chatbox.scrollHeight;
  }

  function hideLoadingScreen() {
    const chatbox = document.getElementById('chatTabs');
    const loadingOverlay = chatbox.querySelector('.loading-overlay');
    const loadingScreen = document.querySelector('.loading-screen');

    if (loadingScreen) {
      chatbox.removeChild(loadingScreen);
    }
    if (loadingOverlay) {
      loadingOverlay.remove();
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
