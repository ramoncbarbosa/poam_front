import { archive1 } from './db/archive1.js';
import { archive2 } from './db/archive2.js';

const rawArchives = [
    archive1,
    archive2
];

export const dbData = rawArchives.map((item, index) => ({
    ...item,
    id: index + 1,
    tipo: item.categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}));