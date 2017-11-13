from app import db

class users(db.Model):
        Username = db.Column(db.String(30), primary_key=True)
        Password = db.Column(db.String(256))
        Lamport = db.Column(db.Integer)
#to initalize
# from app import db, models
# to query db.session.query(models.users).filter_by(models.users.Username=="Username to be queried)
# to add additions = models.users(Username=username, Password=password, Lamport=1000000)
#                   db.session.add(additions)
#                   db.session.commit()
