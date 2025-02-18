/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// https://github.com/microsoft/vscode/issues/185269

	export interface SourceControl {
		historyProvider?: SourceControlHistoryProvider;
	}

	export interface SourceControlHistoryProvider {
		currentHistoryItemGroup?: SourceControlHistoryItemGroup;

		/**
		 * Fires when the current history item group changes after
		 * a user action (ex: commit, checkout, fetch, pull, push)
		 */
		onDidChangeCurrentHistoryItemGroup: Event<void>;

		/**
		 * Fires when history item refs change
		 */
		onDidChangeHistory: Event<SourceControlHistoryChangeEvent>;

		provideHistoryItemRefs(token: CancellationToken): ProviderResult<SourceControlHistoryItemRef[]>;
		provideHistoryItems(options: SourceControlHistoryOptions, token: CancellationToken): ProviderResult<SourceControlHistoryItem[]>;
		provideHistoryItemChanges(historyItemId: string, historyItemParentId: string | undefined, token: CancellationToken): ProviderResult<SourceControlHistoryItemChange[]>;

		resolveHistoryItemGroupCommonAncestor(historyItemGroupIds: string[], token: CancellationToken): ProviderResult<string>;
	}

	export interface SourceControlHistoryOptions {
		readonly cursor?: string;
		readonly skip?: number;
		readonly limit?: number | { id?: string };
		readonly historyItemGroupIds?: readonly string[];
	}

	export interface SourceControlHistoryItemGroup {
		readonly id: string;
		readonly name: string;
		readonly revision?: string;
		readonly base?: Omit<Omit<SourceControlHistoryItemGroup, 'base'>, 'remote'>;
		readonly remote?: Omit<Omit<SourceControlHistoryItemGroup, 'base'>, 'remote'>;
	}

	export interface SourceControlHistoryItemStatistics {
		readonly files: number;
		readonly insertions: number;
		readonly deletions: number;
	}

	export interface SourceControlHistoryItem {
		readonly id: string;
		readonly parentIds: string[];
		readonly message: string;
		readonly displayId?: string;
		readonly author?: string;
		readonly timestamp?: number;
		readonly statistics?: SourceControlHistoryItemStatistics;
		readonly references?: SourceControlHistoryItemRef[];
	}

	export interface SourceControlHistoryItemRef {
		readonly id: string;
		readonly name: string;
		readonly description?: string;
		readonly revision?: string;
		readonly category?: string;
		readonly icon?: Uri | { light: Uri; dark: Uri } | ThemeIcon;
	}

	export interface SourceControlHistoryItemChange {
		readonly uri: Uri;
		readonly originalUri: Uri | undefined;
		readonly modifiedUri: Uri | undefined;
		readonly renameUri: Uri | undefined;
	}

	export interface SourceControlHistoryChangeEvent {
		readonly added: Iterable<SourceControlHistoryItemRef>;
		readonly removed: Iterable<SourceControlHistoryItemRef>;
		readonly modified: Iterable<SourceControlHistoryItemRef>;
	}
}
