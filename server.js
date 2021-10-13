import 'babel-polyfill'
import express from 'express'
import path from 'path'
import fs from 'fs'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom';
import AllRoutes from './src/app/routing/route'
import bodyParser from 'body-parser'
import { Provider } from 'react-redux'
import { store } from './src/app/store/store.factory'

const app = express()
const PORT = 3000

app.use(bodyParser.json())
app.use(express.static('build/public'))

app.get('*', (req, res, next) => {

  const context = {}

  const content = ReactDOMServer.renderToString(
    <Provider store={store} >
      <StaticRouter location={req.url} context={context}>
        <AllRoutes />
      </StaticRouter>
    </Provider>
  );

  return res.send(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <link rel="shortcut icon" href="../bizzhive.ico" type="image/x-icon" />
            <title>MyBizzHive</title>
            <link rel="stylesheet" href="../main.css" />
        </head>
        <body>
            <div id="root">${content}</div>
            <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
                integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
                crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"
                integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN"
                crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"
                integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV"
                crossorigin="anonymous"></script>
            <script>
              $(document).ready(function () {
                var alterClass = function () {
                  var ww = document.body.clientWidth;
                  if (ww < 901) {
                    $('.main-card--collapse').addClass('collapse')
                    $('.mbl-tabbing').addClass('tab-pane fade')
                    $('.leads-col_body').addClass('collapse')
                  } else {
                    $('.main-card--collapse').removeClass('collapse')
                    $('.mbl-tabbing').removeClass('tab-pane fade')
                    $('.leads-col_body').removeClass('collapse')
                  };
                };
                $(window).resize(function () {
                  alterClass();
                });
                //Fire it when the page first loads:
                alterClass();
              });
            </script>

            <script>
              $(window).scroll(function () {
                if ($(this).scrollTop() > 50) {
                  $('.fixed--header').addClass('fixed--elements');
                } else {
                  $('.fixed--header').removeClass('fixed--elements');
                }
              });
            </script>
            <script src="../client_bundle.js"></script>
        </body>
    </html>`)
})

app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`)
})