function delete_trigger_5m() {
  const triggers = ScriptApp.getProjectTriggers();

  logMessage(getCallStackTrace() + ": Checking current triggers...");

  triggers.forEach(trigger => {
    const handler = trigger.getHandlerFunction();
    logMessage(getCallStackTrace() + ": Found trigger -> " + handler);

    if (handler === "trigger_5m") {
      ScriptApp.deleteTrigger(trigger);
      logMessage(getCallStackTrace() + ": Deleted trigger -> " + handler);
    }
  });
}
