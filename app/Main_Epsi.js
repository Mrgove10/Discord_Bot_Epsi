//Packets
const Discord = require("discord.js");
const ping = require('ping');
const {
  c,
  cpp,
  node,
  python,
  java
} = require('compile-run');
const fs = require('fs');
//const schedule = require('node-schedule');

//Files
const config = require("./config.json");
const JsonPackage = require('.././package.json');
const JsonStats = require('./Stats.json');

//creation du client discord
const client = new Discord.Client();
client.on("ready", () => {
  console.log(`💚 Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

  client.user.setActivity(`"/e ?" pour l'aide`); //met a jour le "playing whit"

  //client.user.setAvatar('app/epsi.jpg'); //to set the avatar in cas of an error

  client.users.forEach(user => {
    if(user instanceof Discord.User) console.log("["+user+"] "+user.username);
  });
  

 /* fs.writeFile("Stats.json", "Hey there!", function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); */

  /*
  setInterval (function (){
    var u, user;
    for(u in client.users){
       user = client.users[u];
       if(user instanceof Discord.User) console.log("["+u+"] "+user.username);
    }
}, 10000);
  */
});

client.on("message", async message => {

  if (!message.author.bot) {
    console.log("⚪ Message recu : " + message.content + " | from : " + message.member.displayName + " | channel : " + message.channel.name);
  }

  //Troll frederic
  if (message.author == client.users.get('246365469148315668')){
    message.react(message.guild.emojis.find(x => x.name === "shots"));
  }

  //si le bot est mentioner
  if (message.isMentioned(client.users.get('494472750824685568'))) {
    await message.reply("Bonjour , je peut t'aider ? si oui ecrit \"/e ?\" pour plus d'info ! :smiley:");
  }

  if (message.author.bot) return; //si le message est vide

  if (message.content.indexOf(config.prefix) !== 0) return; // si la commande est pas au debut

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  
  if (command === "help" || command === "?" || command === "aide") {
    await message.channel.send(`
    ----- Commandes -----
    :warning: EN CONSTRUCTION :warning:
    Toute les commandes doivent etre prifixé par "/e"
    Les commandes disponible sont: 
     - ping [adresse] : renvois si l'adress est disponible ou non 
     - compile [c/cpp/node/python/java] [code] : compile et retourne le resultat
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
      await message.channel.send(":warning: adresse non definie");
    }

  }

  if (command === "compile") {
    await message.channel.send(":warning: Commande en cours de creation");
    /*
    if (!["c", "cpp", "node", "python", "java"].includes(args[0].toLowerCase())) {
      await message.channel.send(":warning: type de code non suporté");
    } else {
      var msg = await message.channel.send(":thumbsup: Compilation en cours...");
      var CS = ""; //CS = CompileSctring
      for (let index = 1; index < 9999; index++) {
        if (args[index] != null) {
          if (index != 1) {
            CS += " " + args[index];
          } else {
            CS += args[index];
          }
        }
      }
      console.log("BC");

    
      var ReturnString = compile(args[0].toLowerCase(), CS);
      console.log("AC");
      console.log(ReturnString);
     //  console.log(compile(args[0].toLowerCase(), CS));
      await msg.edit("```" + ReturnString + "```");
    }
*/

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
      ----- Epsiot v${version} -----
      Bot : Adrien
      Temps depuis le dernier démarrage : ${uptime}
      Heure server : ${nowtime}
      Latence Connection : ${m.createdTimestamp - message.createdTimestamp}ms
      Latence API : ${Math.round(client.ping)}ms
      Je suis Open Source : <https://github.com/Mrgove10/Discord_Bot_Epsi> ! Toutes modifications sont accepté !
      Coded in Node.Js, Libraries used = ["discord.js","ping","compile-run"].
      `)
  }
});

client.login(config.token);

//random
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

//compiler
function compile(TypeCode, CodeString) {
  const sourcecode = CodeString;
  const typecode = TypeCode;


  if (typecode == 'c') {
    let resultPromise = c.runSource(sourcecode);
    resultPromise
      .then(result => {
        return result;
      })
      .catch(err => {
        return err;
      });
  } else if (typecode == 'cpp') {
    let resultPromise = cpp.runSource(sourcecode);
    resultPromise
      .then(result => {
        return result;
      })
      .catch(err => {
        return err;
      });
  } else if (typecode == 'node') {
    let resultPromise = node.runSource(sourcecode);
    resultPromise
      .then(result => {
        return result;
      })
      .catch(err => {
        return err;
      });
  } else if (typecode == 'python') {
    let resultPromise = python.runSource(sourcecode);
    resultPromise
      .then(result => {
        console.log(result);
        return result;
        // return result["stdout"];
      })
      .catch(err => {
        console.log(err);
      });
  } else if (typecode == 'java') {
    let resultPromise = java.runSource(sourcecode);
    resultPromise
      .then(result => {
        return result;
      })
      .catch(err => {
        return err;
      });
  }
}