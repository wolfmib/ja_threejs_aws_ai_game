

// Maximum number of messages to store in the buffer
const MAX_BUFFER_SIZE = 5;

// Initialize buffer to store messages between the user and the bot
let conversationBuffer = [];




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


    // Load OpenAI API key from environment variables and log part of it for verification
    const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (openAiApiKey) {
        console.log(`Loaded OpenAI API key: ${openAiApiKey.slice(0, 5)}...`);
    } else {
        console.error('Error: OPENAI_API_KEY is not defined in the environment variables.');
    }

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


        // Add user's message to the buffer
        conversationBuffer.push({ role: 'user', content: message });
      
        // Ensure buffer does not exceed maximum size (FIFO)
        if (conversationBuffer.length > MAX_BUFFER_SIZE * 2) {
            conversationBuffer.shift();
        }



        // Automatically scroll down to the latest message
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // Clear the input field
        messageInput.value = '';

        try {
            // Mock response to simulate OpenAI API call
            const botMessage = await getMockResponse(conversationBuffer);

            // Display bot's response in chat history
            const botResponse = document.createElement('p');
            botResponse.innerHTML = `<strong>Bot:</strong> ${botMessage}`;
            if (document.body.contains(chatHistory)) {
                chatHistory.appendChild(botResponse);
            } else {
                console.error('Chat history element not found in the DOM while appending bot response.');
                return;
            }


            // Add bot's response to the buffer
            conversationBuffer.push({ role: 'assistant', content: botMessage });

            // Ensure buffer does not exceed maximum size (FIFO)
            if (conversationBuffer.length > MAX_BUFFER_SIZE * 2) {
                conversationBuffer.shift();
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

async function getMockResponse(buffer) {
    const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

    // Add System in the front
    buffer.unshift({
        role: 'system',
        content: 'You are a helpful assistant who is assisting the user with technical questions.'
    });
    

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: buffer,
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch response from OpenAI API');
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error fetching response from OpenAI:', error);
        return "Sorry, I couldn't process your request at the moment.";
    }
}



// Reminder: Consider adding a project for backup-go-grpc integration to handle the OpenAI LLM server.