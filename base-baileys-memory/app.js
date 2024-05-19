const { createBot, createProvider, createFlow, addKeyword, EVENTS, addAnswer } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const { delay } = require('@whiskeysockets/baileys')


const flowPrincipal = addKeyword(['hola', 'ole', 'alo', 'ola'])
    .addAnswer('Buenas como estas?')
    .addAnswer('Bienvenido a este curso')

const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer("este es el flujo Welcom", {
        delay: 100,
    },
    async (ctx, ctxFn) => {
        if (ctx.body.includes("casas")){
            await ctxFn.flowDynamic("escribiste casas")
        }else{
            await ctxFn.flowDynamic("escribiste otra cosa")
        }
       
    })

    const menuFlow = addKeyword("Menu").addAnswer(
        "Este es el menu, escogi una opcion 1,2,3,4,5, o 0",
        { capture: true },
        async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
            if (!["1", "2", "3", "4", "5", "0"].includes(ctx.body)) {
                return fallBack(
                    "Respuesta no valida, por favor selecciona una de las opciones."
                );
            }
    
            switch (ctx.body) {
                case "1":
                    return await flowDynamic("esta es la opcion 1")
                case "2":
                    return await flowDynamic("esta es la opcion 2")
                case "3":
                    return await flowDynamic("esta es la opcion 3")
                case "4":
                    return await flowDynamic("esta es la opcion 4")
                case "5":
                    return await flowDynamic("esta es la opcion 5")
                case "0":
                    return await flowDynamic(
                        "Saliendo... Puedes volver a acceder a este menu escribiendo '*Menu*'"
                        );
    
            }
        }
    )
    
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowWelcome,menuFlow])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
