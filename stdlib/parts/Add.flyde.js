module.exports = {
  id: "Add",
  inputs: { n1: { mode: "required", type: "any" }, n2: { mode: "required", type: "any" } },
  outputs: { r: { type: "any" } },
  customViewCode:
    '<%= isDefined(inputs.n1) ? inputs.n1 : "n1" %> + <%= isDefined(inputs.n2) ? inputs.n2 : "n2" %>',
  completionOutputs: ["r"],
  fn: function (inputs, outputs, adv) {
    const { n1, n2 } = inputs;
    const { r } = outputs;

    r.next(n1 + n2);
  }
};