"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var import_vscode = require("vscode");

// src/CodelensProvider.ts
var vscode = __toESM(require("vscode"));
var CodelensProvider = class {
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
          const consoleCommand = line.text.replace("COMMAND ", "");
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
};

// src/extension.ts
var disposables = [];
function activate(context) {
  const codelensProvider = new CodelensProvider();
  import_vscode.languages.registerCodeLensProvider("*", codelensProvider);
  import_vscode.commands.registerCommand("exec-commands.enableExecCommands", () => {
    import_vscode.workspace.getConfiguration("exec-commands").update("disableExecCommands", true, true);
  });
  import_vscode.commands.registerCommand("exec-commands.disableExecCommands", () => {
    import_vscode.workspace.getConfiguration("exec-commands").update("disableExecCommands", false, true);
  });
  import_vscode.commands.registerCommand("exec-commands.execCommandsNewConsoleAction", (args) => {
    openNewConsole(args);
  });
  import_vscode.commands.registerCommand("exec-commands.execCommandsAction", (args) => {
    if (import_vscode.window.activeTerminal) {
      import_vscode.window.activeTerminal?.sendText(args);
    } else {
      openNewConsole(args);
    }
  });
}
function deactivate() {
  if (disposables) {
    disposables.forEach((item) => item.dispose());
  }
  disposables = [];
}
function openNewConsole(args) {
  const terminal = import_vscode.window.createTerminal();
  terminal.sendText(args);
  terminal.show(true);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=main.js.map
