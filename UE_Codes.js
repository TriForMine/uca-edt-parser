const amphis = new Set();
const tds = new Set();
const tps = new Set();
const parenthesesRegex = /\(([^)]+)\)/;
const abbrToName = {
    'EM': 'Physique : Electromagnétisme 1',
    'OM/EM': 'Physique : Outils Mathématiques',
    'OM': 'Physique : Outils Mathématiques',
    'PT': 'Physique de la Terre',
    'RM/RT': 'Roches et Minéraux',
    '(BD)': 'Bases de données (BD)',
    '(PF)': 'Programmation Fonctionnelle (PF)',
    '(SE)': 'Systèmes embarquées (SE)',
    'Systèmes embarqués (SE)': 'Systèmes embarquées (SE)',
    '(OF)': 'Outils formels de l\'Informatique (OF)',
    'Physique : Electromagnétisme 1': 'Physique : Electromagnétisme 1',
    'Physique : Outils Mathématiques': 'Physique : Outils Mathématiques',
    'Physique de la Terre': 'Physique de la Terre',
    'TG': 'Science de la Terre : Le Temps en Géosciences',
    'Bases': 'Bases des Mathématiques'
};

function generateAbbrFromEdt(edt) {
    for (const day of Object.values(edt)) {
        for (const hour of Object.values(day)) {
            for (let i = 0; i < hour.length; i++) {
                switch (hour[i].type) {
                    case 'CM':
                        amphis.add(hour[i].name);
                        const abbr = parenthesesRegex.exec(hour[i].name)?.[1]
                        if (abbr) {
                            abbrToName[abbr] = hour[i].name;
                            abbrToName[abbr.replace(/[0-9]/g, '')] = hour[i].name;
                        } else {
                            if (require.main === module) {
                                console.log("Can't find abbr for", hour[i].name);
                            }
                        }
                        break;
                    case 'TD':
                        tds.add(hour[i].name);
                        break;
                    case 'TP':
                        tps.add(hour[i].name);
                        break;
                }
            }
        }
    }

    return abbrToName
}

// Debug mode if the file is started directly
if (require.main === module) {
    const edt = require('./parsed.json')
    generateAbbrFromEdt(edt);

    tds.forEach((td) => {
        const name = abbrToName[td] ?? abbrToName[parenthesesRegex.exec(td)?.[1]]
        if (!name) {
            console.log("Can't find CM for TD " + td)
        }
    })

    tps.forEach((tp) => {
        const name = abbrToName[tp] ?? abbrToName[parenthesesRegex.exec(tp)?.[1]]
        if (!name) {
            console.log("Can't find CM for TP " + tp)
        }
    })
}

module.exports = generateAbbrFromEdt
