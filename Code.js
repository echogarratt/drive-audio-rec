const MASTER_FOLDER_ID = PropertiesService.getScriptProperties().getProperty('master_folder_id');
const APP_NAME = PropertiesService.getScriptProperties().getProperty('project_name');

function doGet(e) {
  const token = e?.parameter?.token || 'defaultUser';
  
  const template = HtmlService.createTemplateFromFile('index');
  template.userId = token;
  template.appName = APP_NAME;
  return template.evaluate()
    .setTitle(APP_NAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setFaviconUrl('https://sheffield.ac.uk/themes/custom/uos_public/favicon.ico');
}


function getOrCreateUserFolder(userId) {
    const masterFolder = DriveApp.getFolderById(MASTER_FOLDER_ID);
    const folders = masterFolder.getFoldersByName(userId);
    if (folders.hasNext()) return folders.next().getId();
    const newFolder = masterFolder.createFolder(userId);
    return newFolder.getId();
}

function loadUtterancesFromMasterFolder() {
    const folder = DriveApp.getFolderById(MASTER_FOLDER_ID);
    const files = folder.getFilesByName('utteranceList.txt');
    if (!files.hasNext()) throw new Error('utteranceList.txt not found');
    const content = files.next().getBlob().getDataAsString();
    return content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
}

function getUserFileNames(userId) {
    const folderId = getOrCreateUserFolder(userId);
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFiles();
    const names = [];
    while (files.hasNext()) {
        const f = files.next();
        const name = f.getName();
        names.push(name.includes('.') ? name.substring(0, name.lastIndexOf('.')) : name);
    }
    return names;
}

function getNextUnrecordedUtteranceWithProgress(userId) {
  const utterances = loadUtterancesFromMasterFolder();
  const recordedFiles = getUserFileNames(userId);

  const next = utterances.find(u => !recordedFiles.includes(u)) || null;
  const total = utterances.length;
  const completed = recordedFiles.length;

  return { nextUtterance: next, total, completed };
}

function saveRecordingBase64(base64Data, fileName, userId) {
    const folderId = getOrCreateUserFolder(userId);
    const folder = DriveApp.getFolderById(folderId);
    const decoded = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(decoded, MimeType.WAV, fileName);
    folder.createFile(blob);
    return 'Recording saved';
}