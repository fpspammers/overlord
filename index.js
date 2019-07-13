const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const fs = require('fs');
const client = new Discord.Client();
var warnedUsers = {};

//Waits for the client to get ready before initialisation message is displayed
client.once('ready', () => {
    console.log('Ready!')
})

client.on('message', message => {
    var config = require("./config.json");  //includes the json object file in the program.
    var count = 0;  //stores the count of warnings to users.

    //If the message does not start with the "!" prefix this block is run.
    if(!message.content.startsWith(prefix)){

      //If the message is sent by a bot it is ignored.
      if(message.author.bot){
        return;
      }

      const words = message.content.split(' ');   //splits the message into its individual words and stores them in an array.

      for(i=0 ; i<config.bannedWords.length ; i++){

        //If the words array includes any words from the banned words array then this block is entered
        if(words.includes(config.bannedWords[i])){

          //creates and updates the count of warnings for the user in the warnedUsers object.
          warnedUsers[message.author.id] = ++count;

          //Sends the user a message telling them they have been given a warning and for which word.
          client.users.get(message.author.id).send("You have been warned "+warnedUsers[message.author.id]+" times. You utterred this banned word: "+config.bannedWords[i]);
          break;
        }
      }
    }

    //If the message starts with the "!" prefix then enter this block
    else if(message.content.startsWith(prefix)){

      var arguments = message.content.slice(prefix.length).split(' ');    //Removes the "!" prefix and splits the message into an array of its words.
      const command = arguments.shift().toLowerCase();    //Extracts the first word from the arguments array ie. the command, and stores it.

      //If the user entered the "!kick" command.
      if(command === "kick"){

        //Checks if the user who invoked this command has the appropriate permissions.
        if(message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {

          //Reads the @mention for which user needs to be kicked.
          let member = message.mentions.members.first();

          //Kicks the chosen user and sends a message in the chat.
          member.kick().then((member) => {
            message.channel.send(":x: " + member.displayName + " has been exterminated!")
          });
        }
      }

      //If the user entered the "!banwords" command.
      if(command === "banwords"){
        var i;

        //If no arguments are provided.
        if(arguments.length==0){
          message.channel.send("Overlord wasn't provided with any words to add");
        }

        for(i=0 ; i<=arguments.length ; i++){

          //Ignores any words that are blank, spaces or that are already banned, and adds the rest into the bannedWords array.
          if(arguments[i] != " " && arguments[i] != "" && !config.bannedWords.includes(arguments[i])){
            config.bannedWords.push(arguments[i]);
          }
        }

        //Writes the object to the JSON file.
        fs.writeFile("./config.json", JSON.stringify(config), function (err) {
          if(err){
            throw err;
          }
          console.log(JSON.stringify(config));
          console.log('writing to config.json');
        });
      }
    }
})

client.login(token);
