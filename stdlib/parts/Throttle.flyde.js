module.exports = {
  id: "Throttle",
  inputs: {
    value: { mode: "required", type: "any" },
    threshold: { mode: "required", type: "any" },
  },
  outputs: { result: { type: "any" }, available: { type: "any" } },
  customViewCode:
    "<% if (inputs.threshold) { %> Throttle  <%- inputs.threshold %>ms <% } else { %> Throttle <% } %>",
  completionOutputs: ["available"],
  reactiveInputs: ["value"],
  fn: function (inputs, outputs, adv) {
    const { value, threshold } = inputs;
    const { result, available } = outputs;

    if (!adv.state.get("locked")) {
      adv.state.set("locked", true);
      result.next(value);
      const timer = setTimeout(() => {
        available.next(true);
      }, threshold);
      adv.onCleanup(() => clearTimeout(timer));
    } else {
      adv.onError(new Error(`Throttled. Try again later`));
    }
  },
};
