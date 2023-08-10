function create_folder() {
  var parentFolder=DriveApp.getFolderById(DriveApp.getRootFolder().getId());
  //console.log("rootfolderid = %s, rootfoldername = ", DriveApp.getRootFolder().getId(),DriveApp.getRootFolder().getName())
  console.log("rootfoldername = ", parentFolder.getName())
  var newFolder=parentFolder.createFolder("test_folder")
  var newFolderID = newFolder.getId();
  console.log("newfoldername = %s, and the newFolderID = %s", newFolder.getName(),newFolderID )
  
}
