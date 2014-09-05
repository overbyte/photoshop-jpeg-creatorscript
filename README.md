Photoshop Jpeg Creator script
============================

Photoshop script to create an optimised jpeg from a screengrab

## How to install ##

* Put the JpegCreator.jsx into `C:\Program Files\Adobe\Adobe Photoshop CS6 (64 Bit)\Presets\Scripts` (Note: you may have a different version of photoshop so put it in the version you use)

## Usage guide ##

This will guide you through a series of steps to create the jpeg:

* Select the area in the Photoshop file that the jpeg will be created from

* You should run the action

* Add the path to the directory you wish to save the files in

![Add filepath](/img/grab-0.png)

* Add the desired filename - this will have the size appended to it

![Add filename](/img/grab-1.png)

* Add the target filesize

![Add filesize](/img/grab-3.png)

This will store this information and will pre-populate the pop-up next time you use it which is useful for doing multiple jpegs in the same folder as you can use the same path and filename and the script will automatically add the size as a differentiator. 

The script will then attempt to save a jpegs at the desired filesize by reducing the quality until the filesize is hit. If it can't do it (because the target filesize is not possible to hit at the dimensions given), the user will be given a cheerful message to that effect.


## Useful Links ##
* [Guide for installing Photoshop scripts](http://speedscraps.blogspot.co.uk/2010/04/installing-scripts-photoshop.html)
* [Adobe's Photoshop Scripting Reference](http://www.adobe.com/devnet/photoshop/scripting.html)
* [ps-scripts.com Forum](http://www.ps-scripts.com/bb/)