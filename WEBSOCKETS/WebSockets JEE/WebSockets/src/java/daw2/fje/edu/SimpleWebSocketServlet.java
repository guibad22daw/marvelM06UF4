/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package daw2.fje.edu;
import org.apache.catalina.websocket.MessageInbound;
import org.apache.catalina.websocket.StreamInbound;
import org.apache.catalina.websocket.WebSocketServlet;
import org.apache.catalina.websocket.WsOutbound;

 
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.util.logging.Level;
import java.util.logging.Logger;
 
@WebServlet(urlPatterns = "/simple")
public class SimpleWebSocketServlet extends WebSocketServlet {
 
 
    @Override
    protected boolean verifyOrigin(String origin) {
 System.out.println("Origin: {}"+ origin);
        return true;
    }
 
    @Override
    protected StreamInbound createWebSocketInbound(String subProtocol, HttpServletRequest request) {
        return new WebSocketConnection();
    }
 
    private static class WebSocketConnection extends MessageInbound {
 
        @Override
        protected void onOpen(WsOutbound outbound) {
            System.out.println("Conexión abierta");
        }
 
        @Override
        protected void onClose(int status) {
             System.out.println("Conexión cerrada");
        }
 
        @Override
        protected void onBinaryMessage(ByteBuffer byteBuffer) throws IOException {
             System.out.println("No se soportan mensajes binarios");
            throw new UnsupportedOperationException("No se soportan mensajes binarios");
        }
 
        @Override
        protected void onTextMessage(CharBuffer charBuffer) throws IOException {
            final int nombre = Integer.parseInt(charBuffer.toString());
             System.out.println("Nombre:"+ nombre);
             
             Runnable r = new Runnable(){
                 
                 public void run(){
                    for(int i=nombre;i<30;i++){
                        boolean primer=true;
                        for(int j=i-1;j>1;j--){
                            
                            if (i%j==0) primer=false;
                        }
                        
                     try {
                         getWsOutbound().writeTextMessage(CharBuffer.wrap("El nombre  " + i + " desde WebSocket es " + primer));
                     } catch (IOException ex) {
                         Logger.getLogger(SimpleWebSocketServlet.class.getName()).log(Level.SEVERE, null, ex);
                     }
    
                        }
                 }
             };
             Thread fil = new Thread(r);
             
             fil.start();
            
        }
    }
}