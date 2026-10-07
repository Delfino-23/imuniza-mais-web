import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

/**
 * Auxiliar para formatar CPF caso venha apenas em dígitos
 */
const formatarCPF = (cpf) => {
    if (!cpf) return 'Não informado';
    const limpo = String(cpf).replace(/\D/g, '');
    if (limpo.length !== 11) return cpf; // Retorna original se já estiver formatado ou inválido
    return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Auxiliar para formatar Telefone caso venha apenas em dígitos
 */
const formatarTelefone = (tel) => {
    if (!tel) return 'Não informado';
    const limpo = String(tel).replace(/\D/g, '');
    if (limpo.length === 11) {
        return limpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (limpo.length === 10) {
        return limpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return tel; // Retorna original se já tiver máscara
};

/**
 * Mapeia os dados exatamente como na tabela do PDF:
 * [PACIENTE | CPF | DATA DE NASCIMENTO | TELEFONE]
 */
const formatarDadosPacientesIdenticoPdf = (listaCompleta) => {
    const lista = Array.isArray(listaCompleta)
        ? listaCompleta
        : listaCompleta?.pacientes || listaCompleta?.data || [];

    return lista.map((p) => {
        // Tratamento da Data de Nascimento
        const rawDataNasc = p.data_nascimento || p.dataNascimento;
        let nascimentoFormatado = 'Não informado';

        if (rawDataNasc) {
            const dataPura = typeof rawDataNasc === 'string' ? rawDataNasc.split('T')[0] : rawDataNasc;
            const [ano, mes, dia] = dataPura.split('-');
            nascimentoFormatado = (ano && mes && dia)
                ? `${dia}/${mes}/${ano}`
                : new Date(rawDataNasc).toLocaleDateString('pt-BR');
        }

        return {
            'PACIENTE': p.nome || p.nome_completo || 'Não informado',
            'CPF': formatarCPF(p.cpf),
            'DATA DE NASCIMENTO': nascimentoFormatado,
            'TELEFONE': formatarTelefone(p.telefone || p.celular)
        };
    });
};

/**
 * Exporta para Excel (.xlsx) no mesmo padrão do PDF
 */
export const exportarParaExcel = (listaCompleta) => {
    const dadosFormatados = formatarDadosPacientesIdenticoPdf(listaCompleta);

    const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);

    // Ajuste de largura das 4 colunas
    worksheet['!cols'] = [
        { wch: 25 }, // PACIENTE
        { wch: 18 }, // CPF
        { wch: 22 }, // DATA DE NASCIMENTO
        { wch: 18 }  // TELEFONE
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pacientes Cadastrados");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, `Pacientes_Cadastrados_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

/**
 * Exporta para CSV (.csv) no mesmo padrão do PDF
 */
export const exportarParaCsv = (listaCompleta) => {
    const dadosFormatados = formatarDadosPacientesIdenticoPdf(listaCompleta);

    const csv = Papa.unparse(dadosFormatados, { delimiter: ';' });

    // '\ufeff' para manter o enconding correto dos acentos no Excel
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });

    saveAs(blob, `Pacientes_Cadastrados_${new Date().toISOString().slice(0, 10)}.csv`);
};