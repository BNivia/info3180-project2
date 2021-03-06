"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""
import os, jwt
from app import app, db, login_manager
from flask import render_template, request, jsonify, send_from_directory
from flask_login import login_user, logout_user, current_user, login_required
from .forms import *
from .models import *
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from pytz import timezone


###
# Auxiliary Functions
###

def decodetoken(token):
    try:
        jwt_payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        return jwt_payload
    except jwt.ExpiredSignatureError: 
        return 'EXPIRED'
    except jwt.InvalidTokenError: 
        return 'INVALID'

def checktoken(user, jwt_token):
    result = decodetoken(jwt_token)
    if result == 'EXPIRED' or result == 'INVALID':
        return 'Invalid token. Please login in again'
    elif type(result) == dict:
        username = result.get('username')
        if username == user.username:
            return 'OK'
        else:
            return 'Invalid token. Please login in again'
    else:
        return 'Invalid token. Please login in again'

def tvalidate():
    token = request.headers.get('Authorization')
    if token == None:
        return jsonify({'error_message': 'Invalid Credentials'})
    else:
        token = token.split()[1]
        value = checktoken(current_user, token)
        if value != 'OK': 
            return jsonify({'error_message': value })
        return 'OK'

###
# Routing for your application.
###


# Please create all new routes and view functions above this route.
# This route is now our catch all route for our VueJS single page
# application.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')


@login_manager.user_loader 
def load_user(id):
    return Users.query.get(int(id))

###
# API ROUTES
###

@app.route('/api/register', methods=['POST'])
def register():
    form = SignupForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            username = request.form['username']
            password = generate_password_hash(request.form['password'], method='pbkdf2:sha256')
            email = request.form['email']
            name = request.form['name']
            location = request.form['location']
            bio = request.form['biography']
            
            photo = request.files['photo']
            filename = secure_filename(photo.filename)
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            user = Users(username, password, name, email, location, bio, filename)
            db.session.add(user)
            db.session.commit() 
            return jsonify({ 'message': 'User Succesfully Added =)'})               
        error = {'errors': form_errors(form)}
        return jsonify(error)
    return jsonify({'error_message': 'Method Not Allowed'})

@app.route('/api/auth/login',methods=['POST'])
def login():
    lform = LoginForm()
    if request.method == 'POST': 
        if lform.validate_on_submit():
            username = request.form['username']
            password = request.form['password']
            result = db.session.query(Users).filter_by(username=username).first()
            if (result == None):
                loginmsg={ "error_message" : "User not found!" }
            elif (check_password_hash(result.password, password)):
                login_user(result)
                jwt_payload = { 'username': result.username, \
                                'exp': datetime.now(tz=timezone('EST')) + timedelta(minutes=20),
                                'iat': datetime.now(tz=timezone('EST')) \
                            }
                jwt_token = jwt.encode(jwt_payload, app.config['SECRET_KEY'], algorithm="HS256")
                loginmsg = { "message" : "Login successful!" , "token" : jwt_token, "user_id": result.uid}
            else:
                loginmsg={"error_message":"Password Incorrect!",}
            return jsonify(loginmsg)
        return jsonify({"errors": form_errors(lform)})
    return jsonify({'error_message': 'Method Not Allowed'})

@app.route('/api/auth/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    logoutmsg = {"message" : "Log out successful"}
    return jsonify(logoutmsg)

@app.route('/api/cars', methods=['GET'])
@login_required
def getcars():
    if request.method == 'GET':
        val = tvalidate()
        if val != 'OK':
            return val
        result = db.session.query(Cars).order_by(Cars.cid.desc()).limit(3).all()
        if result == []:
            return jsonify({"error_message": "No Cars Available."})
        else:
            cars = []
            for car in result:
                cars.append({"cid": car.cid,\
                    "description": car.description,\
                        "year": car.year,\
                            "make": car.make,\
                                "model": car.model,\
                                    "colour": car.colour,\
                                        "transmission": car.transmission,\
                                            "car_type": car.car_type,\
                                                "price": car.price,\
                                                    "photo": "/uploads/" + car.photo,\
                                                        "user_id": car.user_id})
            return jsonify({"data": cars})
    return jsonify({'error_message': 'Method Not Allowed'}) 
  
@app.route('/api/cars', methods=['POST'])
@login_required
def addcars():
    form = AddCarForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            val = tvalidate()
            if val != 'OK':
                return val
            description = form.description.data
            make = form.make.data
            model = form.model.data
            colour = form.colour.data
            year = form.year.data
            price = form.price.data
            car_type = form.car_type.data
            transmission = form.transmission.data
            photo = request.files['photo']
            user_id = current_user.uid

            filename = secure_filename(photo.filename)
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            car = Cars(description, make, model, colour, year, transmission, car_type, price, filename, user_id) 
            db.session.add(car)
            db.session.commit()
            return jsonify({"description" : description,\
                    "year": year,\
                        "make": make,\
                            "model" : model,\
                                "colour": colour,\
                                    "transmission": transmission,\
                                        "car_type" : car_type, \
                                            "price": price,\
                                                "photo": filename,\
                                                    "user_id": user_id})
        return jsonify({"errors": form_errors(form)})#it good now imma try add again
    return jsonify({'error_message': 'Method Not Allowed'})

        
@app.route('/api/cars/<int:car_id>', methods=['GET'])
@login_required
def getacar(car_id):
    if request.method == 'GET':
        val = tvalidate()
        if val != 'OK':
            return val
        result = db.session.query(Cars).filter_by(cid=car_id).first()
        if result == [] or result == None:
            return jsonify({"error_message": "Car could not be located."})
        else:
            uid = current_user.uid
            check = db.session.query(Favourites).filter(Favourites.user_id == uid, Favourites.car_id == car_id).first()
            if check == None:
                isFav = False
            else:
                isFav = True
            car = {"cid": result.cid,\
                    "description": result.description,\
                        "year": result.year,\
                            "make": result.make,\
                                "model": result.model,\
                                    "colour": result.colour,\
                                        "transmission": result.transmission,\
                                            "car_type": result.car_type,\
                                                "price": result.price,\
                                                    "photo": "/uploads/" + result.photo,\
                                                        "user_id": result.user_id, \
                                                            "favourite": isFav}
            return jsonify({"data": car})
    return jsonify({'error_message': 'Method Not Allowed'})

@app.route('/api/cars/<int:car_id>/favourite', methods=['POST'])
@login_required  
def addfav(car_id):
    if request.method == 'POST':
        val = tvalidate()
        if val != 'OK':
            return val
        uid = current_user.uid
        result = db.session.query(Favourites).filter(Favourites.user_id == uid, Favourites.car_id == car_id).first()
        if result != None: 
            test = {"fav_id": result.fid}
            return jsonify({"data": test})
        else:
            fav = Favourites(car_id, uid)
            db.session.add(fav) 
            db.session.commit()
            test = {"car_id": car_id,\
                "user_id": uid}
            return jsonify({"data": test})
    return jsonify({'error_message': 'Method Not Allowed'})

@app.route('/api/cars/<int:car_id>/unfavourite', methods=['POST'])
@login_required  
def removefav(car_id):
    if request.method == 'POST':
        val = tvalidate()
        if val != 'OK':
            return val
        uid = current_user.uid
        result = db.session.query(Favourites).filter(Favourites.user_id == uid, Favourites.car_id == car_id).first()
        if result == None:
            return jsonify({'error_message': 'It has not been favourited'})
        else:
            db.session.delete(result) 
            db.session.commit()
            return jsonify({"message": "Successfully Removed from Favourites"})
    return jsonify({'error_message': 'Method Not Allowed'})

@app.route('/api/search', methods=['GET'])
@login_required
def search():
    if request.method == 'GET':
        val = tvalidate()
        if val != 'OK':
            return val
        make = request.args.get('make')
        model = request.args.get('model')
        if make == None and model == None:
            return jsonify({"error_message1": "No Search Terms where entered"}) 
        elif make == '' and model == '':
            result = db.session.query(Cars).all()
        elif make == '':
            result = db.session.query(Cars).filter_by(model=model).all()
        elif model == '':
            result = db.session.query(Cars).filter_by(make=make).all()
        else:
            result = db.session.query(Cars).filter(Cars.model==model, Cars.make==make).all()
        if result == None or result == []:
            return jsonify({"error_message": "No search results are available"})
        else:
            cars = [] 
            for car in result:
                cars.append({"cid": car.cid,\
                    "description": car.description,\
                        "year": car.year,\
                            "make": car.make,\
                                "model": car.model,\
                                    "colour": car.colour,\
                                        "transmission": car.transmission,\
                                            "car_type": car.car_type,\
                                                "price": car.price,\
                                                    "photo": "/uploads/" + car.photo,\
                                                        "user_id": car.user_id})
            return jsonify({"data": cars})
    return jsonify({"error_message": 'Method Not Allowed'})

@app.route('/api/users/<int:user_id>', methods=['GET'])
@login_required
def getuser(user_id):
    if request.method == 'GET':
        val = tvalidate()
        if val != 'OK':
            return val
        result = db.session.query(Users).filter_by(uid=user_id).first()
        if result == [] or result == None:
            return jsonify({"error_message": "User cannot be found."})
        else:
            info = {"id": result.uid,\
                "username": result.username,\
                    "name": result.name,\
                        "photo": '/uploads/' + result.photo,\
                            "email": result.email,\
                                "location": result.location,\
                                    "biography": result.biography,\
                                        "date_joined": result.date_joined}
            return jsonify({"data": info})
    return jsonify({'error_message': 'Method Not Allowed'})
        
        

@app.route('/api/users/<int:user_id>/favourites', methods=['GET'])
@login_required
def getfavs(user_id):
    if request.method == 'GET':
        val = tvalidate()
        if val != 'OK':
            return val
        result = db.session.query(Favourites).filter(Favourites.user_id ==user_id).all()
        if result == [] or result == None:
            return jsonify({"error_message": "User has no favourites."})
        else: 
            favs = []
            for fav in result:
                afav = db.session.query(Cars).filter(Cars.cid==fav.car_id).first()
                favs.append({"cid": afav.cid,\
                    "description": afav.description,\
                        "year": afav.year,\
                            "make": afav.make,\
                                "model": afav.model,\
                                    "colour": afav.colour,\
                                        "transmission": afav.transmission,\
                                            "car_type": afav.car_type,\
                                                "price": afav.price,\
                                                    "photo": "/uploads/" + afav.photo,\
                                                        "user_id": afav.user_id})
            return jsonify({"data": favs})
    return jsonify({'error_message': 'Method Not Allowed'})

###
#API ROUTES END
###

def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages


###
# The functions below should be applicable to all Flask apps.
###

@app.route('/uploads/<filename>')
def get_image(filename):
    rootdir = os.getcwd()
    return send_from_directory(os.path.join(rootdir,app.config['UPLOAD_FOLDER']),filename)

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")