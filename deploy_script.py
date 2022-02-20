import os
import ntpath
import sys
import time
from tkinter.tix import MAX

MAXSIZE = 2000

def getImages(dir):
    files = []
    for (dirpath, dirnames, filenames) in os.walk(dir):
        for x in filenames:
            if (x.endswith(".jpg") or x.endswith(".png")):
                files.append((os.path.join(dirpath, x)))
    return files

# img = current full file path
# newfile = new file we'll save to, same as img if overwriting
# command = core part of the command
# thumb = are we making thumbnails?
def toMagick(img, newfile, command, thumb):
    fullpath = os.path.abspath(img)
    origdir = os.path.dirname(fullpath)
    filename = ntpath.basename(os.path.splitext(img)[0])
    extension = os.path.splitext(img)[1]

    if (thumb):
        thumbdir = origdir.replace("photos", "thumbnails")
        newfile = f"{thumbdir}\\{filename}{extension}"

    magick = f"cd {origdir} && magick {filename}{extension} {command} {newfile} &"
    os.system(magick)
    return

def scalePhoto(img):
    command = f"-resize \"{MAXSIZE}>\""
    toMagick(img, img, command, False)
    print(f"Image altered to {MAXSIZE}: {img}")

def createThumbnail(img):    
    command = "-resize 450x450 -gravity center -crop 1:1"
    toMagick(img, None, command, True)
    print(f"Thumbnail created from: {img}")

def processimgs(imgs):
    for img in imgs:
        scalePhoto(img)
        createThumbnail(img)

def deploy(currdir):
    os.system(f'cmd /c cd {currdir} && gcloud app deploy')

if __name__ == "__main__":
    currdir = os.path.dirname(sys.argv[0])
    
    # Generate the thumbnails
    imgs = getImages(currdir + "/public/photos")
    #processimgs(imgs)
    
    # Deploy to app engine
    deploy(currdir)