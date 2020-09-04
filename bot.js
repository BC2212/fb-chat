const login = require('facebook-chat-api')
const fs = require('fs')

login({
    appState: JSON.parse(fs.readFileSync('appstate.json', 'utf-8'))
}, (err, api) => {
    if (err) return console.error(err)

    api.setOptions({
        listenEvents: true
    })

    // Dùng api.listen gây lỗi -> dùng api.listenMqtt
    var stopListening = api.listenMqtt((err, event) => {
        if (err) return console.error(err)

        switch (event.type) {
            case 'message':
                api.getThreadInfo(event.threadID, (err, info) => {
                    if (err) return console.error(err)

                    // Bỏ qua tin nhắn group
                    if (info.isGroup == true) {
                        console.log("Group chat " + info.name + " có tin nhắn mới")
                    } else if (info.threadID == '100009115678491') {
                        if (event.body === '/stop') {
                            api.sendMessage("Goodbye....", event.threadID)
                            return stopListening()
                        }
                        api.markAsRead(event.threadID, (err) => {
                            if (err) return console.error(err)
                        })
                        api.sendMessage("TEST BOT: " + event.body, event.threadID)
                    }
                })
                break
            case 'event':
                console.log(event)
                break
        }
    })
})