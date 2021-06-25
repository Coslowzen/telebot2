const { fetchJson, range } = require('./lib/function')
const { Telegraf } = require('telegraf')
const help = require('./lib/help')
const tele = require('./lib/tele')
const chalk = require('chalk')
const os = require('os')
const fs = require('fs')

const {
    apikey,
    zeks,
    bot_token,
    owner,
    ownerLink,
    version,
    prefix
} = JSON.parse(fs.readFileSync(`./config.json`))

if (bot_token == "") {
    return console.log("=== BOT TOKEN CANNOT BE EMPTY ===")
}

const bot = new Telegraf(bot_token)

bot.command('start', async(lol) => {
    user = await tele.getUser(lol)
    await help.start(lol, user.full_name)
    await lol.deleteMessage()
})


bot.command('help', async(lol) => {
    user = await tele.getUser(lol)
    await help.help(lol, user.full_name)
})

bot.on("callback_query", async(lol) => {
    callback_data = lol.callbackQuery.data
    user = await tele.getUser(lol)
    const isGroup = lol.chat.type.includes("group")
    const groupName = isGroup ? lol.chat.title : ""
    if (!isGroup) console.log(chalk.whiteBright("├ "), chalk.cyanBright("[   ACT   ]"), chalk.whiteBright(callback_data), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
    if (isGroup) console.log(chalk.whiteBright("├ "), chalk.cyanBright("[   ACT   ]"), chalk.whiteBright(callback_data), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))
    switch (callback_data) {
        case 'islami':
            await help.islami(lol)
            break
        case 'downloader':
            await help.download(lol)
            break
        case 'textpro':
            await help.textpro(lol)
            break
        case 'phoxy':
            await help.phoxy(lol)
            break
        case 'ephoto':
            await help.ephoto(lol)
            break
        case 'randimage':
            await help.randimage(lol)
            break
        case 'randtext':
            await help.randtext(lol)
            break
        case 'anime':
            await help.anime(lol)
            break
        case 'movie':
            await help.movie(lol)
            break
        case 'help':
        default:
            await help.help(lol, user.full_name)
            break
    }
})

bot.on("message", async(lol) => {
    try {
        const body = lol.message.text || lol.message.caption || ""

        comm = body.trim().split(" ").shift().toLowerCase()
        cmd = false
        if (prefix != "" && body.startsWith(prefix)) {
            cmd = true
            comm = body.slice(1).trim().split(" ").shift().toLowerCase()
        }
        const command = comm
        const args = await tele.getArgs(lol)
        const user = await tele.getUser(lol)

        const reply = async(text) => {
            for (var x of range(0, text.length, 4096)) {
                await lol.replyWithMarkdown(text.substr(x, 4096))
            }
        }

        const isCmd = cmd
        const isGroup = lol.chat.type.includes("group")
        const groupName = isGroup ? lol.chat.title : ""

        const isImage = lol.message.hasOwnProperty("photo")
        const isVideo = lol.message.hasOwnProperty("video")
        const isAudio = lol.message.hasOwnProperty("audio")
        const isSticker = lol.message.hasOwnProperty("sticker")
        const isContact = lol.message.hasOwnProperty("contact")
        const isLocation = lol.message.hasOwnProperty("location")
        const isDocument = lol.message.hasOwnProperty("document")
        const isAnimation = lol.message.hasOwnProperty("animation")
        const isMedia = isImage || isVideo || isAudio || isSticker || isContact || isLocation || isDocument || isAnimation

        const quotedMessage = lol.message.reply_to_message || {}
        const isQuotedImage = quotedMessage.photo ? true : false
        const isQuotedVideo = quotedMessage.video ? true : false
        const isQuotedSticker = quotedMessage.sticker ? true : false
        const isQuotedDocument = quotedMessage.document ? true : false
        const isQuotedAnimation = quotedMessage.animation ? true : false

        if (!isGroup && !isCmd) console.log(chalk.whiteBright("├ "), chalk.cyanBright("[ PRIVATE ]"), chalk.whiteBright(body), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
        if (isGroup && !isCmd) console.log(chalk.whiteBright("├ "), chalk.cyanBright("[  GROUP  ]"), chalk.whiteBright(body), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))
        if (!isGroup && isCmd) console.log(chalk.whiteBright("├ "), chalk.cyanBright("[ COMMAND ]"), chalk.whiteBright(body), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
        if (isGroup && isCmd) console.log(chalk.whiteBright("├ "), chalk.cyanBright("[ COMMAND ]"), chalk.whiteBright(body), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))

        async function getFileID() {
            file_id = ""
            if (isQuotedImage) {
                photo = lol.message.reply_to_message.photo
                file_id = photo[photo.length - 1].file_id
            } else if (isQuotedDocument) {
                file_id = lol.message.reply_to_message.document.file_id
            } else if (isQuotedVideo) {
                file_id = lol.message.reply_to_message.video.file_id
            } else if (isQuotedAnimation) {
                file_id = lol.message.reply_to_message.animation.file_id
            }
            return file_id
        }

        switch (command) {
             case 'help':
                  user = await tele.getUser(lol)
                  await help.help(lol, user.full_name)
                   break
            case 'owner':
                await reply('my owner @coslow20')
                break
            case 'report':
                IdO ='1816320494'
                query = args.join(" ")
                teks =`[REPORT]${query}`
				await bot.telegram.sendMessage(IdO, teks)
				reply('Masalahmmu Telah Sampai Ke Owner Bot, Owner Akan Segera Menanganinya!')
			break
           case 'bc':
           query = args.join(" ")
           await bot.telegram.sendMessage(lol.message.chat.id, query)
           break
           case 'cek':
           test = await bot.telegram.getChatMembersCount(lol.message.chat.id)
           reply(`Total Members in the Group ${lol.message.chat.title}: ${test}`)
           break  
           //translate//
            case 'translate':
                if (args.length == 0) return reply(`Example: ${prefix + command} kode bahasa ohayou`)
                anya = args[0]
                zyaki = args[1]
                await lol.replyWithChatAction("typing")
                result = await fetchJson(`https://api.lolhuman.xyz/api/translate/auto/${anya}?apikey=${apikey}&text=${encodeURI(zyaki)}`)
                await reply(result.result.translated)
                break
            case 'trjp':
                if (args.length == 0) return reply(`Example: ${prefix + command} selamat pagi`)
                pima = args.join(" ")
                await lol.replyWithChatAction("typing")
                result = await fetchJson(`https://api.lolhuman.xyz/api/translate/id/ja?apikey=${apikey}&text=${encodeURI(pima)}`)
                await reply(result.result.translated)
                break
            case 'trid':
                if (args.length == 0) return reply(`Example: ${prefix + command} ohayou`)
                rini = args.join(" ")
                await lol.replyWithChatAction("typing")
                result = await fetchJson(`https://api.lolhuman.xyz/api/translate/ja/id?apikey=${apikey}&text=${encodeURI(rini)}`)
                await reply(result.result.translated)
                break
            

                // Downloader //
            case 'play':
                if (args.length == 0) return await reply(`Example: ${prefix + command} melukis senja`)
                await fetchJson(`https://api-yogipw.herokuapp.com/api/yt/search?query=${args.join(" ")}`)
                    .then(async(result) => {
                        await fetchJson(`https://apizxyv2.herokuapp.com/api/yutub/audio?url=https://www.youtube.com/watch?v=${result.result[0].videoId}&apikey=zxagung`)
                            .then(async(result) => {
                                caption = `\`❖ Title     :\` ${result.result.result.title}\n`
                                caption += `\`❖ Link      :\`${result.result.result.url_audio}\n`
                                caption += `\`❖ Size :\` ${result.result.result.size}\n`
                                await lol.replyWithPhoto({ url: result.result.result.thumbnail }, { caption: caption, parse_mode: "Markdown" })
                                await reply('wait ±1min')
                                acmar = `${result.result.result.title}kazumusik.mp3`
                                await lol.replyWithAudio({ url: result.result.result.url_audio, filename: acmar }, { thumb: result.result.result.thumbnail })
                            })
                    })
                break
            case 'ytsearch':
                if (args.length == 0) return reply(`Example: ${prefix + command} Melukis Senja`)
                try {
                    query = args.join(" ")
                    result = await fetchJson(`https://api-yogipw.herokuapp.com/api/yt/search?query=${query}`)
                    hasil = result.result.slice(0, 5)
                    hasil.forEach(async(res) => {
                        caption = `\`❖ Title     :\` *${res.title}*\n`
                        caption += `\`❖ Link      :\`* https://www.youtube.com/watch?v=${res.videoId} *\n`
                        caption += `\`❖ Published :\` *${res.ago}*\n`
                        caption += `\`❖ Views    :\` *${res.views}*\n`
                        await lol.replyWithPhoto({ url: res.thumbnail }, { caption: caption, parse_mode: "Markdown" })
                    })
                } catch (e) {
                    console.log(e)
                    help.messageError(lol)
                }
                break
            case 'ytmp3':
                if (args.length == 0) return reply(`Example: ${prefix + command} https://www.youtube.com/watch?v=qZIQAk-BUEc`)
                ini_link = args[0]
                result = await fetchJson(`http://api.lolhuman.xyz/api/ytaudio?apikey=${apikey}&url=${ini_link}`)
                result = result.result
                caption = `\`❖ Title    :\` *${result.title}*\n`
                caption += `\`❖ Uploader :\` *${result.uploader}*\n`
                caption += `\`❖ Duration :\` *${result.duration}*\n`
                caption += `\`❖ View     :\` *${result.view}*\n`
                caption += `\`❖ Like     :\` *${result.like}*\n`
                caption += `\`❖ Dislike  :\` *${result.dislike}*\n`
                caption += `\`❖ Size     :\` *${result.link[3].size}*`
                await lol.replyWithPhoto({ url: result.thumbnail }, { caption: caption, parse_mode: "Markdown" })
                if (Number(result.link[3].size.split(` MB`)[0]) >= 50.00) return reply(`Sorry the bot cannot send more than 50 MB!`)
                await lol.replyWithAudio({ url: result.link[3].link }, { title: result.title, thumb: result.thumbnail })
                break
           case 'video':
            if (args.length == 0) return await reply(`Example: ${prefix + command} melukis senja`)
                await fetchJson(`https://api-yogipw.herokuapp.com/api/yt/search?query=${args.join(" ")}`)
                    .then(async(result) => {
                        await fetchJson(`https://lindow-api.herokuapp.com/api/ytmp4?link=https://www.youtube.com/watch?v=${result.result[0].videoId}&apikey=LindowApi`)
                            .then(async(result) => {
                                caption = `\`❖ Title     :\` ${result.title}\n`
                                caption += `\`❖ Link      :\`${result.dl_link}\n`
                                caption += `\`❖ Size :\` ${result.filesizeF}\n`
                                await lol.replyWithPhoto({ url: result.thumb }, { caption: caption, parse_mode: "Markdown" })
                                await reply('wait ±2min')
                                soleh = `${result.title}kazuvid.mp4`
                                await lol.replyWithVideo({ url: result.dl_link, filename: soleh }, { thumb: result.thumb })
                            })
                    })
                break
            case 'ytmp4':
                if (args.length == 0) return reply(`Example: ${prefix + command} https://www.youtube.com/watch?v=qZIQAk-BUEc`)
                ini_link = args[0]
                result = await fetchJson(`http://api.lolhuman.xyz/api/ytvideo?apikey=ZEROKARA&url=${ini_link}`)
                result = result.result
                caption = `\`❖ Title    :\` *${result.title}*\n`
                caption += `\`❖ Uploader :\` *${result.uploader}*\n`
                caption += `\`❖ Duration :\` *${result.duration}*\n`
                caption += `\`❖ View     :\` *${result.view}*\n`
                caption += `\`❖ Like     :\` *${result.like}*\n`
                caption += `\`❖ Dislike  :\` *${result.dislike}*\n`
                caption += `\`❖ Size     :\` *${result.link[3].size}*`
                await lol.replyWithPhoto({ url: result.thumbnail }, { caption: caption, parse_mode: "Markdown" })
                if (Number(result.link[0].size.split(` MB`)[0]) >= 50.00) return reply(`Sorry the bot cannot send more than 50 MB!`)
                await lol.replyWithVideo({ url: result.link[0].link }, { thumb: result.thumbnail })
                break
            //simi//
            default:
                if (!isGroup && !isCmd) {
                    await lol.replyWithChatAction("typing")
                    simi = await fetchJson(`https://api.zeks.xyz/api/simi?apikey=${zeks}&text=${encodeURI(body)}`)
                    await reply(simi.result)
                }
        }
    } catch (e) {
        console.log(chalk.cyanBright("[  ERROR  ]"), chalk.redBright(e))
    }
})


bot.launch()
bot.telegram.getMe().then((getme) => {
    itsPrefix = (prefix != "") ? prefix : "No Prefix"
    console.log(chalk.greenBright(' ===================================================='))
    console.log(chalk.greenBright(" │ + Owner    : " + owner || ""))
    console.log(chalk.greenBright(" │ + Bot Name : " + getme.first_name || ""))
    console.log(chalk.greenBright(" │ + Version  : " + version || ""))
    console.log(chalk.greenBright(" │ + Host     : " + os.hostname() || ""))
    console.log(chalk.greenBright(" │ + Platfrom : " + os.platform() || ""))
    console.log(chalk.greenBright(" │ + Core     : " + os.cpus().length || ""))
    console.log(chalk.greenBright(` │ + RAM      : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(os.totalmem / 1024 / 1024)} MB`))
    console.log(chalk.greenBright(" │ + Prefix   : " + itsPrefix))
    console.log(chalk.greenBright(' ===================================================='))
    console.log(chalk.whiteBright('╭─── [ LOG ]'))
})
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))