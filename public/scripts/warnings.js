/*
  __                         __
_/  |___  _  __ ____   _____/  |________
\   __\ \/ \/ // __ \_/ __ \   __\_  __ \
 |  |  \     /\  ___/\  ___/|  |  |  | \/
 |__|   \/\_/  \___>  \___> |__|  |__|

*/

const tooShort = () => {
  let possibleStrings = [
    "Say something!",
    "Cat got your tongue?",
    "Is anybody out there?",
    "Enter some text!",
    "Well, this is embarassing...",
    "If you think of something, say it",
    "Penny for your thoughts?"
  ]
  var randomNumber = Math.floor(Math.random()*possibleStrings.length);
  return possibleStrings[randomNumber];
};

const tooLong = () => {
  let possibleStrings = [
    "You said too much!",
    "Keep it real, keep it < 140",
    "Brevity is the soul of wit",
    "Can you summarize that, please?"
  ]
  var randomNumber = Math.floor(Math.random()*possibleStrings.length);
  return possibleStrings[randomNumber];
};
