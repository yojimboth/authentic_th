const net = require('net');
const { ESCPOSEmulator } = require('./escpos-emulator');

const PORT = process.env.RELAY_PORT || 9100;
const LOCAL_HOST = process.env.LOCAL_HOST || '127.0.0.1';
const LOCAL_PORT = parseInt(process.env.LOCAL_PRINTER_PORT || '9100', 10);

console.log(`Printer relay starting on port ${PORT}`);
console.log(`Relaying to local printer at ${LOCAL_HOST}:${LOCAL_PORT}`);

const emulator = new ESCPOSEmulator();

const server = net.createServer((clientSocket) => {
    console.log(`New client connected from ${clientSocket.remoteAddress}`);

    let localSocket = null;

    const connectToLocal = () => {
        localSocket = new net.Socket();
        localSocket.connect(LOCAL_PORT, LOCAL_HOST, () => {
            console.log(`Connected to local printer at ${LOCAL_HOST}:${LOCAL_PORT}`);
        });
    };

    connectToLocal();

    clientSocket.on('data', (data) => {
        try {
            const parsed = emulator.parseCommand(data);
            console.log(`Received command: ${parsed.type}, ${parsed.length} bytes`);

            if (localSocket && localSocket.readyState === 'opening') {
                connectToLocal();
            }

            if (localSocket && localSocket.readyState === 'open') {
                localSocket.write(data);
            }
        } catch (error) {
            console.error(`Error processing command: ${error.message}`);
        }
    });

    clientSocket.on('end', () => {
        console.log('Client disconnected');
        if (localSocket) {
            localSocket.end();
        }
    });

    clientSocket.on('error', (error) => {
        console.error(`Client socket error: ${error.message}`);
        if (localSocket) {
            localSocket.end();
        }
    });

    localSocket?.on('error', (error) => {
        console.error(`Local socket error: ${error.message}`);
        clientSocket.end();
    });
});

server.on('error', (error) => {
    console.error(`Server error: ${error.message}`);
    if (error.code === 'EACCES') {
        console.error('Permission denied - try running with elevated privileges');
        process.exit(1);
    }
});

server.listen(PORT, () => {
    console.log(`Printer relay server listening on port ${PORT}`);
});

process.on('SIGINT', () => {
    console.log('Shutting down printer relay...');
    server.close();
    process.exit(0);
});