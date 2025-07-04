# TO RUN
# uv run python -m src.agentic.utils.graph_visualization --doc-id 1

import argparse
from typing import Any

import dash
import dash_cytoscape as cyto
from dash import dcc, html
from dash.dependencies import Input, Output

from ....database import get_db
from ...dependencies import get_document_service

# Assuming db_utils and its functions are in the same directory or accessible

# --- Default Stylesheet ---
default_stylesheet = [
    # Style for nodes
    {
        "selector": "node",
        "style": {
            "background-color": "#0074D9",
            "label": "data(label)",
            "width": "20px",
            "height": "20px",
            "font-size": "10px",
            "color": "#333",
            "text-halign": "center",
            "text-valign": "bottom",
            "text-wrap": "wrap",
            "text-max-width": "80px",
        },
    },
    # Style for edges
    {
        "selector": "edge",
        "style": {
            "line-color": "#AAAAAA",
            "width": 1,
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "target-arrow-color": "#AAAAAA",
            "label": "data(label)",
            "font-size": "8px",
            "color": "#555",
            "text-rotation": "autorotate",
        },
    },
    # Style for selected nodes
    {
        "selector": ":selected",
        "style": {
            "border-width": 2,
            "border-color": "#FF4136",
            "background-color": "#FF4136",
        },
    },
]


def convert_graph_to_cytoscape_format(
    graph_data: dict[str, list[dict[str, Any]]],
) -> list[dict[str, Any]]:
    """
    Converts a graph from {"nodes": [...], "edges": [...]} format to
    a flat list of elements for Dash Cytoscape.
    """
    elements = []
    if "nodes" in graph_data:
        for node in graph_data["nodes"]:
            elements.append({"group": "nodes", "data": node})
    if "edges" in graph_data:
        for edge in graph_data["edges"]:
            elements.append({"group": "edges", "data": edge})
    return elements


def create_cytoscape_app(elements: list[dict[str, Any]], doc_id: int):
    """
    Creates and returns a Dash app for visualizing the knowledge graph.
    """
    app = dash.Dash(__name__, suppress_callback_exceptions=True)

    app.layout = html.Div(
        [
            html.H1(f"Knowledge Graph for Document ID: {doc_id}"),
            html.Div(
                [
                    dcc.Dropdown(
                        id="layout-dropdown",
                        options=[
                            {"label": "Cose", "value": "cose"},
                            {"label": "Grid", "value": "grid"},
                            {"label": "Circle", "value": "circle"},
                            {"label": "Concentric", "value": "concentric"},
                            {"label": "Breadthfirst", "value": "breadthfirst"},
                        ],
                        value="cose",  # Default layout
                        clearable=False,
                        style={"width": "200px", "display": "inline-block"},
                    ),
                ],
                style={"padding": "10px"},
            ),
            cyto.Cytoscape(
                id="cytoscape-graph",
                elements=elements,
                stylesheet=default_stylesheet,
                style={"width": "100%", "height": "80vh"},
                layout={
                    "name": "cose",
                    "idealEdgeLength": 100,
                    "nodeOverlap": 20,
                    "refresh": 20,
                    "fit": True,
                    "padding": 30,
                    "randomize": False,
                    "componentSpacing": 100,
                    "nodeRepulsion": 400000,
                    "edgeElasticity": 100,
                    "nestingFactor": 5,
                    "gravity": 80,
                    "numIter": 1000,
                    "initialTemp": 200,
                    "coolingFactor": 0.95,
                    "minTemp": 1.0,
                },
            ),
            html.Div(
                id="cytoscape-tapNodeData-output",
                style={"marginTop": "20px", "fontFamily": "monospace"},
            ),
        ]
    )

    @app.callback(
        Output("cytoscape-graph", "layout"), Input("layout-dropdown", "value")
    )
    def update_layout(layout_name):
        return {"name": layout_name, "animate": True}

    @app.callback(
        Output("cytoscape-tapNodeData-output", "children"),
        Input("cytoscape-graph", "tapNodeData"),
    )
    def display_tap_node_data(data):
        if data:
            return f"Selected Node Data: {data}"
        return "Click a node to see its data."

    return app


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Visualize a knowledge graph from the database."
    )
    parser.add_argument(
        "--doc-id",
        type=int,
        required=True,
        help="The ID of the document whose knowledge graph you want to visualize.",
    )
    args = parser.parse_args()

    print(f"Attempting to fetch knowledge graph for document ID: {args.doc_id}")

    db_session = next(get_db())
    try:
        # Fetch the knowledge graph from the database in {"nodes": [], "edges": []} format
        kg_dict = get_document_service(db=db_session).get_knowledge_graph_by_document_id

        if kg_dict is None:
            print("Could not retrieve knowledge graph. The document may not exist.")
        elif not kg_dict.get("nodes") and not kg_dict.get("edges"):
            print(
                f"Document {args.doc_id} exists but has no knowledge graph data to display."
            )
        else:
            # Convert to Cytoscape's flat list format
            kg_elements = convert_graph_to_cytoscape_format(kg_dict)

            # Create and run the Dash app
            app = create_cytoscape_app(kg_elements, args.doc_id)
            print("Starting Dash server on http://127.0.0.1:8050/")
            print("Press CTRL+C to stop.")
            app.run(debug=True, port=8050)

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db_session.close()
