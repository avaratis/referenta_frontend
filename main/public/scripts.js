
function buttonClick(value) {
    document.getElementById('chatinput').value = value;
}

function dropdownClick(value) {
    document.getElementById('chatinput').value = value;
}

const lengthSlider = document.getElementById('lengthSlider');
const lengthOutput = document.getElementById('lengthOutput');

lengthSlider.addEventListener('input', function () {
    lengthOutput.innerText = this.value;
    if (this.value > 1) {
        lengthOutput.innerHTML += ' minuten';
    } else {
        lengthOutput.innerHTML += ' minute';
    }
});

function toggleCheckbox(clickedCheckboxId, formGroupId) {
  const clickedCheckbox = document.getElementById(clickedCheckboxId);
  const formGroup = document.getElementById(formGroupId);
  const checkboxes = formGroup.querySelectorAll('.form-check-input');
  
  checkboxes.forEach(checkbox => {
    if (checkbox !== clickedCheckbox) {
      checkbox.checked = false;
    }
  });
}



function displaySelectedValue(selectElement) {
        const selectedValue = selectElement.value;
        document.getElementById('selectedValueDisplay').textContent = `Selected Redner: ${selectedValue}`;
    }

    function updateCharacterCountoTone(inputElement) {
        const characterCountElement = document.getElementById('characterCountoTone');
        const characterCount = inputElement.value.length;
        characterCountElement.textContent = characterCount;
    }

    function updateCharacterCountHinweise(inputElement) {
        const characterCountElement = document.getElementById('characterCountHinweise');
        const characterCount = inputElement.value.length;
        characterCountElement.textContent = characterCount;
    }

function displaySelectedValue(selectElement) {
const selectedValue = selectElement.value;
document.getElementById('selectedValueDisplay').textContent = `Selected Redner: ${selectedValue}`;
}    

function compileInputData() {
const parliamentaryCheckbox = document.getElementById('parliamentaryCheckbox');
const otherCheckbox = document.getElementById('otherCheckbox');
const dafürCheckbox = document.getElementById('dafürCheckbox');
const dagegenCheckbox = document.getElementById('dagegenCheckbox');
const enthaltungsCheckbox = document.getElementById('enthaltungsCheckbox');
const lengthSlider = document.getElementById('lengthSlider');
const rednerSelect = document.getElementById('rednerSelect');
const oToneInput = document.getElementById('oToneInput');

const inputData = {
    parliamentary: parliamentaryCheckbox.checked,
    other: otherCheckbox.checked,
    dafür: dafürCheckbox.checked,
    dagegen: dagegenCheckbox.checked,
    length: parseInt(lengthSlider.value),
    redner: rednerSelect.value,
    oTone: oToneInput.value
};

return inputData;
}

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
                    maxTokens: calculateWordsSpoken(inputData.length, wordsPerMinute)
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



const dropzone = document.getElementById('dropzone');

// Prevent default behavior for drag and drop events
dropzone.addEventListener('dragenter', (e) => {
e.preventDefault();
dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragover', (e) => {
e.preventDefault();
});

dropzone.addEventListener('dragleave', (e) => {
e.preventDefault();
dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
e.preventDefault();
dropzone.classList.remove('dragover');
});
// Retrieve the dropped file
const file = e.dataTransfer.files[0];

// Perform validation if needed (e.g., file type, size)

function handleFileUpload(event) {
    const file = event.target.files[0]; // Get the selected file
    const storageRef = firebase.storage().ref(); // Get the storage reference
    
    // Create a unique file name (e.g., using the user's ID or a random ID)
    const fileName = generateUniqueFileName(file.name);
  
    // Upload the file to Firebase Storage
    const uploadTask = storageRef.child(fileName).put(file);
  
    // Listen for upload progress or completion
    uploadTask.on('state_changed',
      (snapshot) => {
        // Handle progress updates (e.g., display a progress bar)
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        updateProgressBar(progress);
      },
      (error) => {
        // Handle the upload error
        console.error('Upload error:', error);
      },
      () => {
        // Handle the upload completion
        uploadComplete(uploadTask.snapshot.ref);
      }
    );
    }


function showLoadingScreen() {
    const chatbox = document.getElementById('chatTabs');
    const loadingScreen = document.createElement('div');
    loadingScreen.innerHTML = '<div class="loading-screen"><div class="loading-spinner"></div></div>';
  
    // Display the loading screen
    chatbox.appendChild(loadingScreen);
  
    // Scroll to the bottom of the chatbox
    chatbox.scrollTop = chatbox.scrollHeight;
  }




  function openChat(tabId) {
    // Hide all chat tabs
    const chatTabs = document.querySelectorAll('.chat-tab');
    chatTabs.forEach(tab => {
      tab.style.display = 'none';
    });
  
    // Show the selected chat tab
    const selectedTab = document.getElementById(tabId);
    selectedTab.style.display = 'block';
  }
  
  // Initialize the chat by opening the first tab
  openChat('tab1');

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



