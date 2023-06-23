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

    document.getElementById('chatTab').style.display = 'flex'; // Show the chat tabs
    chatTabs.forEach(tab => {
        document.getElementById(tab.box).style.display = 'block'; // Show each chat box
    });

    const inputData = compileInputData();

    const chatTabs = [
        { tab: 'chat-tab-1', box: 'chatTabs' },
        { tab: 'chat-tab-2', box: 'chatTabs2' },
        { tab: 'chat-tab-3', box: 'chatTabs3' }
    ];

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

    try {
        const responses = await Promise.all(requests.map(req => req.then(res => res.text())));

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

    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.remove();
    }
}


let wordsPerMinute = 130; // Average speech rate

function calculateWordsSpoken(minutes, wordsPerMinute) {
    return minutes * wordsPerMinute;
}



 