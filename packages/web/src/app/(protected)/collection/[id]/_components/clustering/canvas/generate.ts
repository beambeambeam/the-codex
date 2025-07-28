import {
  Clustering,
  GraphNode,
} from "@/app/(protected)/collection/[id]/_components/clustering/context";

export const generateGraphNodes = (clustering: Clustering): GraphNode[] => {
  const nodes: GraphNode[] = [];

  if (!clustering || !Array.isArray(clustering.topics)) {
    return nodes;
  }

  const TOPIC_WIDTH = 400;
  const TOPIC_INITIAL_HEIGHT = 40;
  const DOC_SPACING_Y = 150;
  const ZIGZAG_OFFSET_X = 40;
  const TOPIC_HORIZONTAL_SPACING = 400;
  const TOPIC_START_X = 100;
  const TOPIC_START_Y = 100;

  const GROUP_PADDING = 10; // New constant for padding

  // Adjust offsets based on padding
  const GROUP_LABEL_Y_OFFSET = -30 - GROUP_PADDING; // Move label further up to stay outside padding area
  const DOCUMENT_START_Y = 40 + GROUP_PADDING; // Documents start after padding

  clustering.topics.forEach((topic, i) => {
    const docCount = topic.documents.length;
    // Account for padding on both top and bottom in topic height
    const topicHeight =
      TOPIC_INITIAL_HEIGHT +
      docCount * DOC_SPACING_Y +
      ZIGZAG_OFFSET_X +
      GROUP_PADDING * 2; // Add padding for top and bottom

    const topicNode: GraphNode = {
      id: topic.id,
      data: { label: topic.title },
      position: {
        x: TOPIC_START_X + i * TOPIC_HORIZONTAL_SPACING,
        y: TOPIC_START_Y,
      },
      style: {
        width: TOPIC_WIDTH,
        height: topicHeight,
      },
      type: "group",
    };

    nodes.push(topicNode);

    const topicLabelNode: GraphNode = {
      id: `${topic.id}-label`,
      data: { label: topic.title },
      position: { x: 0, y: GROUP_LABEL_Y_OFFSET },
      parentId: topic.id,
      type: "groupLabel",
    };

    nodes.push(topicLabelNode);

    topic.documents.forEach((doc, j) => {
      let zigzagX: number;
      if (j % 2 === 0) {
        // Left zig: offset by padding from the left edge
        zigzagX = GROUP_PADDING;
      } else {
        // Right zig: offset by padding from the right edge
        // Assuming doc nodes have some implied width, you might need to adjust ZIGZAG_OFFSET_X
        // or account for actual document node width if available.
        zigzagX = TOPIC_WIDTH - ZIGZAG_OFFSET_X - GROUP_PADDING;
      }

      nodes.push({
        id: doc.id,
        data: { label: doc.title || doc.file_name },
        position: {
          x: zigzagX,
          y: DOCUMENT_START_Y + j * DOC_SPACING_Y,
        },
        parentId: topic.id,
        extent: "parent",
        type: "groupChildren",
      });
    });
  });

  return nodes;
};
