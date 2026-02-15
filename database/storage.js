import { filesInFolder } from './files.js';

async function parseFileData(fileName) {
    try {
        // CORREÇÃO: Usando caminho relativo para funcionar no GitHub Pages
        const response = await fetch(`./data/${fileName}`);
        if (!response.ok) throw new Error(`404: ${fileName}`);

        const text = await response.text();
        const lines = text.split('\n').filter(l => l.trim() !== "");

        const getValue = (line) => {
            if (!line) return "";
            const separator = line.includes(';') ? ';' : ',';
            const parts = line.split(separator);
            return parts.slice(1).join(separator).trim();
        };

        return {
            id: null,
            titulo: getValue(lines[0]),
            categoria: getValue(lines[1]),
            responsavel: getValue(lines[2]),
            data: getValue(lines[3]),
            citacao: getValue(lines[4]),
            descricao: getValue(lines[5]),
            resumoCompleto: getValue(lines[6]),
            rawRows: lines.slice(7),
            tipo: getValue(lines[1]).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")
        };
    } catch (error) {
        console.error("Erro ao processar arquivo:", error);
        return null;
    }
}

export const dbData = await Promise.all(
    filesInFolder.map(async (file, index) => {
        try {
            const parsed = await parseFileData(file);
            if (parsed) {
                parsed.id = index + 1;
                return parsed;
            }
            return null;
        } catch (e) { return null; }
    })
).then(data => {
    const validData = data.filter(d => d !== null);
    return validData.sort((a, b) => new Date(b.data) - new Date(a.data));
}).catch(err => []);