function countWordsLetters(text) {
    const words = text.split(' ');
  
    let letterCount = 0;
    let wordCount = words.length;
  
    words.forEach(word => {
        letterCount += word.length;
    });
  
    return {
        wordCount,
        letterCount
    };
  }
  
  function mostUsedWords(text, numberOfWords) {
    const words = text.split(/\s+/);
    const wordCounts = {};
  
    words.forEach((word) => {
        // Add a condition to exclude words shorter than 5 letters
        if (word.length >= 5) {
            if (wordCounts[word]) {
                wordCounts[word]++;
            } else {
                wordCounts[word] = 1;
            }
        }
    });
  
    let sortable = [];
    for (let word in wordCounts) {
        sortable.push({word: word, count: wordCounts[word]});
    }
  
    sortable.sort((a, b) => {
        return b.count - a.count;
    });
  
    return sortable.slice(0, numberOfWords);
  }
  
  
  
  async function submitChat() {
  
  showLoadingScreen();
  
  const inputData = compileInputData();
  
  
      const chatTabs = document.getElementById('chatTabs');
      const chatbox = document.getElementById('chatBox');
  
      let selectedZweck = document.querySelector('#parliamentaryCheckbox').checked ? 'Parlamentarisch' : 'Andere';
      let selectedVotum = document.querySelector('#dafürCheckbox').checked ? 'dafür' : (document.querySelector('#dagegenCheckbox').checked ? 'dagegen' : 'enthaltung');
      let selectedLänge = document.querySelector('#lengthSlider').value;
      let selectedRedner = document.querySelector('#rednerSelect').value;
      let selectedOTone = document.querySelector('#oToneInput').value;
  
      // Set these values to the respective elements in the "Selected Parameters" card
      document.getElementById('selectedZweck').innerText = selectedZweck;
      document.getElementById('selectedVotum').innerText = selectedVotum;
      document.getElementById('selectedLänge').innerText = selectedLänge + ' Minuten';
      document.getElementById('selectedRedner').innerText = selectedRedner;
      document.getElementById('selectedOTone').innerText = selectedOTone;
  
      // Unhide the tabs
      document.getElementById('chatTab').style.display = 'flex';
      chatbox.style.display = 'block'; // Show the chat box
      chatTabs.style.display = 'block'; // Show the chat tabs
  
          //chatbox.innerHTML += '<div class="p-2 mt-2 bg-light border rounded"><strong>Anfrage erhalten:</strong> ' + 'Bitte warten' + '</div>';
          console.log(inputData.oTone)
          try {
              const response = await fetch('https://us-central1-referenta-30a27.cloudfunctions.net/api/getChatResponse', { // Update the URL to your deployed server 
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      prompt: "Task Speech: " + "Speaker: " + inputData.redner + " Topic " + inputData.oTone + " Language German " + "Maximum amount of words: " +  calculateWordsSpoken(inputData.length, wordsPerMinute) + " Position: " + (inputData.dafür == true ? " for that position " : " against that position "),
                      //maxTokens: calculateWordsSpoken(inputData.length, wordsPerMinute),
                      totalTokensNeeded: calculateWordsSpoken(inputData.length, wordsPerMinute)
                  })
              });
  
              if (response.ok) {
  
                      const botReply = await response.text();
  
                      let wordCount = countWordsLetters(botReply).wordCount;
                      let letterCount = countWordsLetters(botReply).letterCount;
                      let topUsedWords  = mostUsedWords(botReply, 5);
                      let topUsedWordsStr = topUsedWords.map(obj => `${obj.word}: ${obj.count}`).join(', ');
  
                      document.getElementById('wordCount').innerText = wordCount;
                      document.getElementById('letterCount').innerText = letterCount;
                      document.getElementById('mostUsedWords').innerText = topUsedWordsStr ;
  
                
                      // Create a new tab for the chat reply
                      const chatTabs = document.getElementById('chatTabs');
                      const tabId = `tab-${Date.now()}`;
                      const tabButton = document.createElement('button');
                      tabButton.className = 'btn btn-light';
                      tabButton.innerText = `Anfrage #${chatTabs.children.length + 1}`;
                      tabButton.addEventListener('click', () => showChatReply(tabId));
                      chatTabs.appendChild(tabButton);
                
                      // Create a new chat reply div and hide it initially
                      const chatReply = document.createElement('div');
                      chatReply.className = 'p-2 mt-2';
                      chatReply.id = tabId;
                      chatReply.style.display = 'none';
                      chatReply.innerHTML = `${botReply}`;
                      chatTabs.insertBefore(chatReply, tabButton.nextSibling);
                
                      // Show the newly created chat reply by default
                      showChatReply(tabId);
              } else {
                  console.error('Error:', response.statusText);
              }
          } catch (error) {
              console.error('Error:', error);
          }
  
          const loadingScreen = document.querySelector('.loading-screen');
          if (loadingScreen) {
            loadingScreen.remove();
          }    
      
  }
  
  let wordsPerMinute = 130; // Average speech rate
  
  function calculateWordsSpoken(minutes, wordsPerMinute) {
      return minutes * wordsPerMinute;
  }



 