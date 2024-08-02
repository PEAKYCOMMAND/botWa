

// importa as dependencias
import { writeFile } from 'fs/promises';
import  { downloadMediaMessage } from '@whiskeysockets/baileys';
import  pkg from  '@whiskeysockets/baileys';
const {logger} = pkg;
// import { MessageType, MessageOptions, Mimetype } from '@whiskeysockets/baileys'

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



//propagandas



// evento de receber msg
bot.ev.on("messages.upsert", async (messages) => {
  const messageBot = messages.messages[0];
  const mensagem = messageBot?.message?.extendedTextMessage?.text;
  // console.log(messageBot.message?.imageMessage);
  
  
  async function teste() {
      const ids = ["559981199229@s.whatsapp.net", "559992134658@s.whatsapp.net" ];
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
    
    const nomePropagandas = ["calca","janela"];
    const legendas = ["Calça jeans por APENAS 500R$!!! corree", "Janela para banheiro 2x2 APENAS 1000R$!!!!!"]
    
    
    if(mensagem === "/menu") {
      await bot.sendMessage(id, {text:"----------Menu de Escolha----------------\n  \n */nova-propaganda*: Adicionar propaganda \n \n */enviar* : use /enviar nomedapropaganda \n  \n */listar-propagandas* : mostra propagandas cadastradas \n "});
      }


      if(mensagem === "/enviar") {
        await bot.sendMessage(id, {text: `------lista de propagandas --------`});

       nomePropagandas.forEach((nomePg, indice) => {

        async function send() {
          await bot.sendMessage(id, {text: `${indice}: ${nomePropagandas[indice]}`});
        }
          send();
        });



        //segundo fluxo NÃO FUNCIONA AINDA!!!
        bot.ev.on("messages.upsert", async (messages) => {

          const mensagemRecebida = messages.messages[0];


          if(mensagemRecebida === nomePropagandas[0]) {
            nomePropagandas.forEach((prop, indice) => {

              async function send() {
                await bot.sendMessage(id, { 
                  image: { url: `./propagandas/${prop}.jpeg` }, mimetype: 'image/jpeg',  caption: `${legendas[indice]}`})
              }
              send();
            });
          }
        })



      // ids.forEach((id, indice) => {
      //   async function send() {
      //     await bot.sendMessage(id,    { 
      //       image: { url: `./propagandas/${}.jpeg` }, mimetype: 'image/jpeg',  caption: `${legendas[indice]}`});
      //   }
      //   send();
      // });


      }


      if(mensagem === "/nova-propaganda") {
        async function send() {
          await bot.sendMessage(id, {text:"Escolha um nome para sua propaganda: "});
        }
        send();
      }

      if(mensagem === "/listar-propagandas") {
        nomePropagandas.forEach((prop, indice) => {

          async function send() {
            try{
              
              await bot.sendMessage(id, { 
                image: { url: `./propagandas/${prop}.jpeg` }, mimetype: 'image/jpeg',  caption: `Nome da postagem: ${prop} \n \n legenda: ${legendas[indice]}`})
            }catch{
              await bot.sendMessage(id, { 
                image: { url: `./propagandas/${prop}.jpeg` }, mimetype: 'image/jpeg',  caption: `Nome da postagem: ${prop} \n \n legenda: ${legendas[indice]}`})
            }

            }
          send();
        });
       
      }


    }

  teste()

  });

}


startBot();
