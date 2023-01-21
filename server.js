console.log("WebSocket Server ")
//���������� ������ � �������
var fs = require('fs');
//��������� ������ ���������� html ����
var contents = fs.readFileSync('webclient.html', 'utf8');
//���������� ������ � ����������� �������
var WebSocketServer = require('websocket').server;
//���������� http
var http = require('http');
//������� http ������
var server = http.createServer(function (request, response) {
    //������ ��������� �������� ������� (��������)
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(contents)
    response.end()
});
//������������� ������� �������
server.listen(10556, function () { });

// create the ��� ������ server �������������� � http ��������
wsServer = new WebSocketServer({
    httpServer: server
});
// WebSocket server - ��������� ������� ������ ����������
wsServer.on('request', function (request) {
    //���������� ��� ������� ������� ����
    var fl = true;
    var index = 0;
    var connection = request.accept(null, request.origin);
    console.log(connection.toString());
    // ���������� ������� �� �������
    function timecounter(arg) {
        console.log('arg was => %s', arg);
        console.log(fl);
        //�������� ������ �� ������ �� �������� ��� ���������
        if (fl) {
            //���������� json ������ �������
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

        // process WebSocket message  , ���� ��� �����
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
