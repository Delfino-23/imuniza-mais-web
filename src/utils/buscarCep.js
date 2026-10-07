export const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) return null;

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            alert("CEP não encontrado.")
            return;
        }

        return {
            logradouro: dados.logradouro || '',
            bairro: dados.bairro || '',
            cidade: dados.localidade || '',
            uf: dados.uf || ''
        }
    } catch (e) {
        console.error("Erro ao buscar o CEP: ", e);
        return null;
    }
}