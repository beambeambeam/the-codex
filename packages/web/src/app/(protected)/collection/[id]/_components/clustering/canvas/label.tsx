import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ClusteringGroupLabelNodeData {
  label: string;
}

interface ClusteringGroupLabelNodeProps {
  data: ClusteringGroupLabelNodeData;
  selected?: boolean;
  className?: string;
}

function ClusteringGroupLabelNode(props: ClusteringGroupLabelNodeProps) {
  return (
    <Card className={cn("nodrag p-2 text-sm", props.className)}>
      {props.data.label}
    </Card>
  );
}
export default ClusteringGroupLabelNode;
