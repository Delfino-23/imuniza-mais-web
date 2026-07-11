export function formatarCPF(cpf) {
    if (!cpf) return "";

    // Remove tudo que não é dígito
    cpf = cpf.replace(/\D/g, "");

    console.log(cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"));
    // Aplica a máscara e retorna
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatarTelefone(telefone) {
    if (!telefone) return "";

    // Remove tudo o que não for número
    const apenasNumeros = telefone.replace(/\D/g, "");

    // Se o usuário digitou até 11 caracteres (DDD + 9 dígitos)
    if (apenasNumeros.length <= 10) {
        // Formato Fixo: (11) 4567-8901
        return apenasNumeros
            .replace(/^(\d{2})(\d)/g, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
        // Formato Celular: (11) 94567-8901
        return apenasNumeros
            .replace(/^(\d{2})(\d)/g, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .substring(0, 15); // Limita o tamanho máximo do caractere visualizado
    }
}