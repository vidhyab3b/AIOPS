
import HomePage from '../pages/home.f7';
import AboutPage from '../pages/about.f7';
import FormPage from '../pages/form.f7';
import errdetailsPage from '../pages/errdetails.f7';

import DynamicRoutePage from '../pages/dynamic-route.f7';
import RequestAndLoad from '../pages/request-and-load.f7';
import NotFoundPage from '../pages/404.f7';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/errdetails/:errId/',
    component: errdetailsPage,
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;
      //console.log(app.store.state.products);

      // Show Preloader
      app.preloader.show();
      
      //console.log(app.request);
      //get all data from server 
      // app.request.get(baseurl + "/my-errors/all", (data)=> {
      //    data=JSON.parse(data)
      //    app.data.errorlist=data;
      //    console.log(app)
      // });

      

      //call gemini
      
      // var gprompt = {
      //   "contents": [
      //     {
      //       "parts": [
      //         {
      //           "text": "Nginx service is not running. What should I do Give the major headings alone in json format"
      //         }
      //       ]
      //     }
      //   ]
      // }
      // var gdata;
      // fetch( "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBwHJbpEFvAKikUwTOM0pzTkeAtfK8Fn-8 ", {
      //   method: 'POST',
      //   headers: {
      //     'type': 'application/json',
      //     'Content-Type': 'application/json',
      //     'origin': '',
      //     'x-stainless-arch': null,
      //     'x-stainless-lang': null,
      //     'x-stainless-os': null,
      //     'x-stainless-package-version': null,
      //     'x-stainless-retry-count': null,
      //     'x-stainless-runtime': null,
      //     'x-stainless-runtime-version': null,
      //     'x-stainless-timeout': null
      //   },
      //   body:  JSON.stringify(gprompt)
      // })
      // .then(res => res.json())
      // .then((data) => {
         
      //     console.log(data);
      //     gdata=data;

      // })



      // User ID from request
      var userId = to.params.userId;
      
      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'AIOPS',
          lastName: 'Administrator',
          about: 'These are the following issues logged today',
          issues: [
            {
              title: 'Fail to start dnf makecache',
              url: 'http://framework7.io',
            },
            {
              title: 'Failed to start Process archive logs',
              url: 'http://forum.framework7.io',
            },
            {
              title: 'cockpit-tls: gnutils_handshake failed: Error in the push function',
              url: 'http://forum.framework7.io',
            },
            {
              title: 'cockpit-tls: gnutils_handshake failed: The TLS connection was not properly terminated',
              url: 'http://forum.framework7.io',
            },
            {
              title: 'cockpit-tls: gnutils_handshake failed: Fatal alert has been recieved',
              url: 'http://forum.framework7.io',
            },
          ]
        };

      var errorsjson;
      var errors2json;
      //call open errors
      fetch( app.store.state.baseurl + "/my-errors/open", {
        method: 'GET',
        headers: {
           'type': 'application/json',
           'accept': 'application/json',
           'origin': ''
        },
      })
       .then((res) => { 
        // console.log(res);
        
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.status);
        
       })
       .then((data) => {
          // console.log(data);
          errorsjson=data;
          fetch( app.store.state.baseurl + "/my-errors/closed", {
            method: 'GET',
            headers: {
               'type': 'application/json',
               'accept': 'application/json',
               'origin': ''
            },
          })
           .then((res) => { 
            // console.log(res);
            
            if (res.ok) {
              return res.json();
            }
            throw new Error(res.status);
            
           })
           .then((data) => {
              // console.log(data);
              errors2json=data;
              console.log(errors2json);
              console.log(errorsjson);
              resolve(
                {
                  component: RequestAndLoad,
                },
                {
                  props: {
                    user: user,
                    errorsjson: errorsjson,
                    errors2json: errors2json
                  }
                }
              );
           })





       })


       //Fetch Closed Issues
    

        // Hide Preloader
        app.preloader.hide();
        
        

        // Resolve route to load page
        
      }, 1000);
    },
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;