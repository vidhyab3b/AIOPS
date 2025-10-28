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

      // Show Preloader
      app.preloader.show();
      
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
              title: 'cockpit-tls: gnutils_handshake failed: Fatal alert has been received',
              url: 'http://forum.framework7.io',
            },
          ]
        };

        var errorsjson;
        var errors2json;

        // Call open errors via proxy
        fetch('/api/my-errors/open', {
          method: 'GET',
          headers: {
             'Content-Type': 'application/json',
             'Accept': 'application/json'
          },
        })
        .then((res) => { 
          if (res.ok) return res.json();
          throw new Error(res.status);
        })
        .then((data) => {
          errorsjson = data;

          // Call closed errors via proxy
          fetch('/api/my-errors/closed', {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json'
            },
          })
          .then((res) => { 
            if (res.ok) return res.json();
            throw new Error(res.status);
          })
          .then((data) => {
            errors2json = data;
            console.log(errors2json);
            console.log(errorsjson);

            // Resolve route to load page
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

            // Hide Preloader
            app.preloader.hide();
          });
        });
      }, 1000);
    },
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
