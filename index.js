const xlsx = require('node-xlsx').default;
const fs = require('fs');

const generateAbbrFromEdt = require('./UE_Codes');
const {getGroupeList} = require("./helpers");

const edt = xlsx.parse(`${__dirname}/edt.xlsx`);

const data = edt[0].data;
const parsed = {'Lundi': {}, 'Mardi': {}, 'Mercredi': {}, 'Jeudi': {}, 'Vendredi': {}};
let currentDay = undefined;
const hourRegex = /[0-9]+h?\s?[0-9]+\s?-\s?[0-9]+h?\s?[0-9]+/i;
const groupRegex = /Gr\s?[A-Z0-9]+/ig;
const clearGroupRegex = /\(Gr\s?[A-Z0-9]+\)/ig;
const salleRegex = /(salle|amphi)\s[a-zA-Z0-9]+/ig
const parenthesesRegex = /\(([^)]+)\)/ig;
const startRegex = /début ([^)]+)\)/ig;
const endRegex = /fin ([^)]+)\)/ig;

const SEMESTER = 3;

data.forEach((item) => {
    let horaires = undefined;
    if (item.length === 0) return;

    item.forEach((subItem, i) => {
        if (parsed[subItem] !== undefined) {
            currentDay = subItem;
        } else if (hourRegex.test(subItem.replaceAll('  ', '').trim()) && currentDay && i <= 3) {

            horaires = subItem.replaceAll('  ', '').trim();
            if (parsed[currentDay][horaires] === undefined) {
                parsed[currentDay][horaires] = [];
            }
        } else if (horaires && subItem !== null && currentDay) {
            let unparsedOther = subItem.split('\n').splice(1)?.join(' ').replaceAll('\r', '').trim()
            const name = subItem.split('\n')[0].replaceAll('\r', '').trim()
            let parsedName
            let type

            let group = unparsedOther ? [...unparsedOther?.matchAll(groupRegex)].map((data) => data[0].replaceAll('Gr ', '').replaceAll('Gr', '')) : []

            unparsedOther = unparsedOther?.replaceAll(clearGroupRegex, '').trim()
            if (unparsedOther === '')
                unparsedOther = undefined

            if (name.startsWith('TD ')) {
                parsedName = name.replaceAll('TD ', '').trim()
                type = 'TD'
            } else if (name.startsWith('TP ')) {
                parsedName = name.replaceAll('TP ', '').trim()
                type = 'TP'
            } else if (name.startsWith('TD/TP')) {
                parsedName = name.replaceAll('TD/TP', '').trim()
                type = 'TD/TP'
            } else {
                parsedName = name;
                type = 'CM'
            }

            const salle = unparsedOther?.matchAll(salleRegex)
            const cleanedSalle = salle ? [...salle].map((data) => data[0].replaceAll('salles', '').replaceAll('salle', '').trim()) : undefined

            let currentHoraires = horaires

            if (parsedName.match(startRegex)) {
                const end = currentHoraires.split('-')?.[1].trim()
                const start = startRegex.exec(parsedName)?.[1].trim().split(' ').join('h ')

                parsedName = parsedName.replaceAll(parenthesesRegex, '').trim()

                currentHoraires = `${start} - ${end}`
                if (!parsed[currentDay][currentHoraires]) {
                    parsed[currentDay][currentHoraires] = []
                }
            }

            if (parsedName.match(endRegex)) {
                const end = endRegex.exec(parsedName)?.[1].trim().split(' ').join('h ')
                const start = currentHoraires.split('-')?.[0].trim()

                parsedName = parsedName.replaceAll(parenthesesRegex, '').trim()

                currentHoraires = `${start} - ${end}`
                if (!parsed[currentDay][currentHoraires]) {
                    parsed[currentDay][currentHoraires] = []
                }
            }

            if (subItem.includes('Economie d\'assurance')) {
                parsedName = 'Economie d\'assurance'
            } else if (subItem.includes('Economie bancaire')) {
                parsedName = 'Economie bancaire'
            } else if (subItem.includes('Culture Economie')) {
                parsedName = 'Culture Economie'
            } else if (subItem.includes('Introduction à l\'Analyse d\'Economie')) {
                parsedName = 'Introduction à l\'Analyse d\'Economie'
            }

            if (type === "CM" && group.length > 0 && !group.includes('1') && name !== "ANGLAIS") {
                const groupes = getGroupeList(parsedName)

                const tempGroupes = group
                group = [...groupes.values()].filter((groupe) => tempGroupes.find((tempGroupe) => groupe.startsWith(tempGroupe))).map((groupe) => groupe.replaceAll('_G', ''))
            }

            if (group.length > 0) {
                for (let i = 0; i < group.length; i++) {
                    parsed[currentDay][currentHoraires].push({
                        name: parsedName,
                        type,
                        salle: cleanedSalle?.[i],
                        group: group[i],
                        unparsed: subItem
                    })
                }
            } else {
                parsed[currentDay][currentHoraires].push({
                    name: parsedName,
                    type,
                    salle: cleanedSalle?.[0],
                    unparsed: subItem
                })
            }
        }
    });
})

const abbr = generateAbbrFromEdt(parsed);

// Convert TD/TP name to the CM name
Object.entries(parsed).forEach(([day]) => {
    Object.entries(parsed[day]).forEach(([hour]) => {
        Object.entries(parsed[day][hour]).forEach(([cours, value]) => {
            if (value.type !== 'CM') {
                if (abbr[value.name]) {
                    parsed[day][hour][cours] = {...value, name: abbr[value.name]}
                } else if (value.type !== 'CM' && !Object.values(abbr).includes(value.name) && value.name !== 'Physique' && value.name !== 'Chimie') {
                    console.log(value)
                }
            }
        })
    })
});

if (SEMESTER === 3) {
    parsed['Mercredi']['13h 15 - 15h 15'].push({
        name: 'Programmation fonctionelle (PF)',
        type: 'TD',
        salle: 'M11',
        group: '1',
        unparsed: 'TD Programmation fonctionelle (PF)\n\nM11'
    })
    parsed['Mercredi']['15h 30 - 17h 30'].push({
        name: 'Programmation fonctionelle (PF)',
        type: 'TP',
        salle: 'PV 301',
        group: '1',
        unparsed: 'TP Programmation fonctionelle (PF)\n\nPV 301'
    })
}

fs.writeFileSync('parsed.json', JSON.stringify(parsed));
