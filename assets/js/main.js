let message_list = document.getElementById('message-list')
let message = document.getElementById('message')
let room_name = document.getElementById('room_name')

let ws_endpoint = "ws://localhost:8000/chat"
let ws = null;
let user = ""

room_name.addEventListener("keypress", (e) => {
    if (e.code === 'Enter') {
        ws = new WebSocket(`${ws_endpoint}/${e.target.value}`)

        ws.addEventListener('open', (event) => {
            console.log("Connection is OPEN.")
        })

        ws.addEventListener('message', (text_message) => {
            let data = JSON.parse(text_message.data)
            console.log("TEXT_MESSAGE :", data)

            let text = data.text
            let type = data.type
            let ch_name = data.channel_name

            if (type === "user") {
                user = ch_name
            }

            let li = document.createElement('li')
            li.classList.add("text-left")

            if (type === "send_text") {
                li.innerText = text
                li.classList.add("bg-info")
                li.classList.add("text-white")
                li.classList.add("rounded")
                li.classList.add("border")
                li.classList.add("px-2")
                li.classList.add("my-2")
            }

            if (type === "user") {
                li.innerText = text
                li.classList.add("bg-warning")
                li.classList.add("text-white")
                li.classList.add("rounded")
                li.classList.add("border")
                li.classList.add("px-2")
                li.classList.add("my-2")
            }

            message_list.append(li)

            message.value = ''
        })

        ws.addEventListener('close', (event) => {
            console.log("Connection CLOSED.")
        })
    }
})

// user write something
message.addEventListener("keypress", (e) => {
    let message = e.target.value
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
