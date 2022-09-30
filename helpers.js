const xlsx = require("node-xlsx");
const groupes = xlsx.parse(`${__dirname}/groupe.xlsx`);


const UENameToCM = {
    // S1
    "MATHS S1 :  Fondements 1" : "Mathématiques : Fondements (MF)",
    "MATHS S1 : Méthodes - approche continue" : "Méthodes",
    "MATHS S1 : Approfondissements 1" : "Mathématiques : Approfondissement (MA)",
    "ECUE MIASHS S1 : Macroéconomie 1" : "Economie Gestion",
    "INFO S1 : Bases de l'informatique" : "Bases de l'Informatique (BI)",
    "INFO S1 : Introduction à l'informatique par le web" : "Introduction à l'Informatique par le Web (IIW)",
    "CHIMIE S1 : Structure microscopique de la matière" : "Structure microscopique de la matière (SM)",
    "ELECTRONIQUE S1 : Electronique numérique - Bases" : "Electronique Numérique (EN)",
    "TERRE S1 : Découverte des sciences de la terre" : "Découverte Science de la Terre (ST)",
    "SPUC10": "Structure microscopique de la matière (SM)",
    "PHYSIQUE S1 : Mécanique 1": "Mécanique (M)",
    "SV-S1 : Org et mécan. moléculaires - cellules eucaryotes" : "Organisation et Mécanismes Moléculaires des Cellules Eucaryotes (OMM)",
    "SV-S1 : Génétique, évolution, origine vie & biodiversité" : "Génétique, Evolution (GE)",
    "Bases des Mathématiques - parcours aménagé": "Bases des Mathématiques",

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
    "KLSANS3" : "ANGLAIS",
    "Anglais-3 (SCIENCES)" : "ANGLAIS",
    "SPUM30" : "Maths : Fondements 3 (MF3)",
    "MATHS S3 : Fondements 3" : "Maths : Fondements 3 (MF3)",
    "SPUM31" : "Mathématiques Compléments d'Analyse (MCANA)",
    "MATHS S3 : Compléments d'analyse" : "Mathématiques Compléments d'Analyse (MCANA)",
    "MATHS S3 : Compléments d'algèbre" : "Compléments d'Algèbre (MCALG)",
    "MATHS S3 : Méthodes - approche géométrique" : "Méthodes Maths : Approche Géométrique (MMAG) ",
    "ECUE MIASHS S3 : Microéconomie 2" : "Microéconomie 2 (ME2)",
    "SPEA31" : "Economie bancaire",
    "SPEA32" : "Economie d'assurance",
    "SPUA31" : "Introduction R (R)",
    "MIASHS S3 : Introduction R" : "Introduction R (R)",
    "SPUF30" : "Structures de données et programmation C (SDC)",
    "INFO S3 : Structures de données et programmation C" : "Structures de données et programmation C (SDC)",
    "SPUF31" : "Bases de données (BD)",
    "INFO S3 : Bases de données" : "Bases de données (BD)",
    "SPUF32" : "Outils formels de l'Informatique (OF)",
    "INFO S3 : Outils formels de l'informatique" : "Outils formels de l'Informatique (OF)",
    "SPUSA301" : "Introduction à l'Intéliigence Artificielle (IIA)",
    "SCIENCES S3 : Inroduction à l'intélligenece artificielle" : "Introduction à l'Intéliigence Artificielle (IIA)",
    "SPUM33" : "Méthodes Maths pour l'Ingénierie (MMMI)",
    "MATHS S3 : Méthodes - mathématiques et ingénierie" : "Méthodes Maths pour l'Ingénierie (MMMI)",
    "SPUP30" : "Physique : Electromagnétisme 1",
    "PHYSIQUE S3 : Electromagnétisme 1" : "Physique : Electromagnétisme 1",
    "SPUP31" : "Thermodynamique 1 (TH)",
    "PHYSIQUE S3 : Thermodynamique 1" : "Thermodynamique 1 (TH)",
    "SPEP30" : "Physique : Outils et Méthodes 1",
    "PHYSIQUE S3 : Outils et méthodes 1" : "Physique : Outils et Méthodes 1",
    "SPUC30" : "Chimie des Solutions (CS)",
    "CHIMIE S3 : Chimie des solutions" : "Chimie des Solutions (CS)",
    "SPUC31" : "Chimie organique (CO)",
    "CHIMIE S3 : Chimie organique" : "Chimie organique (CO)",
    "SPUC32" : "Chimie Matériaux (CM)",
    "CHIMIE S3 : Matériaux 1" : "Chimie Matériaux (CM)",
    "SPUE30" : "Automatique : Une Introduction (AI)",
    "ELECTRONIQUE S3 : Automatique - introduction" : "Automatique : Une Introduction (AI)",
    "SPUE31" : "Systèmes embarquées (SE)",
    "ELECTRONIQUE S3 : Système embarqué" : "Systèmes embarquées (SE)",
    "SPUE32" : "Physique des capteurs (PC)",
    "ELECTRONIQUE S3 : Physique des capteurs" : "Physique des capteurs (PC)",
    "SPUT31" : "Le Temps en Géosciences",
    "TERRE S3 : Le temps en géosciences" : "Le Temps en Géosciences",
    "SPUT32" : "Physique de la Terre",
    "TERRE S3 : Physique de la Terre" : "Physique de la Terre",
    "SPUT34" : "Roches et Minéraux (RM)",
    "TERRE S3 : Roches et Minéraux" : "Roches et Minéraux (RM)",
    "SPEP31": "Physique : Méthodes et Mésures",
    "SPEC300": "Chimie Cinétique",
    "SPEC303": "Chimie organique (CO)",
    "SPEC307": "Chimie Inorganique",
    "SPEC309": "Polymères (CS)",
    "SPEV300" : "Physiologie Cellulaire Animale (PCA)",
    "SV : Physiologie animale" : "Physiologie Cellulaire Animale (PCA)",
    "SPEV301" : "Neuro ou Immuno",
    "SPEV303": "Organisation du Vivant Animal (OVA)",
    "SPEV304" : "Organisation du Vivant Végétal (OVV)",
    "SV : Mode d'organisation des végétaux et des animaux" : "",
};

const getGroupeList = (name) => {
    const ueName = Object.values(groupes[0].data[0]).map((ue, i) => [UENameToCM[ue.trim()], i]).filter((ue) => ue[0] !== undefined).find((ue) => ue[0] === name);

    if (!ueName) {
        return new Set()
    } else {
        return new Set(Object.values(groupes[0].data).map((data) => data[ueName[1]]).filter((data) => data !== undefined && data !== 0 && data.length <= 5))
    }
}

module.exports = {
    getGroupeList,
    UENameToCM,
}
