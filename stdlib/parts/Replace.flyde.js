module.exports = {
  id: "String Replace",
  inputs: {
    str: { mode: "required", type: "any" },
    from: { mode: "required", type: "any" },
    to: { mode: "required", type: "any" },
  },
  outputs: { r: { type: "any" } },
  completionOutputs: ["r"],
  fn: function (inputs, outputs, adv) {
    const { str, from, to } = inputs;
    const { r } = outputs;

    r.next(str.replace(from, to));
  },
};
