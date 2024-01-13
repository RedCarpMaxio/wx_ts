// main.ts
import {
    log,
    ScanStatus,
    WechatyBuilder,
    Message
} from 'wechaty'
import {getWeather} from './api/weather'
const { FileBox } = require('file-box');
async function onMessage(message: Message) {
    try {
        const room = message.room()
        const sender = message.talker()
        const content = message.text()

        if (message.self()) {
            return
        }

        if (content.startsWith("天气")) {
            let city = content.split('|')[1]
            city = city.trim()
            const res = await getWeather(city)
            await message.say('\@' + sender.name() + '\n' + res.data)

        }
        if (content.startsWith("roll")) {
            const args = content.split(' ').slice(1);
            const nums = args.length

            if (nums >= 2) {
                const result = args[Math.floor(Math.random() * nums)];
                console.log(result);
                await message.say('\@' + sender.name() + '\n' + '小助理帮你选择:' + result)
            }
        }

    } catch
        (e) {
        console.error(e)
    }
}

const bot = WechatyBuilder.build({
    name: "UosDemo",
    puppetOptions: {
        uos: true  // 重要，开启uos协议
    },
    puppet: 'wechaty-puppet-wechat',
})
    .on("scan", (qrcode, status) => {
        if (status === ScanStatus.Waiting && qrcode) {
            const qrcodeImageUrl = [
                'https://wechaty.js.org/qrcode/',
                encodeURIComponent(qrcode),
            ].join('')

            log.info(`onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`);

            require('qrcode-terminal').generate(qrcode, {small: true})  // show qrcode on console
        } else {
            log.info(`onScan: ${ScanStatus[status]}(${status})`);
        }
    })

    .on("login", (user) => {
        log.info(`${user} login`);
    })

    .on("logout", (user, reason) => {
        log.info(`${user} logout, reason: ${reason}`);
    })

    .on('message', onMessage)


bot.start().then(() => {
    log.info("started.");
});
