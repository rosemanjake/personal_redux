import os
import ntpath
import sys

def getImages(dir):
    files = []
    for (dirpath, dirnames, filenames) in os.walk(dir):
        for x in filenames:
            if (x.endswith(".jpg") or x.endswith(".png")):
                files.append((os.path.join(dirpath, x)))
    return files

def createThumbnail(img):
    fullpath = os.path.abspath(img)
    origdir = os.path.dirname(fullpath)
    filename = ntpath.basename(os.path.splitext(img)[0])
    extension = os.path.splitext(img)[1]
    thumbdir = origdir.replace("photos", "thumbnails")
    newfile = f"{thumbdir}\\{filename}{extension}"
    
    #Stop if the thumbnail already exists
    if os.path.isfile(newfile):
        return
    else:
        magick = f"cd {origdir} && magick {filename}{extension} -resize 450x450 -gravity center -crop 1:1 {newfile} &"
        os.system(magick)

        while not os.path.isfile(newfile):
            pass

def deploy(currdir):
    os.system(f'cmd /c cd {currdir} && gcloud app deploy')

if __name__ == "__main__":
    currdir = os.path.dirname(sys.argv[0])
    
    # Generate the thumbnails
    imgs = getImages(currdir + "/public/photos")
    for img in imgs:
        createThumbnail(img)
    
    # Deploy to app fine
    deploy(currdir)