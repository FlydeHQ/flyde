

const { isCodePart, keys, isGroupedPart, isInlinePartInstance, isRefPartInstance, flydeFlowSchema } = require('@flyde/core');
const { deserializeFlow, serializeFlow } = require('@flyde/runtime');
const res = require('@flyde/runtime');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const files = 
    fs.readdirSync('./parts')
    .filter(f => f.endsWith('.flyde'))

for (const f of files) {

    const flowPath = path.join('./parts', f);

    const d = yaml.parse(fs.readFileSync(flowPath, 'utf8'));

    console.log('processindg', f);
    const {imports, parts} = d;

    if (parts) {

        const [firstId, ...more] = Object.keys(parts);
        if (more.length > 0) {
            throw 'oops more than 1'
        }

        const firstPart = parts[firstId];

        if (!isGroupedPart(firstPart)) {
            throw 'wat';
        }

        const deps = Array.from(new Set(firstPart.instances.filter(i => isRefPartInstance(i)).map(i => i.partId)));
        console.log({deps});

        const imports = deps.reduce((acc ,curr) => {
            return {...acc, [`./${curr}.flyde`]: curr}
        }, {});
        
        const complete = {
            imports,
            part: firstPart
        }

        const {success} = flydeFlowSchema.safeParse(complete);

        if (!success) {
            throw 'failed validation ' + file;
        }

        const flow = serializeFlow(complete);

        fs.writeFileSync('./parts/' + firstPart.id + '.flyde', flow, 'utf-8');

        // const neededImports = 
    }

    // console.log({imports});


    // const deser = deserializeFlow(fs.readFileSync(flowPath, 'utf-8'), flowPath);

    // const firstPart = deser.parts[Object.keys(deser.parts)[0]];

    // if (isCodePart(firstPart)) {
    //     if (Object.keys(deser.parts) > 1) {
    //         throw new Error('many parts in ' + f)
    //     }

    //     const {fnCode, ...part} = firstPart;

    //     part.fn = "__FN_HERE__"

    //     const partStr = JSON.stringify(part).replace('"__FN_HERE__"', `function (inputs, outputs, adv) { ${fnCode} }`);

    //     const template = `module.exports = ${partStr}`

    //     fs.writeFileSync('./parts/' + firstPart.id + '.flyde.js', template, 'utf-8');
    //     fs.rmSync(flowPath)
    // }
    // console.log(deser);
}



// console.log({files});