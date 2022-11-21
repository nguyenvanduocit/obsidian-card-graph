import {App, ItemView, Notice, OpenViewState, TFile, WorkspaceLeaf} from "obsidian";
import { DataviewApi } from "obsidian-dataview";
import {drawchart} from "./drawchart.js";
import {ObjectData} from "gojs";

export const VIEW_TYPE_EXAMPLE = "example-view";

export class ExampleView extends ItemView {
	private dataViewApi: DataviewApi;

	constructor(leaf: WorkspaceLeaf, app: App) {
		super(leaf);
		if (!app.plugins.enabledPlugins.has("dataview")) {
			new Notice("Dataview plugin is not enabled.");
			return
		}

		this.dataViewApi = app.plugins.plugins.dataview!.api!;

	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return "Card Graph";
	}

	async onOpen() {

	}

	async drawGraph(filePath: string) {

		const page = this.dataViewApi.page(filePath)
		if (!page) {
			new Notice("Page not found");
			return
		}

		const currentFile = page['file']

		const nodes: Record<string, ObjectData> = {}
		const links: Record<string, ObjectData> = {}

		await this.buildGraph(currentFile.path, nodes, links)

		const containerEl = this.containerEl.children[1];
		containerEl.id = "myDiagramDiv";

		const nodeArr = Object.values(nodes)
		const linkArr = Object.values(links)

		drawchart("myDiagramDiv", nodeArr, linkArr, this.onNodeClicked.bind(this));
	}

	onNodeClicked(node: ObjectData) {
		this.app.workspace.openLinkText( "", node.key);
	}

	async buildGraph(path: string, nodes: Record<string, ObjectData>, links: Record<string, ObjectData>) {
		const page = this.dataViewApi.page(path)
		if (!page) {
			return
		}

		const currentFile = page['file']

		if (nodes[currentFile.path]) {
			return
		}

		const aFile = await this.app.vault.getAbstractFileByPath(currentFile.path)
		const content = await this.app.vault.cachedRead(aFile as TFile)
		// get the first paragraph
		const firstParagraph = content.split("\n")[0]
		nodes[currentFile.path] = {key: currentFile.path, title: currentFile.name, content: firstParagraph, color: "lightblue"}

		for (const link of currentFile.outlinks) {
			const subpage = this.dataViewApi.page(link.path)
			if (!subpage) {
				continue
			}
			const subfile = subpage['file']
			links[currentFile.path + subfile.path] = {from: currentFile.path, to: subfile.path, title: subfile.name}
			await this.buildGraph(subfile.path, nodes, links)
		}
	}

	async onClose() {
		// destroy view
	}
}
