#!/usr/bin/python
# -*- coding: UTF-8 -*-# enable debugging
import cgitb
import cgi
cgitb.enable()
import sqlite3
import hashlib

print "Content-Type: text/html;charset=utf-8"
print ""

form = cgi.FieldStorage()

uname = form.getvalue('uname')
pw = form.getvalue('sha')
path = '/var/www/html/picPass/prototype/db/app.db'
#path = ':memory:'

conn = sqlite3.connect(path)
with conn:
  select = "SELECT `Password`, `Lamport` FROM `users` WHERE `Username`=?"
  update = "UPDATE `users` SET `Password`=?, `Lamport`=? WHERE `Username`=?"

  row = conn.execute(select, (uname,)).fetchone()
  storedPW = row[0]
  lamport = row[1] - 1
  checkPW = hashlib.sha256(pw).hexdigest()
  if checkPW == storedPW:
    print "<html><body>"
    print "Success!<br>"
    print "Sha from server %s <br>" %(checkPW)
    print "<a href='/picPass/prototype/index.html'>Return Home</a>"
    params = (pw, lamport, uname)
    conn.execute(update, params)
    row = conn.execute(select, (uname,)).fetchone()
    storedPW = row[0]
    lamport = row[1]
    print "<h1>Database Info</h1>"
    print "<table><tr><th>Name</th><th>Password</th><th>Lamport Number</th></tr>"
    print "<tr><td>%s</td><td>%s</td><td>%s</td></tr>" % (uname,storedPW,lamport)
    print "</table>"
    if lamport == 1:
      print "<strong>You have reached your login limit! You must reset your Password.</strong>"
      print "<a href='/picPass/prototype/index.html'>Reset Password</a>"
    print "</body></html>"
  else:
    print "Failed Bad PW<br>"
    print checkPW
