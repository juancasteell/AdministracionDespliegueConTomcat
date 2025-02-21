import java.io.*;
public class HolaMundoServlet extends HttpServlet {
protected void doGet(HttpServletRequest request,
HttpServletResponse response) throws ServletException,
IOException {
response.setContentType("text/html");
PrintWriter out = response.getWriter();
out.println("<html><body>");
out.println("<h1>¡Hola Mundo!</h1>");
out.println("<p>Bienvenido a MiSitioWeb</p>");
out.println("</body></html>");
}
}