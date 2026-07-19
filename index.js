const mineflayer = require("mineflayer")
const readline = require("readline")
const config = require('./config.json')
const fs = require('fs')
const { Client, GatewayIntentBits } = require('discord.js')

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })
let discordChannel = null

discordClient.on('ready', () => {
    console.log(`[DISCORD] Logged in as ${discordClient.user.tag}`)
    discordChannel = discordClient.channels.cache.get(config.discordChannelId)
    if (discordChannel) {
        console.log(`[DISCORD] Đã kết nối kênh: ${discordChannel.name}`)
    } else {
        console.log('[DISCORD] Không tìm thấy kênh, kiểm tra discordChannelId')
    }
})

if (config.discordToken) {
    discordClient.login(config.discordToken)
}

let bot_args = {
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version,
    respawn: config.respawn
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let reconnecting = false
let afkInterval = null
let wAfkInterval = null

let kingsmpSuccessPatterns = [
  /vào thành công/i,
  /đã vào KingSMP/i,
  /welcome to kingsmp/i,
  /chào mừng.*KingSMP/i,
]

let joiningKingSMP = false
let joinedKingSMP = false



function tryJoinKingSMP(bot) {
    if (joinedKingSMP || joiningKingSMP) return
    joiningKingSMP = true
    bot.chat('/menu')
    console.log('[AUTO] Đã gửi lệnh /menu')
}

function confirmKingSMP(reason) {
    joiningKingSMP = false
    joinedKingSMP = true
}

function start_bot() {
    let pendingTimeout = null
    let spawnIndex = 0
    let recentDeath = false
    let authSent = false

    const bot = mineflayer.createBot(bot_args)

    bot.on('login', () => {
        joiningKingSMP = false

        console.log('Logged in')
        if (joinedKingSMP) {
            console.log('[AUTO] Đã ở KingSMP')
            return
        }

        const watchKingSMP = () => {
            const onMsg = (msg) => {
                for (let p of kingsmpSuccessPatterns) {
                    if (p.test(msg)) {
                        confirmKingSMP('chatObserve')
                        bot.removeListener('messagestr', onMsg)
                        break
                    }
                }
            }
            bot.on('messagestr', onMsg)
        }

        if (!authSent) {
            authSent = true
            if (config.registered == false) {
                setTimeout(() => {
                    bot.chat(`/dk ${config.botPassword}`)
                    config.registered = true
                    console.log('[+] Đã Đăng Ký')
                    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4))
                    setTimeout(() => { if (!joinedKingSMP) watchKingSMP() }, 10000)
                }, 2000)
            } else {
                setTimeout(() => {
                    bot.chat(`/dn ${config.botPassword}`)
                    console.log('[+] Đã Gửi Lệnh Đăng Nhập')
                    setTimeout(() => { if (!joinedKingSMP) watchKingSMP() }, 10000)
                }, 2000)
            }
        } else {
            if (pendingTimeout) {
                clearTimeout(pendingTimeout)
                pendingTimeout = null
            }
            console.log('[AUTO] Đã auth, chờ spawn...')
            const onSpawn = () => {
                bot.removeListener('spawn', onSpawn)
                if (pendingTimeout) {
                    clearTimeout(pendingTimeout)
                    pendingTimeout = null
                }
                setTimeout(() => {
                    console.log('[AUTO] Chờ tin nhắn đăng nhập thành công...')
                    const onMsg = (msg) => {
                        if (/đăng nhập thành công/i.test(msg)) {
                            bot.removeListener('messagestr', onMsg)
                            if (pendingTimeout) {
                                clearTimeout(pendingTimeout)
                                pendingTimeout = null
                            }
                            setTimeout(() => {
                                if (!joinedKingSMP) {
                                    bot.chat('/menu')
                                    joiningKingSMP = true
                                    console.log('[AUTO] Đã gửi lệnh /menu')
                                }
                            }, 2000)
                        }
                    }
                    bot.on('messagestr', onMsg)
                    pendingTimeout = setTimeout(() => {
                        bot.removeListener('messagestr', onMsg)
                        if (!joinedKingSMP) {
                            bot.chat('/menu')
                            joiningKingSMP = true
                            console.log('[AUTO] Đã gửi /menu (fallback)')
                        }
                    }, 12000)
                }, 2000)
            }
            bot.on('spawn', onSpawn)
            pendingTimeout = setTimeout(() => {
                bot.removeListener('spawn', onSpawn)
                if (!joinedKingSMP) {
                    bot.chat('/menu')
                    joiningKingSMP = true
                    console.log('[AUTO] Đã gửi /menu (fallback spawn)')
                }
            }, 20000)
        }
    })

    bot.on('death', () => {
        recentDeath = true
        console.log('im dead')
        let delay = Math.floor(Math.random() * 10000)
        console.log(`Respawning in ${delay}...`)
        setTimeout(() => {
            bot.respawn()
        }, delay)
    })

    bot.on('spawn', () => {
        spawnIndex++
        console.log("Đăng Nhập Thành Công")
        if (spawnIndex > 1 && !recentDeath) {
            confirmKingSMP('spawnDetect')
        }
        recentDeath = false
    })

    bot.on('chat', (username, message) => {})

    bot.on('messagestr', (message) => {
        console.log(`[server] ${message}`)
    })

    rl.removeAllListeners('line')
    rl.on('line', (line) => {
        if (line.startsWith('/')) { bot.chat(line) }
        else if (line == 'menu') { bot.chat('/menu') }
        else if (line.includes('tpa')) { bot.chat(`/tpa ${config.ownerUsername}`) }
        else if (line == 'afk') {
            clearInterval(afkInterval)
            afkInterval = setInterval(() => {
                bot.setControlState('jump', true)
                setTimeout(() => { bot.setControlState('jump', false) }, 200)
            }, 5000)
        } else if (line == 'wafk') {
            clearInterval(wAfkInterval)
            let yaw = 0
            wAfkInterval = setInterval(() => {
                yaw += 0.5; bot.look(yaw, -Math.PI / 2, true)
            }, 500)
        } else if (line == 'stop') {
            clearInterval(wAfkInterval); clearInterval(afkInterval)
        } else if (line == 'exit') {
            reconnecting = false; bot.quit()
        } else {
            bot.chat(line)
        }
    })

    bot.on('windowOpen', (window) => {
        if (joiningKingSMP) {
            setTimeout(() => {
                joiningKingSMP = false
                try {
                    bot.clickWindow(24, 0, 0)
                    console.log('[AUTO] Đã click slot 24')
                    confirmKingSMP('clickSlot24')
                } catch(e) {
                    console.log('[AUTO] Click lỗi:', e.message)
                }
            }, 2653)
        }
    })

    bot.on('end', () => {
        if (pendingTimeout) {
            clearTimeout(pendingTimeout)
            pendingTimeout = null
        }
        authSent = false
        joiningKingSMP = false
        joinedKingSMP = false

        if (reconnecting) return
        reconnecting = true
        console.log('Disconnected')
        console.log('[+] Kết Nối Lại Sau 5s')
        setTimeout(() => {
            reconnecting = false
            start_bot()
        }, 5000)
    })

    bot.on('error', (err) => {
        console.log('[ERROR]', err.message)
        bot.quit()
    })
}

start_bot()
