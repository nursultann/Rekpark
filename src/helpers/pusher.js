import { io } from 'socket.io-client';

const socket = io('http://localhost:8001', {
    transports: ['websocket'],
    autoConnect: false,
});

class SocketHelper {
    static instance = null;

    static getInstance = () => {
        if (SocketHelper.instance === null) {
            SocketHelper.instance = new SocketHelper();
        }

        return SocketHelper.instance;
    }

    static I = SocketHelper.getInstance();

    constructor() {
        this.connected = false;

        this.socket = socket;

        this.socket.on('disconnect', () => {
            console.log('disconnected');
            this.connected = false;
        });
    }

    connect = async () => {
        return new Promise((resolve) => {
            this.socket.connect();

            this.socket.on('connect', () => {
                console.log('connected');
                this.connected = true;

                socket.emit('join', {
                    token: localStorage.getItem('token')
                });

                resolve();
            });

        });
    }

    disconnect = () => {
        this.socket.disconnect();
    }

    sendMessage = (message) => {
        this.socket.emit('message', message);
    }

    async* subscribeTo(channel) {
        if (!this.connected) {
            await this.connect();
        }

        yield new Promise((resolve) => {
            this.socket.on(channel, (data) => {
                console.log(channel, data);

                resolve(data);
            });
        });
    }

    unsubscribeFrom = (channel) => {
        this.socket.off(channel);
    }
}

export default SocketHelper;
