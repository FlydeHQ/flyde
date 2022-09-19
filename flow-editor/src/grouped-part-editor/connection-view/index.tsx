import * as React from "react";
import classNames from "classnames";
import {
  GroupedPart,
  Pos,
  PartDefRepo,
  getPartDef,
  PartInstance,
  ConnectionNode,
  isInternalConnectionNode,
  isExternalConnectionNode,
} from "@flyde/core";
import {
  calcPinPosition,
  calcMainInputPosition,
  calcMainOutputPosition,
} from "./calc-pin-position";
import { Size } from "../../utils";
// ;
import { calcBezierPath } from "./bezier";

import { useSsr } from 'usehooks-ts'


export interface ConnectionViewProps {
  from: ConnectionNode;
  to: ConnectionNode;
  instances: PartInstance[];
  repo: PartDefRepo;
  part: GroupedPart;
  parentInsId: string;
  onDblClick: () => void;
  size: Size;
  boardPos: Pos;
  viewPort: { pos: Pos; zoom: number };
  future?: "addition" | "removal";
}

const calcStartPos = (props: ConnectionViewProps): Pos => {
  const { from, part, size, boardPos, parentInsId } = props;

  if (isExternalConnectionNode(from)) {
    return calcMainInputPosition(part, size, from.pinId, parentInsId, "input", boardPos);
  } else {
    return calcPinPosition(parentInsId, from.insId, from.pinId, "output", boardPos);
  }
};

const calcTargetPos = (props: ConnectionViewProps): Pos => {
  const { to, part, size, boardPos, parentInsId } = props;

  if (isExternalConnectionNode(to)) {
    return calcMainOutputPosition(part, size, to.pinId, parentInsId, "output", boardPos);
  } else {
    return calcPinPosition(parentInsId, to.insId, to.pinId, "input", boardPos);
  }
};

export const ConnectionView: React.FC<ConnectionViewProps> = (props) => {
    const { isBrowser } = useSsr();

  const { from, onDblClick, part, viewPort, repo, future, instances, to } = props;
  const [renderTrigger, setRenderTrigger] = React.useState(0);

  const fromInstance = isInternalConnectionNode(from) && instances.find((i) => i.id === from.insId);

  if (!fromInstance && isInternalConnectionNode(from)) {
    throw new Error(`impossible state  - "from instance id - [${from.insId}] does not exist"`);
  }

  const fromPart =
    isInternalConnectionNode(from) && fromInstance ? getPartDef(fromInstance, repo) : part;

  const sourcePin = fromPart.outputs[from.pinId];
  const delayed = sourcePin && sourcePin.delayed;

  const { x: x1, y: y1 } = isBrowser ? calcStartPos(props) : {x: 0, y: 0};
  const { x: x2, y: y2 } = isBrowser ? calcTargetPos(props) : {x: 0, y: 0};

  const requestRerender = React.useCallback((count: number) => {

      return requestAnimationFrame(() => {
        setRenderTrigger((r) => (r + 1) % 9);
        if (count > 0) {
          requestRerender(count - 1);
        }
      });
  }, []);

  React.useEffect(() => {
    // re-render 10 times and then stop
    // this is a very ugly hack to make connections render smoothly
    // but for some reason, if this is always on (As in no limit), when the playground
    // is scrolled, connections are rendered wrong
    
    const t = requestRerender(10);
    
    return () => {
      cancelAnimationFrame(t);
    };
  }, [x1, y1, x2, y2, requestRerender]);

  React.useEffect(() => {
    const handler = () => {
      console.log('REREND', renderTrigger);
      
      requestRerender(3);
    }
    window.addEventListener('scroll', handler);
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    }
  }, [requestRerender, renderTrigger])

  const cm = classNames("connection", { delayed }, future ? `future-${future}` : undefined);

  const bob = calcBezierPath({
    sourceX: x1,
    sourceY: y1,
    targetX: x2,
    targetY: y2,
    curvature: 0.15,
  });

  return (
    <span
      className={cm}
      style={{ opacity: viewPort.zoom }}
      data-from-id={`${from.insId}.${from.pinId}`}
      data-to-id={`${to.insId}.${to.pinId}`}
      data-bob={renderTrigger}
      key={renderTrigger}
    >
      <svg>
        {/* <polyline onDoubleClick={onDblClick} points={`${x1},${y1} ${x2},${y2}`}></polyline> */}
        <path d={bob} />
      </svg>
    </span>
  );
};
