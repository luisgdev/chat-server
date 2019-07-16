const socket = io();

// DOM Elements
let chatbox = document.getElementById('chat-box');
let chat_block = document.getElementById('chat-input-block');
let text = document.getElementById('text-input');
let button = document.getElementById('send-button');
let login_block = document.getElementById('login-block');
let username = document.getElementById('usermail').innerHTML; //modified
let login_btn = document.getElementById('login-button');
let user_typing = document.getElementById('user-typing');

// Send message to 'chatroom'
function send_msg(){
    socket.emit('chatroom', {
        username: username,
        message: text.value
    });
    text.value = '';
}
button.addEventListener('click', send_msg);
text.addEventListener('change', send_msg);

// Listen messages from 'chatroom'
socket.on('chatroom', (data) => {
    user_typing.innerHTML = '';
    chatbox.innerHTML += `<p class="mb-1"><strong>${data.username}</strong>: ${data.message}</p>`
});

// Listen user keyboard
text.addEventListener('keypress', () => {
    socket.emit('user:typing', username);
});

// Show user is typing
socket.on('user:typing', (username) => {
    user_typing.innerHTML = `<i class="text-warning">${username} is typing...</i>`;
});
