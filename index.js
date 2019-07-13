const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const fs = require('fs');
const client = new Discord.Client();
var warnedUsers = {};

client.once('ready', () => {
    console.log('Ready!')
})

client.on('message', message => {
    var config = require("./config.json");
    var count = 0;
    if(!message.content.startsWith(prefix)){
      if(message.author.bot){
        return;
      }

      const words = message.content.split(' ');
      for(i=0 ; i<config.bannedWords.length ; i++){
        if(words.includes(config.bannedWords[i])){
          warnedUsers[message.author.id] = ++count;
          client.users.get(message.author.id).send("You have been warned "+warnedUsers[message.author.id]+" times. You utterred this banned word: "+config.bannedWords[i]);
          break;
        }
      }
    }

    var arguments = message.content.slice(prefix.length).split(' ');
    const command = arguments.shift().toLowerCase();

    if(command === "kick"){
      if(message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
        let member = message.mentions.members.first();
        member.kick().then((member) => {
          message.channel.send(":x: " + member.displayName + " has been exterminated!")
        });
      }
    }

    if(command === "banwords"){
      var i;

      if(arguments.length==0){
        message.channel.send("Overlord wasn't provided with any words to add");
      }

      for(i=0 ; i<=arguments.length ; i++){
        if(arguments[i] != " " && arguments[i] != "" && !config.bannedWords.includes(arguments[i])){
          config.bannedWords.push(arguments[i]);
        }
      }

      fs.writeFile("./config.json", JSON.stringify(config), function (err) {
        if(err){
          throw err;
        }
        console.log(JSON.stringify(config));
        console.log('writing to config.json');
      });
    }
})

client.login(token);
