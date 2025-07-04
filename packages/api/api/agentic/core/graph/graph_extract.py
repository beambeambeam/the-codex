import json
from collections.abc import Awaitable
from typing import Any, Callable

from .schemas import DocumentEdgeBase, DocumentNodeBase, ExtractedGraph


class KnowledgeGraphExtractor:
    def __init__(
        self,
        llm_caller: Callable[[str], Awaitable[str]],
        prompt_renderer: Callable[[str, int], str],
        text_limit: int = 15000,
    ):
        self.llm_caller = llm_caller
        self.prompt_renderer = prompt_renderer
        self.text_limit = text_limit

    def _convert_to_kg_node(self, node: dict[str, Any]) -> DocumentNodeBase:
        """Convert a node dictionary to DocumentNodeBase."""
        return DocumentNodeBase.model_validate(node)

    def _convert_to_kg_edge(self, edge: dict[str, Any]) -> DocumentEdgeBase:
        """Convert an edge dictionary to DocumentEdgeBase."""
        return DocumentEdgeBase.model_validate(edge)

    def _convert_to_kg_data(
        self, kg_data: dict[str, list[dict[str, Any]]]
    ) -> ExtractedGraph:
        """Convert KG data to DocumentNodeBase and DocumentEdgeBase."""
        nodes: list[DocumentNodeBase] = [
            self._convert_to_kg_node(node) for node in kg_data.get("nodes", [])
        ]
        edges: list[DocumentEdgeBase] = [
            self._convert_to_kg_edge(edge) for edge in kg_data.get("edges", [])
        ]
        return ExtractedGraph(
            nodes=nodes,
            edges=edges,
        )

    async def extract(self, full_text: str) -> ExtractedGraph:
        """Extract knowledge graph from the provided text.
        Returns a dictionary with 'nodes' and 'edges' keys.
        If extraction fails, returns an empty graph with empty nodes and edges.
        """
        empty_kg = ExtractedGraph(nodes=[], edges=[])

        if not full_text:
            print("KnowledgeGraphExtractor: No text provided for KG extraction.")
            return empty_kg

        prompt = self.prompt_renderer(full_text=full_text, text_limit=self.text_limit)
        print(
            f"KnowledgeGraphExtractor: Sending text (length: {len(full_text[: self.text_limit])}) to LLM..."
        )

        try:
            # Call the LLM with the rendered prompt
            response_text = await self.llm_caller(prompt)

            # Extract and check format
            json_str = self._extract_json_string(response_text)
            validated_kg_dict = self._validate_and_parse_json(json_str)
            kg_data = self._convert_to_kg_data(validated_kg_dict)

            print(
                f"KnowledgeGraphExtractor: Extracted KG with {len(kg_data.nodes)} nodes and {len(kg_data.edges)} edges."
            )
            return kg_data

        except json.JSONDecodeError as e:
            print(
                f"KnowledgeGraphExtractor: JSON decode error: {e}. Response: {response_text[:500]}"
            )
            return empty_kg

        except Exception as e:
            print(f"KnowledgeGraphExtractor: Error during KG extraction: {e}")
            return empty_kg

    def _extract_json_string(self, response_text: str) -> str:
        """Extract JSON code block from LLM response."""
        if "```json" in response_text:
            return response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            return response_text.split("```")[1].split("```")[0].strip()
        else:
            return response_text.strip()

    def _validate_and_parse_json(
        self, json_str: str
    ) -> dict[str, list[dict[str, Any]]]:
        """Validate and parse JSON string to KG data."""
        if not (json_str.startswith("{") and json_str.endswith("}")):
            start = json_str.find("{")
            end = json_str.rfind("}")
            if start != -1 and end != -1 and end > start:
                json_str = json_str[start : end + 1]
            else:
                print(
                    f"KnowledgeGraphExtractor: Invalid JSON structure. Response: {json_str}"
                )
                return {"nodes": [], "edges": []}

        print(f"KnowledgeGraphExtractor: Parsing JSON content: {json_str[:1000]}...")
        kg_data = json.loads(json_str)

        # Validate structure
        if (
            not isinstance(kg_data, dict)
            or "nodes" not in kg_data
            or "edges" not in kg_data
        ):
            print(
                f"KnowledgeGraphExtractor: Missing 'nodes' and 'edges' keys. Data: {kg_data}"
            )
            return {"nodes": [], "edges": []}

        for node in kg_data.get("nodes", []):
            if not (isinstance(node, dict) and "id" in node and "label" in node):
                print(f"KnowledgeGraphExtractor: Invalid node structure: {node}")

        for edge in kg_data.get("edges", []):
            if not (isinstance(edge, dict) and "source" in edge and "target" in edge):
                print(f"KnowledgeGraphExtractor: Invalid edge structure: {edge}")

        return kg_data
