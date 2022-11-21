/// <reference path="./node_modules/gojs/release/go.d.ts" />


import { DataviewApi } from 'obsidian-dataview';
import {EventRef} from "obsidian";

declare module 'obsidian' {
	interface App {
		plugins: {
			enabledPlugins: Set<string>;
			plugins: {
				[id: string]: any;
				dataview?: {
					api?: DataviewApi;
				};
			};
		};
	}

	interface MetadataCache {
		on(
			name: 'dataview:api-ready',
			callback: (api: DataviewApi) => any,
			ctx?: any
		): EventRef;
		on(
			name: 'dataview:metadata-change',
			callback: (op: string, file: TFile) => any,
			ctx?: any
		): EventRef;
	}
}
