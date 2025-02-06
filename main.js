// NOTE: Replace the firebaseConfig values with your own Firebase project's configuration.
const firebaseConfig = {
    apiKey: "AIzaSyBRBGeKHCLe0gLqj4Jjt4-Hq3lo8WKxk0A",
    authDomain: "vape-tracker-b7ac1.firebaseapp.com",
    databaseURL: "https://vape-tracker-b7ac1-default-rtdb.firebaseio.com",
    projectId: "vape-tracker-b7ac1",
    storageBucket: "vape-tracker-b7ac1.firebasestorage.app",
    messagingSenderId: "667878189303",
    appId: "1:667878189303:web:433f72bc701ae97bb78bf2",
    measurementId: "G-SHZJM1P3EP"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Reference to the document that stores the puff count
  const counterDocRef = db.collection('vapeTracker').doc('puffCounter');
  
  // Elements
  const puffCountElement = document.getElementById('puff-count');
  const addPuffButton = document.getElementById('add-puff-btn');
  
  // Function to update the UI with the current count
  function updateUI(count) {
    puffCountElement.textContent = count;
  }
  
  // Initialize the counter document if it doesn't exist
  counterDocRef.get().then((doc) => {
    if (!doc.exists) {
      counterDocRef.set({ count: 0 });
    }
  }).catch((error) => {
    console.error("Error getting document:", error);
  });
  
  // Listen for real-time updates on the puff counter
  counterDocRef.onSnapshot((doc) => {
    if (doc.exists) {
      const data = doc.data();
      updateUI(data.count);
    }
  });
  
  // Function to increment the puff count safely using a transaction
  function addPuff() {
    db.runTransaction(async (transaction) => {
      const doc = await transaction.get(counterDocRef);
      if (!doc.exists) {
        throw "Document does not exist!";
      }
      let newCount = doc.data().count + 1;
      // Optionally, ensure we never exceed 25,000
      if (newCount > 25000) {
        newCount = 25000;
      }
      transaction.update(counterDocRef, { count: newCount });
    }).catch((error) => {
      console.error("Transaction failed: ", error);
    });
  }
  
  // Event listener for the button click
  addPuffButton.addEventListener('click', addPuff);
  