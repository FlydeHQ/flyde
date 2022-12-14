import { CodePart, partOutput } from "@flyde/core";

const part: CodePart = {
  id: "Sub",
  inputs: {
    a: { mode: "required", type: "number" },
    b: { mode: "required", type: "number" },
  },
  outputs: {
    r: partOutput(),
  },
  fn: (inputs, outputs) => {
    outputs.r.next(inputs.a - inputs.b);
  },
};

export default part;
