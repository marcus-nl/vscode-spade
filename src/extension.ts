'use strict';

import * as vscode from 'vscode';
import * as Path from 'path';
import * as Net from 'net';
import * as PortFinder from 'portfinder';
import * as ChildProcess from 'child_process';
import {LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, StreamInfo} from 'vscode-languageclient';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Extension "vscode-spade" is now active');

    vscode.languages.setLanguageConfiguration('spade', {
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/']
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
        ],
    });
        
    let clientOptions: LanguageClientOptions = {
        // Register the server for spade documents
        documentSelector: ['spade'],
        synchronize: {
            // Synchronize the setting section 'spade' to the server
            // NOTE: this currently doesn't do anything
            configurationSection: 'spade',
            fileEvents: [
                vscode.workspace.createFileSystemWatcher('**/*.spade')
            ]
        }
    }
    function createServer(): Promise<StreamInfo> {
        let javaExecutablePath = "java";
        return new Promise((resolve, reject) => {
            let socket = Net.connect(12345);
            resolve({
                reader: socket,
                writer: socket
            });
            /*
            PortFinder.getPort((err, port) => {
                port = 12345;
                let fatJar = Path.resolve(context.extensionPath, "out", "stcs.jar");
                
                let args = [
                    '-Dstcs.port=' + port,
                    '-jar', fatJar
                ];
                
                console.log(javaExecutablePath + ' ' + args.join(' '));
                
                Net.createServer(socket => {
                    console.log('Child process connected on port ' + port);

                    resolve({
                        reader: socket,
                        writer: socket
                    });
                }).listen(port, () => {
                    let options = { stdio: 'inherit', cwd: vscode.workspace.rootPath };
                    console.log('Child process connecting on port ' + port);
                    
                    // Start the child java process
                    ChildProcess.execFile(javaExecutablePath, args, options);
                });
            });
            */
        });
    }

    let client = new LanguageClient('SPADE Language Server', createServer, clientOptions);
    let disposable = client.start();

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}