#!/usr/bin/python
# -*- coding: UTF-8 -*-# enable debugging
import cgitb
import cgi
cgitb.enable()
import sqlite3

print "Content-Type: text/html;charset=utf-8"
print ""

form = cgi.FieldStorage()
uname = form.getvalue('uname')

# check if the Username already exists
path = '/var/www/html/picPass/prototype/db/app.db'
#path = ':memory:'
conn = sqlite3.connect(path)
with conn:
  select = "SELECT `Username` FROM `users` WHERE `Username`=?"
  row = conn.execute(select, (uname,)).fetchone()

print """
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
  <meta charset="utf-8">
  <title>Pic PassI</title>

  <link rel="stylesheet" href="/picPass/prototype/style.css">
  <script src="/picPass/prototype/sha256.js"></script>
  <script src="/picPass/prototype/hmac-sha256.js"></script>
  <script src="/picPass/prototype/enc-base64.js"></script>
  <script src="/picPass/prototype/register.js"></script>

  </head>
  <body>
  <div id="page-wrapper">

    <h1>Image File Reader</h1>
"""

if not row:
  print """
    <div>
      Select an image file:
      <input type="file" id="fileInput">
  <!--  TODO: make the inputs invisible and put the info in label instead    -->
      <form action="/cgi-bin/register.cgi" method="post">
        <input type="text" id="uname" name="uname" value="%s" ><br>
        <label>Nth sha256</label><br>
        <input type="textarea" id="sha" name="sha" value="" ><br>
        <label>Nth sha256 in base64</label><br>
        <input type="textarea" id="shab64" name="shab64" value="" ><br>
        <label>PIN for 2-factor authentication</label><br>
        <input type="password" id="pin" name="pin"><br>
        <input id="register" type="submit" value="register" disabled="true">
        <!-- TESTING: This will actually be a session variable  -->
        <input type="checkbox" value="True" name="reset"><label>reset pw</label>
      </form>
      <a id="download" download="image.png"><input id="dlButton" type="button" onClick="download()" value="Download" disabled="true"></a>
    </div>
    <h2>Stego Image</h2>
    <canvas id="canvas" width=500 height=500>Don't use Microsoft Browsers L0000000SER!!!!</canvas>
    <h2>Original Image</h2>
    <div id="fileDisplayArea"></div>

  </div>

  </body>
  </html>
  """ % uname
else:
  print """
  <strong>That Username already exists. Please try again</strong><br>
  <a href=/picPass/prototype/index.html>Go Back</a>
  </div></body></html>
  """
