window.parsedPdf = "";

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

    const chatTabs = [
        { tab: 'chat-tab-1', box: 'chatTabs' },
        { tab: 'chat-tab-2', box: 'chatTabs2' },
        { tab: 'chat-tab-3', box: 'chatTabs3' }
    ];



    document.getElementById('chatTab').style.display = 'flex'; // Show the chat tabs
    chatTabs.forEach(tab => {
        document.getElementById(tab.box).style.display = 'block'; // Show each chat box
    });

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

    const requests = Array(3).fill().map(() => 
    fetch('https://us-central1-referenta-30a27.cloudfunctions.net/api/getChatResponse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: "Task Speech: " + "Speaker: " + inputData.redner + " Topic " + inputData.oTone + " Language: German " + "Maximum amount of words: " +  calculateWordsSpoken(inputData.length, wordsPerMinute) + " Position: " + (inputData.dafür == true ? " for that position " : " against that position "),
            totalTokensNeeded: calculateWordsSpoken(inputData.length, wordsPerMinute),
            attachedPdf: parsedPdf
        })
    })
);

const start = new Date().getTime();

try {

        // Clear the chat boxes
        chatTabs.forEach(tab => {
            const chatBox = document.getElementById(tab.box);
            while (chatBox.firstChild) {
                chatBox.removeChild(chatBox.firstChild);
            }
        });
    

    const responses = await Promise.all(requests.map(req => req.then(res => res.text())));

    const duration = new Date().getTime() - start;
    const hints = ["Tokenization: Text is split into meaningful pieces", "Embedding: Tokens are converted into vectors", "Forward pass: Input vectors are processed through the model", "Backward pass: Model outputs are backpropagated to adjust weights", "Decoding: Model output is converted back into text"];
    const hintDisplayTime = duration / hints.length;
    let hintIndex = 0;
    const hintInterval = setInterval(() => {
        if (hintIndex >= hints.length) {
            clearInterval(hintInterval);
            return;
        }
        const hint = hints[hintIndex];
        // Display the hint - replace this with your actual hint display function
        document.getElementById('hint-text').innerText = hint;
        hintIndex++;
    }, hintDisplayTime);

    responses.forEach(async (botReply, index) => {
            let wordCount = countWordsLetters(botReply).wordCount;
            let letterCount = countWordsLetters(botReply).letterCount;
            let topUsedWords  = mostUsedWords(botReply, 5);
            let topUsedWordsStr = topUsedWords.map(obj => `${obj.word}: ${obj.count}`).join(', ');

            document.getElementById('wordCount').innerText = wordCount;
            document.getElementById('letterCount').innerText = letterCount;
            document.getElementById('mostUsedWords').innerText = topUsedWordsStr;

            // Add the bot reply to the appropriate chat tab
            const chatBox = document.getElementById(chatTabs[index].box);
            const chatReply = document.createElement('div');
            chatReply.className = 'p-2 mt-2';
            chatReply.innerHTML = botReply;
            chatBox.appendChild(chatReply);
        });

        // After all requests are complete, unhide the tabs and boxes

    } catch (error) {
        console.error('Error:', error);
    }

    

    hideLoadingScreen()
}


let wordsPerMinute = 130; // Average speech rate

function calculateWordsSpoken(minutes, wordsPerMinute) {
    return minutes * wordsPerMinute;
}

function copyToClipboard() {
    let firstTabContent = document.getElementById('chatTabs').innerText;  // Select the text from the first tab
    let tempInput = document.createElement('textarea');  // Create a temporary textarea to hold the text
    document.body.appendChild(tempInput);
    tempInput.value = firstTabContent;  // Assign the text content to the temporary textarea
    tempInput.select();  // Select the text
    document.execCommand('copy');  // Execute the 'copy' command
    document.body.removeChild(tempInput);  // Remove the temporary textarea from the document

    // Alert the user or provide some feedback that the text has been copied
    alert('Text copied to clipboard');
}


 