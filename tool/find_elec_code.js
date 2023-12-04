function find_elec_code(name) {
    switch (name) {
        case '대통령선거':
            return 1;
        case '국회의원선거':
            return 2;
        case '시·도지사선거':
            return 3;
        case '구·시·군의장선거':
            return 4;
        case '시·도의회의원선거':
            return 5;
        case '구·시·군의회의원선거':
            return 6;
        case '비례대표국회의원선거':
            return 7;
        case '광역의원비례대표선거':
            return 8;
        case '기초의원비례대표선거':
            return 9;
        case '교육의원선거':
            return 10;
        case '교육감선거':
            return 11;
    }
}

module.exports = { find_elec_code };