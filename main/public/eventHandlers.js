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

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
  
    // Retrieve the dropped file
    const file = e.dataTransfer.files[0];
  
    // Perform validation if needed (e.g., file type, size)
    if (file.type !== 'application/pdf') {
      console.error('File is not a PDF');
      return;
    }
  
    // Change the inner HTML of the dropzone
    dropzone.innerHTML = `
      <i class="far fa-file-pdf"></i>
      <p>Uploaded: ${file.name}</p>
    `;
  
  });