module.exports = {
  id: "StringAppend",
  inputs: {
    str: { mode: "required", type: "any" },
    strToAppend: { mode: "required", type: "any" },
  },
  outputs: { r: { type: "any" } },
  completionOutputs: ["r"],
  fn: function (inputs, outputs, adv) {
    // magic here// magic here
    outputs.r.next(`${inputs.str}${inputs.strToAppend}`);
  },
};
