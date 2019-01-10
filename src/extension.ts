import * as vscode from 'vscode'

import RenameCodeLensProvider from './RenameCodeLensProvider'
import RenameEditor from './RenameEditor'
import RenameService from './RenameService'

export function activate (context: vscode.ExtensionContext) {
  const service = new RenameService()
  const renameEditor = new RenameEditor(service)
  const renameCodelensProvider = new RenameCodeLensProvider(service)

  function rename (file: any, files: any[]) {
    renameEditor.openEditor(files && files.length ? files : [file])
  }

  function execute (sources: string[], targets: []) {
    renameEditor.execute(sources, targets)
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.renamePlus.edit', rename)
  )
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.renamePlus.execute', execute)
  )
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider({ language: 'renameplus' },renameCodelensProvider)
  )
}

export function deactivate () {
  /* noop */
}
