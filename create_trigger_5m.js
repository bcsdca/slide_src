function create_trigger_5m() {
  let exists = false;

  const triggers = ScriptApp.getProjectTriggers();

  logMessage(getCallStackTrace() + ": Checking existing triggers...");

  triggers.forEach(trigger => {
    const handler = trigger.getHandlerFunction();
    logMessage(getCallStackTrace() + ": Found trigger -> " + handler);

    if (handler === "trigger_5m") {
      exists = true;
    }
  });

  if (!exists) {
    ScriptApp.newTrigger("trigger_5m")
      .timeBased()
      .everyMinutes(10)
      .create();

    logMessage(getCallStackTrace() + ": Created trigger -> trigger_5m");
  } else {
    logMessage(getCallStackTrace() + ": Trigger already exists -> trigger_5m");
  }
}