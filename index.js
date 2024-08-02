

// importa as dependencias
import { writeFile } from 'fs/promises';
import  { downloadMediaMessage } from '@whiskeysockets/baileys';
import  pkg from  '@whiskeysockets/baileys';
const {logger} = pkg;


import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";

// funcao que inicia a conexão e ouve eventos e msg do whatsapp
async function startBot() {
  // varivel para mostrar onde vai ser salva a conexao
  const { state, saveCreds } = await useMultiFileAuthState("assets/qrcode");

  // configurando instancia do bot
  const bot = makeWASocket({
    defaultQueryTimeoutMs: undefined,
    printQRInTerminal: true,
    auth: state,
  });

  // buscando a conexao da pasta assets/qrcode para autenticação
  bot.ev.on("creds.update", saveCreds);

  // verifica queda de conexao e tenta reconectar
  bot.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(
        "Conexao fechada",
        lastDisconnect.error,
        ", Reconectando ",
        shouldReconnect
      );

      // tetando reconectar o bot se ouver queda
      if (shouldReconnect) {
        startBot();
      }
      // mostra que o bot está pronto
    } else if (connection === "open") {
      console.log("Conexão aberta");
    }
  });

  // evento de receber msg
  bot.ev.on("messages.upsert", async (messages) => {
    const messageBot = messages.messages[0];
    const mensagem = messageBot?.message?.extendedTextMessage?.text;
    console.log(messageBot.message.imageMessage);

    
  async function teste() {
      const ids = ["559981199229@s.whatsapp.net" ];
      const id = "559981199229@s.whatsapp.net"
      const messageType = Object.keys(messageBot.message)[0]
    
      //baixar imagens

      if (messageType === 'imageMessage') {
        // download the message
        const buffer = await downloadMediaMessage(
            messageBot,
            'buffer',
            { },
            { 
                logger,
                // pass this so that baileys can request a reupload of media
                // that has been deleted
                reuploadRequest: bot.updateMediaMessage
            }
        )
        // save to file
        await writeFile('./propagandas/$my-download.jpeg', buffer)
    }

    // let chaveMenu = false


      if(mensagem === "/menu") {
        ids.forEach(id => {
          async function send() {
            await bot.sendMessage(id, {text:"----------Menu de Escolha----------------\n */nova-propaganda*: Adicionar propaganda \n  */enviar* : use /enviar nomedapropaganda \n "});
          }
          send();
        });
      }

      if(mensagem === "/nova-propaganda") {
        async function send() {
          await bot.sendMessage(id, {text:"Escolha um nome para sua propaganda: "});
        }
        send();
      }

      if(mensagem === "Propaganda-dia-maes") {

        id.forEach(id => {
          async function send() {
            await bot.sendMessage(id, {text:"maes......"});
          }
          send();
        });
      }


    }

  teste()

  });

}


startBot();
