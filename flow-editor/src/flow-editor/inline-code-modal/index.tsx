import * as React from "react";

// ;

import Editor, { OnMount } from "@monaco-editor/react";
import {
  Button,
  Callout,
  Classes,
  Code,
  Dialog,
  Icon,
  Intent,
  Radio,
  RadioGroup,
} from "@blueprintjs/core";
import classNames from "classnames";
import { getVariables } from "./inline-code-to-part";
import { InlineValuePartType, ExecuteEnv, isDefined } from "@flyde/core";
import { Tooltip2 } from "@blueprintjs/popover2";

export type InlineCodeModalProps = {
  initialValue?: string;
  initialType?: InlineValuePartType;
  onSubmit: (type: InlineValuePartType, code: string) => void;
  onCancel: () => void;
  env?: ExecuteEnv;
};

// eslint-disable-next-line no-template-curly-in-string
const defaultValue = "`Result is ${inputs.a + inputs.b}`";

export const InlineCodeModal: React.FC<InlineCodeModalProps> = React.memo(
  function ValueEditorModal(props) {
    const { initialValue, initialType } = props;

    const [value, setValue] = React.useState(
      isDefined(initialValue) ? initialValue : defaultValue
    );

    const [type, setType] = React.useState<InlineValuePartType>(
      initialType || InlineValuePartType.VALUE
    );

    const onMonacoMount: OnMount = (editor) => {
      if (editor) {
        editor.updateOptions({
          lineNumbers: "off",
          minimap: { enabled: false },
        });
      }
    };

    const onKeyDown: React.KeyboardEventHandler<any> = (e) => {
      if (e.key === "Enter" && e.metaKey) {
        props.onSubmit(type, value);
      }
    };

    const inputPinExplanation = (
      <div>
        <p>
          You can add variables to by referrencing the "inputs" object.
          <br /> For example:
          <Code>{"`Hello {inputs.name}`"}</Code> will expose an input pin named
          "name"
        </p>
        <p>
          You can also use ternery expressions, arithmetic operators and more!
          <br />
          For example:
          <Code>
            {"inputs.a > inputs.b ? inputs.a + 42 : Math.random() * inputs.b"}
          </Code>
        </p>
      </div>
    );

    const typeExplanationValue = (
      <span>
        Type in any valid JS value, such as <Code>true</Code>, <Code>42</Code>,{" "}
        <Code>["bob", "alice", "dave"]</Code>.<br /> Dynamic inputs may also be
        used
      </span>
    );
    const typeExplanationInline = (
      <span>
        Write any JS code and return a value.
        <br /> The returned value will be the output.
        <br /> Example:
        <Code>
          const a = inputs.a; const b = inputs.b; return Math.floor(a/b);
        </Code>
      </span>
    );

    const vars = getVariables(value);

    const maybeWrongTypeWarning = () => {
      // very naive, TODO - use ast parser such as epsreema
      const hasReturn = value.includes("return");
      if (hasReturn && type === InlineValuePartType.VALUE) {
        return (
          <Callout intent={Intent.WARNING}>
            When using the "value" type you are not expected to return anything
          </Callout>
        );
      }

      if (!hasReturn && type === InlineValuePartType.FUNCTION) {
        return (
          <Callout intent={Intent.DANGER}>
            When using the "function" type you are expected to{" "}
            <Code>return</Code> a value.
            <br />
            Example: <Code>return 42 + Date.now();</Code>
          </Callout>
        );
      }
      return null;
    };

    React.useEffect(() => {
      if (
        value === defaultValue &&
        type === InlineValuePartType.FUNCTION
      ) {
        setValue(`return ${defaultValue}`);
      }
      if (
        value === `return ${defaultValue}` &&
        type === InlineValuePartType.VALUE
      ) {
        setValue(defaultValue);
      }
    }, [value, type]);

    return (
      <Dialog
        isOpen={true}
        title={"Inline Value / Code"}
        onClose={props.onCancel}
        canEscapeKeyClose={false}
        className="inline-code-modal"
      >
        <main
          className={classNames(Classes.DIALOG_BODY)}
          onKeyDown={onKeyDown}
          tabIndex={0}
        >
          <RadioGroup
            inline
            onChange={(e: any) => setType(e.target.value as any)}
            selectedValue={type}
          >
            <Radio
              labelElement={
                <React.Fragment>
                  Value{" "}
                  <Tooltip2 content={typeExplanationValue} placement="top">
                    <Icon icon="info-sign" intent="primary" />
                  </Tooltip2>
                </React.Fragment>
              }
              value={InlineValuePartType.VALUE}
            />
            <Radio
              labelElement={
                <React.Fragment>
                  Function{" "}
                  <Tooltip2 content={typeExplanationInline} placement="top">
                    <Icon icon="info-sign" intent="primary" />
                  </Tooltip2>
                </React.Fragment>
              }
              value={InlineValuePartType.FUNCTION}
            />
          </RadioGroup>
          <Editor
            height="80px"
            theme="vs-dark"
            defaultLanguage="javascript"
            value={value}
            onChange={(e) => setValue(e || "")}
            onMount={onMonacoMount}
          />
          {maybeWrongTypeWarning()}
          <Callout intent={Intent.NONE}>
            Input pins detected:{" "}
            {vars.length ? vars.map((v) => <Code key={v}>{v}</Code>) : "None"}
            <Tooltip2 content={inputPinExplanation}>
              <Icon icon="info-sign" intent={Intent.PRIMARY} />
            </Tooltip2>
          </Callout>
        </main>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={props.onCancel}>Cancel</Button>
            <Button
              onClick={() => props.onSubmit(type, value)}
              intent={Intent.PRIMARY}
              className="save-btn"
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
);
