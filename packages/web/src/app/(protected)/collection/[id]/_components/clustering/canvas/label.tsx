interface ClusteringGroupLabelNodeData {
  label: string;
}

interface ClusteringGroupLabelNodeProps {
  data: ClusteringGroupLabelNodeData;
  selected?: boolean;
  className?: string;
}

function ClusteringGroupLabelNode(props: ClusteringGroupLabelNodeProps) {
  return <div>{props.data.label}</div>;
}
export default ClusteringGroupLabelNode;
