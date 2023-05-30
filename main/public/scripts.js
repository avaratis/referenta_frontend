
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

function toggleCheckbox(selectedCheckboxId, otherCheckboxId) {
        const selectedCheckbox = document.getElementById(selectedCheckboxId);
        const otherCheckbox = document.getElementById(otherCheckboxId);

        if (selectedCheckbox.checked) {
            otherCheckbox.checked = false;
        }
    }

function displaySelectedValue(selectElement) {
        const selectedValue = selectElement.value;
        document.getElementById('selectedValueDisplay').textContent = `Selected Redner: ${selectedValue}`;
    }

    function updateCharacterCount(inputElement) {
        const characterCountElement = document.getElementById('characterCount');
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

async function submitChat() {
const inputData = compileInputData();
    const chatbox = document.getElementById('chatbox');

    chatbox.style.display = 'block'; // Show the chat box

        chatbox.innerHTML += '<div class="p-2 mt-2 bg-light border rounded"><strong>Anfrage erhalten:</strong> ' + 'Bitte warten' + '</div>';
        console.log(inputData.oTone)
        try {
            const response = await fetch('https://referenta-30a27.web.app/getChatResponse', { // Update the URL to your deployed server
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: "Task Speech: " + "Speaker: " + inputData.redner + " Topic " + inputData.oTone + "Language German " + "Speech length:  " +  inputData.length + " Position: " + (inputData.dafür == true ? " for that position " : " against that position ")
                })
            });

            if (response.ok) {
                const botReply = await response.text();
                chatbox.innerHTML += '<div class="p-2 mt-2 bg-primary text-white border rounded"><strong>Bot:</strong> ' + botReply + '</div>';
                inputData.value = '';
                chatbox.scrollTop = chatbox.scrollHeight;
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    
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

// Retrieve the dropped file
const file = e.dataTransfer.files[0];

// Perform validation if needed (e.g., file type, size)

// Handle the file upload
handleFileUpload(file);
});

function handleFileUpload(file) {
// You can perform additional processing or send the file to the server for further handling
console.log('File uploaded:', file);
}
