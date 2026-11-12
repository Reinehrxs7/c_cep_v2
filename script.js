const selectedUf = document.getElementById('uf');
const inputCidade = document.getElementById('cidade');
const inputRua = document.getElementById('rua');

const btnBuscar = document.getElementById('btnBuscar');
const divMensagem = document.getElementById('mensagem');
const divResultado = document.getElementById('resultado');

const containerLista = document.getElementById('listaResultados');

//add eventos
btnBuscar.addEventListener('click', buscaEndereco);

[selectedUf, inputCidade, inputRua].forEach(campo => {
    campo.addEventListener('keypress', (tecla) =>{
        if(tecla.key === 'Enter'){
            buscarEndereco();
        }
    });
});

async function buscaEndereco() {
    const valorUf = selectedUf.value.trim();
    const valorCidade = inputCidade.value.trim();
    const valorRua = inputCidade.value.trim();
    
    esconderElemento(divMensagem);
    esconderElemento(divResultado);
    containerLista.innerHTML = '';

    if(!valorUf){
        mostrarMensagem('Por favor, selecione o Estado (UF).','erro');
        selectedUf.focus();
        return;
    }

    if(valorCidade.length < 3){
        mostrarMensagem('Por favor, informe a Cidade com no minímo 3 caracteres','erro');
        inputCidade;focus();
        return;
    }

    if(valorRua.length < 3){
        mostrarMensagem('Por favor, informe a Rua com no minímo 3 caracteres', 'erro');
        inputRua.focus();
        return;
    }

    mostrarMensagem('Buscando informações do CEP...', 'info');

    try {

    const cidadeFormatada = encodeURIComponent(valorCidade);
    const ruaFormatada = encodeURIComponent(valorRua);


    const url = `https://viacep.com.br/ws/${valorUf}/${cidadeFormatada}/${ruaFormatada}/json/`;

    const resposta = await fetch(url);

    if(!resposta.ok) {
       throw new Error(`Falha na requisição. Código de status: ${resposta.status}`);
    }

    const enderecos = await resposta.json();
    //se nada for encontrado, a api devolve uma lista vazia
    if(!Array.isArray(enderecos) || enderecos.length === 0){
        mostrarMensagem('Nenhum CEP/endereço encontrado para os dados informados.', 'erro');
        return;
    }

    enderecos.forEach((itemEndereco) => {
        const card= document.createElement('div');
        card.className = 'item-endereco';

        card.innerHTML = `
            <p class="destaque-cep">📮CEP: ${itemEndereco.cep}</p>
            <p><strong>Logradouro:</strong> ${itemEndereco.logradouro || 'Não informado'}</p>
            <p><strong>Bairro:</strong> ${itemEndereco.bairro || 'Não informado'}</p>
            <p><strong>Cidade/UF:</strong> ${itemEndereco.localidade} - ${itemEndereco.uf}</p>
            <p><strong>Complemento:</strong> ${itemEndereco.complemento ? itemEndereco.complemento: 'Nenhum'}</p>
        `;
        containerLista.appendChild(card);
    });

    esconderElemento(divMensagem);
    divResultado.classList.remove('oculto');

  } catch (erro) {
        console.error('Erro na requisição:', erro);
        mostrarMensagem('Ocorreu um erro ao buscar o CEP. Tente novamente mais tarde.', 'erro');
  }

} 
//funcoes auxuliares
function mostrarMensagem(texto, tipo) {
    divMensagem.textContent = texto;
    divMensagem.className = `mensagem ${tipo}`;
}
 
function esconderElemento(elemento) {
    elemento.classList.add('oculto'); 
}
