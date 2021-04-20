from . import db
from datetime import datetime
from pytz import timezone


class Cars(db.Model):
    cid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String(255))
    make = db.Column(db.String(25))
    model = db.Column(db.String(25))
    colour = db.Column(db.String(255))
    year = db.Column(db.String(10))
    transmission = db.Column(db.String(255))
    car_type = db.Column(db.String(255))
    price = db.Column(db.Float(precision=2,asdecimal=False))
    photo = db.Column(db.String(255))
    user_id = db.Column(db.Integer)

    def __init__(self, description, make, model, colour, year, transmission, car_type, price, photo, user_id):
        self.description = description
        self.make = make
        self.model = model
        self.colour = colour
        self.year = year
        self.transmission = transmission
        self.car_type = car_type
        self.price = price
        self.photo = photo
        self.user_id = user_id

class Favourites(db.Model):
    fid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    car_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)

    def __init__(self, car_id, user_id):
        self.car_id = car_id
        self.user_id = user_id
    

class Users(db.Model):
    uid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    name = db.Column(db.String(255))
    email = db.Column(db.String(255))
    location = db.Column(db.String(255))
    biography = db.Column(db.String(255))
    photo = db.Column (db.String(255))
    date_joined = db.Column(db.DateTime)

    def __init__(self,username,password,name,email,location,biography,photo):
        self.username = username
        self.password = password
        self.name = name
        self.email = email
        self.location = location
        self.biography = biography
        self.photo = photo 
        self.date_joined = datetime.now(timezone("EST"))

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.uid) 

    def __repr__(self):
        return '<Users {} {} {} {} {} {} {} {} {}'.format(self.uid,self.username,self.password,self.name,self.email,self.location,self.biography,self.photo,self.date_joined)