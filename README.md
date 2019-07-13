# overlord
Discord bot for server moderation and more.

Commands: 

  !kick @mention -> Kicks the user specified by the mention.
  
  !banwords [word 1] [word 2]... -> Adds words to the list of banned words.
  
Automated Functionality:

  -> Overlord monitors the content of each message. If the message contains any of the banned words, the offending user is sent a warning in their direct messages.
  
  -> Overlord kicks a user automatically if they are warned more than thrice.
