//Packets
const Discord = require("discord.js");
const ping = require('ping');
const fs = require('fs');
const schedule = require('node-schedule');

//Files
const config = require("./config.json");
const JsonPackage = require('.././package.json');

//creation du client discord
const client = new Discord.Client();

//consts
const CAT_API_URL   = "https://api.thecatapi.com/"
const CAT_API_KEY   = "8e150203-b8a6-4835-8a1e-e3d9c4438f91"; 

/**
 * When the bot is ready
 */
client.on("ready", () => {
  console.log(`💚 Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

  client.user.setActivity(`"/e ?" pour l'aide`); //met a jour le "playing whit"

  //client.user.setAvatar('app/epsi.jpg'); //to set the avatar in cas of an error

  client.users.forEach(user => {
    if (user instanceof Discord.User) console.log("[" + user + "] " + user.username);
  });
});

/**
 * On every message recieved by the bot
 */
client.on("message", async message => {

  if (!message.author.bot) {
    console.log("⚪ Message recu : " + message.content + " | from : " + message.member.displayName + " | channel : " + message.channel.name);
  }

  //si le bot est mentioner
  if (message.isMentioned(client.users.get('494472750824685568'))) {
    await message.reply("Bonjour , je peux t'aider ? Si oui écris \"/e ?\" pour plus d'info ! :smiley:");
  }

  if (message.author.bot) return; //si le message est vide

  if (message.content.indexOf(config.prefix) !== 0) return; // si la commande est pas au debut

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();



  if (command === "help" || command === "?" || command === "aide") {
    await message.channel.send(`
    ----- Commandes -----
    :warning: EN CONSTRUCTION :warning:
    Toute les commandes doivent etre préfixées par "/e"
    Les commandes disponibles sont: 
     - ping [adresse] : renvoit si l'adresse est disponible ou non 
     - compile [c/cpp/node/python/java] [code] : compile et retourne le résultat
     - about : Informations diverses
    `);
  }

  if (command === "ping") {
    var HostToPing = args[0];
    if (args[0] != null) {
      var msg = await message.channel.send("Ping en cours..."); //envoie du message
      ping.sys.probe(HostToPing, function (isAlive) {
        if (isAlive == true) {
          var Retour = ':thumbsup: host ' + HostToPing + ' est up';
        } else {
          var Retour = ':thumbsdown: host ' + HostToPing + ' est dead'
        }
        msg.edit(Retour);
      });
    } else {
      await message.channel.send(":warning: adresse non définie !");
    }
  }

  if (command === "epsi") {
    await message.channel.send("http://www.epsi.fr/");
  }

  if (command === "about") {

    var time = process.uptime(); //temps depuis le demararge
    var uptime = (time + "").toHHMMSS(); //conversion en lisible
    var nowtime = new Date(); //date actuel 
    var version = JsonPackage.version; //recuperation de la version de l'appli

    var m = await message.channel.send("Chargement..."); //envoie du message
    //Mofification du message
    m.edit(`
      ----- Epsibot v${version} -----
      Bot : Adrien
      Temps depuis le dernier démarrage : ${uptime}
      Heure server : ${nowtime}
      Latence Connection : ${m.createdTimestamp - message.createdTimestamp}ms
      Latence API : ${Math.round(client.ping)}ms
      Je suis Open Source : <https://github.com/Mrgove10/Discord_Bot_Epsi> ! Toutes modifications sont acceptées !
      Coded in Node.Js, Libraries used = ["discord.js","ping","compile-run"].
      `)
  }
});

client.login(config.token);

/**
 * Gets a random int between 0 and max
 * @param {*} max 
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//Time counter
String.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var days = Math.floor(sec_num / (3600 * 24));
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (24 < 10) {
    days = "0" + days;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var time = days + ":" + hours + ':' + minutes + ':' + seconds;
  return time;
}

/**
 * Makes a request to theDogAPI.com for a random dog image with breed info attached.
 */
async function loadImage(sub_id) {
  // you need an API key to get access to all the iamges, or see the requests you've made in the stats for your account
  var headers = {
    'X-API-KEY': CAT_API_KEY,
  }
  var query_params = {
    'has_breeds': true, // we only want images with at least one breed data object - name, temperament etc
    'mime_types': 'jpg,png', // we only want static images as Discord doesn't like gifs
    'size': 'small',   // get the small images as the size is prefect for Discord's 390x256 limit
    'sub_id': sub_id, // pass the message senders username so you can see how many images each user has asked for in the stats
    'limit': 1       // only need one
  }
  // convert this obejc to query string 
  let queryString = querystring.stringify(query_params);

  try {
    // construct the API Get request url
    let _url = CAT_API_URL + `v1/images/search?${queryString}`;
    // make the request passing the url, and headers object which contains the API_KEY
    var response = await r2.get(_url, { headers }).json
  } catch (e) {
    console.log(e)
  }
  return response;
}