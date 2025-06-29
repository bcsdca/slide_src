function delete_trigger_5m() {
  let remove_array = []
  var oldTrigger = ScriptApp.getScriptTriggers()
  logMessage(getCallStackTrace() + ": The below triggers are the current running triggers !!!");
  //Logger.log(oldTrigger.length);
  for (var i = 0; i < oldTrigger.length; i++) {
    logMessage(getCallStackTrace() + ": Current running trigger is " + ScriptApp.getScriptTriggers()[i].getHandlerFunction());
    if (ScriptApp.getScriptTriggers()[i].getHandlerFunction() == "trigger_5m") {
      remove_array.push(oldTrigger[i]);
    }
  }

  remove_array.forEach(function (row) {
    ScriptApp.deleteTrigger(row);
    logMessage(getCallStackTrace() + ": " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss') + ': Deleting 5 min trigger !!!');

  });
}
