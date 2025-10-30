function doGet() {
  const email = Session.getActiveUser().getEmail();
  if (!email) {
    return HtmlService.createHtmlOutput('Please sign in with your Google account to continue.');
  }

  const userFolder = getOrCreateUserFolder(email);

  const t = HtmlService.createTemplateFromFile('index');
  t.userEmail = email;
  t.folderId = userFolder;
  return t.evaluate().setTitle('Voice Recorder');
}

function getOrCreateUserFolder(email) {
  const root = DriveApp.getFolderById('1L2ihX8qAIbJ8WsRGGeruINuhcEcS1Crr'); // This is the "dissertation" folder ID. Should be in an env file really
  const folders = root.getFoldersByName(email);
  if (folders.hasNext()) {
    return folders.next().getId();
  } else {
    return root.createFolder(email).getId();
  }
}