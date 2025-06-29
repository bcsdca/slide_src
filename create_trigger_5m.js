function create_trigger_5m() {
  //Create new trigger
  //check to make sure there is no trigger_5m already existed
  var find_it = false
  var oldTrigger = ScriptApp.getScriptTriggers()
  logMessage(arguments.callee.name + ": The below triggers are the current running triggers !!!");
  //Logger.log(oldTrigger.length);
  for (var i = 0; i < oldTrigger.length; i++) {
    logMessage(arguments.callee.name + ": Current running trigger is " + ScriptApp.getScriptTriggers()[i].getHandlerFunction());
    if (ScriptApp.getScriptTriggers()[i].getHandlerFunction() == "trigger_5m") {
      find_it = true;
      break;
    }
  }

  if (!find_it) {
    ScriptApp.newTrigger('trigger_5m').timeBased().everyMinutes(10).create();
    logMessage(arguments.callee.name + ": " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss') + ': No existing trigger_5m, so creating trigger_5m !!!');
  } else {
    logMessage(arguments.callee.name + ": " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss') + ': Found an existing trigger_5m, NOT creating trigger_5m !!!');
  }

  
}
