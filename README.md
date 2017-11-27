# picPass
Picture based authentication.
# Installiation 

## Install Apache

<!--YOU MAY NOT NEED TO DO THIS STEP-->

<!--TRY RUNNING LOCALHOST FIRST SEE WHAT COMES UP-->

    sudo apt-get update
    sudo apt-get install apache2
    sudo apache2ctl configtest


## Install PHP

    sudo apt-get install php libapache2-mod-php php-mcrypt php-mysql
    sudo a2enmod php7.0

    sudo vim /etc/apache2/mods-enabled/dir.conf

Insert this

    <IfModule mod_dir.c>
         DirectoryIndex index.php index.html index.cgi index.pl index.xhtml index.htm
    </IfModule>
Run This

    sudo systemctl restart apache2
    sudo service restart apache2

<!--- RUN IT, MAKE SURE PHP WORKS-->


## Install SQL

    sudo apt-get install php7.0-sqlite3
    sudo apache2ctl restart

<!-- THIS MAY NEED TO BE DONE I DON'T KNOW FOR SURE-->

<!--TRY BEFORE MAKING THIS JUMP-->

<!--NOTE IF YOUR DATABASE IS USING CGI, SKIP THIS STEP EVEN IF IT DOESNT WORK FOR LATER-->

    sudo vim /etc/php/7.0/apache2/php.ini
Insert this
    
    extension=sqlite.so

Run This

    sudo systemctl restart apache2
    sudo service restart apache2



## Install CGI

    sudo apt-get install curl
    cd /etc/apache2/mods-enabled
    sudo ln -s ../mods-available/cgi.load
    sudo service apache2 reload



## What to do with CGI?

GO HERE

    sudo vim /etc/apache2/sites-enabled/000-default.conf

Insert this

    ScriptAlias /cgi-bin/ /var/www/html/picPass/prototype/cgi-bin/ 

^ YES A SLASH NEEDS TO BE AT THE END

GO HERE

    sudo vim /etc/apache2/apache2.conf

INSERT THIS

    ScriptAlias /cgi-bin/ /var/www/html/picPass/prototype/cgi-bin 
    <Directory /var/www/html/picPass/prototype/cgi-bin>
        Options ExecCGI
        SetHandler cgi-script
    </Directory>

^ YES NO SLASH AT THE END OF THIS ONE

## CGI DATABASE SETUP
    sudo chown www-data db/ #<---- ON THE DIRECTORY
    sudo chown www-data db/app.db #<---- ON THE FILE

    sudo chmod u+w+x,g+w+x db/ #<---- ON THE DIRECTORY
    sudo chmod u+w+x,g+w+x db/app.db #<---- ON THE FILE


