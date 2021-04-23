"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""
import os, jwt
from app import app, db, login_manager
from flask import render_template, request, session, jsonify, send_from_directory
from flask_login import login_user, logout_user, current_user, login_required
from .forms import *
from .models import *
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

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
                jwt_payload = { "username": result.username, "password": result.password}
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
    session.pop('logged-in',None)
    logout_user()
    logoutmsg = {"message" : "Log out successful"}
    return jsonify(logoutmsg)

@app.route('/api/cars', methods=['GET'])
@login_required
def getcars():
    if request.method == 'GET':
        result = db.session.query(Cars).order_by(Cars.cid).all()
        if result == []:
            return jsonify({"error_message": "No Cars Available."})
        else:
            cars = [] #me nuh see tht kmt
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
# @login_required
def addcars():
    form = AddCarForm()
    if request.method == 'POST':
        if form.validate_on_submit():
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
        return jsonify(form_errors(form))
    return jsonify({'error_message': 'Method Not Allowed'})

        
@app.route('/api/cars/<int:car_id>', methods=['GET'])
@login_required
def getacar(car_id):
    if request.method == 'GET':
        result = db.session.query(Cars).filter_by(cid=car_id).first()
        if result == [] or result == None:
            return jsonify({"error_message": "Car could not be located."})
        else:
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
                                                        "user_id": result.user_id}
            return jsonify({"data": car})
    return jsonify({'error_message': 'Method Not Allowed'})

@app.route('/api/cars/<int:car_id>/favourite', methods=['POST'])
@login_required  
def addfav(car_id):
    if request.method == 'POST': 
        user_id = current_user.uid
        fav = Favourites(car_id, user_id) 
        db.session.add(fav) 
        db.session.commit()
        return jsonify({"car_id": car_id,\
            "user_id": user_id})
    return jsonify({'error_message': 'Method Not Allowed'})

@app.route('/api/search', methods=['GET'])
@login_required
def search():
    if request.method == 'GET':
        make = request.args.get('make')
        model = request.args.get('model')
        if make == None and model == None:
            return jsonify({"error_message": "No search results are available"})
        elif make == None:
            result = db.session.query(Cars).filter_by(model=model).all()
        elif model == None:
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
    print(current_user.uid)
    if request.method == 'GET':
        result = db.session.query(Users).filter_by(uid=user_id).first()
        if result == [] or result == None:
            return jsonify({"error_message": "User cannot be found."})
        else:
            for user in result:
                info = {"id":user.user_id,\
                    "username": user.username,\
                        "name": user.name,\
                            "photo": user.photo,\
                                "email": user.email,\
                                    "location": user.location,\
                                        "biography": user.biography,\
                                            "date_joined": user.date_joined}
            return jsonify({"data": info})
    return jsonify({'error_message': 'Method Not Allowed'})
        
        

@app.route('/api/users/<int:user_id>/favourites', methods=['GET'])
@login_required
def getfavs(user_id):
    if request.method == 'GET':
        result = db.session.query(Favourites).filter_by(uid=user_id).all()
        if result == [] or result == None:
            return jsonify({"error_message": "User has no favourites."})
        else: 
            favs = []
            for fav in result:
                afav = db.session.query(Cars).filter_by(cid=fav.car_id).first()
                for f in afav:
                    favs.append({"id": f.car_id,\
                        "description": f.description,\
                            "year": f.year,\
                                "make": f.make,\
                                    "model": f.model,\
                                        "colour": f.colour,\
                                            "transmission": f.transmission,\
                                                "car_type": f.car_type,\
                                                    "price": f.price,\
                                                        "photo": "/uploads/" + f.photo,\
                                                            "user_id": f.user_id})
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