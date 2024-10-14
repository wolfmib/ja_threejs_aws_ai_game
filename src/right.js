//import dotenv from 'dotenv';

// Load environment variables from .env file
// dotenv is not supported in browser environment. Ensure to load necessary environment variables in your server-side code.
// dotenv.config();

export function initializeChat() {
    const chatHistory = document.getElementById('chat-history');
    const messageInput = document.getElementById('message');
    const sendButton = document.getElementById('send-button');

    if (!sendButton || !messageInput || !chatHistory) {
        console.error('Chat elements not found during initialization. Make sure all elements are correctly defined in the DOM before initializing chat.');
        return;
    }

    // Debug: Log to verify event listeners are added
    console.log('Adding event listeners to chat input and button');

    sendButton.addEventListener('click', () => {
        if (document.body.contains(chatHistory)) {
            sendMessage(chatHistory, messageInput);
        } else {
            console.error('Chat history element not found in the DOM at the time of sending the message.');
        }
    });

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            if (document.body.contains(chatHistory)) {
                sendMessage(chatHistory, messageInput);
            } else {
                console.error('Chat history element not found in the DOM at the time of sending the message.');
            }
        }
    });
}

async function sendMessage(chatHistory, messageInput) {
    const message = messageInput.value.trim();

    if (message) {
        // Display user's message in chat history
        const userMessage = document.createElement('p');
        userMessage.innerHTML = `<strong>You:</strong> ${message}`;
        if (document.body.contains(chatHistory)) {
            chatHistory.appendChild(userMessage);
        } else {
            console.error('Chat history element not found in the DOM while appending user message.');
            return;
        }

        // Automatically scroll down to the latest message
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // Clear the input field
        messageInput.value = '';

        try {
            // Mock response to simulate OpenAI API call
            const botMessage = await getMockResponse(message);

            // Display bot's response in chat history
            const botResponse = document.createElement('p');
            botResponse.innerHTML = `<strong>Bot:</strong> ${botMessage}`;
            if (document.body.contains(chatHistory)) {
                chatHistory.appendChild(botResponse);
            } else {
                console.error('Chat history element not found in the DOM while appending bot response.');
                return;
            }

            // Automatically scroll down to the latest message
            chatHistory.scrollTop = chatHistory.scrollHeight;
        } catch (error) {
            console.error('Error fetching response:', error);
            const botResponse = document.createElement('p');
            botResponse.innerHTML = `<strong>Bot:</strong> Sorry, I couldn't process your request at the moment.`;
            if (document.body.contains(chatHistory)) {
                chatHistory.appendChild(botResponse);
            } else {
                console.error('Chat history element not found in the DOM while appending error message.');
                return;
            }

            // Automatically scroll down to the latest message
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    }
}

async function getMockResponse(message) {
    // This function simulates a response based on the user message.
    // You can modify it to create more varied and interesting responses.
    const mockResponses = {
        'hello': 'Hello! How can I assist you today?',
        'how are you': 'I am just a bot, but thanks for asking! How can I assist you?',
        'what is your name': 'I am your friendly assistant. You can call me Javis-01!',
    };

    return mockResponses[message.toLowerCase()] || "I'm not sure about that, but I'm here to help!";
}

// Reminder: Consider adding a project for backup-go-grpc integration to handle the OpenAI LLM server.