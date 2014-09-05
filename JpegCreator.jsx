/**
    JpegCreator
    creates jpg from a psd
    @author     Allandt Bik-Elliott
    @version    0.1b
**/

// file reference
var docRef = app.activeDocument;
preferences.rulerUnits = Units.PIXELS;

// flatten and crop
docRef.flatten();
try  {
    docRef.crop(docRef.selection.bounds);
} catch (e) {}

// constants
var DEFAULT_FRAME_TIME  = 3;
var END_FRAME_TIME = 5;
var ACTION_FOLDER = "BannerActions";
var DEFAULT_ACTION = "createAnimationFrame";
var DEFAULT_PATH = "~/Desktop/";
var DEFAULT_NAME = "output";
var DEFAULT_FILESIZE = 50;
var FILE_SIZE = parseFloat(docRef.width) + "x" + parseFloat(docRef.height);
var END_ACTION = "createAnimationEndFrame";
var QUALITY_VALUES = [99, 90, 80, 70, 60, 50, 40, 30, 20];
var CACHE_FOLDER = Folder.myDocuments + '/photoshopScripts/';
var CACHE_PATH = CACHE_FOLDER + 'savedsettingsjpgcreator.txt';

// create folder if doesn't exist
var cachefolder = new Folder(CACHE_FOLDER);
if (!cachefolder.exists) cachefolder.create();

// read in settings cache file
var savedSettings = new File(CACHE_PATH);
savedSettings.open ('r');
var line = savedSettings.readln();

// get values from csv
var arSettings = line.split(',');
savedSettings.close();

// set names from defaults or cached values
var startPath = '';
var startName = '';
var startSize = 0;

if (arSettings.length > 1)
{
    startPath = arSettings[0];
    startName = arSettings[1];
    startSize = parseFloat(arSettings[2]);
}
else
{
    startPath = DEFAULT_PATH;
    startName = DEFAULT_NAME;
    startSize = DEFAULT_FILESIZE;
}

var numLayers = docRef.artLayers.length;
var curLayer;

// prompt user to set file path
var targetPath = prompt ("save file path: ", startPath, "choose a save file path");
if (!targetPath) targetPath = startPath;
if (targetPath.charAt(targetPath.length - 1) !== "/") targetPath += "/";

// check to see if director exists. If not, create it
var targetFolder = new Folder(targetPath);
if (!targetFolder.exists) targetFolder.create();

// prompt user to set filename and generate filename-widthxheight
var targetName =  prompt("save file name: ", startName, "choose a save file name") ;
var targetFile = targetPath + targetName+ "-" + FILE_SIZE;
if (!targetFile) targetFile = targetPath + startName + "-" + FILE_SIZE;

// save psd
$.writeln ("saving in " + targetFile);
var saveOptions = new PhotoshopSaveOptions();
saveOptions.layers = true;
saveOptions.embedColorProfile = true;
docRef.saveAs (new File(targetFile), saveOptions, false, Extension.LOWERCASE);

// create gif
// prompt user to set size
var saveSize = prompt("target file size in kb: ", startSize, "target size for save");
if (saveSize)
{
    saveSize *= 1024;
}
var options = new ExportOptionsSaveForWeb();
options.format = SaveDocumentType.JPEG;

//progress bar
// thanks to http://www.ps-scripts.com/bb/viewtopic.php?t=786
var value = 0; 
var win = new Window("palette{text:'Please wait...',bounds:[100,100,550,140]," + 
               "progress:Progressbar{bounds:[20,10,430,28] , minvalue:0,value:" + value + "}" +
               "};"
         );
win.progress.maxvalue = QUALITY_VALUES.length;

// loop through colour sizes array until filesize is under current size from array
var sizeFound = false;
var fileRef;
for (var i = 0; i < QUALITY_VALUES.length; i++)
{
    // update progress bar
    win.center(); 
    win.show();
    win.hide();
    win.show();
    win.progress.value++;
    
    // export doc as gif
    fileRef = new File(targetFile + ".jpg");
    docRef.exportDocument (fileRef, ExportType.SAVEFORWEB, options);
    if (fileRef.length > saveSize)
    {
        // destroy old file
        fileRef.remove();
        
        // set colors in options
        options.quality = QUALITY_VALUES[i];
        
        $.writeln("attempting save with " + QUALITY_VALUES[i] + " quality");
        
        // create file
        docRef.exportDocument (new File(targetFile + ".jpg"), ExportType.SAVEFORWEB, options);
    }
    else 
    {
        // file is already smaller than current value from QUALITY_VALUES so break the loop
        $.writeln("filesize is " + fileRef.length);
        sizeFound = true;
        break;
    }

    $.writeln(targetFile + " save with size of " + Math.floor(fileRef.length / 1024) + "kb");
}

// if the size isn't found - make the user smile because they have failed miserably
if (!sizeFound) alert("Couldn't get the jpg small enough - maybe you should rethink this");

// cache settings
savedSettings = new File(CACHE_PATH);
savedSettings.open ('w');
savedSettings.write ([targetPath, targetName,saveSize / 1024].toString());
savedSettings.close();

// save and close the psd
docRef.save();
docRef.close (SaveOptions.SAVECHANGES);

