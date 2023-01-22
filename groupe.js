const xlsx = require('node-xlsx').default;
const fs = require('fs');

const edt = xlsx.parse(`${__dirname}/groupe_l2.xlsx`);
const {UENameToCM} = require('./helpers');

const data = edt[0].data;

const UE = data[0].splice(4).map((item) => item.trim());

const SEMESTRE = 3;

// Uncomment this line to get the list of UE for UENameToCM.
//console.log(UE.map((v) => `"${v}" : ""`).join(',\n'));

UE.forEach((ue, i) => {
    if (UENameToCM[ue]) {
        UE[i] = UENameToCM[ue].trim()
    } else {
        console.warn('\x1b[33m', `Could not find the CM name for: ${ue}`, "\x1b[0m");
    }
});

const parsed = {};

data.forEach((item, index) => {
    if (index === 0) return; // Skip header

    let numETU
    if (data[0][0] === 'NUM_ETU' || data[0][0] === 'COD_ETU' || data[0][0] === 'Numéro étudiant' || data[0][0] === 'Num Etu') {
        numETU = item[0]
    } else if (data[0][1] === 'NUM_ETU' || data[0][1] === 'COD_ETU' || data[0][1] === 'Numéro étudiant' || data[0][1] === 'Num Etu') {
        numETU = item[1]
    } else if (data[0][2] === 'NUM_ETU' || data[0][2] === 'COD_ETU' || data[0][2] === 'Numéro étudiant' || data[0][2] === 'Num Etu') {
        numETU = item[2]
    } else if (data[0][3] === 'NUM_ETU' || data[0][3] === 'COD_ETU' || data[0][3] === 'Numéro étudiant' || data[0][3] === 'Num Etu') {
        numETU = item[3]
    } else {
        console.error('NUM_ETU/COD_ETU not found')
        process.exit(1)
    }
    const result = {}

    for (let i = 4; i < item.length; i++) {
        if (item[i] !== 0) {
            if (typeof item[i] === "string") {
                if (item[i].startsWith('G') && item[i].length <= 3) {
                    if (UE[i - 4] === "Economie Gestion") {
                        result['Culture Economie'] = item[i].replaceAll('G', '').trim()
                        result['Introduction à l\'Analyse d\'Economie'] = item[i].replaceAll('G', '').trim()
                    } else {
                        result[UE[i - 4]] = item[i].replaceAll('G', '').trim()
                    }
                } else {
                    const separateTP = item[i].split(' / ')
                    if (separateTP.length === 2) {
                        const  groups = [...item[i].matchAll(/G([0-9]{1,2}) \/ TP G?([0-9]{1,2})/gi)]
                        result[UE[i - 4]] = groups[0][1]
                        result[UE[i - 4] + ' - TP'] = groups[0][2]
                    } else {
                        result[UE[i - 4]] = item[i].replaceAll('_G', '').replaceAll('_G', '').replaceAll('_G', '').replaceAll('D_G', '').trim()
                    }
                }
            } else {
                result[UE[i - 4]] = item[i].toString().trim()
            }
        }
    }

    if (item[0] === "SPMAI1") {
        result['Bases de données (BD)'] = '1'
    } else if (item[0] === "SPMAI2") {
        result['Programmation fonctionelle (PF)'] = '1'
    }

    parsed[numETU] = result
})

if (SEMESTRE === 3) {
    parsed['22206932']['Economie d\'assurance'] = '0'
}

if (SEMESTRE === 1) {
    delete parsed['22203319']['Culture Economie']
    parsed['22206302']['Electronique Numérique (EN)'] = '5'
}

fs.writeFileSync('parsedGroupe.json', JSON.stringify(parsed));
