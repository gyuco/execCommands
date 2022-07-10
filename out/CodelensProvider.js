"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodelensProvider = void 0;
const vscode = require("vscode");
/**
 * CodelensProvider
 */
class CodelensProvider {
    constructor() {
        this.codeLenses = [];
        this._onDidChangeCodeLenses = new vscode.EventEmitter();
        this.onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;
        this.regex = /COMMAND/g;
        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }
    provideCodeLenses(document, token) {
        if (vscode.workspace.getConfiguration("exec-commands").get("enableCodeLens", true)) {
            this.codeLenses = [];
            const regex = new RegExp(this.regex);
            const text = document.getText();
            let matches;
            while ((matches = regex.exec(text)) !== null) {
                const line = document.lineAt(document.positionAt(matches.index).line);
                const indexOf = line.text.indexOf(matches[0]);
                const position = new vscode.Position(line.lineNumber, indexOf);
                const range = document.getWordRangeAtPosition(position, new RegExp(this.regex));
                if (range) {
                    const consoleCommand = line.text.replace('COMMAND ', '');
                    const command = {
                        title: "Exec",
                        tooltip: `Exec command ${consoleCommand}`,
                        command: "exec-commands.execCommandsAction",
                        arguments: [consoleCommand]
                    };
                    this.codeLenses.push(new vscode.CodeLens(range, command));
                    const command2 = {
                        title: "Exec in a new terminal",
                        tooltip: `Exec command ${consoleCommand}`,
                        command: "exec-commands.execCommandsNewConsoleAction",
                        arguments: [consoleCommand]
                    };
                    this.codeLenses.push(new vscode.CodeLens(range, command2));
                }
            }
            return this.codeLenses;
        }
        return [];
    }
    resolveCodeLens(codeLens, token) {
        if (vscode.workspace.getConfiguration("exec-commands").get("enableExecCommands", true)) {
            return codeLens;
        }
        return null;
    }
}
exports.CodelensProvider = CodelensProvider;
//# sourceMappingURL=CodelensProvider.js.map