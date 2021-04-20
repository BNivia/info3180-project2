"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""
import os
from app import app, db
from flask import render_template, request, session
from .forms import LoginForm, SignupForm, AddCarForm
from werkzeug.utils import secure_filename
from flask_login import login_user, current_user
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


# @app.route('/api/upload', methods=['POST'])
# def upload():
#     form = UploadForm()

#     if (request.method == 'POST'):
#         if (form.validate_on_submit()):
#             description = form.description.data
#             photo = form.photo.data

#             filename = secure_filename(photo.filename)
#             photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

#             return '{\
#                     "message": "File Upload Successful",\
#                     "filename": "%s",\
#                     "description": "%s"}' % (photo.filename,description)
#         return '{"errors": "%s"}' % form_errors(form)

# Here we define a function to collect form errors from Flask-WTF
# which we can later use
# @app.route('/api/auth/login',methods=['POST'])
# def login():
#     lform = LoginForm()
#     if request.method == 'POST' and lform.validate_on_submit():
#         username = request.form['username']
#         password = request.form['password']
#         result = db.session.query(User).filter_by(username=username).first()
#         if (result == None):
#             loginmsg={"message":"User not found!",}
#         elif (check_password_hash(result.password, password)):
#             login_user(result)
#             session["uname"] = request.form['username']
#             loginmsg={"message":"Login successful!",}
#         else:
#             loginmsg={"message":"Password Incorrect!",}
#         return jsonify(loginmsg = loginmsg)
#      return jsonify(form_errors(form))


#Helper Methods
def encrypt_password(self, password):
        return generate_password_hash(password, method='pbkdf2:sha256')
    
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