const { spawn } = require('child_process');
const path = require('path');

function runCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, {
            cwd: cwd,
            shell: true,
            stdio: 'inherit'
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
}

async function startServers() {
    try {
        console.log('Starting backend server...');
        const backend = runCommand('mvnw.cmd', ['spring-boot:run'], process.cwd());
        
        console.log('Starting frontend server...');
        const frontend = runCommand('npm', ['run', 'start'], path.join(process.cwd(), 'frontend'));

        await Promise.all([backend, frontend]);
    } catch (error) {
        console.error('Error starting servers:', error);
        process.exit(1);
    }
}

startServers(); 