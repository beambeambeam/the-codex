import copy
import warnings

from loguru import logger
from pocketflow import BatchNode as BasePocketBatchNode
from pocketflow import Flow as BasePocketFlow
from pocketflow import Node as BasePocketNode
from pydantic import BaseModel, Field


# Custom Node and Flow classes for PocketFlow
# track node names and flow names for better debugging and logging.
class ShareStoreBase(BaseModel):
    current_node: str = Field(
        None, description="Name of the current node being executed in the flow"
    )

    class Config:
        arbitrary_types_allowed = True


class Node(BasePocketNode):
    def __init__(self, name: str = "", max_retries=1, wait=0):
        super().__init__(max_retries=max_retries, wait=wait)
        self.name = name if name else self.__class__.__name__


class BatchNode(BasePocketBatchNode):
    def __init__(self, name: str = "", max_retries=1, wait=0):
        super().__init__(max_retries=max_retries, wait=wait)
        self.name = name if name else self.__class__.__name__


class Flow(BasePocketFlow):
    def __init__(self, start=None, name: str = "", debug: bool = False):
        super().__init__(start=start)
        self.name = name if name else self.__class__.__name__
        self.debug = debug
        if start and not hasattr(start, "node_name"):
            warnings.warn(
                f"Start node {start.__class__.__name__} in Flow {self.name} "
                "is not a CustomNode or CustomBatchNode. Node name tracking might not work as expected for it."
            )

    def _orch(self, shared: ShareStoreBase, params=None):
        curr = copy.copy(self.start_node)
        p = params or {**self.params}
        last_action = None

        if not curr:
            warnings.warn(f"Flow '{self.name}' has no start node.")
            return None

        while curr:
            curr.set_params(p)

            node_name = curr.name if hasattr(curr, "name") else curr.__class__.__name__
            shared.current_node = node_name

            if self.debug:
                logger.debug(f"Executing Node: {node_name}")

            if not hasattr(curr, "name"):
                warnings.warn(
                    f"Node {curr.__class__.__name__} in Flow {self.name} "
                    "does not have a 'name' attribute. Using class name."
                )

            last_action = curr._run(shared)

            if hasattr(curr, "name"):
                shared.current_node = f"{curr.name} (Completed)"

            next_node_candidate = self.get_next_node(curr, last_action)

            curr = copy.copy(next_node_candidate) if next_node_candidate else None

        return last_action


# TODO: Create custom versions for AsyncNode, AsyncFlow, etc., if used,
# ensuring they also correctly set current_node_name and flow_name.
