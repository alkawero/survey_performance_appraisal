<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Pahoa Survey System</title>

        <!-- Fonts -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
        <!-- Styles -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css">
        <link rel="stylesheet" href="app.css">

        <style>
        ::-webkit-scrollbar {
        width: 3px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
        background: #edf0ff;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
        background: #3f51b5 ;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
        background: #ea1e63;
        }
        </style>

    </head>
    <body>
        <div id="root">
        </div>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <script src="{{asset('/js/app.js')}}" ></script>
    </body>
</html>
