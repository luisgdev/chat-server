const socket = io();

// DOM Elements
let chatbox = document.getElementById('chat-box');
let text = document.getElementById('text-input');
let button = document.getElementById('send-button');
let username = document.getElementById('username').innerHTML; //modified
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
// This event listen for a 'Enter' key to send_msg
text.addEventListener('keyup', (event)=>{
    if(event.keyCode === 13){
        event.preventDefault();
        send_msg();
    }
});

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
