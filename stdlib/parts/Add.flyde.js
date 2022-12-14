module.exports = {
  id: "Add",
  inputs: { n1: { mode: "required", type: "any" }, n2: { mode: "required", type: "any" } },
  outputs: { sum: { type: "any" } },
  customViewCode:
    '<%= typeof inputs.n1 !== "undefined" ? inputs.n1 : "n1" %> + <%= typeof inputs.n2 !== "undefined" ? inputs.n2 : "n2" %>',
  completionOutputs: ["sum"],
  fn: function (inputs, outputs, adv) {
    const { n1, n2 } = inputs;
    const { sum } = outputs;

    sum.next(n1 + n2);
  },
};
