import { z } from "zod";
import { PartDefRepo, PartStyle } from ".";
import { CustomPart, VisualPart, CodePart, Part, PartDefinition } from "./part";

const importSchema = z.record(z.string(), z.string().or(z.array(z.string())));
const position = z.strictObject({ x: z.number(), y: z.number() });

const inputConfig = z.discriminatedUnion("mode", [
  z.strictObject({
    mode: z.literal("static"),
    value: z.any(),
  }),
  z.strictObject({
    mode: z.literal("queue"),
  }),
  z.strictObject({
    mode: z.literal("sticky"),
  }),
]);

const partStyle = z.object({
  size: z.optional(z.enum(["small", "regular", "large"])),
  icon: z.optional(z.any()),
  color: z.optional(z.string()),
  cssOverride: z.optional(z.record(z.string())),
});

const instance = z
  .object({
    pos: position.default({ x: 0, y: 0 }),
    id: z.string(),
    inputConfig: z.optional(z.record(z.string(), inputConfig)).default({}),
    visibleInputs: z.optional(z.array(z.string())),
    visibleOutputs: z.optional(z.array(z.string())),
    partId: z.optional(z.string()),
    part: z.optional(z.any()),
    style: z.optional(partStyle),
  })
  .refine((val) => val.part || val.partId, {
    message: "Instance must have either an inline part or refer to a partId",
  });

const inputPinSchema = z.union([
  z.string(),
  z.object({
    mode: z.enum(["required", "optional", "required-if-connected"]),
    type: z.string(),
    description: z.optional(z.string()),
    defaultValue: z.optional(z.any()),
  }),
]);

const outputPinSchema = z.object({
  type: z.string(),
  optional: z.optional(z.boolean()),
  delayed: z.optional(z.boolean()),
  description: z.optional(z.string()),
});

const flydeBasePart = z.object({
  id: z.optional(z.string()),
  inputs: z.record(z.string(), inputPinSchema),
  outputs: z.record(z.string(), outputPinSchema),
  inputsPosition: z.optional(z.record(z.string(), position)),
  outputsPosition: z.optional(z.record(z.string(), position)),
  customViewCode: z.optional(z.string()),
  dataBuilderSource: z.optional(z.string()),
  templateType: z.optional(z.string()),
  completionOutputs: z.optional(z.array(z.string())),
  reactiveInputs: z.optional(z.array(z.string())),
  defaultStyle: z.optional(partStyle),
  description: z.optional(z.string()),
});

const visualPart = z
  .object({
    instances: z.array(instance),
    connections: z.array(
      z.strictObject({
        from: z.strictObject({ insId: z.string(), pinId: z.string() }),
        to: z.strictObject({ insId: z.string(), pinId: z.string() }),
        delayed: z.optional(z.boolean()),
        hidden: z.optional(z.boolean()),
      })
    ),
  })
  .and(flydeBasePart);

export type FlydeFlow = {
  imports?: Record<string, String[]>;
  part: VisualPart;
};

export type ImportedPartDefinition = PartDefinition & {
  importPath: string;
};

export type ImportedPart = Part & {
  importPath: string;
};

export type ImportedPartDef = PartDefinition & {
  importPath: string;
};

export type ResolvedFlydeFlowDefinition = {
  main: VisualPart;
  dependencies: Record<string, ImportedPartDefinition>;
};

export type ResolvedFlydeRuntimeFlow = {
  main: VisualPart;
  dependencies: Record<string, ImportedPart>;
};

export type ResolvedFlydeFlow =
  | ResolvedFlydeFlowDefinition
  | ResolvedFlydeRuntimeFlow;

export const flydeFlowSchema = z.strictObject({
  imports: z.optional(importSchema).default({}),
  part: visualPart,
});
