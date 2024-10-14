// right.js

export function initializeChat() {
    const chatHistory = document.getElementById('chat-history');
    const messageInput = document.getElementById('message');
    const sendButton = document.getElementById('send-button');

    if (!sendButton || !messageInput || !chatHistory) {
        console.error('Chat elements not found during initialization');
        return;
    }

    // Debug: Log to verify event listeners are added
    console.log('Adding event listeners to chat input and button');

    sendButton.addEventListener('click', () => {
        sendMessage(chatHistory, messageInput);
    });

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage(chatHistory, messageInput);
        }
    });
}

function sendMessage(chatHistory, messageInput) {
    const message = messageInput.value.trim();

    if (message) {
        // Display user's message in chat history
        const userMessage = document.createElement('p');
        userMessage.innerHTML = `<strong>You:</strong> ${message}`;
        chatHistory.appendChild(userMessage);

        // Automatically scroll down to the latest message
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // Clear the input field
        messageInput.value = '';

        // For demonstration purposes, echo the message from the bot
        setTimeout(() => {
            const botResponse = document.createElement('p');
            botResponse.innerHTML = `<strong>Bot:</strong> You said: "${message}"`;
            chatHistory.appendChild(botResponse);

            // Automatically scroll down to the latest message
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }, 500);
    }
}
