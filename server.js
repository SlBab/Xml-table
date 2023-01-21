console.log("WebSocket Server ")
//библиотека работы с файлами
var fs = require('fs');
//синхронно читаем клиентский html файл
var contents = fs.readFileSync('webclient.html', 'utf8');
//библиотека работы с вебсоккетом сервера
var WebSocketServer = require('websocket').server;
//библиотека http
var http = require('http');
//создаем http сервер
var server = http.createServer(function (request, response) {
    //отдаем считанный документ клиенту (браузеру)
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(contents)
    response.end()
});
//прослушивание соккета сервера
server.listen(10556, function () { });

// create the веб соккет server ассоцированный с http сервером
wsServer = new WebSocketServer({
    httpServer: server
});
// WebSocket server - обработка события запрос соединения
wsServer.on('request', function (request) {
    //переменные для каждого клиента свои
    var fl = true;
    var index = 0;
    var connection = request.accept(null, request.origin);
    console.log(connection.toString());
    // обработчик собатия от таймера
    function timecounter(arg) {
        console.log('arg was => %s', arg);
        console.log(fl);
        //проверка закрыт ли соккет до отправки ему сообщения
        if (fl) {
            //отправляем json строку клиенту
            connection.sendUTF(
                JSON.stringify({ 'type': 'chat', 'data': String(index) }));
            index = index + 1;
            setTimeout(timecounter, 3000, index);
        }
    }
    setTimeout(timecounter, 3000, 'start');

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function (message) {

        // process WebSocket message  , если это текст
        if (message.type === 'utf8') {
            console.log("client send json: " + message.utf8Data);
            msg = JSON.parse(message.utf8Data);
            console.log("client send data: " + msg.data);
        }
    });
    connection.on('close', function (connection) {
        // close user connection
        fl = false;
        console.log(connection.toString());
        console.log("User close connection")
    });
});
