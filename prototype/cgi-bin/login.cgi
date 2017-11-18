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

uname = (form.getvalue('uname'),)
pw = form.getvalue('sha')
print "name: ", uname
print "pw: ", pw
print "<br>"
lamport = 10
params = (uname, pw, lamport)
path = '/var/www/html/picPass/prototype/app.db'
#path = ':memory:'

conn = sqlite3.connect(path)
with conn:
  select = "SELECT `Password` FROM `users` WHERE `Username`=?"
  insert = "INSERT INTO `users` (`Username`, `Password`, `Lamport`) VALUES (?, ?, ?)"

  storedPW = conn.execute(select, uname).fetchone()[0]
  checkPW = hashlib.sha256(pw).hexdigest()
  if checkPW == storedPW:
    print "<html><body>"
    print "Success!<br>"
    print "</body></html>"
  else:
    print "Failed Bad PW<br>"
    print checkPW
  #conn.execute(insert, params)
