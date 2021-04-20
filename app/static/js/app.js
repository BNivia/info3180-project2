// Global Variables Space
var jwt_token;
// 

const app = Vue.createApp({
  data() {
      return {

      }
  }
});

app.component('app-header', {
  name: 'AppHeader',
  template: `
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <a class="navbar-brand" href="#">Project 2</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
  
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
        </li>
        <li class="nav-item active">
          <router-link class="nav-link" to="/login">Login<span class="sr-only">(current)</span></router-link>
        </li>
        <li class="nav-item active">
          <router-link class="nav-link" to="/register">Register<span class="sr-only">(current)</span></router-link>
        </li>
        <li class="nav-item active">
          <router-link class="nav-link" to="/cars/new">Add Car<span class="sr-only">(current)</span></router-link>
        </li>
      </ul>
    </div>
  </nav>
  `
});

app.component('app-footer', {
  name: 'AppFooter',
  template: `
  <footer>
      <div class="container">
          <p>Copyright &copy; {{ year }} Flask Inc.</p>
      </div>
  </footer>
  `,
  data() {
      return {
          year: (new Date).getFullYear()
      }
  }
});

const Home = {
  name: 'Home',
  template: `
  <div class="jumbotron">
      <h1>Project 2</h1>
      <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
  </div>
  `,
  data() {
      return {}
  }
};

const NotFound = {
  name: 'NotFound',
  template: `
  <div>
      <h1>404 - Not Found</h1>
  </div>
  `,
  data() {
      return {}
  }
};

const loginForm = {
  name: 'login-form',
  template: `
  <h1>Login Form</h1>
  <form id="loginForm" enctype="multipart/form-data" @submit.prevent="login" method="POST">
      <div>
          <label for="username">Username</label>
          <input type="text" name="username" class="form-control">
          <label for="password">Password</label>
          <input type="password" name="password" class="form-control">
          <br>
          <button type="submit" class="btn btn-primary">Submit</button>
      </div>
  </form>
  `,
  data() {
      return {}
  },
  methods:{
      login(){
          let loginForm = document.getElementById('loginForm');
          let form_data = new FormData(loginForm);

          fetch('/api/auth/login',{
              method:'POST',
              body: form_data,
              headers:{
                  'X-CSRFToken': token
              },
              credentials: 'same-origin'
          }) 
          .then(function (response) {
              return response.json();
          })
          .then(function (jsonResponse) {
              // display a success message
              console.log(jsonResponse);
              if('errors' in jsonResponse){
                //Form errrors
              }else if('error_message' in jsonResponse){
                // Other error unrelated to form
              }else if('message' in jsonResponse){
                //Suceessss
              }  
          }) 
          .catch (function(error){
              console.log(error);
          })              
      }
  }
};

const signupForm = {
  name: 'sigup-form',
  template: `
  <br><h1>Sigup Form</h1><br>
  <form id="sigupForm" enctype="multipart/form-data" @submit.prevent="signup" method="POST">
      <div>
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" name="username" class="form-control">
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" name="password" class="form-control">
        </div>
        <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" name="name" class="form-control">
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input type="text" name="email" class="form-control">
        </div>
        <div class="form-group">
            <label for="location">Location</label>
            <input type="text" name="location" class="form-control">
        </div>
        <div class="form-group">
            <label for="biography">Biography</label>
            <input type="textArea" name="biography" class="form-control">
        </div>
        <div class="form-group">
            <label for="photo">Photo</label>
            <input type="file" name="photo" class="form-control-file">
        </div><br>

        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
  </form> 
  `,
  data() {
      return {}
  },
  methods:{
      signup(){
          let form = document.forms[0];
          let form_data = new FormData(form);
          
          fetch('/api/register',{
              method:'POST',
              body: form_data,
              headers:{
                  'X-CSRFToken': token
              },
              credentials: 'same-origin'
          })
          .then(function (response) {
              return response.json();
          })
          .then(function (jsonResponse) {
              // display a success message
              console.log(jsonResponse);
              if('errors' in jsonResponse){
                //Form errrors
              }else if('error_message' in jsonResponse){
                // Other error unrelated to form
              }else if('message' in jsonResponse){
                //Suceessss
              }  
          })
          .catch (function(error){
              console.log(error);
          })              
      }
  }
};


const addCarForm = {
  name: 'addCar-form',
  template: `
  <br><h1>New Car Form</h1><br>
  <form id="addCarForm" enctype="multipart/form-data" @submit.prevent="addcar" method="POST">
      <div>
        <div class="form-group">
            <label for="make">Make</label>
            <input type="text" name="make" class="form-control">
        </div>
        <div class="form-group">
            <label for="model">Model</label>
            <input type="text" name="model" class="form-control">
        </div>
        <div class="form-group">
            <label for="colour">Colour</label>
            <input type="text" name="colour" class="form-control">
        </div>
        <div class="form-group">
            <label for="year">Year</label>
            <input type="text" name="year" class="form-control">
        </div>
        <div class="form-group">
            <label for="price">price</label>
            <input type="float" name="price" class="form-control">
        </div>
        <div class="form-group">
            <label for="car_type">Car Type</label>
            <select name="car_type" id="car_type" class="form-select">
                <option value="Convertable">Convertable</option>
                <option value="Coupe">Coupe</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Minivan">Minivan</option>
                <option value="Pickup Truck">Pickup Truck</option>
                <option value="Sedan">Sedan</option>
                <option value="Sports Car">Sports Car</option>
                <option value="Station Wagon">Station Wagon</option>
                <option value="SUV">SUV</option>
            </select><br>
        </div>
        <div class="form-group">
            <label for="transmission">Transmission</label>
            <select name="transmission" id="transmission" class="form-select">
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
            </select><br>
        </div>
        <div class="form-group">
            <label for="description">Description</label>
            <input type="textArea" name="description" class="form-control">
        </div>
        <div class="form-group">
            <label for="photo">Photo</label>
            <input type="file" name="photo" class="form-control-file">
        </div><br>

        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
  </form> 
  `,
  data() {
      return {}
  },
  methods:{
      addcar(){ 
          let form = document.forms[0];
          let form_data = new FormData(form);
          
          fetch('/api/cars',{
              method:'POST',
              body: form_data,
              headers:{
                  'X-CSRFToken': token
              },
              credentials: 'same-origin'
          })
          .then(function (response) {
              return response.json();
          })
          .then(function (jsonResponse) {
              // display a success message
              console.log(jsonResponse);
              if('errors' in jsonResponse){
                //Form errrors
              }else if('error_message' in jsonResponse){
                // Other error unrelated to form
              }else if('message' in jsonResponse){
                //Suceessss
              }  
          })
          .catch (function(error){
              console.log(error);
          })              
      }
  }
};

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: loginForm}, 
  { path: "/register", component: signupForm},
  { path: "/cars/new", component: addCarForm},
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

app.use(router);
app.mount('#app');

