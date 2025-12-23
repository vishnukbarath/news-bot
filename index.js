if (typeof global.crypto === 'undefined') {
    global.crypto = require('crypto');
  }
  
  const { 
      default: makeWASocket, 
      useMultiFileAuthState, 
      DisconnectReason, 
      isJidBroadcast, 
      fetchLatestBaileysVersion 
  } = require('@whiskeysockets/baileys');
  const { Boom } = require('@hapi/boom');
  const pino = require('pino');
  const messageHandler = require('./handlers/messageHandler');
  const config = require('./config');



  async function connectToWhatsApp() {
      const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  
      // ✅ Always fetch latest WhatsApp Web version
      const { version, isLatest } = await fetchLatestBaileysVersion();
      console.log(`Using WhatsApp Web version: ${version.join('.')} (Latest: ${isLatest})`);
  
      const sock = makeWASocket({
          printQRInTerminal: true,
          auth: state,
          logger: pino({ level: 'silent' }),
  
          // Keep browser simple & valid
          browser: ['Chrome', 'Desktop', '1.0.0'],
  
          // ✅ use the correct version dynamically
          version,   
  
          // Optional minimal safe settings
          markOnlineOnConnect: false,
          generateHighQualityLinkPreview: false,
          emitOwnEvents: false,
          shouldIgnoreJid: jid => isJidBroadcast(jid),
  
          // Dummy getMessage to avoid crashes
          getMessage: async () => {
              return { conversation: 'hello' }
          }
      });

      
      // Handle connection updates
      sock.ev.on('connection.update', async (update) => {
          const { connection, lastDisconnect } = update;
  
          if (connection === 'close') {
              const shouldReconnect = 
                  (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
              
              console.log('Connection closed:', lastDisconnect?.error, ' Reconnecting:', shouldReconnect);
  
              if (shouldReconnect) {
                  connectToWhatsApp();
              }
          } else if (connection === 'open') {
              console.log('✅ Bot is now connected!');
          }
      });
  
      // Save credentials
      sock.ev.on('creds.update', saveCreds);
  
      // Handle messages
      sock.ev.on('messages.upsert', async ({ messages }) => {
          const msg = messages[0];
          if (!msg.key.fromMe && msg.message) {
              await messageHandler.handleMessage(sock, msg);
          }
      });
  
      return sock;
  }
  
  // Start the bot
  connectToWhatsApp().catch(err => console.log("Unexpected error: ", err));
  
