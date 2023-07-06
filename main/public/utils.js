const dropzone = document.getElementById('dropzone');
const pdfjsLib = window.pdfjsLib;
let parsedPdf;

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
    dropzone.classList.add('uploaded');
    // Parse the PDF
    pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
      // Get the number of pages
      let numPages = pdf.numPages;

      // Function to get text from a page
      function getPageText(pageNum) {
        return pdf.getPage(pageNum).then(function(page) {
          return page.getTextContent().then(function(textContent) {
            return textContent.items.map(item => item.str).join(' ');
          });
        });
      }

      // Generate an array of promises to get the text of each page
      let pagePromises = [];
      for (let i = 1; i <= numPages; i++) {
        pagePromises.push(getPageText(i));
      }

      // Wait for all pages and log the text content to the console
      Promise.all(pagePromises).then(function(pagesText) {
        //console.log(pagesText.join('\n'));
        parsedPdf = pagesText.join('\n');
        window.parsedPdf = parsedPdf;
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

