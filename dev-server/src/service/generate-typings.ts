import { FlydeFlow, GroupedPart, keys, PartDefinition } from "@flyde/core"
import { Corrupt } from "../setup-flows-watcher";

import * as ejs from 'ejs';
import { readFileSync } from "fs";
import { join } from "path";

const RUNTIME_MODULE_NAME = '@flyde/runtime';

export type LocatedFlowOrCorrupt = {
    relativePath: string,
    flow: FlydeFlow | Corrupt,
    fileName: string;
}

export const generateTypings = (locatedFlows: LocatedFlowOrCorrupt[]) => {
    const template = readFileSync(join(__dirname, '../../src/service/typings.template.ejs'), 'utf8');
    return ejs.render(template, {locatedFlows, MODULE_NAME: RUNTIME_MODULE_NAME});
}