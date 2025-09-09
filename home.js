import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBlr50tTLt6heWur5Fh0Njmkkg7RbPTqjY",
    authDomain: "investsmart-4ca38.firebaseapp.com",
    projectId: "investsmart-4ca38",
    storageBucket: "investsmart-4ca38.firebasestorage.app",
    messagingSenderId: "500206714508",
    appId: "1:500206714508:web:eaf5078ef657aacf20c5a9",
    measurementId: "G-GM943Z7G36"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let currentUser = null;

// Check login
onAuthStateChanged(auth, async (user) => {
    if (!user) { window.location.href = "index.html"; return; }
    currentUser = user;
    document.getElementById('user-email').textContent = user.email;

    // Wallet
    const walletRef = doc(db, 'wallets', user.uid);
    const walletSnap = await getDoc(walletRef);
    document.getElementById('wallet-amount').textContent = walletSnap.exists() ? walletSnap.data().amount + " Rs" : "0 Rs";

    // Today Winner
    const winnerRef = doc(db, 'winners', 'today');
    const winnerSnap = await getDoc(winnerRef);
    document.getElementById('today-winner').textContent = winnerSnap.exists() ? winnerSnap.data().name : "No winner yet";
});

// Play button
window.play = function() {
    const playDiv = document.getElementById('play-section');
    playDiv.innerHTML = `<p>Join the game by paying <strong>20 Rs</strong> to <strong>riya09876@ybl</strong></p>
                         <button id="play-proceed">Proceed</button>`;
    document.getElementById('play-proceed').addEventListener('click', processing);
}

// Processing
window.processing = function() {
    document.getElementById('play-section').innerHTML = `<p>Processing... Please wait</p>`;
}

// Logout
window.logout = function() {
    signOut(auth).then(() => window.location.href = "index.html");
}

// Withdrawal
window.withdraw = function() {
    const playDiv = document.getElementById('play-section');
    playDiv.innerHTML = `
        <h3>Withdrawal Request</h3>
        <input type="text" id="upi-id" placeholder="Enter UPI ID" /><br/><br/>
        <input type="number" id="withdraw-amount" placeholder="Enter Amount" /><br/><br/>
        <button id="submit-withdraw">Submit</button>
    `;
    document.getElementById('submit-withdraw').addEventListener('click', submitWithdrawal);
}

// Submit Withdrawal
window.submitWithdrawal = async function() {
    const upi = document.getElementById('upi-id').value.trim();
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    if (!upi || isNaN(amount) || amount <= 0) { alert("Enter valid UPI & amount"); return; }

    try {
        await addDoc(collection(db, 'withdrawals'), {
            userId: currentUser.uid,
            email: currentUser.email,
            upi: upi,
            amount: amount,
            status: "pending",
            timestamp: new Date()
        });
        document.getElementById('play-section').innerHTML = `<p>Your withdrawal will be completed within 1 to 2 hours.</p>`;
    } catch(e) { alert("Error: " + e.message); console.error(e); }
}
