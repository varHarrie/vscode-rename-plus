import { CodeLens, DecorationOptions, Range, TextDocument } from 'vscode'

const colors = {
  '': '',
  Rename: '#89d185',
  Remove: '#f48771'
}

export default class RenameService {
  private store: Map<TextDocument, string[]> = new Map()

  public addDocument (document: TextDocument, files: string[]) {
    this.store.set(document, files)
  }

  public getDecorations (document: TextDocument): DecorationOptions[] {
    const files = this.store.get(document) || []
    const lines = document.getText().split('\n')

    return files.map((file, i) => {
      const target = lines[i] || ''
      const tag =
        file === target ? '' : target ? 'Rename' : 'Remove'

      return {
        range: new Range(i, 0, i, target.length),
        renderOptions: {
          after: {
            contentText: tag ? ` ▪ ${tag}` : '',
            color: colors[tag]
          }
        }
      }
    })
  }

  public getCodeLenses (document: TextDocument): CodeLens[] {
    const files = this.store.get(document) || []
    const lines = document.getText().split('\n')
    const codeLenses: CodeLens[] = []

    codeLenses.push(
      new CodeLens(new Range(0, 0, 0, 0), {
        title: 'Execute All',
        command: 'extension.renamePlus.execute',
        arguments: [files, lines]
      })
    )

    files.forEach((file, i) => {
      const target = lines[i] || ''
      const range = new Range(i, 0, i, 0)
      const changed = target !== file

      codeLenses.push(
        changed
          ? new CodeLens(range, {
            title: 'Execute',
            command: 'extension.renamePlus.execute',
            arguments: [[file], [target]]
          })
          : new CodeLens(range, {
            title: 'Not changed',
            command: ''
          })
      )
      codeLenses.push(
        new CodeLens(range, { title: `Source: ${file}`, command: '' })
      )
    })

    return codeLenses
  }
}
