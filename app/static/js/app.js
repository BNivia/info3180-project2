// const app = Vue.createApp({
//   data() {
//       return {

//       }
//   }
// });

// app.component('app-header', {
//   name: 'AppHeader',
//   template: `
//   <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
//     <a class="navbar-brand" href="#">Lab 7</a>
//     <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//       <span class="navbar-toggler-icon"></span>
//     </button>
  
//     <div class="collapse navbar-collapse" id="navbarSupportedContent">
//       <ul class="navbar-nav mr-auto">
//         <li class="nav-item active">
//           <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
//         </li>
//         <li class="nav-item active">
//           <router-link class="nav-link" to="/upload">Upload<span class="sr-only">(current)</span></router-link>
//         </li>
//       </ul>
//     </div>
//   </nav>
//   `
// });

// app.component('app-footer', {
//   name: 'AppFooter',
//   template: `
//   <footer>
//       <div class="container">
//           <p>Copyright &copy; {{ year }} Flask Inc.</p>
//       </div>
//   </footer>
//   `,
//   data() {
//       return {
//           year: (new Date).getFullYear()
//       }
//   }
// });

// const routes = [
//   { path: "/", component: Home },
//   // Put other routes here
//   { path:"/upload",component:upload_form},
//   // This is a catch all route in case none of the above matches
//   { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
// ];

// const router = VueRouter.createRouter({
//   history: VueRouter.createWebHistory(),
//   routes, // short for `routes: routes`
// });

// app.use(router);
// app.mount('#app');

// const loginForm = {
//   name: 'login-form',
//   template: `
//   <h1>Login Form</h1>
//   <form id="loginForm" enctype="multipart/form-data" @submit.prevent="login">
//       <div>
//           <label for="username">Username</label>
//           <input type="file" name="username" class="form-control">
//           <label for="password">Password</label>
//           <input type="file" name="password" class="form-control">
//           <br>
//           <button type="submit" class="btn btn-primary">Submit</button>
//       </div>
//   </form>
//   `,
//   data() {
//       return {}
//   },
//   methods:{
//       login(){
//           let loginForm = document.getElementById('loginForm');
//           let form_data = new FormData(loginForm);

//           fetch('/api/auth/login',{
//               method:'POST',
//               body: form_data,
//               headers:{
//                   'X-CSRFToken': token
//               },
//               credentials: 'same-origin'
//           })
//           .then(function (response) {
//               return response.json();
//           })
//           .then(function (jsonResponse) {
//               // display a success message
//               console.log(jsonResponse);
//           })
//           .catch (function(error){
//               console.log(error);
//           })              
//       }
//   }
// };