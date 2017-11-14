#!/usr/bin/python
import cgi, os
import cgitb; cgitb.enable(display=0, logdir="/home/denton/files/")

form = cgi.FieldStorage()

# A nested FieldStorage instance holds the file
fileitem = form["file"]

# Test if the file was uploaded
if fileitem.filename:

    # strip leading path from file name
    # to avoid directory traversal attacks
    fn = os.path.basename(fileitem.filename)
    open('/home/denton/files/' + fn, 'wb').write(fileitem.file.read())
    message = 'The file "' + fn + '" was uploaded successfully'

else:
    message = 'No file was uploaded'

#print "Content-Type: text/html\n"
#print "hello world"
print "Content-Type: text/html\n"
print "<html><body><p>%s</p></body></html>" % (message)