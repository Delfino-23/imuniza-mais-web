import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

const formatarDados = (listaCompleta, vacinas = []) => {
    return listaCompleta.map((a) => {
        const vacinaRelacionada = Array.isArray(vacinas)
            ? vacinas.find((v) => v.id === a.vacinaId)
            : null;

        const rawData = a.data_aplicacao || a.data;

        return {
            'Paciente': a.Paciente?.nome || a.paciente_nome || a.paciente || 'Não informado',
            'Vacina': a.Vacina?.nome || a.vacina_nome || a.vacina || vacinaRelacionada?.nome || 'Não informada',
            'Lote': a.lote || a.Vacina?.lote || a.vacina_lote || vacinaRelacionada?.lote || '-',
            'Dose': a.dose || '-',
            'Profissional': a.profissional_responsavel || a.profissional || '-',
            'Data da Aplicação': rawData ? new Date(rawData).toLocaleDateString('pt-BR') : '-'
        };
    });
}

export const exportarParaExcel = (listaCompleta, vacinas = []) => {
    const dadosFormatados = formatarDados(listaCompleta, vacinas);

    const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Aplicações");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Historico_Aplicacoes_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export const exportarParaCsv = (listaCompleta, vacinas = []) => {
    const dadosFormatados = formatarDados(listaCompleta, vacinas);

    const csv = Papa.unparse(dadosFormatados, { delimiter: ';' });
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `Historico_Aplicacoes_${new Date().toISOString().slice(0, 10)}.csv`);
}