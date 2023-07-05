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

    // Your existing code for gathering the selected parameters...

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
            // Your existing code for handling the responses...
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



 