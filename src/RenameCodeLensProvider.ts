import { CancellationToken, CodeLens, CodeLensProvider, Event, TextDocument } from 'vscode'

import RenameService from './RenameService'

export default class RenameCodeLensProvider implements CodeLensProvider {

  private service: RenameService

  public onDidChangeCodeLenses?: Event<void> | undefined

  public constructor (service: RenameService) {
    this.service = service
  }

  public provideCodeLenses (document: TextDocument, token: CancellationToken): CodeLens[] {
    return this.service.getCodeLenses(document)
  }

}
