<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <html>

    <head>
        <title>Bienvenida</title>
    </head>

    <body>
        <h1>¡Bienvenido, <%= request.getParameter("nombre") %>!</h1>
    </body>

    </html>