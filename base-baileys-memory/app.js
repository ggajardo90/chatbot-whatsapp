const { createBot, createProvider, createFlow, addKeyword, EVENTS, addAnswer } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const { delay } = require('@whiskeysockets/baileys')
const path = require("path")
const fs = require("fs")

const menuPath = path.join(__dirname, "mensajes", "menu.txt")
const menu = fs.readFileSync(menuPath, "utf8")

const flowMenu = addKeyword(EVENTS.ACTION)
        .addAnswer('ingresa el numero de orden VTR', {capture:true}, async (ctx, ctxFn) =>{
            if (ctx.body  == ctx.body) {
                await ctxFn.flowDynamic ("favor ingresar numeros de series instalados")
            }
        } )


const flowReservas = addKeyword(EVENTS.ACTION)
    .addAnswer('ingresa el numero de orden CLARO')

    


const flowConsultas = addKeyword(EVENTS.ACTION)
    .addAnswer('ingresa el numero de orden DIRECTV')



const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer("Bienvenido a tu asistente virtual 🤖 XR3 insgresa tu rut", { capture: true },
        async (ctx, ctxFn) => {

            const rut = ctx.body;
            const rutValido = verificarRut(rut);

            if (rutValido) {
                await ctxFn.flowDynamic("¡Gracias! Tu RUT es válido. porfavor selecciona una opcion");
               return ctxFn.gotoFlow(menuFlow)
            }else{
                await ctxFn.flowDynamic("El RUT ingresado no es válido. Por favor");
            }
          
        })
    

const flowe = addKeyword(EVENTS.WELCOME)
    .addAnswer("escribe menu", {
        delay: 100,
    })
// ,
//     async (ctx, ctxFn) => {
//         if (ctx.body.includes("casas")) {
//             await ctxFn.flowDynamic("escribiste casas")
//         } else {
//             await ctxFn.flowDynamic("escribiste otra cosa")
//         }

//     })


const menuFlow = addKeyword("Menu").addAnswer(
    menu,
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        if (!["1", "2", "3", "0"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no valida, por favor selecciona una de las opciones."
            );
        }

        switch (ctx.body) {
            case "1":
                return gotoFlow(flowMenu)
            case "2":
                return gotoFlow(flowReservas)
            case "3":
                return gotoFlow(flowConsultas)
            case "0":
                return await flowDynamic(
                    "Saliendo... Puedes volver a acceder a este menu escribiendo '*Menu*'"
                );

        }
    }
)


function verificarRut(rut) {
    if (rut.toString().trim() != '' && rut.toString().indexOf('-') > 0) {
        var caracteres = new Array();
        var serie = new Array(2, 3, 4, 5, 6, 7);
        var dig = rut.toString().substr(rut.toString().length - 1, 1);
        rut = rut.toString().substr(0, rut.toString().length - 2);

        for (var i = 0; i < rut.length; i++) {
            caracteres[i] = parseInt(rut.charAt((rut.length - (i + 1))));
        }

        var sumatoria = 0;
        var k = 0;
        var resto = 0;

        for (var j = 0; j < caracteres.length; j++) {
            if (k == 6) {
                k = 0;
            }
            sumatoria += parseInt(caracteres[j]) * parseInt(serie[k]);
            k++;
        }

        resto = sumatoria % 11;
        dv = 11 - resto;

        if (dv == 10) {
            dv = "K";
        }
        else if (dv == 11) {
            dv = 0;
        }

        if (dv.toString().trim().toUpperCase() == dig.toString().trim().toUpperCase())
            return true;
        else
            return false;
    }
    else {
        return false;
    }
}

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowWelcome, menuFlow, flowMenu, flowReservas, flowConsultas, flowe])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
