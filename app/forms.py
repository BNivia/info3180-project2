from flask_wtf import FlaskForm
from wtforms.fields import StringField, PasswordField, IntegerField, TextField, FloatField, FileField, TextAreaField, SelectField
from wtforms.validators import DataRequired, Email, EqualTo, InputRequired, ValidationError
from flask_wtf.file import FileField,FileRequired,FileAllowed 
from datetime import date

def length_check(mx = -1):
    def length(form, field):
        if len(field.data) > mx:
            raise ValidationError('Data is greater than {} characters'.format(mx))    
    return length

class LoginForm(FlaskForm):
    username = StringField("Username", validators = [DataRequired(), length_check(mx=255)])
    password = PasswordField("Password", validators = [DataRequired(), length_check(mx=255)])


class SignupForm(FlaskForm):
    username = StringField("Username", validators = [DataRequired(), length_check(mx=255)])
    password = PasswordField("Password", validators = [DataRequired(), length_check(mx=255)])
    name = StringField("Full Name", validators = [DataRequired(), length_check(mx=255)])
    email = TextField('Email', validators=[DataRequired(), Email(), length_check(mx=255)])
    location = StringField("Location", validators = [DataRequired(), length_check(mx=255)])
    biography = TextAreaField("Biography", validators = [DataRequired(), length_check(mx=255)])
    photo = FileField("Photo", validators=[FileRequired(), FileAllowed(['jpg','png'])])


class AddCarForm(FlaskForm):
    make = StringField("Make", validators = [DataRequired(), length_check(mx=25)])
    model = StringField("Model", validators = [DataRequired(), length_check(mx=25)])
    colour = StringField("Colour", validators = [DataRequired(), length_check(mx=255)])
    year = StringField("Year", validators = [DataRequired(), length_check(mx=10)])
    price= FloatField("Price", validators = [DataRequired()])
    car_type = SelectField("Car Type", choices=[('Convertable', 'Convertable'), ('Coupe', 'Coupe'), ('Hatchback', 'Hatchback'), ('Minivan', 'Minivan'), ('Pickup Truck', 'Pickup Truck'), ('Sedan', 'Sedan'), ('Sports Car', 'Sports Car'), ('Station Wagon', 'Station Wagon'), ('SUV', 'SUV')])
    transmission = SelectField("Transmission", choices=[('Automatic', 'Automatic'), ('Manual', 'Manual')])
    description = TextAreaField("Descripton", validators = [DataRequired(), length_check(mx=255)])
    photo = FileField("Photo", validators=[FileRequired(), FileAllowed(['jpg','png'])])