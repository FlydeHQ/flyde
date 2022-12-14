module.exports = {
  id: "Equals",
  inputs: {
    val: { mode: "required", type: "any" },
    compare: { mode: "required", type: "any" },
    transform: { mode: "required-if-connected", type: "any" },
  },
  outputs: { true: { type: "any" }, false: { type: "any" } },
  customViewCode: `<% if (typeof inputs.compare !== 'undefined') { %>Equals "<%- inputs.compare %>" <% } else { %> Equals <% } %>`,
  completionOutputs: ["r", "else"],
  fn: function (inputs, outputs, adv) {
    const { val, compare, transform } = inputs;
    const { true: t, false: f } = outputs;

    const valueToPush = typeof transform !== "undefined" ? transform : val;

    // magic here
    if (val === compare) {
      t.next(valueToPush);
    } else {
      f.next(valueToPush);
    }
  },
};
