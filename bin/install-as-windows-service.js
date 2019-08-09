var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name: 'JIRA-time',
    description: 'Express and websocket server listening on port 3000 and 8080',
    script: 'D:\\Projects\\jira-time\\bin\\server.js',
    env: {
        name: 'NODE_ENV',
        value: 'production'
    }
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function() {
    svc.start();
});

svc.install();
