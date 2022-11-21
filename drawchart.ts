import * as go from "gojs/release/go";
import {ObjectData} from "gojs";


// decalre callback type
type Callback = (node: ObjectData) => void;

export const drawchart = (id: string, nodes: ObjectData[], links: ObjectData[], onNodeClicked: Callback)=> {
	const $ = go.GraphObject.make;

	let myDiagram = new go.Diagram(id, {
		contentAlignment: go.Spot.Center,
		autoScale: go.Diagram.UniformToFill,
		layout: new go.ForceDirectedLayout({}),
		allowZoom: true,
	});

	myDiagram.addDiagramListener("ObjectSingleClicked", (e) => {
		const part = e.subject.part;
		if (!(part instanceof go.Link)) {
			const node = part.data;
			onNodeClicked(node);
		}
	});

	myDiagram.nodeTemplate =
		new go.Node("Auto", {
			resizable: true,
			layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
			width: 300
		})
			.add(
				new go.Shape("RoundedRectangle")
					.bind("key", "path")
					.bind("fill", "color")
			)
			.add(
				new go.TextBlock({margin: 8, wrap: go.TextBlock.WrapFit})
					.bind("text", "content")
			);

	myDiagram.linkTemplate = new go.Link({
		curve: go.Link.Bezier,
		adjusting: go.Link.Scale,
	})
		.add(new go.Shape({ strokeWidth: 2, stroke: "#00a4a4" }))
		.add(new go.Shape({ toArrow: "kite", fill: "#00a4a4", stroke: null, scale: 2 }))
		.add(
			new go.TextBlock({margin: 8, wrap: go.TextBlock.WrapFit, stroke: "white"})
				.bind("text", "title")
		);

	myDiagram.model = new go.GraphLinksModel(
		{
			nodeDataArray: nodes,
			linkDataArray: links,
			copiesArrays: false,
			copiesArrayObjects: false,
		}
	);

	myDiagram.layoutDiagram(true);
}
