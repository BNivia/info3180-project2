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
    <a class="navbar-brand" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16">
            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
        </svg>
        United Auto Sales</a>
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
          <router-link class="nav-link" to="/explore">Explore<span class="sr-only">(current)</span></router-link>
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
  <br><h1>Cars</h1>
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
            <button v-on:click="gotoCar(car.cid)" class="btn btn-primary btn-block">View Details</button>
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
      gotoCar(num){
          let router = this.$router;
          router.push(`/cars/${num}`);
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


const getACar = {
  name: 'getACar',
  template: `
    <br>
    <button v-on:click="goBack" class="btn btn-primary">Back to Explore</button>
    <br><br>
    <div class="card card-dif" v-if="car != {}">
        <img class ="card-img-top card-img-diff" v-bind:src=car.photo > 
        <div class = "card-body sincar" id = "{{car.cid}}">
            <div class="card-title">
                <h3>{{car.year}} {{car.make}}</h3>
            </div>
            <p class="model card-subtitle text-muted">{{car.model}}</p>
            <p class="card-text price">{{car.description}}</p>
        </div>
    </div>
  `,
  data() {
      return {
        car: {},
      }
  },
  created(){
      let self = this;
      let route = this.$route;
      let id = route.params.car_id;

      fetch(`/api/cars/${id}`,{
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
          if('errors' in jsonResponse){
            //Form errrors
          }else if('error_message' in jsonResponse){
            // Other error unrelated to form
          }else if('data' in jsonResponse){
            self.car = jsonResponse.data;
          }  
      })
      .catch (function(error){
          console.log(error);
      })
  },
  methods: {
    goBack(){
        let router = this.$router;
        router.push("/explore");
    }
  },
};


const getUser = {
  name: 'getUser',
  template: `
    <br><br>
    <div class="card" v-if="user != {}">
        <img class ="" v-bind:src=user.photo > 
        <div class = "card-body sincar" id = "{{user.id}}">
          <h3 class="card-title">{{user.name}}</h3>
          <p class="model card-subtitle text-muted">{{user.username}}</p>
          <p class="card-text"> {{user.biography}}
          <div>
            <table>
              <tr>
                <td><h5>Email</h5></td>
                <td>{{user.email}}</td>
              </tr>
              <tr>
                <td><h5>Location</h5></td>
                <td><{{user.location}}</td>
              </tr>
              <tr>
                <td><h5>Joined</h5></td>
                <td>{{user.date_joined}}</td>
              </tr>
            </table>
          </div>
        </div>
    </div>

    <button v-on:click="goBack" class="btn btn-primary btn-block">Go Back to Explore</button>
  `,
  data() {
      return {
        user: {},
      }
  },
  created(){
      let self = this;
      let route = this.$route;
      let id = route.params.car_id;

      fetch(`/api/users/${id}`,{
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
          if('errors' in jsonResponse){
            //Form errrors
          }else if('error_message' in jsonResponse){
            // Other error unrelated to form
          }else if('data' in jsonResponse){
            self.user = jsonResponse.data;
          }  
      })
      .catch (function(error){
          console.log(error);
      })
  },
  methods: {
    goBack(){}
  },
};

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: loginForm}, 
  { path: "/register", component: signupForm},
  { path: "/explore", component: getCars},
  { path: "/cars/new", component: addCarForm},
  { path: "/cars/:car_id(\\d+)", component: getACar},
  { path: "/users/:user_id(\\d+)", component: getUser},
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

app.use(router);
app.mount('#app');

