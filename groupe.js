const xlsx = require('node-xlsx').default;
const fs = require('fs');

const edt = xlsx.parse(`${__dirname}/groupe.xlsx`);

const data = edt[0].data;

const UE = data[0].splice(4).map((item) => item.trim());

const parsed = {};

data.forEach((item, index) => {
    if (index === 0) return; // Skip header

    const numETU = item[1]
    const result = {}

    for (let i = 4; i < item.length; i++) {
        if (item[i] !== 0) {
            if (typeof item[i] === "string") {
                if (item[i].startsWith('G') && item[i].length === 2) {
                    result[UE[i - 4]] = item[i].replaceAll('G', '').trim()
                } else {
                    result[UE[i - 4]] = item[i].replaceAll('A_G', '').replaceAll('B_G', '').trim()
                }
            } else {
                result[UE[i - 4]] = item[i].toString().trim()
            }
        }
    }

    parsed[numETU] = result
})

fs.writeFileSync('parsedGroupe.json', JSON.stringify(parsed));
