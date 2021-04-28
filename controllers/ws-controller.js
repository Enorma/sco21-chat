const WebSocket = require('ws');

let users = [];

const send = (ws, data) => {
    const d = JSON.stringify({
        "jsonrpc" : 2.0,
        ...data
    });
    ws.send(d);
};

const isUsernameTaken = uname => {
    for(let i=0; i<users.length; i++) {
        if(uname===users[i].username) {
            return true;
        }
    }
    return false;
};

const refreshUsers = () => {

    //WebSocket.CONNECTING = 0
    //WebSocket.OPEN       = 1
    //WebSocket.CLOSING    = 2
    //WebSocket.CLOSED     = 3

    let deletethese = [];

    for(let i=0; i<users.length; i++) {
        if(users[i].ws.readyState!==WebSocket.OPEN) {
            deletethese.push(i);
        }
    }

    for(let i=0; i<deletethese.length; i++) {
        users = users.filter(user => user.ws!==deletethese[i]);
    }

    deletethese = [];

    //loggear los usuarios actuales
    console.log("users: [");
    users.forEach(user => {
        console.log("  "+user.username);
    });
    console.log("]");

    return;
};

module.exports = (ws, req) => {

    ws.on("message", msg => {

        const data = JSON.parse(msg);
        console.log("\nusername:", data.params.username);

        switch(data.method) {

            case "logout":

                console.log(`Logging out user: ${data.params.username}`);

                //filtrar para eliminar el que estamos borrando
                users = users.filter(user => user.ws!==ws);

                send(ws, {
                    "id"            : data.id,
                    "loggedoutuser" : data.params.username,
                    "result"        : {"status":"success"},
                });

                refreshUsers();

                break;
            //case logout

            case "username":

                console.log(`Signing up new user: ${data.params.username}`);

                //aquí se podría validar que el nombre no sea repetido
                //con isUsernameTaken(data.params.username)

                users.push({
                    "username" : data.params.username,
                    "ws"       : ws,
                });

                send(ws, {
                    "id"      : data.id,
                    "newuser" : data.params.username,
                    "result"  : {"status":"success"},
                });

                refreshUsers();

                break;
            //case username

            case "message":

                //encontrar quién envía el mensaje
                const username = users.find(user => user.ws===ws).username;

                refreshUsers();

                //loggear el mensaje
                console.log(`${username} is sending "${data.params.message}"`);

                let deletethese = [];
                let sendmsg;

                //enviar el mensaje a todos los usuarios
                for(let i=0; i<users.length; i++) {

                    sendmsg = {
                        "method" : "update",
                        "params" : {
                            "message"  : data.params.message,
                            "username" : username,
                        }
                    };

                    try {
                        send(users[i].ws, sendmsg); //intentar enviar
                    }catch(error) {
                        deletethese.push(users[i].ws); //si fracasa, marca el usuario destino
                    }
                }

                //borra todos los usuarios que fallaron
                for(let i=0; i<deletethese.length; i++) {
                    users = users.filter(user => user.ws!==deletethese[i]);
                }

                deletethese = [];

                break;
            //case message
        }//switch
    });
};

//eof (backend)
