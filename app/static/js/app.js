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
        <li class="nav-item active">
          <router-link class="nav-link" to="/explore">View Cars<span class="sr-only">(current)</span></router-link>
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
          let router = this.$router;
          let loginForm = document.getElementById('loginForm');
          let form_data = new FormData(loginForm);

          fetch('/api/auth/login',{
              method:'POST',
              body: form_data,
              headers:{
                  'X-CSRFToken': token,
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
                jwt_token = jsonResponse.token;
                router.push('/cars/new')
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
          let router = this.$router;
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
                //Success
                router.push('/login');
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
                  'X-CSRFToken': token,
                  'Authorization': `Bearer ${jwt_token}`
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

const getCars = {
  name: 'getCars',
  template: `
  <br><h1>Cars</h1><br>
  <div class = "card-set">
    <div class = "cars card" v-for="car in cars">
        <img class ="card-img-top" v-bind:src=car.photo > 
        <div class = "card-body sincar" id = "{{car.cid}}">
            <div class="card-title">
                <h3>{{car.year}} {{car.make}}</h3>
                <p class="price">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tag" viewBox="0 0 16 16">
                        <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z"/>
                        <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z"/>
                    </svg>
                    {{car.price}}
                </p>
            </div>
            <p class="model card-subtitle text-muted">{{car.model}}</p>
        </div>
    </div>
  </div>

  `,
  data() {
      return {
        cars: []
      }
  },
  created(){
    let self = this;
    fetch('/api/cars',{
        method:'GET',
        headers:{
            'X-CSRFToken': token,
            'Authorization': `Bearer ${jwt_token}`
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
        }else if('error_message' in jsonResponse){
        }else if('data' in jsonResponse){
          self.cars = jsonResponse.data;  
          console.log(jsonResponse.data)
        }  
    })
    .catch (function(error){
        console.log(error);
    })
  },
  methods:{ 
      getcars(){ 
          fetch('/api/cars',{
              method:'GET',
              headers:{
                  'X-CSRFToken': token,
                  'Authorization': `Bearer ${jwt_token}`
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
              }else if('data' in jsonResponse){
                self.cars = jsonResponse.data;
                console.log(jsonResponse.data)
              }  
          })
          .catch (function(error){
              console.log(error);
          })              
      },
      getimage(filename){
        fetch('/uploads/<filename>',{
          method:'GET',
          data: filename,
          headers:{
              'X-CSRFToken': token,
              'Authorization': `Bearer ${jwt_token}`
          },
          credentials: 'same-origin'
      })
      .then(function (response) {
          console.log("SUUUUUPPPPP")
          return response.json();
      })
      .then(function (jsonResponse) {
          // display a success message
          console.log(jsonResponse);
          if('errors' in jsonResponse){
            //Form errrors
          }else if('error_message' in jsonResponse){
            // Other error unrelated to form
          }else if('data' in jsonResponse){
            return jsonResponse.data;
            // console.log(jsonResponse.data)
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
  { path: "/explore", component: getCars},
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

app.use(router);
app.mount('#app');

