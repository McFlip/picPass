#!/usr/bin/python2.7
import cgitb
import cgi
cgitb.enable()
import sqlite3

print "Content-Type: text/html;charset=utf-8"
print ""

form = cgi.FieldStorage()
uname = form.getvalue('uname')
path = '/var/www/html/picPass/prototype/db/app.db'
print """
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<title>Pic PassI</title>

<link rel="/stylesheet" href="style.css">
<script src="/sha256.js"></script>
<script src="/hmac-sha256.js"></script>
<script src="/enc-base64.js"></script>
<script src="/login.js"></script>

</head>
<body>
"""
conn = sqlite3.connect(path)
with conn:
    query = "SELECT `Username`, `Lamport` FROM `users` WHERE `Username`=?"
    unameQuery = conn.execute(query, (uname,)).fetchone()
    if unameQuery:
        print """
        <div id="page-wrapper">

        <h1>Log in with your picture</h1>
        <div>
        Select an image file:
        <input type="file" id="fileInput">
        <!--  TODO: make the inputs invisible and put the info in label instead    -->
        <form action="/cgi-bin/login.cgi" method="post">
        <input type="text" id="uname" name="uname" value="%s"><br>
        <label>PIN for 2-factor authentication</label><br>
        <input type="password" id="pin" name="pin"><br>
        <label>Nth sha256</label><label>N = </label><input id="lamport" name="lamport" value="%s"><br>
        <input type="textarea" id="sha" name="sha" value="" ><br>
        <label>Nth sha256 in base64</label><br>
        <input type="textarea" id="shab64" name="shab64" value="" ><br>
        <input id="login" type="submit" value="login" disabled="true">
        </form>
        </div>
        </div>
        </body>
        </html>
        """ % (unameQuery[0],unameQuery[1]-1)
        print unameQuery
    else:

        print """<strong>That Username doesn't exist</strong>"""



