$(document).ready(function() {

    const $formUsername  = $('#form-username');
    const $modalUsername = $('#modal-username');
    const $formChat      = $('#form-chat');
    const $preview       = $('#preview');

    const ws = new WebSocket(`ws://${location.host}/chat`);

    ws.onopen = () => {
        console.log("ws open on ", `ws://${location.host}/chat`);
        $modalUsername.modal("show");
    };

    //handler de recibir un mensaje
    ws.onmessage = event => {

        console.log(event.data); //aquí cae el response del server

        const data = JSON.parse(event.data);

        if(data.id===1 && data.result) {
            $modalUsername.modal("hide");
        }

        if(data.id===1 && data.error) {
            $formUsername.find("input").addClass("is-invalid");
            $formUsername.find(".invalid-feedback").text(data.error.message);
        }

        if(data.method==="update") {
            $preview.append('<div class="mb-2">' + '<b>' + data.params.username + '</b>:<br/>' + data.params.message + '</div>');
        }
    };

    ws.onclose = () => {
        console.log("ws close");
    };

    const send = data => {
        ws.send(JSON.stringify(data));
    };

    //este se debe disparar al iniciar sesión
    //es para que tu cuenta tenga un username
    $formUsername.on("submit", e => {
        e.preventDefault();
        //const username = $(this).find("input").val(); //shingaéra no sirve...
        const username = e.target[0].value;
        console.log("captured username:", username);
        send({
            "id"     : 1,
            "method" : "username",
            "params" : {"username":username},
        });
    });

    //este es el handler de mandar un mensaje
    $formChat.on("submit", e => {
        e.preventDefault();
        send({
            "method" : "message",
            "params" : {"message" : $(this).find("input").val()} //$(this).find("input").val() es el value del textbox que disparó el evento
        });
    });
});

//eof (frontend)
