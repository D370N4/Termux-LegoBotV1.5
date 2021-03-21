const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const { help } = require('./src/help')
const { help1 } = require('./src/help1')
const { idiome } = require('./src/idiome')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const { nsfwmenu } = require('./src/nsfwmenu')
const fs = require('fs')
const axios = require('axios')
const client = require('nekos.life');
const neko = new client();
const math = require('mathjs')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const kagApi = require('@kagchi/kag-api')
const fetch = require('node-fetch')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const imgbb = require('imgbb-uploader')
const lolis = require('lolis.life')
const loli = new lolis()
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
const double = Math.floor(Math.random() * 2) + 1
const lvpc = Math.floor(Math.random() * 100) + 1
prefix = '.'
blocked = []

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Hora ${pad(minutes)} Minuto ${pad(seconds)} Segundo`
}

async function starts() {
	const client = new WAConnection()
	client.logger.level = 'warn'
	console.log(banner.string)
	client.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan the qr code above'))
	})

	fs.existsSync('./BarBar.json') && client.loadAuthInfo('./BarBar.json')
	client.on('connecting', () => {
		start('2', 'Connecting...')
	})
	client.on('open', () => {
		success('2', 'Connected')
	})
	await client.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./BarBar.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

	client.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Olá @${num.split('@')[0]}\nBem vindo ao grupo *${mdata.subject}*\nLeia a descrição do grupo e por favor não seja um ghost🥰🤙️`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Tchau @${num.split('@')[0]} ja foi tarde 😂👋🏾`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})

	client.on('CB:Blocklist', json => {
            if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	client.on('chat-update', async (mek) => {
		try {
                        if (!mek.hasNewMessage) return
                        mek = JSON.parse(JSON.stringify(mek)).messages[0]
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const apiKey = 'Your-Api-Key'
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)

			mess = {
				wait: '⌛ Por favor, aguarde um pouco... ⌛',
				success: '✔️ Deu certo, ufa kk ✔️',
				error: {
					stick: '⚠️ Falha, ocorreu um erro ao converter a imagem em figurinha ⚠️',
					Iv: '❌ Link inválido ❌'
				},
				only: {
					group: '❌ Este comando só pode ser usado em grupos! ❌',
					ownerG: '⚠️ Este comando só pode ser usado pelo dono do bot! 😂',
					ownerB: '❌ Este comando só pode ser usado pelo proprietário do bot! ❌',
					admin: '⚠️ Este comando só pode ser usado por admins! 😝',
					Badmin: '❌ Este comando só pode ser usado quando o bot se torna um administrador! ❌'
				}
			}

			const botNumber = client.user.jid
			const ownerNumber = ["5511995982356@s.whatsapp.net"] // replace this with your number
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupDesc = isGroup ? groupMetadata.desc : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : true
			const isSimi = isGroup ? samih.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			switch(command) {
				case 'help':
				case 'menu':
					client.sendMessage(from, help(prefix), text)
					break
					case 'help1':
				case 'menu1':
					client.sendMessage(from, help1(prefix), text)
					break
                case 'nsfwmenu':
			        client.sendMessage(from, nsfwmenu(prefix, sender), text, {quoted: mek})
				    break
				case 'info':
					me = client.user
					uptime = process.uptime()
					teks = `*Nama bot* : ${me.name}\n*Número do bot* : @${me.jid.split('@')[0]}\n*Prefix* : ${prefix}\n*Contato de bloqueio total* : ${blocked.length}\n*`
					buffer = await getBuffer(me.imgUrl)
					client.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
					break
				case 'blocklist':
					teks = 'Esta é a lista de números bloqueados :\n'
					for (let block of blocked) {
						teks += `~> @${block.split('@')[0]}\n`
					}
					teks += `Total : ${blocked.length}`
					client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					break
				case 'ocr':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('Só uma foto')
					}
					break
                case 'figu':
				case 'figurinha':
				case 'stiker':
				case 'sticker':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Finish')
								client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`❌ Falha ao converter ${tipe} para figurinha`)
							})
							.on('end', function () {
								console.log('Finish')
								client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'Your-ApiKey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg.result, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('Falha, ocorreu um erro, tente novamente mais tarde.')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return reply(mess.error.stick)
								client.sendMessage(from, fs.readFileSync(ranw), sticker, {quoted: mek})
							})
						})
					/*} else if ((isMedia || isQuotedImage) && colors.includes(args[0])) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.on('start', function (cmd) {
								console.log('Started :', cmd)
							})
							.on('error', function (err) {
								fs.unlinkSync(media)
								console.log('Error :', err)
							})
							.on('end', function () {
								console.log('Finish')
								fs.unlinkSync(media)
								client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)*/
					} else {
						reply(`Aparentemente você escreveu o comando errado ou o vídeo solicitado tem mais de 10 segundos, recomendamos usar gifs de no máximo 7 segundos caso queira evitar problemas`)
					}
					break
				case 'tts':
				   client.updatePresence(from, Presence.recording) 
				   if (args.length < 1) return client.sendMessage(from, 'Qual é o código da linguagem? Caso não saiba, use o conando .idioma', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return client.sendMessage(from, 'Cadê o texto', text, {quoted: mek})
					dtt = body.slice(8)
					ranm = getRandom('.mp3')
					rano = getRandom('.ogg')
					dtt.length > 600
					? reply('limite de 600 caracteres')
					: gtts.save(ranm, dtt, function() {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							buff = fs.readFileSync(rano)
							if (err) return reply('Gagal om:(')
							client.sendMessage(from, buff, audio, {quoted: mek, ptt:true})
							fs.unlinkSync(rano)
						})
					})
					break
                case 'idiomas':
                case 'idioma':
					client.sendMessage(from, idiome(prefix), text)
					break
				case 'meme':
					meme = await kagApi.memes()
					buffer = await getBuffer(`https://imgur.com/${meme.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
                case 'infogrupo':
                    client.updatePresence(from, Presence.composing)
                    if (!isGroup) return reply(mess.only.group)
                    ppUrl = await client.getProfilePicture(from) // leave empty to get your own
			        buffer = await getBuffer(ppUrl)
		            client.sendMessage(from, buffer, image, {quoted: mek, caption: `*NOME* : ${groupName}\n\n*DESCRIÇÃO* : ${groupDesc}`})
                    break
                case 'onlyadm':
					client.updatePresence(from, Presence.composing) 
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('digite 1 para abrir, 0 para fechar o grupo')
					if (Number(args[0]) === 0) {
						var nomor = mek.participant
					const close = {
					text: `Grupo fechado pelo administrador @${nomor.split("@s.whatsapp.net")[0]}\nagora *apenas administradores* podem enviar mensagens`,
					contextInfo: { mentionedJid: [nomor] }
					}
					client.groupSettingChange (from, GroupSettingChange.messageSend, true);
					reply(close)
					} else if (Number(args[0]) === 1) {
						open = {
					text: `Grupo aberto pelo administrador @${sender.split("@")[0]}\nagora *todos os participantes* podem enviar mensagens`,
					contextInfo: { mentionedJid: [sender] }
					}
					client.groupSettingChange (from, GroupSettingChange.messageSend, false)
					client.sendMessage(from, open, text, {quoted: mek})
					} else {
					reply('digite 1 para abrir, 0 para fechar o grupo')
					}
					break
                case 'block':
					client.updatePresence(from, Presence.composing) 
					if (!isGroup) return reply(mess.only.group)
					if (!isOwner) return reply(mess.only.ownerB)
					client.blockUser (`${body.slice(8)}@c.us`, "add")
					client.sendMessage(from, `Pedidos recebidos, bloquear ${body.slice(8)}@c.us`, text)
					break
				case 'porno':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx3BgnL2qAHDTlfCPMAvdjuLGvOx402dSdhw&usqp=CAU`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Adm proibiu porno no gp🙄'})
					break
				case 'dono':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://lh3.googleusercontent.com/pw/ACtC-3exdwgviVgJK8T3UQIO7AQmi0_sDAnLWZ8l3OP7IpFoOnUzSHXkBGx-xCZ_DHfwnqXTpsY22-ybg7CujrN2sUcqIaN7fNqwLLjH6vWHlzgMGlbpSrPDrHJvYks4Cdt0eGH5Y74P-a7fBBjCpBWGz1bY=s625-no?authuser=0.jpg `)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '*CRIADOR:* Legosi-dono\n*WPP:* wa.me/18482765528'})
					break
				case 'belle2':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://4.bp.blogspot.com/-pBwX3-rdXeM/XwTW_9oT_9I/AAAAAAAAPt4/_jmeK-lOJMoE4gPYvhgFqzOp-uKnNN9ygCLcBGAsYHQ/s1600/boabronha_2.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: 'slc'})
					break
				case 'grupo':
			     	memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://lh3.googleusercontent.com/pw/ACtC-3c3P5wP0jGkyuP_6D65FjmVM5r6711wm41uweitGX2Y5Os4BSqgx8twv2aVi0imJKJP8hoPOrvLtpPuTMxSPBxiPPuB1tbmmdtsdupFCwGUgtFDFV8lsSD4smPdqLZzRZNd-n_cztEEaZcJW-QP6P9k=s625-no?authuser=0.png `)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: 'entra aí mano, tmj\n https://chat.whatsapp.com/CZk4tz8Q3jlLNHYZOERkeN'})
					break
				case 'belle3':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://1.bp.blogspot.com/-3K_b14RzHTA/XwTW7SQTPRI/AAAAAAAAPtY/UOaKURECbzwXfvASa3g6Pz0D_Ha73Dw4wCLcBGAsYHQ/s1600/boabronha_10.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: 'olha p isso mano, pqp '})
					break
				case 'akeno':
					meme = await kagApi.memes()
					buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnFAocqaur5ZX1DPN6ZGP8PJy2cNppas_gYA&usqp=CAU`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
				case 'loli1':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://i.imgur.com/iphQUGi.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: 'hmm, então quer ver loli?'})
					break
				case 'hentai':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://i.imgur.com/8U9GwX4.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Cara bate pra 2d 😂'})
					break
				case 'bomdia':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://i.imgur.com/7VL9cFf.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Bom dia, vcs sao fodas ❤️'})
					break
				case 'donate':
				    memein = await kagApi.memeindo()
				    buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-hCbp3CuiLaHYmWx1nUPOhP5gvCC0RREaZg&usqp=CAU`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: 'me ajuda a pagar a pensão do enzo 😂\n https://m.kwai.app/s/KeI6cAU9'})
				    break
				case 'bomdia1':
				    memein = await kagApi.memeindo()
				    buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThVCLKXRIajYxMIrLYgbX1TVFXd_1Ftdxx8g&usqp=CAU`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Bom dia, seus gostosos ❤️'})
				    break
				case 'superpack':
				    memein = await kagApi.memeindo()
				    buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ18HwCvjnh-O0PYa5zNdseg9WlC-Q8RDxAEA&usqp=CAU`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: 'https://www.superhentais.com/hentai-anime/lovely-day\nhttps://www.superhentais.com/hentai-anime/furyou-ni-hamerarete-jusei-suru-kyonyuu-okaa-san-the-animation\nhttps://www.superhentais.com/hentai-anime/bikyaku-seido-kaichou-ai\nhttps://www.superhentais.com/hentai-anime/enbi\nhttps://www.superhentais.com/hentai-anime/bi-chiku-beach-nangoku-nyuujoku-satsueikai\nhttps://www.superhentais.com/hentai-anime/bijukubo\nhttps://www.superhentais.com/hentai-anime/betsu-ni-anta-no-tame-ni-ookiku-nattan-janain-dakarane\nhttps://www.superhentais.com/hentai-anime/jk-fuuzoku-gakuensai\nhttps://www.superhentais.com/hentai-anime/meijyou\nhttps://www.superhentais.com/hentai-anime/kuro-gal-ni-nattakara-shin-yuu-to-shite-mita'})
				    break
                case 'superpack1':
				    memein = await kagApi.memeindo()
				    buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ18HwCvjnh-O0PYa5zNdseg9WlC-Q8RDxAEA&usqp=CAU`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: 'https://www.superhentais.com/hentai-anime/ero-zemi-ecchi-ni-yaru-ki-ni-abc-the-animation\nhttps://www.superhentais.com/hentai-anime/enkou-shoujo-rikujoubu-yukky-no-baai-the-animation\nhttps://www.superhentais.com/hentai-anime/boy-meets-harem-the-animation\nhttps://www.superhentais.com/hentai-anime/binkan-athlete\nhttps://www.superhentais.com/hentai-anime/bangable-girl-train-sex\nhttps://www.superhentais.com/hentai-anime/bokura-no-sex\nhttps://www.superhentais.com/hentai-anime/euphoria\nhttps://www.superhentais.com/hentai-anime/real-eroge-situation-2-the-animation/9429727\nhttps://www.superhentais.com/hentai-anime/jk-fuuzoku-gakuensai/2370416\nhttps://www.superhentais.com/hentai-anime/meijyou/1312621\nhttps://www.superhentais.com/hentai-anime/rikujoubu-joshi-wa-ore-no-nama-onaho-the-animation\nhttps://www.superhentais.com/hentai-anime/hajimete-no-orusuban/4462940\nhttps://www.superhentais.com/hentai-anime/meijyou'})
				    break
                case 'superpack2':
				    memein = await kagApi.memeindo()
				    buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ18HwCvjnh-O0PYa5zNdseg9WlC-Q8RDxAEA&usqp=CAU`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: 'https://www.superhentais.com/hentai-anime/eromame\nhttps://www.superhentais.com/hentai-anime/dekakute-ecchi-na-ore-no-ane\nhttps://www.superhentais.com/hentai-anime/d-spray\nhttps://www.superhentais.com/hentai-anime/dokidoki-oyako-lesson-oshiete-h-na-obenkyou\nhttps://www.superhentais.com/hentai-anime/dainiji-ura-nyuugaku-shiken-the-animation\nhttps://www.superhentais.com/hentai-anime/diabolus-kikoku\nhttps://www.superhentais.com/hentai-anime/demonion-gaiden\nhttps://www.superhentais.com/hentai-anime/desperate-carnal-housewives\nhttps://www.superhentais.com/hentai-anime/ijirare-fukushuu-saimin\nhttps://www.superhentais.com/hentai-anime/toilet-no-hanako-san-vs-kukkyou-taimashi\nhttps://www.superhentais.com/hentai-anime/ane-kyun\nhttps://www.superhentais.com/hentai-anime/aku-no-onna-kanbu\nhttps://www.superhentais.com/hentai-anime/amanee\nhttps://www.superhentais.com/hentai-anime/ane-summer\nhttps://www.superhentais.com/hentai-anime/anejiru-2'})
				    break
                case 'superpack3':
				    memein = await kagApi.memeindo()
				    buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ18HwCvjnh-O0PYa5zNdseg9WlC-Q8RDxAEA&usqp=CAU`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: 'https://www.superhentais.com/hentai-anime/futabu\nhttps://www.superhentais.com/hentai-anime/aku-no-onna-kanbu-full-moon-night\nhttps://www.superhentais.com/hentai-anime/ane-to-boin\nhttps://www.superhentais.com/hentai-anime/akina-to-onsen-de-h-shiyo\nhttps://www.superhentais.com/hentai-anime/chijoku-no-seifuku\nhttps://www.superhentais.com/hentai-anime/consenting-adultery\nhttps://www.superhentais.com/hentai-anime/dark-blue\nhttps://www.superhentais.com/hentai-anime/hishoka-drop-the-animation\nhttps://www.superhentais.com/hentai-anime/daraku-reijou-the-animation\nhttps://www.superhentais.com/hentai-anime/harem-time-the-animation\nhttps://www.superhentais.com/hentai-anime/hontou-ni-atta-hitozuma-furin-kokuhaku\nhttps://www.superhentais.com/hentai-anime/papa-love\nhttps://www.superhentais.com/hentai-anime/hakoiri-shoujo-virgin-territory\nhttps://www.superhentais.com/hentai-anime/hyoudou-ibuki-kanpeki-ibuki-kaichou-ga-kousoku-do-m-na-wake\nhttps://www.superhentais.com/hentai-anime/chinetsu-karte-the-devilish-cherry'})
				    break
                case 'superpack4':
				    memein = await kagApi.memeindo()
				    buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ18HwCvjnh-O0PYa5zNdseg9WlC-Q8RDxAEA&usqp=CAU`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: 'https://www.superhentais.com/hentai-anime/cafe-junkie\nhttps://www.superhentais.com/hentai-anime/cosplay-rakuen\nhttps://www.superhentais.com/hentai-anime/cele-kano\nhttps://www.superhentais.com/hentai-anime/chu-shite-agechau-oshikake-onee-san-no-seikou-chiryou\nhttps://www.superhentais.com/hentai-anime/cleavage\nhttps://www.superhentais.com/hentai-anime/chichi-iro-toiki\nhttps://www.superhentais.com/hentai-anime/gakuen-de-jikan-yo-tomare\nhttps://www.superhentais.com/hentai-anime/gakuen-shinshoku-xx-of-the-dead\nhttps://www.superhentais.com/hentai-anime/oppai-heart\nhttps://www.superhentais.com/hentai-anime/gakuen-maria\nhttps://www.superhentais.com/hentai-anime/gyakuten-majo-saiban-chijo-na-majo-ni-sabakarechau-the-animation\nhttps://www.superhentais.com/hentai-anime/anime-nanase-ren\nhttps://www.superhentais.com/hentai-anime/gitai-saimin\nhttps://www.superhentais.com/hentai-anime/zton-jingai-animation-a-beautiful-greed-nulu-nulu'})
				    break
                case 'superpack5':
				    memein = await kagApi.memeindo()
				    buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ18HwCvjnh-O0PYa5zNdseg9WlC-Q8RDxAEA&usqp=CAU`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: 'https://www.superhentais.com/hentai-anime/green-eyes-ane-kyun-yori-the-animation\nhttps://www.superhentais.com/hentai-anime/uhou-renka\nhttps://www.superhentais.com/hentai-anime/kanojo-ga-nekomimi-ni-kigaetara\nhttps://www.superhentais.com/hentai-anime/bible-black-only-version\nhttps://www.superhentais.com/hentai-anime/birei-okami-mie\nhttps://www.superhentais.com/hentai-anime/spocon\nhttps://www.superhentais.com/hentai-anime/fault-service-aratanaru-rival\nhttps://www.superhentais.com/hentai-anime/gogo-no-kouchou-junai-mellow-yori\nhttps://www.superhentais.com/hentai-anime/anime-yagami-yuu\nhttps://www.superhentais.com/hentai-anime/fighting-of-ecstasy\nhttps://www.superhentais.com/hentai-anime/anime-kazama-mana\nhttps://www.superhentais.com/hentai-anime/fukubiki-triangle-futaba-wa-atafuta\nhttps://www.superhentais.com/hentai-anime/furueru-kuchibiru\nhttps://www.superhentais.com/hentai-anime/immoral-sisters-2'})
				    break
				case 'boatarde':
				    memein = await kagApi.memeindo()
				    buffer = await getBuffer(`https://i.imgur.com/JaO3yoV.jpg`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Boa tarde, rapeize 😎👍'})
				break
				case 'bilada':
				    memein = await kagApi.memeindo() 
				    buffer = await getBuffer(`https://photos.google.com/share/AF1QipMa60EQouDeuGa2NjDFvyggtUvuu3vKiv6pon__6_uhBG5Q4MRgicLUGWkeHdiWyw/photo/AF1QipMkkk_oycL33c9oMgl4fojPUnBIw4pADeNGhJY5?key=YUwxY2MwMGtoVjdIT1dWQmxQY3lXTXdwcEJBVWpR.vid`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: 'CARRRRRRRRRALHOOOW'})
				    break
				case 'boatarde1':
				    memein = await kagApi.memeindo()
				    buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4_dcbFTG4Stht4uDA5bAvUprLFsRLgoHeQQ&usqp=CAU`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Boa tarde, vamo aglomerar???? 😎👍'})
				    break
				case 'boanoite':
				    memein = await kagApi.memeindo()
				    buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIyjhZyKv5fvp2ZVe39RGVqgH9rKnoXOXXbA&usqp=CAU.jpg`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Boa noite fml ❤️'})
				    break
				case 'boanoite1':
				    memein = await kagApi.memeindo()
				    buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOgUzAyYk7NgH4yQsLb3fQeOfQdbZwhMNeSg&usqp=CAU`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: 'hmmm soninbom, boa noite seus fofos ❤️'})
				    break
				case 'belle':
				    memein = await kagApi.memeindo()
				    buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZu6GwgURUgkuWZXOq-KPLRvA5LOezhvY_VQ&usqp=CAU`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: '👀️'})
				    break
				case 'belle1':
				    memein = await kagApi.memeindo()
				    buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ7ot6RZPnXSJFFKVjPoeXHjTYyi6uk5W_mA&usqp=CAU`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: '👀️'})
				    break
				case 'mia':
			    	memein = await kagApi.memeindo()
				    buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaKeXU5ryvFTNz6nJm9cioGCoeqlZQSh1Mgw&usqp=CAU`)
				    client.sendMessage(from, buffer, image, {quoted: mek, caption: '👀️'})
				    break
				case 'lofi':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL9hZBPRo16fIhsIus3t1je2oAU23pQqBpfw&usqp=CAU`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '️💆'})
					break
				case 'malkova':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtbo5EcVSGj-IvEVznHIgMZ9vjFptZfvprtg&usqp=CAU`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '️💆'})
					break
				case 'canal':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://imgur.com/gallery/xuTCBPO`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '️*canal do dark:*\n\n https://bit.ly/3omUNCg'})
					break
				case 'mia1':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjVCGkGDxARumfloekQMCazM8uvpj2AgW2lg&usqp=CAU`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '👀️'})
					break
				case 'lolifoda':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJhzKetbU3pzhoZdaIo6qBklCzwvmCCOznbg&usqp=CAU`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Rum️'})
					break
				case 'reislin':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKlc2hMIJ4PjW5tIXltrKe6xeBoKPLKTZMnQ&usqp=CAU`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '🤭'})
					break
				case 'mia2':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://i.gifer.com/7udO.gif`)
					client.sendMessage(from, buffer, video, {quoted: mek, caption: 'use o .sticker para ver o gif da mia️'})
					break
				case 'memeindo':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://imgur.com/${memein.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
				case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					reply(`O prefixo foi alterado com sucesso para : ${prefix}`)
					break
                case 'waifu':
					gatauda = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.my.id/api/nekonime`, {method: 'get'})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, image,{quoted: mek})
					break
				case 'nsfwtrap':
                      try{
                      if (!isNsfw) return reply('❌ *NSFW Desativado* ❌')
                      res = await fetchJson(`https://tobz-api.herokuapp.com/nsfwtrap?apikey=BotWeA`, {method: 'get'})
                      buffer = await getBuffer(res.result)
                      client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Nih gambarnya kak...'})
                       } catch (e) {
                       console.log(`*Error* :`, color(e,'red'))
                        reply('❌ *ERROR* ❌')
                       }
	                	break
		         case 'randomhentaio': 
						try {
							if (!isNsfw) return reply('❌ *NSFW Desativado* ❌')
							res = await fetchJson(`https://tobz-api.herokuapp.com/api/hentai?apikey=BotWeA`, {method: 'get'})
							buffer = await getBuffer(res.result)
							client.sendMessage(from, buffer, image, {quoted: mek, caption: 'hentai teros'})
						} catch (e) {
							console.log(`Error :`, color(e,'red'))
							reply('❌ *ERROR* ❌')
						}
						break
					case 'nsfwloli':
						try {
							if (!isNsfw) return reply('❌ *NSFW Desativado* ❌')
							res = await fetchJson(`https://api.lolis.life/random?nsfw=true`, {method: 'get'})
							buffer = await getBuffer(res.url)
							client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Jangan jadiin bahan buat comli om'})
						} catch (e) {
							console.log(`Error :`, color(e,'red'))
							reply('❌ *ERROR* ❌')
						}
						break
					case 'nsfwbobs': 
						try {
							if (!isNsfw) return reply('❌ *NSFW Desativado* ❌')
							res = await fetchJson(`https://meme-api.herokuapp.com/gimme/biganimetiddies`, {method: 'get'})
							buffer = await getBuffer(res.url)
							client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Tai os peitos que vc queria\npunhetero de merda'})
						} catch (e) {
							console.log(`Error :`, color(e,'red'))
							reply('❌ *ERROR* ❌')
						}
						break
					case 'nsfwblowjob':
						try {
							if (!isNsfw) return reply('❌ *NSFW Desativado* ❌')
							res = await fetchJson(`https://tobz-api.herokuapp.com/api/nsfwblowjob`, {method: 'get'})
							buffer = await getBuffer(res.result)
							client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Jangan jadiin bahan buat comli om'})
						} catch (e) {
							console.log(`Error :`, color(e,'red'))
							reply('❌ *ERROR* ❌')
						}
						break
					case 'nsfwneko':
						try {
							if (!isNsfw) return reply('❌ *NSFW Desativado* ❌')
							res = await fetchJson(`https://api.computerfreaker.cf/v1/neko`, {method: 'get'})
							buffer = await getBuffer(res.result)
							client.sendMessage(from, buffer, image, {quoted: mek, caption: 'ni anjim'})
						} catch (e) {
							console.log(`Error :`, color(e,'red'))
							reply('❌ *ERROR* ❌')
						}
						break
					case 'trap':
						try {
							if (!isNsfw) return reply('❌ *NSFW Desativado* ❌')
							res = await fetchJson(`https://api.computerfreaker.cf/v1/trap`, {method: 'get'})
							buffer = await getBuffer(res.result)
							client.sendMessage(from, buffer, image, {quoted: mek, caption: 'ni anjim'})
						} catch (e) {
							console.log(`Error :`, color(e,'red'))
							reply('❌ *ERROR* ❌')
						}
					break
				case 'nsfwass':
						try {
							if (!isNsfw) return reply('❌ *NSFW Desativado* ❌')
							res = await fetchJson(`'https://meme-api.herokuapp.com/gimme/animebooty`, {method: 'get'})
							buffer = await getBuffer(res.url)
							client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Tai a bunda que vc queria'})
						} catch (e) {
							console.log(`Error :`, color(e,'red'))
							reply('❌ *ERROR* ❌')
						}
						break
					case 'nsfwsidebobs':
						try {
							if (!isNsfw) return reply('❌ *NSFW Desativado* ❌')
							res = await fetchJson(`https://meme-api.herokuapp.com/gimme/sideoppai`, {method: 'get'})
							buffer = await getBuffer(res.url)
							client.sendMessage(from, buffer, image, {quoted: mek, caption: 'aaaah'})
						} catch (e) {
							console.log(`Error :`, color(e,'red'))
							reply('❌ *ERROR* ❌')
						}
					    break
					case 'nsfwahegao':
						try {
							if (!isNsfw) return reply('❌ *NSFW Desativado* ❌')
							res = await fetchJson(`https://meme-api.herokuapp.com/gimme/ahegao`, {method: 'get'})
							buffer = await getBuffer(res.url)
							client.sendMessage(from, buffer, image, {quoted: mek, caption: 'fodar'})
						} catch (e) {
							console.log(`Error :`, color(e,'red'))
							reply('❌ *ERROR* ❌')
						}
						break
					case 'nsfwthighs':
						try {
							if (!isNsfw) return reply('❌ *NSFW Desativado* ❌')
							res = await fetchJson(`https://meme-api.herokuapp.com/gimme/animethighss`, {method: 'get'})
							buffer = await getBuffer(res.url)
							client.sendMessage(from, buffer, image, {quoted: mek, caption: 'aaah q bosta'})
						} catch (e) {
							console.log(`Error :`, color(e,'red'))
							reply('❌ *ERROR* ❌')
						}
						break
					case 'nsfwfeets':
						try {
							if (!isNsfw) return reply('❌ *NSFW Desativado* ❌')
							res = await fetchJson(`https://meme-api.herokuapp.com/gimme/animefeets`, {method: 'get'})
							buffer = await getBuffer(res.url)
							client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Tai mais fia sapoha no cu'})
						} catch (e) {
							console.log(`Error :`, color(e,'red'))
							reply('❌ *ERROR* ❌') 
						}
						break
					case 'nsfwarmpits':
						try {
							if (!isNsfw) return reply('❌ *NSFW Desativado* ❌')
							res = await fetchJson(`https://meme-api.herokuapp.com/gimme/animearmpits`, {method: 'get'})
							buffer = await getBuffer(res.url)
							client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Tai'})
						} catch (e) {
							console.log(`Error :`, color(e,'red'))
							reply('❌ *ERROR* ❌')
						}
						break
						case 'nsfwtoin':
						try {
							if (!isNsfw) return reply('❌ *NSFW Desativado* ❌')
							res = await fetchJson(`https://tobz-api.herokuapp.com/nsfwtrap?apikey=BotWeA`, {method: 'get'})
							buffer = await getBuffer(res.url)
							client.sendMessage(from, buffer, image, {quoted: mek, caption: 'Tai os peitos que vc queria\npunhetero de merda'})
						} catch (e) {
							console.log(`Error :`, color(e,'red'))
							reply('❌ *ERROR* ❌')
						}
						break
                 case 'nsfwneko':
				    try{
						if (!isNsfw) return reply('❌ *NSFW NAUM ATIVADO* ❌')
						res = await fetchJson(`https://tobz-api.herokuapp.com/api/nsfwneko?apikey=BotWeA`, {method: 'get'})
						buffer = await getBuffer(res.result)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: 'mesum'})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('❌ *ERROR* ❌')
					}
					break
                case 'nsfw':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('digite 1 para ativar')
					if (Number(args[0]) === 1) {
						if (isNsfw) return reply('o recurso está ativo')
						nsfw.push(from)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('❬ SUCESSO ❭ ativado o recurso nsfw neste grupo')
					} else if (Number(args[0]) === 0) {
						nsfw.splice(from, 1)
						fs.writeFileSync('./src/nsfw.json', JSON.stringify(nsfw))
						reply('❬ SUCESSO ❭ desativado o recurso nsfw neste grupo')
					} else {
						reply('digite 1 para ativar, 0 para desativar o recurso')
					}
					break	
                case 'randomhentai':
                     gatauda = body.slice(6)
                     reply(mess.wait)
                     anu = await fetchJson(`https://tobz-api.herokuapp.com/api/hentai?apikey=BotWeA`, {method: 'get'})
                     buffer = await getBuffer(anu.result)
                     client.sendMessage(from, buffer, image, {quoted: mek})
                     break
                case 'loli':
                     gatauda = body.slice(6)
                     reply(mess.wait)
                     anu = await fetchJson(`https://tobz-api.herokuapp.com/api/randomloli?apikey=BotWeA`, {method: 'get'})
                     buffer = await getBuffer(anu.result)
                     client.sendMessage(from, buffer, image, {quoted: mek})
                     break
				case 'hilih':
					if (args.length < 1) return reply('Cadê o texto, hum?')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/hilih?teks=${body.slice(7)}`, {method: 'get'})
					reply(anu.result)
					break
				case 'yt2mp3':
					if (args.length < 1) return reply('Cadê o url, hum?')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/yta?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}\n*Filesize* : ${anu.filesize}`
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
					break
				case 'ytsearch':
					if (args.length < 1) return reply('O que você está procurando? pau?')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/ytsearch?q=${body.slice(10)}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = '=================\n'
					for (let i of anu.result) {
						teks += `*Title* : ${i.title}\n*Id* : ${i.id}\n*Published* : ${i.publishTime}\n*Duration* : ${i.duration}\n*Views* : ${h2k(i.views)}\n=================\n`
					}
					reply(teks.trim())
					break
				case 'tiktok':
					if (args.length < 1) return reply('Onde está o url, hum?')
					if (!isUrl(args[0]) && !args[0].includes('tiktok.com')) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/tiktok?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, video, {quoted: mek})
					break
				case 'tiktokstalk':
					try {
						if (args.length < 1) return client.sendMessage(from, 'Onde está o nome de usuário, hum?', text, {quoted: mek})
						let { user, stats } = await tiktod.getUserProfileInfo(args[0])
						reply(mess.wait)
						teks = `*ID* : ${user.id}\n*Username* : ${user.uniqueId}\n*Nickname* : ${user.nickname}\n*Followers* : ${stats.followerCount}\n*Followings* : ${stats.followingCount}\n*Posts* : ${stats.videoCount}\n*Luv* : ${stats.heart}\n`
						buffer = await getBuffer(user.avatarLarger)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: teks})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('Possível nome de usuário inválido')
					}
					break
				case 'nulis':
				case 'tulis':
					if (args.length < 1) return reply('O que você quer escrever??')
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/nulis?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek, caption: mess.success})
					break
				case 'url2img':
					tipelist = ['desktop','tablet','mobile']
					if (args.length < 1) return reply('Que tipo é??')
					if (!tipelist.includes(args[0])) return reply('Tipe desktop|tablet|mobile')
					if (args.length < 2) return reply('Cadê o url, hum?')
					if (!isUrl(args[1])) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/url2image?tipe=${args[0]}&url=${args[1]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
				case 'tstiker':
				case 'tsticker':
					if (args.length < 1) return reply('Cadê o texto, hum?')
					ranp = getRandom('.png')
					rano = getRandom('.webp')
					teks = body.slice(9).trim()
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/text2image?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						client.sendMessage(from, fs.readFileSync(rano), sticker, {quoted: mek})
						fs.unlinkSync(rano)
					})
					break
				case 'marcar':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `@${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					break
                case 'marcar1':
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `*#* @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					reply(teks)
					break
                case 'marcar2':
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `╠➥ @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					reply(teks)
					break
                case 'marcar3':
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `╠➥ https://wa.me/${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					client.sendMessage(from, teks, text, {detectLinks: false, quoted: mek})
					break
				case 'limpar':
					if (!isOwner) return reply('Comando so funfa, se você for o dono do bot 😡')
					anu = await client.chats.all()
					client.setMaxListeners(25)
					for (let _ of anu) {
						client.deleteChat(_.jid)
					}
					reply('Excluido todos os chats com sucesso :)')
					break
				case 'ts':
					if (!isOwner) return reply('Quem é você lek?')
					if (args.length < 1) return reply('.......')
					anu = await client.chats.all()
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							client.sendMessage(_.jid, buff, image, {caption: `[ ISSO E UMA TRANSMISSÃO ]\n\n${body.slice(4)}`})
						}
						reply('Transmissão enviada com sucesso')
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `[ ISSO E UMA TRANSMISSÃO ]\n\n${body.slice(4)}`)
						}
						reply('Transmissão enviada com sucesso')
					}
					break
                case 'promote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Promovido com sucesso\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(from, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Esse carinha aqui @${mentioned[0].split('@')[0]} agora é admin então respeitem ok?! 😂`, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					}
					break
				case 'demote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Rebaixado com sucesso\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Esse carinha aqui @${mentioned[0].split('@')[0]} Acabou de perder o adm pressionem F ai rapaziada 😂!`, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					}
					break
				case 'add':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('quem você deseja adicionar, um gênio??')
					if (args[0].startsWith('08')) return reply('Use o código do país amigo')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						client.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('Falha ao adicionar a pessoa, talvez seja porque é privado')
					}
					break
				case 'kick':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('tag alguém aí parça')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Pedidos recebidos, emitidos :\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`KKKKKKKKKK acabou de levar ban, bobao : @${mentioned[0].split('@')[0]}`, mentioned, true)
						client.groupRemove(from, mentioned)
					}
					break
				case 'listadm':
					if (!isGroup) return reply(mess.only.group)
					teks = `Lista de admins do grupo *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
                                case 'linkgrupo':
                                        if (!isGroup) return reply(mess.only.group)
                                        if (!isGroupAdmins) return reply(mess.only.admin)
                                        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                                        linkgc = await client.groupInviteCode(from)
                                        reply('https://chat.whatsapp.com/'+linkgc)
                                        break
                                case 'leave':
                                        if (!isGroup) return reply(mess.only.group)
                                        if (isGroupAdmins || isOwner) {
                                            client.groupLeave(from)
                                        } else {
                                            reply(mess.only.admin)
                                        }
                                        break
				case 'toimg':
					if (!isQuotedSticker) return reply('❌ responder sticker hum ❌')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('❌ Falha ao converter adesivos em imagens ❌')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: '>//<'})
						fs.unlinkSync(ran)
					})
					break
				case 'simi':
					if (args.length < 1) return reply('Textnya mana um?')
					teks = body.slice(5)
					anu = await simih(teks) //fetchJson(`https://mhankbarbars.herokuapp.com/api/samisami?text=${teks}`, {method: 'get'})
					//if (anu.error) return reply('Simi ga tau kak')
					reply(anu)
					break
				case 'simih':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('O modo Simi está ativado')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Modo simi ativado com sucesso neste grupo hehe️')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Modo simi desativado com sucesso neste grupo ✔️')
					} else {
						reply('1 para ativar, 0 para desativar, lerdão você em 🤦')
					}
					break
				case 'welcome':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isWelkom) return reply('Já ativo um')
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('Ativou com sucesso o recurso de boas-vindas neste grupo ✔️')
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('Desativou com sucesso o recurso de boas-vindas neste grupo ✔️')
					} else {
						reply('1 para ativar, 0 para desativar')
					}
                                      break
				case 'clone':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isOwner) return reply(mess.only.ownerB)
					if (args.length < 1) return reply('A tag alvo que você deseja clonar')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						client.updateProfilePicture(botNumber, buffer)
						mentions(`foto de perfil clonada com sucesso 😎 @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply('falhou')
					}
					break
                case 'gay':
                case 'lgbt':
    	            var lgbt = fs.readFileSync('./lib/lgbt.txt').toString().split('\n')
    	            var guei = lgbt[Math.floor(Math.random() * lgbt.length)]
    	            var twgui = lgbt[Math.floor(Math.random() * lgbt.length)]
		         	var lvrq = 100 - lvpc
		         	if (args.length == 1 && isGroup) {
			         	await client.sendMessage(from, `${args[1]} é ${lvpc}% ${guei} e ${lvrq}% ${twgui}.`)
                    } else {
			            reply(from, `Você é ${lvpc}% ${guei} e ${lvrq}% ${twgui}.`, id)
                    }
		         	break
				case 'wait':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						media = await client.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							client.sendMessage(from, res.video, video, {quoted: mek, caption: res.teks.trim()})
						}).catch(err => {
							reply(err)
						})
					} else {
						reply('Só uma foto')
					}
					break
				default:
					if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
						console.log(color('[ERROR]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
					}
                           }
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
starts()
