from flask_wtf import FlaskForm
from wtforms.fields import StringField, PasswordField, IntegerField, TextField, FloatField, FileField, TextAreaField, SelectField
from wtforms.validators import DataRequired, Email, EqualTo, InputRequired
from flask_wtf.file import FileField,FileRequired,FileAllowed 
from datetime import date

class LoginForm(FlaskForm):
    username = StringField("Username", validators = [DataRequired()])
    password = PasswordField("Password", validators = [DataRequired()])


class SignupForm(FlaskForm):
    username = StringField("Username", validators = [DataRequired()])
    password = PasswordField("Password", validators = [DataRequired()])
    name = StringField("Full Name", validators = [DataRequired()])
    email = TextField('Email', validators=[DataRequired(), Email()])
    location = StringField("Location", validators = [DataRequired()])
    biography = TextAreaField("Biography", validators = [DataRequired()])
    photo = FileField("Photo", validators=[FileRequired(), FileAllowed(['jpg','png'])])


class AddCarForm(FlaskForm):
    make = StringField("Make", validators = [DataRequired()])
    model = StringField("Model", validators = [DataRequired()])
    colour = StringField("Colour", validators = [DataRequired()])
    year = StringField("Year", validators = [DataRequired()])
    price= FloatField("Price", validators = [DataRequired()])
    car_type = SelectField("Car Type", choices=[('Convertable', 'Convertable'), ('Coupe', 'Coupe'), ('Hatchback', 'Hatchback'), ('Minivan', 'Minivan'), ('Pickup Truck', 'Pickup Truck'), ('Sedan', 'Sedan'), ('Sports Car', 'Sports Car'), ('Station Wagon', 'Station Wagon'), ('SUV', 'SUV')])
    transmission = SelectField("Transmission", choices=[('Automatic', 'Automatic'), ('Manual', 'Manual')])
    description = TextAreaField("Descripton", validators = [DataRequired()])
    photo = FileField("Photo", validators=[FileRequired(), FileAllowed(['jpg','png'])])