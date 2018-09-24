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
pw = form.getvalue('sha')
reset = form.getvalue('reset')
lamport = 10
if reset:
  params = (pw, lamport, uname)
else:
  params = (uname, pw, lamport)
path = '/var/www/html/picPass/prototype/db/app.db'
#path = ':memory:'

conn = sqlite3.connect(path)
with conn:
  insert = "INSERT INTO `users` (`Username`, `Password`, `Lamport`) VALUES (?, ?, ?)"
  update = "UPDATE `users` SET `Password`=?, `Lamport`=? WHERE `Username`=?"
  #use create to create the table in blank database
  #create = "CREATE TABLE `users` (`Username`, `Password`, `Lamport`)"

  #conn.execute(create)
  if reset:
    conn.execute(update, params)
  else:
    conn.execute(insert, params)
  print "<html><body>"
  print "Success!<br>"
  print "<a href='/picPass/prototype/index.html'>Return Home</a>"
  print "<table>"
  print "<tr><th>Name</th><th>Password</th><th>Lamport Number</th></tr>"
  for row in conn.execute("SELECT `Username`, `Password`, `Lamport` FROM `users`"):
    print "<tr><td>%s</td><td>%s</td><td>%s</td></tr>" % (row[0],row[1],row[2])
  print "</table></body></html>"
