import HomeCanvas, {
  HomeCanvasProps,
} from "@/app/(protected)/home/_components/canvas";
import { useForceLayout } from "@/hooks/use-force-layout";

function HomeCanvasLayout(props: HomeCanvasProps) {
  const { nodes: layoutNodes, edges: layoutEgdes } = useForceLayout(
    props.nodes,
    props.edges,
  );

  if (layoutNodes.length == 0) {
    return null;
  }

  return <HomeCanvas nodes={layoutNodes} edges={layoutEgdes} />;
}
export default HomeCanvasLayout;
