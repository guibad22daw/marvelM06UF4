package edu.fje.daw2;

import java.io.IOException;

import javax.websocket.OnMessage;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 * Classe que implementa un endpoint de WebSockets.
 * És accessible amb  la URI definida
 * @author sergi.grau@fje.edu
 * @version 1.0 12.03.2015
 *
 */
@ServerEndpoint("/eco")
public class WebSocketEco {

    @OnMessage
    public void contestarMissatge(Session sessio, String missatge, boolean tancament) {
        try {
            if (sessio.isOpen()) {
                
                if(tancament){
                	sessio.getBasicRemote().sendText("ADEU " + missatge, tancament);	
                }
                else{
                	sessio.getBasicRemote().sendText("ECO " + missatge, tancament);
                }
            }
        } catch (IOException e) {
            try {
                sessio.close();
            } catch (IOException e1) {
            }
        }
    }


}