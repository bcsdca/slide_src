function playSound() {
  //var myAudio = new Audio(chrome.runtime.getURL("https://upload.wikimedia.org/wikipedia/commons/5/55/En-us-house-noun.ogg"));
  //myAudio.play();
  //var myAudio = new Audio();
  //myAudio.src = "https://upload.wikimedia.org/wikipedia/commons/5/55/En-us-house-noun.ogg";
  //myAudio.play();
  //const [audio, setAudio] = useState(null)
  //useEffect(() => {
  //  setAudio(new Audio("https://upload.wikimedia.org/wikipedia/commons/5/55/En-us-house-noun.ogg"))
  // only run once on the first render on the client
  //}, [])
  //import { Meteor } from 'meteor/meteor'
  //Meteor.isClient;
  if (typeof Audio != "undefined") {
    const typeWriter = new Audio("https://www.freesound.org/data/previews/256/256458_4772965-lq.mp3");
    typeWriter.play()
  }
  //const typeWriter = new Audio("https://www.freesound.org/data/previews/256/256458_4772965-lq.mp3");
  //typeWriter.play()
}
