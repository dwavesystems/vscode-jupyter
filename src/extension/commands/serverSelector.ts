// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { inject, injectable } from 'inversify';
import { ICommandManager } from '../../client/common/application/types';
import { IDisposable } from '../../client/common/types';
import { Commands } from '../../client/datascience/constants';
import { traceInfo } from '../../client/common/logger';
import { Uri } from 'vscode';
import { JupyterServerSelector } from '../../kernels/jupyter/serverSelector';

@injectable()
export class JupyterServerSelectorCommand implements IDisposable {
    private readonly disposables: IDisposable[] = [];
    constructor(
        @inject(ICommandManager) private readonly commandManager: ICommandManager,
        @inject(JupyterServerSelector) private readonly serverSelector: JupyterServerSelector
    ) {}
    public register() {
        this.disposables.push(
            this.commandManager.registerCommand(
                Commands.SelectJupyterURI,
                (
                    local: boolean = true,
                    source: Uri | 'nativeNotebookStatusBar' | 'commandPalette' | 'toolbar' = 'commandPalette'
                ) => {
                    if (source instanceof Uri) {
                        traceInfo(`Setting Jupyter Server URI to remote: ${source}`);
                        void this.serverSelector.setJupyterURIToRemote(source.toString(true));
                        return;
                    }

                    // Activate UI Selector
                    void this.serverSelector.selectJupyterURI(local, source);
                },
                this.serverSelector
            )
        );
    }
    public dispose() {
        this.disposables.forEach((d) => d.dispose());
    }
}
