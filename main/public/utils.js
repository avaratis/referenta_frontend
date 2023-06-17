

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
