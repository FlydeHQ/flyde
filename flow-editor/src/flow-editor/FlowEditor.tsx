import * as React from "react";
import {
  isVisualPart,
  Pos,
  VisualPart,
  isInlineValuePart,
  PartInstance,
  FlydeFlow,
  ResolvedFlydeFlowDefinition,
  ImportablePart,
  PartDefRepo,
  ImportedPartDef,
  InlinePartInstance,
  PinType,
} from "@flyde/core";
import {
  VisualPartEditor,
  ClipboardData,
  defaultViewPort,
  GroupEditorBoardData,
  PART_HEIGHT,
} from "../visual-part-editor/VisualPartEditor";
import produce from "immer";
import { useHotkeys } from "../lib/react-utils/use-hotkeys";

// ;
import {
  createNewPartInstance,
  domToViewPort,
} from "../visual-part-editor/utils";

import { HistoryPayload } from "@flyde/remote-debugger";
import { AppToaster, toastMsg } from "../toaster";

import {
  FlydeFlowChangeType,
  functionalChange,
} from "./flyde-flow-change-type";
import { Omnibar, OmniBarCmd, OmniBarCmdType } from "./omnibar/Omnibar";

import { usePorts } from "./ports";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { vAdd } from "..";

export * from "./ports";

library.add(fab, fas);

export type FlowEditorState = {
  flow: FlydeFlow;
  boardData: GroupEditorBoardData;
};

export type FlydeFlowEditorProps = {
  state: FlowEditorState;
  onChangeEditorState: React.Dispatch<React.SetStateAction<FlowEditorState>>;

  resolvedRepoWithDeps: ResolvedFlydeFlowDefinition;

  onImportPart: (
    part: ImportablePart,
    target?: { pos: Pos; connectTo?: { insId: string; outputId: string } }
  ) => void;
  onQueryImportables?: (query: string) => Promise<ImportablePart[]>;

  onInspectPin: (insId: string, pinId: string, pinType: PinType) => void;

  onRequestHistory: (
    insId: string,
    pinId: string,
    pinType: PinType
  ) => Promise<HistoryPayload>;

  onNewEnvVar?: (name: string, val: any) => void;

  onExtractInlinePart: (ins: InlinePartInstance) => Promise<void>;

  ref?: React.Ref<any>;

  hideTemplatingTips?: boolean;
};

const maxUndoStackSize = 50;

export type ConstTargetData = {
  ins?: PartInstance;
  pinId?: string;
  pos: Pos;
};

export type DataBuilderTarget = {
  partId: string;
  src: string;
};

const ignoreUndoChangeTypes = ["select", "drag-move", "order-step"];

const resolvedToRepo = (res: ResolvedFlydeFlowDefinition): PartDefRepo => ({
  ...res.dependencies,
  [res.main.id]: res.main,
});

export const FlowEditor: React.FC<FlydeFlowEditorProps> = React.memo(
  React.forwardRef((props, ref) => {
    const {
      state,
      resolvedRepoWithDeps: resolvedFlow,
      onChangeEditorState,
      onImportPart,
    } = props;

    const [undoStack, setUndoStack] = React.useState<
      Partial<FlowEditorState>[]
    >([]);
    const [redoStack, setRedoStack] = React.useState<
      Partial<FlowEditorState>[]
    >([]);

    const { flow, boardData: editorBoardData } = state;
    const editedPart = state.flow.part;

    const { openFile } = usePorts();

    const onChangeFlow = React.useCallback(
      (newFlow: FlydeFlow, changeType: FlydeFlowChangeType) => {
        console.log("onChangeFlow", changeType.type);

        if (changeType.type === "functional") {
          setUndoStack([
            { flow: newFlow },
            ...undoStack.slice(0, maxUndoStackSize),
          ]);
          setRedoStack([]);
        }
        onChangeEditorState((state) => ({ ...state, flow: newFlow }));
      },
      [onChangeEditorState, undoStack]
    );

    const [clipboardData, setClipboardData] = React.useState<ClipboardData>({
      instances: [],
      connections: [],
    });

    const [omnibarVisible, setOmnibarVisible] = React.useState(false);

    const hideOmnibar = React.useCallback(() => setOmnibarVisible(false), []);
    const showOmnibar = React.useCallback(() => setOmnibarVisible(true), []);

    const onChangeEditorBoardData = React.useCallback(
      (partial: Partial<GroupEditorBoardData>) => {
        onChangeEditorState((state) => {
          return { ...state, boardData: { ...state.boardData, ...partial } };
        });
      },
      [onChangeEditorState]
    );

    // clear board data that isn't related to part when it changes
    React.useEffect(() => {
      onChangeEditorBoardData({
        selected: [],
        viewPort: defaultViewPort,
        from: undefined,
        to: undefined,
        lastMousePos: { x: 0, y: 0 },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editedPart.id]);

    useHotkeys(
      "cmd+z",
      (e) => {
        setRedoStack([...redoStack, state]);
        const [last, ...rest] = undoStack;
        if (last) {
          onChangeEditorState((state) => ({ ...state, ...last }));
          setUndoStack(rest);
        }
        e.preventDefault();
      },
      undefined,
      [state, undoStack, redoStack]
    );

    useHotkeys("a", (e) => {
      e.preventDefault();
      showOmnibar();
    });

    const onChangePart = React.useCallback(
      (newPart: VisualPart, changeType: FlydeFlowChangeType) => {
        const shouldIgnore = ignoreUndoChangeTypes.some((str) =>
          changeType.message.includes(str)
        );
        if (!shouldIgnore) {
          setRedoStack([]);
        }

        const changedProject = produce(flow, (draft) => {
          draft.part = newPart;
        });

        onChangeFlow(changedProject, changeType);
      },
      [flow, onChangeFlow]
    );

    const onEditPart = React.useCallback(
      (part: ImportedPartDef) => {
        openFile({ absPath: part.importPath });

        // toastMsg('TODO');
      },
      [openFile]
    );

    const onAddPartInstance = React.useCallback(
      (partId: string, offset: number = -1 * PART_HEIGHT * 1.5) => {
        const newPartIns = createNewPartInstance(
          partId,
          offset,
          editorBoardData.lastMousePos,
          resolvedToRepo(resolvedFlow)
        );
        if (newPartIns) {
          const valueChanged = produce(flow, (draft) => {
            const part = draft.part;
            if (!isVisualPart(part)) {
              throw new Error(
                `Impossible state, adding part to non visual part`
              );
            }
            part.instances.push(newPartIns);
          });
          onChangeFlow(valueChanged, functionalChange("add-part"));
          hideOmnibar();
          return newPartIns;
        }
      },
      [
        editorBoardData.lastMousePos,
        flow,
        onChangeFlow,
        hideOmnibar,
        resolvedFlow,
      ]
    );

    const onOmnibarCmd = React.useCallback(
      async (cmd: OmniBarCmd) => {
        switch (cmd.type) {
          case OmniBarCmdType.ADD:
            return onAddPartInstance(cmd.data);
          case OmniBarCmdType.ADD_VALUE:
            const pos = domToViewPort(
              editorBoardData.lastMousePos,
              editorBoardData.viewPort,
              defaultViewPort
            );
            toastMsg("TODO");
            // return requestNewConstValue(pos);
            break;
          case OmniBarCmdType.CREATE_CODE_PART:
            toastMsg("TODO");
            // onCreateNewPart("code");
            break;
          case OmniBarCmdType.CREATE_GROUPED_PART:
            toastMsg("TODO");
            // onCreateNewPart("visual");
            break;
          case OmniBarCmdType.IMPORT: {
            await onImportPart(cmd.data, { pos: editorBoardData.lastMousePos });
            const finalPos = vAdd({ x: 0, y: 0 }, editorBoardData.lastMousePos);
            const newPartIns = createNewPartInstance(
              cmd.data.part,
              0,
              finalPos,
              resolvedToRepo(resolvedFlow)
            );
            const newValue = produce(flow, (draft) => {
              draft.part.instances.push(newPartIns);
            });
            onChangeFlow(newValue, functionalChange("add-imported-part"));
            break;
          }
          default:
            AppToaster.show({
              intent: "warning",
              message: "Not supported yet",
            });
        }
        hideOmnibar();
      },
      [
        hideOmnibar,
        onAddPartInstance,
        editorBoardData.lastMousePos,
        editorBoardData.viewPort,
        onImportPart,
        resolvedFlow,
        flow,
        onChangeFlow,
      ]
    );

    const renderInner = () => {
      if (isInlineValuePart(editedPart)) {
        throw new Error("Impossible state");
      } else {
        return (
          <React.Fragment>
            <VisualPartEditor
              insId={`root.${editedPart.id}`}
              ref={ref}
              key={editedPart.id}
              boardData={editorBoardData}
              onChangeBoardData={onChangeEditorBoardData}
              part={editedPart}
              onGoToPartDef={onEditPart}
              // editOrCreateConstValue={editOrCreateConstValue}
              // requestNewConstValue={requestNewConstValue}
              // onGroupSelected={onGroupPart}
              onChangePart={onChangePart}
              resolvedFlow={resolvedFlow}
              // onToggleLog={props.onToggleLog}
              // onToggleBreakpoint={props.onToggleBreakpoint}
              clipboardData={clipboardData}
              onCopy={setClipboardData}
              partIoEditable={!editedPart.id.startsWith("Trigger")}
              onInspectPin={props.onInspectPin}
              onRequestHistory={props.onRequestHistory}
              onRequestImportables={props.onQueryImportables}
              onImportPart={props.onImportPart}
              onShowOmnibar={showOmnibar}
              onExtractInlinePart={props.onExtractInlinePart}
            />

            {omnibarVisible ? (
              <Omnibar
                flow={flow}
                repo={resolvedFlow.dependencies}
                onCommand={onOmnibarCmd}
                visible={omnibarVisible}
                onClose={hideOmnibar}
                onRequestImportables={props.onQueryImportables}
              />
            ) : null}
          </React.Fragment>
        );
      }
    };

    return <div className="project-editor">{renderInner()}</div>;
  })
);
