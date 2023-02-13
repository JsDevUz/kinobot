const { Telegraf } = require('telegraf');
const fs = require('fs')
const { get } = require('lodash');

const bot = new Telegraf(process.env.BOT_TOKEN);
const admin = '1261385122'

const checkUserAvialable = (user) => {
    fs.readFile(`./users.txt`, 'utf8', (err, data) => {
        if (!(data.indexOf(user) + 1) || data.length == 0) {
            fs.writeFile('./users.txt', `${data}\n${user}`, () => { });
        }
    });
}

bot.start(async (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, 'Salom! Siz bu bot orqali @MixFilm_hd kanalidagi kinolarni yuklab olishingiz mumkun buning uchun kino ko\'dini kiritsangiz bas bot sizga kinoni tashlab beradi. Ko\'dni esa kanaldan olishingiz mumkun.')
    fs.readFile(`./users.txt`, 'utf8', (err, data) => {
        if (!(data.indexOf(ctx.chat.id) + 1) || data.length == 0) {
            fs.writeFile('./users.txt', `${data}\n${ctx.chat.id}`, () => { });
        }
    });
});

bot.on('text', async (ctx) => {
    checkUserAvialable(ctx.chat.id)

    if (ctx.message.text == '/users') {
        if (ctx.chat.id == admin) {
            fs.readFile(`./users.txt`, 'utf8', (err, data) => {
                bot.telegram.sendMessage(ctx.chat.id, `Foydalanuvchilar soni ${data.split('\n').length} ta`)
            });

        }
    }


    bot.telegram.sendChatAction(ctx.chat.id, 'upload_video')
    let checkBozorMember = await bot.telegram.getChatMember('-1001636651553', ctx.chat.id).then(e => get(e, 'status', false)).catch(e => false)
    let checkFilmMember = await bot.telegram.getChatMember('-1001651887201', ctx.chat.id).then(e => get(e, 'status', false)).catch(e => false)

    if (checkBozorMember == 'left' || checkFilmMember == 'left') {
        bot.telegram.sendMessage(ctx.chat.id, `Botdan to'liq foydalanish uchun quydagi kanallarga a'zo bo\'ling\n\n@bozorlikuz ${checkBozorMember == 'left' ? '❌' : '✅'}\n@mixfilm_hd ${checkFilmMember == 'left' ? '❌' : '✅'}`)
        return
    }
    let num = await bot.telegram.getChatMembersCount('@mixfilm_hd')
    bot.telegram.copyMessage(ctx.chat.id,
        '@bazamixfilm',
        ctx.message.text,
        { protect_content: false, disable_notification: false }

    ).catch(e => {
        bot.telegram.sendMessage(ctx.chat.id, 'Bunday ko\'dga ega kino bazada mavjud emass')
    })
})

bot.launch();



