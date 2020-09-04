// Đăng nhập lần đầu

const login = require("facebook-chat-api")
const fs = require("fs")
const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const obj = {email:"baobinh78964@gmail.com", password:"NyN1312"}

login(obj, (err, api)=>{
    if(err){
        switch(err.error){
            case 'login-approval':
                console.log('Enter code > ')
                rl.on('line', (line) => {
                    err.continue(line)
                    rl.close
                })
                break
            default:
                console.error(err)
        }
        return
    }

    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()))
})