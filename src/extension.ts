// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, languages, commands, Disposable, workspace, window } from 'vscode';
import { CodelensProvider } from './CodelensProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let disposables: Disposable[] = [];

export function activate(context: ExtensionContext) {
    const codelensProvider = new CodelensProvider();

    languages.registerCodeLensProvider("*", codelensProvider);

    commands.registerCommand("exec-commands.enableExecCommands", () => {
        workspace.getConfiguration("exec-commands").update("disableExecCommands", true, true);
    });

    commands.registerCommand("exec-commands.disableExecCommands", () => {
        workspace.getConfiguration("exec-commands").update("disableExecCommands", false, true);
    });

    commands.registerCommand("exec-commands.execCommandsNewConsoleAction", (args: any) => {
        openNewConsole(args);
    });

    commands.registerCommand("exec-commands.execCommandsAction", (args: any) => {
        if(window.activeTerminal) {
            window.activeTerminal?.sendText(args);
        } else {
            openNewConsole(args);
        }
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
    if (disposables) {
        disposables.forEach(item => item.dispose());
    }
    disposables = [];
}

function openNewConsole(args: string) {
    const terminal = window.createTerminal();
    terminal.sendText(args);
    terminal.show(true);
}
