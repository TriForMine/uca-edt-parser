const xlsx = require('node-xlsx').default;
const fs = require('fs');

const edt = xlsx.parse(`${__dirname}/edt.xlsx`);

const data = edt[0].data;
const parsed = {'Lundi': {}, 'Mardi': {}, 'Mercredi': {}, 'Jeudi': {}, 'Vendredi': {}};
let currentDay = undefined;
const hourRegex = /[0-9]+h\s[0-9]+\s-\s[0-9]+h\s[0-9]+/i;
const groupRegex = /Gr\s?[A-Z0-9]+/ig;
const clearGroupRegex = /\(Gr\s?[A-Z0-9]+\)/ig;
const salleRegex = /(salle|amphi)\s[a-zA-Z0-9]+/ig

data.forEach((item, index) => {
    let duration = undefined;
    if (item.length === 0) return;

    item.forEach((subItem, subIndex) => {
        if (parsed[subItem] !== undefined) {
            currentDay = subItem;
        } else if (hourRegex.test(subItem) && currentDay) {
            duration = subItem;
            if (parsed[currentDay][duration] === undefined) {
                parsed[currentDay][duration] = [];
            }
        } else if (duration && subItem !== null && currentDay) {
            let unparsedOther = subItem.split('\n').splice(1)?.join(' ').replaceAll('\r', '').trim()
            const name = subItem.split('\n')[0].replaceAll('\r', '').trim()
            let parsedName
            let type = undefined

            const group = unparsedOther ? [...unparsedOther?.matchAll(groupRegex)].map((data) => data[0].replaceAll('Gr ', '').replaceAll('Gr', '')) : []
            unparsedOther = unparsedOther?.replaceAll(clearGroupRegex, '').trim()
            if (unparsedOther === '')
                unparsedOther = undefined

            if (name.startsWith('TD ')) {
                parsedName = name.replaceAll('TD ', '')
                type = 'TD'
            } else if (name.startsWith('TP ')) {
                parsedName = name.replaceAll('TP ', '')
                type = 'TP'
            } else {
                parsedName = name;
                type = 'CM'
            }

            const salle = unparsedOther?.matchAll(salleRegex)
            const cleanedSalle = salle ? [...salle].map((data) => data[0].replaceAll('salles', '').replaceAll('salle', '').trim()) : undefined

            for (let i = 0; i < group.length; i++) {
                parsed[currentDay][duration].push({
                    name: parsedName,
                    type,
                    salle: cleanedSalle?.[i],
                    group: group[i],
                    unparsed: subItem
                })
            }
        }
    });
})

fs.writeFileSync('parsed.json', JSON.stringify(parsed));
