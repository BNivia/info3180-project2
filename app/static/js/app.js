const app = Vue.createApp({
  data() {
      return {}
  }
});

app.component('app-header', {
  name: 'AppHeader',
  template: `
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
    <a class="navbar-brand" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16">
            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
        </svg>
        United Auto Sales</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent" v-if="!stat"> 
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
      </ul>
    </div>
    <div class="collapse navbar-collapse" id="navbarSupportedContent" v-if="stat">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link class="nav-link" to="/cars/new">Add Car<span class="sr-only">(current)</span></router-link>
        </li>
        <li class="nav-item active">
          <router-link class="nav-link" to="/explore">Explore<span class="sr-only">(current)</span></router-link>
        </li>
        <li class="nav-item active">
          <router-link class="nav-link" v-on:click.prevent="gotoUser()" to="/users">View Profile<span class="sr-only">(current)</span></router-link>
        </li>
        <li class="nav-item active">
          <router-link class="nav-link" to="/logout">Logout<span class="sr-only">(current)</span></router-link>
        </li>
      </ul>
    </div>
  </nav>
  `,
  data(){
    return {
        stat: false,
    }
  },
  mounted(){
    setInterval(() => {
      if (localStorage.getItem('user')) { 
        this.stat = true;
      } else {
        this.stat = false;
      }
    }, 100) 
  },
  methods: {
    gotoUser(){ 
      let router = this.$router; 
      let user = JSON.parse(localStorage.getItem('user'));
      router.push(`/users/${user.id}`);
    }
  } 
});


const Home = {
  name: 'Home',
  template: `
  <div class="home">
      <br>
      <div class="home-col-1">
        <h1 class="display-4 c-font">Buy and Sell Cars Online</h1>
        <p>United Auto Sales Provides the fastest, easiest and most user friendly way to buy or sell cars online. Find a Great Price on the Vehicle You Want</p>
        <router-link class="btn btn-primary btn-home" to="/register">Register<span class="sr-only">(current)</span></router-link>
        <router-link class="btn btn-us btn-home" to="/login">Login<span class="sr-only">(current)</span></router-link>

        </div>
      <div class="home-col-2">
        <img id="homepic" src="static/imgs/covercar.png"> 
      </div>
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
  <br>
  <section class="us">
    <h3 class="text-center display-5">Login to your account</h3>
    <div class="form-group mx-auto card size p-3 bg-white">
      <form class="card-body" id="loginForm" enctype="multipart/form-data" @submit.prevent="login" method="POST">
        <div class="alert alert-success" role="alert" v-if="on && success" v-for="message in messages">
          {{message}}
        </div>
        <div class="alert alert-danger" role="alert"  v-if="on && !success" >
            <div v-for="message in messages">
                <li> {{message}}</li>
            </div>
        </div>
        <div class="c-font">
            <label for="username">Username</label>
            <input type="text" name="username" class="btn-r form-control">
            <br>
            <label for="password">Password</label>
            <input type="password" name="password" class="btn-r form-control">
            <br>
            <button type="submit" class="btn btn-block btn-us btn-r">Login</button>
        </div>
      </form>
    </div>
  </section>
  `,
  data()
  {
      return {
        on: false,
        success: false,
        messages: []
      }
  },
  methods:{
      login(){
          let self = this;
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
              if('errors' in jsonResponse){
                self.messages = []
                for (e in jsonResponse.errors){
                    self.messages.push(jsonResponse.errors[e]);
                }
                self.on = true;
                self.success = false;
              }else if('error_message' in jsonResponse){
                self.messages = []
                self.messages.push(jsonResponse.error_message);
                self.on = true;
                self.success = false;
              }else if('message' in jsonResponse){
                self.messages = []
                self.messages.push(jsonResponse.message);
                self.on = true;
                self.success = true;
                localStorage.setItem('user', JSON.stringify({"token": jsonResponse.token, "id": jsonResponse.user_id}));
                setTimeout(() => {
                  router.push('/explore')
                }, 1300);                 
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
  <br>
  <h1 class="display-5 shift">Register New User</h1>
  <div class="form-group mx-auto card size size-2 p-4 bg-white">
    <form id="sigupForm" enctype="multipart/form-data" @submit.prevent="signup" method="POST">
      <div class="alert alert-success" role="alert" v-if="on && success" v-for="message in messages">
        {{message}}
      </div>
      <div class="alert alert-danger" role="alert"  v-if="on && !success" >
          <div v-for="message in messages">
              <li> {{message}}</li>
          </div>
      </div>
      <div class="c-font">
        <div class="form-row">
          <div class="form-group col-md-6"> 
            <label for="username">Username</label>
            <input type="text" name="username" class="form-control">
          </div>
          <div class="form-group col-md-6">
              <label for="password">Password</label>
              <input type="password" name="password" class="form-control">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="name">Full Name</label>
            <input type="text" name="name" class="form-control">
          </div>
          <div class="form-group col-md-6">
              <label for="email">Email</label>
              <input type="text" name="email" class="form-control">
          </div>
        </div>
        <div class="form-group">
            <label for="location">Location</label>
            <input type="text" name="location" class="form-control">
        </div>
        <div class="form-group">
            <label for="biography">Biography</label>
            <textarea type="textarea" name="biography" class="form-control"></textarea>
        </div>
        <div class="form-group">
            <label for="photo">Upload Photo</label>
            <input type="file" name="photo" class="form-control-file">
        </div><br>

        <button type="submit" class="btn btn-us btn-r pr-4 pl-4">Register</button>
      </div>
    </form> 
  </div>
  `,
  data() {
      return {
        on: false,
        success: false,
        messages: []
      }
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
              if('errors' in jsonResponse){
                self.messages = []
                for (e in jsonResponse.errors){
                    self.messages.push(jsonResponse.errors[e]);
                }
                self.on = true;
                self.success = false;
              }else if('error_message' in jsonResponse){
                self.messages = []
                self.messages.push(jsonResponse.error_message);
                self.on = true;
                self.success = false;
              }else if('message' in jsonResponse){
                self.messages = [];
                self.on = false;
                self.success = false;
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
    <br><h1 class="display-5 shift">Add New Car</h1>
    <div class="form-group mx-auto card size size-2 p-4 bg-white">
      <form id="addCarForm" enctype="multipart/form-data" @submit.prevent="addcar" method="POST">
        <div class="alert alert-success" role="alert" v-if="on && success" v-for="message in messages">
          {{message}}
        </div>
        <div class="alert alert-danger" role="alert"  v-if="on && !success" >
            <div v-for="message in messages">
                <li> {{message}}</li>
            </div>
        </div>
        <div class="c-font">
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="make">Make</label>
              <input type="text" name="make" class="form-control">
            </div>
            <div class="form-group col-md-6">
                <label for="model">Model</label>
                <input type="text" name="model" class="form-control">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="colour">Colour</label>
              <input type="text" name="colour" class="form-control">
            </div> 
            <div class="form-group col-md-6"> 
                <label for="year">Year</label>
                <input type="text" name="year" class="form-control">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="price">Price</label>
              <input type="float" name="price" class="form-control">
            </div>
            <div class="form-group col-md-6">
                <label for="car_type">Car Type</label>
                <select name="car_type" id="car_type" class="form-control form-select">
                    <option value="Convertable">Convertable</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Minivan">Minivan</option>
                    <option value="Pickup Truck">Pickup Truck</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Sports Car">Sports Car</option>
                    <option value="Station Wagon">Station Wagon</option>
                    <option value="SUV">SUV</option>
                </select>
            </div>
          </div>
          <div class="form-group">
              <label for="transmission">Transmission</label>
              <select name="transmission" id="transmission" class="form-control form-select">
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
              </select>
          </div>
          <div class="form-group">
              <label for="description">Description</label>
              <textarea type="textArea" name="description" class="form-control"></textarea>
          </div>
          <div class="form-group">
              <label for="photo">Upload Photo</label>
              <input type="file" name="photo" class="form-control-file">
          </div><br>

          <button type="submit" class="btn btn-us btn-r pr-5 pl-5">Save</button>
        </div>
      </form>
    </div> 
  `,
  data() {
      return {
        on: false,
        success: false,
        messages: []
      }
  },
  methods:{
      addcar(){
          let self = this;
          let form = document.forms[0];
          let form_data = new FormData(form);
          let user = JSON.parse(localStorage.getItem('user'));
          let jwt_token = user.token;
          
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
              console.log(jsonResponse);
              if('errors' in jsonResponse){
                self.messages = []
                for (e in jsonResponse.errors){
                    self.messages.push(jsonResponse.errors[e]);
                }
                self.on = true;
                self.success = false;
              }else if('error_message' in jsonResponse){
                self.messages = []
                self.messages.push(jsonResponse.error_message);
                self.on = true;
                self.success = false;
              }else if('description' in jsonResponse){
                self.messages = []
                self.messages.push("Successfully Added");
                self.on = true;
                self.success = true;
                setTimeout(() => {
                  router.push('/explore')
                }, 1300);         
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
  <br><h1 class="display-5">Explore</h1>
  <div class="alert alert-success" role="alert" v-if="on && success" v-for="message in messages">
    {{message}}
  </div>
  <div class="alert alert-danger" role="alert"  v-if="on && !success && messages.length > 0" >
      <div v-for="message in messages">
          <li> {{message}}</li>
      </div>
  </div>
  <div class="card s-card sh">
    <div class="form-row card-body">
      <div class="form-group col-md-5">
        <label for="search">Make</label>     
        <input type="search" name="search" v-model="make" id="make" class="form-control mb-2 mr-sm-2"/>
      </div>
      <div class="form-group col-md-5">
        <label for="search">Model</label> 
        <input type="search" name="search" v-model="model" id="model" class="form-control mb-2 mr-sm-2"/> 
      </div>
      <button class="btn btn-us btn-r col-md-1 form-group btn-search" @click="search">Search</button>
    </div>
    
  </div>
  <div class = "card-set">
    <div class = "cars card" v-for="car in cars">
        <img class ="card-img-top img3" v-bind:src=car.photo > 
        <div class = "card-body sincar" id = "{{car.cid}}">
            <div class="card-title-2 form-inline">
                <h5 class="year">{{car.year}} {{car.make}}</h5>
                <p class="price">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tag" viewBox="0 0 16 16">
                          <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z"/>
                          <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z"/>
                      </svg>
                    $ {{car.price}}
                </p>
            </div>
            <p class="model card-subtitle text-muted">{{car.model}}</p>             
        </div>
        <div class="card-footer">
          <button v-on:click="gotoCar(car.cid)" class="btn btn-primary btn-block">View more details</button>
        </div>
    </div>
  </div>

  `,
  data() {
      return {
        cars: [],
        make: '',
        model: '',
        on: false,
        success: false,
        messages: []
      }
  },
  mounted(){
    let self = this;
    let user = JSON.parse(localStorage.getItem('user'));
    let jwt_token = user.token;
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
        if('errors' in jsonResponse){
                self.messages = []
                for (e in jsonResponse.errors){
                    self.messages.push(jsonResponse.errors[e]);
                }
                self.on = true;
                self.success = false;
          }
        else if('error_message' in jsonResponse){
          if(jsonResponse.error_message == 'Invalid token. Please login in again' || jsonResponse.error_message == 'Invalid Credentials'){
            self.messages = []
            self.messages.push(jsonResponse.error_message);
            self.on = true;
            self.success = false;
            setTimeout(() => {
              router.push('/logout')
            }, 1500);
          }else{
            self.messages = []
            self.messages.push(jsonResponse.error_message);
            self.on = true;
            self.success = false;
          }
        }else if('data' in jsonResponse){
          self.messages = [];
          self.on = false;
          self.success = false;
          self.cars = jsonResponse.data;  
        }  
    })
    .catch (function(error){
        console.log(error);
    })
  },
  methods:{ 
      gotoCar(num){
          let router = this.$router;
          router.push(`/cars/${num}`);
      },
      search(){
        let self = this;
        let user = JSON.parse(localStorage.getItem('user'));
        let jwt_token = user.token;
        
        fetch(`/api/search?make=${self.make}&model=${self.model}`,{
             'method' :'GET',
             'headers':{
                 'X-CSRFToken': token,
                 'Authorization': `Bearer ${jwt_token}`
             },
             'credentials': 'same-origin'
         })
         .then(function (response) {
             return response.json();
         })
         .then(function (jsonResponse) {
             if('errors' in jsonResponse){
                self.messages = []
                for (e in jsonResponse.errors){
                    self.messages.push(jsonResponse.errors[e]);
                }
                self.on = true;
                self.success = false;
             }else if('error_message' in jsonResponse){
                if(jsonResponse.error_message == 'Invalid token. Please login in again' || jsonResponse.error_message == 'Invalid Credentials'){
                  self.messages = []
                  self.messages.push(jsonResponse.error_message);
                  self.on = true;
                  self.success = false;
                  setTimeout(() => {
                    router.push('/logout')
                  }, 1500);
                }else{
                  self.messages = []
                  self.messages.push(jsonResponse.error_message);
                  self.on = true;
                  self.success = false;
                }
               self.cars = [];
             }else if('data' in jsonResponse){
                self.on = false;
                self.success = false;
               self.messages = [];
               self.cars = jsonResponse.data;
             }
         })
         .catch (function(error){
             console.log(error);
         })
      },
  }
};

const getACar = {
  name: 'getACar',
  template: `
  <br>
  <div class="alert alert-success" role="alert" v-if="on && success" v-for="message in messages">
    {{message}}
  </div>
  <div class="alert alert-danger" role="alert"  v-if="on && !success" >
      <div v-for="message in messages">
          <li> {{message}}</li>
      </div>
  </div>
  <button v-on:click="goBack" class="btn btn-primary">Back to Explore</button>
  <br><br>
  <div class="card ch" v-if="car != {}">
      <div class="row">
          <div class="col-md-5 no-gutters">
              <img class="col-md-12 nh" v-bind:src=car.photo  alt="Image of a Car">
          </div>
          <div class="col-md-7">
              <div class="card-title ml-4 mt-4">
                <h3 class="display-5 pb-0">{{car.year}} {{car.make}}</h3>
              </div>
              <div class="card-body pt-0">
                  <p class="model card-subtitle text-muted">{{car.model}}</p><br>
                  <p class="card-text text-muted">{{car.description}}</p>
                  <div class="row">
                      <div class="col-md-4">
                        <p class="card-text"><span class="text-muted">Colour: </span>{{car.colour}}</p>
                      </div>
                      <div class="col-md-4">
                        <p class="card-text"><span class="text-muted">Body Type: </span>{{car.car_type}}</p>
                      </div>
                  </div>
                  <div class="row mb-3">
                      <div class="col-md-4">
                        <p class="card-text"><span class="text-muted">Price: </span>&dollar; {{car.price}}</p>
                      </div>
                      <div class="col-md-4">
                        <p class="card-text"><span class="text-muted">Transmission: </span>{{car.transmission}}</p>
                      </div>
                  </div>
                  <div class="d-flex justify-content-between mb-3">
                      <button class="btn btn-us">Email Owner</button>
                      <button v-if="!fav" v-on:click="addtofave(car.cid)" class="heart"> 
                        <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                          <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                        </svg>
                      </button>
                      <button v-if="fav" v-on:click="removefave(car.cid)" class="heart full"> 
                        <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                          <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                        </svg>
                      </button>
                  </div>
              </div>
          </div>
      </div>
  </div>
  <br><br>
  `, //
  data() {
      return {
        car: {},
        fav: false,
        on: false,
        success: false,
        messages: []
      }
  },
  created(){
      let self = this;
      let route = this.$route;
      let id = route.params.car_id;
      let user = JSON.parse(localStorage.getItem('user'));
      let jwt_token = user.token;

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
          if('errors' in jsonResponse){
                self.messages = []
                for (e in jsonResponse.errors){
                    self.messages.push(jsonResponse.errors[e]);
                }
                self.on = true;
                self.success = false;
          }else if('error_message' in jsonResponse){
            if(jsonResponse.error_message == 'Invalid token. Please login in again' || jsonResponse.error_message == 'Invalid Credentials'){
              self.messages = []
              self.messages.push(jsonResponse.error_message);
              self.on = true;
              self.success = false;
              setTimeout(() => {
                router.push('/logout')
              }, 1500);
            }else{
              self.messages = []
              self.messages.push(jsonResponse.error_message);
              self.on = true;
              self.success = false;
            }
          }else if('data' in jsonResponse){
            self.messages = [];
            self.on = false;
            self.success = false;
            self.fav = jsonResponse.data.favourite;
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
        router.push('/explore');
    },
    addtofave(id){
      let self = this;
      let user = JSON.parse(localStorage.getItem('user'));
      let jwt_token = user.token;

      fetch(`/api/cars/${id}/favourite`,{
          method:'POST',
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
          if('errors' in jsonResponse){
                self.messages = []
                for (e in jsonResponse.errors){
                    self.messages.push(jsonResponse.errors[e]);
                }
                self.on = true;
                self.success = false;
          }else if('error_message' in jsonResponse){
            if(jsonResponse.error_message == 'Invalid token. Please login in again' || jsonResponse.error_message == 'Invalid Credentials'){
              self.messages = []
              self.messages.push(jsonResponse.error_message);
              self.on = true;
              self.success = false;
              setTimeout(() => {
                router.push('/logout')
              }, 1500);
            }else{
              self.messages = []
              self.messages.push(jsonResponse.error_message);
              self.on = true;
              self.success = false;
            }
          }else if('data' in jsonResponse){
            self.messages = []
            self.messages.push("Succesfuly Added to Favourites");
            self.on = true;
            self.success = true;
            self.fav = !self.fav;
          }  
      })
      .catch (function(error){
          console.log(error);
      })
      
    },
    removefave(id){
      let self = this;
      let user = JSON.parse(localStorage.getItem('user'));
      let jwt_token = user.token;

      fetch(`/api/cars/${id}/unfavourite`,{
          method:'POST',
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
          if('errors' in jsonResponse){
                self.messages = []
                for (e in jsonResponse.errors){
                    self.messages.push(jsonResponse.errors[e]);
                }
                self.on = true;
                self.success = false;
          }else if('error_message' in jsonResponse){
            if(jsonResponse.error_message == 'Invalid token. Please login in again' || jsonResponse.error_message == 'Invalid Credentials'){
              self.messages = []
              self.messages.push(jsonResponse.error_message);
              self.on = true;
              self.success = false;
              setTimeout(() => {
                router.push('/logout')
              }, 1500);
            }else{
              self.messages = []
              self.messages.push(jsonResponse.error_message);
              self.on = true;
              self.success = false;
            }
          }else if('message' in jsonResponse){
            self.messages = []
            self.messages.push(jsonResponse.message);
            self.on = true;
            self.success = true;
            self.fav = !self.fav; 
          }  
      })
      .catch (function(error){
          console.log(error);
      })
      
    }
  },
};


const getUser = {
  name: 'getUser',
  template: `
    <br>
    <button v-on:click="goBack" class="btn btn-primary">Go Back to Explore</button>
    <br><br>
    <div class="card s-card" v-if="user != {}">
        <div class="prof">
          <div>
            <img class ="prof-col-1 img2" v-bind:src=user.photo > 
          </div>
          <div class = "prof-col-2 card-body sincar" id = "{{user.id}}">
            <h3 class="card-title display-6">{{user.name}}</h3>
            <p class="model card-subtitle text-muted c-font">@ {{user.username}}</p>
            <p class="card-text pt-3 pb-2">{{user.biography}}</p>
            <div>
              <table class="c-font">
                <tr>
                  <td><p class="m-grey">Email</p></td>
                  <td class="u-data"><p>{{user.email}}</p></td>
                </tr>
                <tr>
                  <td><p class="m-grey">Location</p></td>
                  <td class="u-data"><p>{{user.location}}</p></td>
                </tr>
                <tr>
                  <td><p class="m-grey">Joined</p></td>
                  <td class="u-data"><p>{{user.date_joined}}</p></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
    </div>

    <br><h1 class="display-6">Cars Favourited</h1>
    <div class = "card-set">
      <div class = "cars card" v-for="car in faves">
          <img class ="card-img-top img3" v-bind:src=car.photo > 
          <div class = "card-body sincar" id = "{{car.cid}}">
              <div class="card-title-2 form-inline">
                  <h5 class="year">{{car.year}} {{car.make}}</h5>
                  <p class="price">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tag" viewBox="0 0 16 16">
                          <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z"/>
                          <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z"/>
                      </svg>
                      $ {{car.price}}
                  </p>
              </div>
              <p class="model card-subtitle text-muted">{{car.model}}</p>             
          </div>
          <div class="card-footer">
            <button v-on:click="gotoCar(car.cid)" class="btn btn-primary btn-block">View more details</button>
          </div>
      </div>
    </div>
  `,
  data() {
      return {
        user: {},
        faves: [],
        on: false,
        success: false,
        messages: []
      }
  },
  created(){
      let self = this;
      let route = this.$route;
      let id = route.params.user_id;
      let user = JSON.parse(localStorage.getItem('user'));
      let jwt_token = user.token;

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
          if('errors' in jsonResponse){
                self.messages = []
                for (e in jsonResponse.errors){
                    self.messages.push(jsonResponse.errors[e]);
                }
                self.on = true;
                self.success = false;
          }else if('error_message' in jsonResponse){
            if(jsonResponse.error_message == 'Invalid token. Please login in again' || jsonResponse.error_message == 'Invalid Credentials'){
              self.messages = []
              self.messages.push(jsonResponse.error_message);
              self.on = true;
              self.success = false;
              setTimeout(() => {
                router.push('/logout')
              }, 1500);
            }else{
              self.messages = []
              self.messages.push(jsonResponse.error_message);
              self.on = true;
              self.success = false;
            }
          }else if('data' in jsonResponse){
            self.user = jsonResponse.data;
            return fetch(`/api/users/${id}/favourites`,{
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
                if('errors' in jsonResponse){
                  self.messages = []
                  for (e in jsonResponse.errors){
                      self.messages.push(jsonResponse.errors[e]);
                  }
                  self.on = true;
                  self.success = false;
                }else if('error_message' in jsonResponse){
                  if(jsonResponse.error_message == 'Invalid token. Please login in again' || jsonResponse.error_message == 'Invalid Credentials'){
                    self.messages = []
                    self.messages.push(jsonResponse.error_message);
                    self.on = true;
                    self.success = false;
                    setTimeout(() => {
                      router.push('/logout')
                    }, 1500);
                  }else{
                    self.messages = []
                    self.messages.push(jsonResponse.error_message);
                    self.on = true;
                    self.success = false;
                  }
                }else if('data' in jsonResponse){
                  self.faves = jsonResponse.data;
                  self.messages = [];
                  self.on = false;
                  self.success = false;
                }  
            })
          }  
      })
      .catch (function(error){
          console.log(error);
        })
      },
  methods: {
    goBack(){
      let router = this.$router;
      router.push('/explore');
    },
    gotoCar(num){
      let router = this.$router;
      router.push(`/cars/${num}`);
    },
    getfaves(){
      let user = JSON.parse(localStorage.getItem('user'));
      let jwt_token = user.token;

      fetch(`/api/users/${id}/favourites`,{
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
          if('errors' in jsonResponse){
                for (e in jsonResponse.errors){
                    console.log(jsonResponse.errors[e]);
                }
          }else if('error_message' in jsonResponse){
            if(jsonResponse.error_message == 'Invalid token. Please login in again' || jsonResponse.error_message == 'Invalid Credentials'){
              self.messages = []
              console.log(jsonResponse.error_message);
              self.on = true;
              self.success = false;
              setTimeout(() => {
                router.push('/logout')
              }, 1500);
            }else{
              console.log(jsonResponse.error_message);
            }
          }else if('data' in jsonResponse){
            self.faves = jsonResponse.data;
            self.messages = [];
            self.on = false;
            self.success = false;
          }  
      })
      .catch (function(error){
          console.log(error);
      })
    }
  },
};

const Logout = {
  name: 'logout',
  template: `
    <br><br>
    <div class="mx-auto">
      <h3 class="display-5 text-center">Logging out...</h3><br>
      <img id="logoutpic" class="img4" src="static/imgs/logout.svg">
    </div>
  `,
  mounted(){
    setTimeout(() => {
        this.logout()
    }, 1000)
  },
  methods:{
    logout(){
        fetch('/api/auth/logout',{
            method: 'POST',
            headers:{
              'X-CSRFToken': token,
            },
            credentials: 'same-origin'
        }) 
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {
            if('message' in jsonResponse){
              localStorage.removeItem('user');
              router.push('/')
            }  
        }) 
        .catch (function(error){
            console.log(error);
        })
    },
  }
};


const routes = [
  { path: "/", component: Home },
  { path: "/login", component: loginForm},
  { path: "/logout", component: Logout}, 
  { path: "/register", component: signupForm},
  { path: "/explore", component: getCars},
  { path: "/cars/new", component: addCarForm},
  { path: "/cars/:car_id(\\d+)", component: getACar},
  { path: "/users/:user_id(\\d+)?", component: getUser},
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

app.use(router);
app.mount('#app');