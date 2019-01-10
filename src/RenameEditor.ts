import * as path from 'path'
import * as fse from 'fs-extra'
import { TextEditor, window, workspace } from 'vscode'

import RenameService from './RenameService'

const decorationType = window.createTextEditorDecorationType({
  isWholeLine: true
})

export default class RenameEditor {
  private service: RenameService

  public constructor (service: RenameService) {
    this.service = service
  }

  public async openEditor (files: any[]) {
    const rootPath = workspace.rootPath
    if (!rootPath) return

    const fileNames = files.map((f) => path.relative(rootPath, f.fsPath))
    const content = fileNames.join('\n')

    const document = await workspace.openTextDocument({ language: 'renameplus', content })
    const editor = await window.showTextDocument(document, { preview: false })

    this.service.addDocument(document, fileNames)
    this.updateDecorations(editor)

    workspace.onDidChangeTextDocument(() => {
      const activeEditor = window.activeTextEditor
      if (activeEditor && activeEditor.document === document) {
        this.updateDecorations(activeEditor)
      }
    })

    window.onDidChangeActiveTextEditor(() => {
      const activeEditor = window.activeTextEditor
      if (activeEditor && activeEditor.document === document) {
        this.updateDecorations(activeEditor)
      }
    })
  }

  public updateDecorations (editor: TextEditor) {
    const document = editor.document
    const decorations = this.service.getDecorations(document)

    editor.setDecorations(decorationType, decorations)
  }

  public execute (sources: string[], targets: string[]) {
    const rootPath = workspace.rootPath
    if (!rootPath) return

    sources.forEach(async (source, index) => {
      let target = (targets[index] || '').trim()

      source = path.join(rootPath, source)
      target = target ? path.join(rootPath, target) : ''

      if (target) {
        fse.moveSync(source, target)
      } else {
        fse.removeSync(source)
      }
    })
  }
}
