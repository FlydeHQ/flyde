import EventEmitter = require("events");
import {
  Part,
  PartRepo,
  dynamicOutput,
  keys,
  staticPartInput,
  partOutput,
  isDynamicInput,
} from ".";
import { execute, ExecuteParams } from "./execute";

export const simplifiedExecute = (
  partToRun: Part,
  repo: PartRepo,
  inputs: Record<string, any>,
  onOutput?: (key: string, data: any) => void,
  otherParams: Partial<ExecuteParams> = {}
) => {
  const outputKeys = keys(partToRun.outputs);

  const _inputs = Object.keys(inputs).reduce((acc, curr) => {
    const input = inputs[curr];
    return {
      ...acc,
      [curr]: isDynamicInput(input) ? input : staticPartInput(input),
    };
  }, {});

  const outputs = outputKeys.reduce((acc, k) => {
    const output = dynamicOutput();
    if (onOutput) {
      output.subscribe((value) => {
        onOutput(k, value);
      });
    }
    return { ...acc, [k]: output };
  }, {});

  return execute({
    part: partToRun,
    inputs: _inputs,
    outputs,
    partsRepo: repo,
    onBubbleError: (err) => {
      throw err;
    },
    ...otherParams,
  });
};
