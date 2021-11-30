let message_list = document.getElementById('message-list')
let message = document.getElementById('message')

const roomName = JSON.parse(document.getElementById('room-name').textContent)
const username = JSON.parse(document.getElementById('username').textContent)

let ws_endpoint = "ws://localhost:8000/chat"
let ws = null;

const onMessageEvent = (text_message) => {
    let data = JSON.parse(text_message.data)
    console.log("TEXT_MESSAGE :", data)

    let li = document.createElement('li')
    let li_text = document.createTextNode(`${data.username}: ${data.text}`)
    li.appendChild(li_text)
    li.classList.add("text-dark")
    if (username === data.username) {
        li.classList.add("text-left")
    } else {
        li.classList.add("text-right")
    }
    message_list.append(li)

    message.value = ''
}


ws = new WebSocket(`${ws_endpoint}/${roomName}`)

ws.addEventListener('open', (event) => {
    console.log("Connection is OPEN.")
})

ws.addEventListener('close', (event) => {
    console.log("Connection CLOSED.")
})

ws.addEventListener('message', onMessageEvent)

// user write something
message.addEventListener("keypress", (e) => {
    let message = JSON.stringify({
        'text': e.target.value,
        'username': username
    })
    if (e.code === 'Enter') {
        sendMessage(ws, message)
    }
})

function sendMessage(ws, message) {
    if (message === null || message_list === undefined || message === '') {
        return
    }
    ws.send(message)
}
