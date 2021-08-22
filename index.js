const { fetchJson, range, parseMarkdown } = require('./lib/function')
const { Telegraf } = require('telegraf')
const help = require('./lib/help')
const tele = require('./lib/tele')
const chalk = require('chalk')
const os = require('os')
const fs = require('fs')

const {
    apikey,
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

bot.on("new_chat_members", async(lol) => {
    var message = lol.message
    var pp_group = await tele.getPhotoProfile(message.chat.id)
    var groupname = message.chat.title
    var groupmembers = await bot.telegram.getChatMembersCount(message.chat.id)
    for (x of message.new_chat_members) {
        var pp_user = await tele.getPhotoProfile(x.id)
        var full_name = tele.getUser(x).full_name
        console.log(chalk.whiteBright("├"), chalk.cyanBright("[  JOINS  ]"), chalk.whiteBright(full_name), chalk.greenBright("join in"), chalk.whiteBright(groupname))
        await lol.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/base/welcome?apikey=${apikey}&img1=${pp_user}&img2=${pp_group}&background=https://i.ibb.co/8B6Q84n/LTqHsfYS.jpg&username=${encodeURI(full_name)}&member=${groupmembers}&groupname=${encodeURI(groupname)}` })
    }
})

bot.on("left_chat_member", async(lol) => {
    var message = lol.message
    var pp_group = await tele.getPhotoProfile(message.chat.id)
    var pp_user = await tele.getPhotoProfile(message.left_chat_member.id)
    var pp_group = await tele.getPhotoProfile(message.chat.id)
    var groupname = message.chat.title
    var groupmembers = await bot.telegram.getChatMembersCount(message.chat.id)
    var pp_user = await tele.getPhotoProfile(message.left_chat_member.id)
    var full_name = tele.getUser(message.left_chat_member).full_name
    console.log(chalk.whiteBright("├"), chalk.cyanBright("[  LEAVE  ]"), chalk.whiteBright(full_name), chalk.greenBright("leave from"), chalk.whiteBright(groupname))
    await lol.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/base/leave?apikey=${apikey}&img1=${pp_user}&img2=${pp_group}&background=https://i.ibb.co/8B6Q84n/LTqHsfYS.jpg&username=${encodeURI(full_name)}&member=${groupmembers}&groupname=${encodeURI(groupname)}` })
})

bot.command('start', async(lol) => {
    user = tele.getUser(lol.message.from)
    await help.start(lol, user.full_name)
    await lol.deleteMessage()
})

bot.command('help', async(lol) => {
    user = tele.getUser(lol.message.from)
    await help.help(lol, user.full_name, lol.message.from.id.toString())
})

bot.on("callback_query", async(lol) => {
    cb_data = lol.callbackQuery.data.split("-")
    user_id = Number(cb_data[1])
    if (lol.callbackQuery.from.id != user_id) return lol.answerCbQuery("Sorry, You do not have the right to access this button.", { show_alert: true })
    callback_data = cb_data[0]
    user = tele.getUser(lol.callbackQuery.from)
    const isGroup = lol.chat.type.includes("group")
    const groupName = isGroup ? lol.chat.title : ""
    if (!isGroup) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ ACTIONS ]"), chalk.whiteBright(callback_data), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
    if (isGroup) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ ACTIONS ]"), chalk.whiteBright(callback_data), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))
    if (callback_data == "help") return await help[callback_data](lol, user.full_name, user_id)
    await help[callback_data](lol, user_id.toString())
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
        const user = tele.getUser(lol.message.from)

        const reply = async(text) => {
            for (var x of range(0, text.length, 4096)) {
                return await lol.replyWithMarkdown(text.substr(x, 4096), { disable_web_page_preview: true })
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
        const isQuotedImage = quotedMessage.hasOwnProperty("photo")
        const isQuotedVideo = quotedMessage.hasOwnProperty("video")
        const isQuotedAudio = quotedMessage.hasOwnProperty("audio")
        const isQuotedSticker = quotedMessage.hasOwnProperty("sticker")
        const isQuotedContact = quotedMessage.hasOwnProperty("contact")
        const isQuotedLocation = quotedMessage.hasOwnProperty("location")
        const isQuotedDocument = quotedMessage.hasOwnProperty("document")
        const isQuotedAnimation = quotedMessage.hasOwnProperty("animation")
        const isQuoted = lol.message.hasOwnProperty("reply_to_message")

        var typeMessage = body.substr(0, 50).replace(/\n/g, '')
        if (isImage) typeMessage = "Image"
        else if (isVideo) typeMessage = "Video"
        else if (isAudio) typeMessage = "Audio"
        else if (isSticker) typeMessage = "Sticker"
        else if (isContact) typeMessage = "Contact"
        else if (isLocation) typeMessage = "Location"
        else if (isDocument) typeMessage = "Document"
        else if (isAnimation) typeMessage = "Animation"

        if (!isGroup && !isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ PRIVATE ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
        if (isGroup && !isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[  GROUP  ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))
        if (!isGroup && isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ COMMAND ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name))
        if (isGroup && isCmd) console.log(chalk.whiteBright("├"), chalk.cyanBright("[ COMMAND ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName))

        var file_id = ""
        if (isQuoted) {
            file_id = isQuotedImage ? lol.message.reply_to_message.photo[lol.message.reply_to_message.photo.length - 1].file_id :
                isQuotedVideo ? lol.message.reply_to_message.video.file_id :
                isQuotedAudio ? lol.message.reply_to_message.audio.file_id :
                isQuotedDocument ? lol.message.reply_to_message.document.file_id :
                isQuotedAnimation ? lol.message.reply_to_message.animation.file_id : ""
        }
        var mediaLink = file_id != "" ? await tele.getLink(file_id) : ""

        switch (command) {
            case 'help':
                await help.help(lol, user.full_name, lol.message.from.id.toString())
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
            case 'wikipedia':
            case 'wiki':
                if (args.length == 0) return reply(`Example: ${prefix + command} google`)
                try {
                  siang = args.join(" ")
                  sore = await fetchJson(`https://tobz-api.herokuapp.com/api/wiki?q=${siang}&apikey=Tobzzz17`)
                  await reply(sore.result)
                } catch (e) {
                    console.log(e)
                    help.messageError(lol)
                    IdO ='1816320494'
                   query = `[wiki]${e}`
	              await bot.telegram.sendMessage(IdO, query)
                }
                break
            case 'kbbi':
                if (args.length == 0) return reply(`Example: ${prefix + command} kucing`)
                try {
                  senja = args.join(" ")
                  pagi = await fetchJson(`https://tobz-api.herokuapp.com/api/kbbi?kata=${senja}&apikey=Tobzzz17`)
                  await reply(pagi.result)
                } catch (e) {
                    console.log(e)
                    help.messageError(lol)
                    IdO ='1816320494'
                   query = `[kbbi]${e}`
                  await bot.telegram.sendMessage(IdO, query)
                }
                break
            case 'trjp':
                if (args.length == 0) return reply(`Example: ${prefix + command} selamat pagi`)
                try {
                pima = args.join(" ")
                await lol.replyWithChatAction("typing")
                result = await fetchJson(`https://api.lolhuman.xyz/api/translate/id/ja?apikey=${apikey}&text=${encodeURI(pima)}`)
                await reply(result.result.translated)
                } catch (e) {
                    console.log(e)
                    help.messageError(lol)
                    IdO ='1816320494'
                   query = `[ytsearch]${e}`
	              await bot.telegram.sendMessage(IdO, query)
                }
                break
            case 'trid':
                if (args.length == 0) return reply(`Example: ${prefix + command} ohayou`)
                try {
                rini = args.join(" ")
                await lol.replyWithChatAction("typing")
                result = await fetchJson(`https://api.lolhuman.xyz/api/translate/ja/id?apikey=${apikey}&text=${encodeURI(rini)}`)
                await reply(result.result.translated)
                } catch (e) {
                    console.log(e)
                    help.messageError(lol)
                    IdO ='1816320494'
                   query = `[trid]${e}`
	              await bot.telegram.sendMessage(IdO, query)
                }
                break
            

                // Downloader //
            case 'play':
                if (args.length == 0) return await reply(`Example: ${prefix + command} ending tonikaku kawai`)
                try {
                await fetchJson(`https://api-yogipw.herokuapp.com/api/yt/search?query=${args.join(" ")}`)
                    .then(async(result) => {
                        await fetchJson(`https://api.zeks.xyz/api/ytmp3?apikey=ZerokaraBot&url=https://m.youtube.com/watch?v=${result.result[0].videoId}`)
                            .then(async(result) => {
                                caption = `\`❖ Title     :\` ${result.result.title}\n`
                                caption += `\`❖ Link      :\`${result.result.url_audio}\n`
                                caption += `\`❖ Size :\` ${result.result.size}\n`
                                await lol.replyWithPhoto({ url: result.result.thumbnail }, { caption: caption, parse_mode: "Markdown" })
                                await reply('TUNGGU!musik akan segera dikirim')
                                acmar = `${result.result.title}kazumusik.mp3`
                                if (Number(result.result.size.split(` MB`)[0]) >= 50.00) return reply(`Sorry the bot cannot send more than 50 MB!`)
                                await lol.replyWithAudio({ url: result.result.url_audio, filename: acmar }, { thumb: result.result.thumbnail })
                            })
                    })
               } catch (e) {
                    console.log(e)
                    help.messageError(lol)
                    IdO ='1816320494'
                    query = `[play]${e}`
	                await bot.telegram.sendMessage(IdO, query)
                }
                break
            case 'ytsearch':
                if (args.length == 0) return reply(`Example: ${prefix + command} Melukis Senja`)
                try {
                    query = args.join(" ")
                    result = await fetchJson(`https://api-yogipw.herokuapp.com/api/yt/search?query=${query}`)
                    hasil = result.result.slice(0, 5)
                    hasil.forEach(async(res) => {
                        caption = `\`❖ Title     :\` *${res.title}*\n`
                        caption += `\`❖ Link      :\`*https://www.youtube.com/watch?v=${res.videoId} *\n`
                        caption += `\`❖ Published :\` *${res.ago}*\n`
                        caption += `\`❖ Views    :\` *${res.views}*\n`
                        await lol.replyWithPhoto({ url: res.thumbnail }, { caption: caption, parse_mode: "Markdown" })
                    })
                } catch (e) {
                    console.log(e)
                    help.messageError(lol)
                    IdO ='1816320494'
                   query = `[ytsearch]${e}`
	              await bot.telegram.sendMessage(IdO, query)
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
            try {
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
                                if (Number(result.filesizeF.split(` MB`)[0]) >= 50.00) return reply(`Sorry the bot cannot send more than 50 MB!`)
                                await lol.replyWithVideo({ url: result.dl_link, filename: soleh }, { thumb: result.thumb })
                            })
                    })
                } catch (e) {
                    console.log(e)
                    help.messageError(lol)
                    IdO ='1816320494'
                   query = `[video]${e}`
	              await bot.telegram.sendMessage(IdO, query)
                }
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

                // Searching
            case 'reverse':
                if (!isQuotedImage) return await reply(`Please reply a image use this command.`)
                google = await fetchJson(`https://api.lolhuman.xyz/api/googlereverse?apikey=${apikey}&img=${mediaLink}`)
                yandex = await fetchJson(`https://api.lolhuman.xyz/api/reverseyandex?apikey=${apikey}&img=${mediaLink}`)
                options = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'Google', url: google.result },
                                { text: 'Yandex', url: yandex.result }
                            ]
                        ]
                    }
                }
                await lol.reply(`Found result`, options)
                break
            case 'wait':
                if (isQuotedImage || isQuotedAnimation || isQuotedVideo || isQuotedDocument) {
                    url_file = await tele.getLink(file_id)
                    result = await fetchJson(`https://api.lolhuman.xyz/api/wait?apikey=${apikey}&img=${url_file}`)
                    result = result.result
                    text = `Anilist id : ${result.anilist_id}\n`
                    text += `MAL id : ${result.mal_id}\n`
                    text += `Title Romaji : ${result.title_romaji}\n`
                    text += `Title Native : ${result.title_native}\n`
                    text += `Title English : ${result.title_english}\n`
                    text += `At : ${result.at}\n`
                    text += `Episode : ${result.episode}\n`
                    text += `Similarity : ${result.similarity}`
                    await lol.replyWithVideo({ url: result.video }, { caption: text })
                } else {
                    reply(`Tag gambar yang sudah dikirim`)
                }
                break
           
            case 'test':
                test = await bot.telegram.getChatMembersCount(lol.message.chat.id)
                console.log(test)
                break
            default:
                if (!isGroup && !isCmd && !isMedia) {
                    await lol.replyWithChatAction("typing")
                    simi = await fetchJson(`https://api.zeks.xyz/api/simi?apikey=wwicoslow&text=${encodeURI(body)}`)
                    await reply(simi.result)
                }
        }
    } catch (e) {
        console.log(chalk.whiteBright("├"), chalk.cyanBright("[  ERROR  ]"), chalk.redBright(e))
        IdO ='1816320494'
        query = `[simi error]${e}`
	    await bot.telegram.sendMessage(IdO, query)
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
    console.log(chalk.greenBright(" │ + Prefix   : " + itsPrefix))
    console.log(chalk.greenBright(' ===================================================='))
    console.log(chalk.whiteBright('╭─── [ LOG ]'))
})
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))