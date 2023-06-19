const dropzone = document.getElementById('dropzone');
const pdfjsLib = window['pdfjs-dist/build/pdf'];

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
  if (file.type !== 'application/pdf') {
    console.error('File is not a PDF');
    return;
  }

  // Create a new FileReader object
  let reader = new FileReader();

  // Define the event handler for the load event
  reader.onload = function(event) {
    let typedarray = new Uint8Array(this.result);

    // Parse the PDF
    pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
      // Get the first page
      pdf.getPage(1).then(function(page) {
        // Extract the text content
        page.getTextContent().then(function(textContent) {
          // Log the text content to the console
          console.log(textContent.items.map(item => item.str).join(' '));
        }).catch(function(error) {
          console.error('Error extracting text content:', error);
        });
      }).catch(function(error) {
        console.error('Error getting page:', error);
      });
    }).catch(function(error) {
      console.error('Error parsing PDF:', error);
    });
  };

  // Define the event handler for the error event
  reader.onerror = function(event) {
    console.error('Error reading file:', event.target.error);
  };

  // Read the file as an ArrayBuffer
  reader.readAsArrayBuffer(file);
});
