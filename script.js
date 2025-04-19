// Elementos del DOM
const authModal = document.getElementById('auth-modal');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const messagesContainer = document.getElementById('messages');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const usernameDisplay = document.getElementById('username');
const inputUsername = document.getElementById('input-username');

let currentUser = null;

// Autenticación
loginBtn.addEventListener('click', () => {
    const username = inputUsername.value.trim();
    if (username) {
        currentUser = username;
        usernameDisplay.textContent = username;
        authModal.style.display = 'none';
        messageInput.disabled = false;
        sendBtn.disabled = false;
        loadMessages();
    }
});

logoutBtn.addEventListener('click', () => {
    currentUser = null;
    usernameDisplay.textContent = 'Invitado';
    authModal.style.display = 'flex';
    messageInput.disabled = true;
    sendBtn.disabled = true;
    messagesContainer.innerHTML = '';
});

// Enviar mensaje
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText && currentUser) {
        const timestamp = Date.now();
        database.ref('messages/' + timestamp).set({
            user: currentUser,
            text: messageText,
            timestamp: timestamp
        });
        messageInput.value = '';
    }
}

// Cargar mensajes
function loadMessages() {
    database.ref('messages').orderByChild('timestamp').limitToLast(50).on('value', (snapshot) => {
        messagesContainer.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const msg = childSnapshot.val();
            displayMessage(msg.user, msg.text, msg.timestamp);
        });
    });
}

function displayMessage(user, text, timestamp) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `
        <strong>${user}:</strong> ${text}
        <span class="time">${new Date(timestamp).toLocaleTimeString()}</span>
    `;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}