const xlsx = require('node-xlsx').default;
const fs = require('fs');

const edt = xlsx.parse(`${__dirname}/groupe.xlsx`);

const data = edt[0].data;

const UE = data[0].splice(4).map((item) => item.trim());


// Uncomment this line to get the list of UE for UENameToCM.
//console.log(UE.map((v) => `"${v}" : ""`).join(',\n'));

const UENameToCM = {
    // S1
    "MATHS S1 :  Fondements 1" : "Mathématiques : Fondements (MF)",
    "MATHS S1 : Méthodes - approche continue" : "Méthodes",
    "MATHS S1 : Approfondissements 1" : "Mathématiques : Approfondissement (MA)",
    "MIASHS S1 : Economie-gestion S1" : "Economie Gestion",
    "INFO S1 : Bases de l'informatique" : "Bases de l'Informatique (BI)",
    "INFO S1 : Introduction à l'informatique par le web" : "Introduction à l'Informatique par le Web (IIW)",
    "PHYSIQUE S1 : Mécanique 1" : "Mécanique (M)",
    "CHIMIE S1 : Structure microscopique de la matière" : "Structure microscopique de la matière (SM)",
    "ELECTRONIQUE S1 : Electronique numérique - Bases" : "Electronique Numérique (EN)",
    "TERRE S1 : Découverte des sciences de la terre" : "Découverte Science de la Terre (ST)",
    "SV-S1 : Org et mécan. moléculaires - cellules eucaryotes" : "Organisation et Mécanismes Moléculaires des Cellules Eucaryotes (OMM)",
    "SV-S1 : Génétique, évolution, origine vie & biodiversité" : "Génétique, Evolution (GE)",

    // S2
    "MATHS S2 :  Fondements 2" : "Mathématiques fondements (MF)",
    "MATHS S2 : Méthodes -Approche discrète" : "Approche Aléatoire (MMAA)",
    "MATHS S2 : Approfondissements 2" : "Mathématiques Approfondissements (MA)",
    "ECUE MIASHS S2 : Microéconomie 1" : "Microéconomie (EGE)",
    "ECUE MIASHS S2 : Economie d'entreprise 1" : "Economie d'entreprise",
    "ECUE MIASHS S2 : Economie de l'information" : "Economie de l'information",
    "INFO S2 : Système 1 unix et programmation shell" : "Système 1",
    "INFO S2 : Programmation impérative" : "Programmation Impérative (PI)",
    "PHYSIQUE S2 : Optique" : "Physique - Optique (PH-O)",
    "PHYSIQUE S2 : Mécanique 2" : "Physique - Mécanique approfondie (PH-MA)",
    "CHIMIE S2 : Réactions et réactivités chimiques" : "Chimie - Réactions et Réactivités Chimiques (CH-RRC)",
    "CHIMIE S2 : Thermodynamique chimique / Options" : "Chimie - Thermodynamique Chimique",
    "ELECTRONIQUE S2 : Electronique analogique" : "ELECTRONIQUE ANALOGIQUE (EA)",
    "ELECTRONIQUE S2 : Communication sans fil" : "Electronique - Communication sans Fils (CSF)",
    "TERRE S2 : Structure et dynamique de la terre" : "Structure et Dynamique de la Terre (SDT)",
    "TERRE S2 : Atmosphère, océan, climats" : "Atmosphère, Océans, Climat (AOC)",
    "SV S2 : Physiologie - neurologie - enzymologie" : "PHYNEM (A)",
    "SV S2 : Diversité du vivant" : "Diversité du Vivant (DV)",

    // S3,

};

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
    if (data[0][0] === 'NUM_ETU' || data[0][0] === 'COD_ETU') {
        numETU = item[0]
    } else if (data[0][1] === 'NUM_ETU' || data[0][1] === 'COD_ETU') {
        numETU = item[1]
    } else if (data[0][2] === 'NUM_ETU' || data[0][2] === 'COD_ETU') {
        numETU = item[2]
    } else {
        console.error('NUM_ETU/COD_ETU not found')
        process.exit(1)
    }
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
