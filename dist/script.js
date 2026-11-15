"use strict";
function ehHistoricoEtapa(valor) {
    if (typeof valor !== "object" || valor === null) {
        return false;
    }
    return ("etapa" in valor &&
        typeof valor.etapa === "string" &&
        ["enviada", "entrevista", "selecao", "finalizada"].includes(valor.etapa) &&
        "data" in valor &&
        typeof valor.data === "string" &&
        Number.isFinite(Date.parse(valor.data)));
}
function ehCandidatura(valor) {
    if (typeof valor !== "object" || valor === null) {
        return false;
    }
    return ("empresa" in valor &&
        typeof valor.empresa === "string" &&
        "cargo" in valor &&
        typeof valor.cargo === "string" &&
        "link" in valor &&
        typeof valor.link === "string" &&
        "data" in valor &&
        typeof valor.data === "string" &&
        "etapa" in valor &&
        typeof valor.etapa === "string" &&
        ["enviada", "entrevista", "selecao", "finalizada"].includes(valor.etapa) &&
        (!("historico" in valor) ||
            (Array.isArray(valor.historico) &&
                valor.historico.every(ehHistoricoEtapa))));
}
const elementoBusca = document.querySelector("#busca");
if (!(elementoBusca instanceof HTMLInputElement)) {
    throw new Error("Campo de busca não encontrado.");
}
const campoBusca = elementoBusca;
const elementoOrdenacao = document.querySelector("#ordenacao");
if (!(elementoOrdenacao instanceof HTMLSelectElement)) {
    throw new Error("Seletor de ordenação não encontrado.");
}
const campoOrdenacao = elementoOrdenacao;
const elementoMensagem = document.querySelector("#mensagem-vazia");
const elementoContador = document.querySelector("#contador-candidaturas");
const elementoTitulo = document.querySelector("#titulo-formulario");
if (!(elementoTitulo instanceof HTMLHeadingElement)) {
    throw new Error("Título do formulário não encontrado.");
}
const tituloFormulario = elementoTitulo;
if (!(elementoMensagem instanceof HTMLParagraphElement)) {
    throw new Error("Mensagem de lista vazia não encontrada.");
}
if (!(elementoContador instanceof HTMLParagraphElement)) {
    throw new Error("Contador de candidaturas não encontrado.");
}
const mensagemVazia = elementoMensagem;
const contadorCandidaturas = elementoContador;
const elementoFiltro = document.querySelector("#filtro-etapa");
if (!(elementoFiltro instanceof HTMLSelectElement)) {
    throw new Error("Filtro de etapa não encontrado.");
}
const filtroEtapa = elementoFiltro;
function carregarCandidaturas() {
    const texto = localStorage.getItem("candidaturas");
    if (texto === null) {
        return [];
    }
    try {
        const dados = JSON.parse(texto);
        if (!Array.isArray(dados) || !dados.every(ehCandidatura)) {
            throw new Error("Formato de candidaturas inválido.");
        }
        return dados;
    }
    catch (erro) {
        // Guarda uma cópia antes de iniciar uma lista vazia.
        localStorage.setItem("candidaturas-backup-" + Date.now(), texto);
        console.error("Erro ao carregar candidaturas:", erro);
        alert("Não foi possível carregar as candidaturas. " +
            "Uma cópia dos dados foi preservada neste navegador.");
        return [];
    }
}
const candidaturas = carregarCandidaturas();
let candidaturaEmEdicao = null;
const elementoFormulario = document.querySelector("#formulario");
if (!(elementoFormulario instanceof HTMLFormElement)) {
    throw new Error("Formulário não encontrado na página.");
}
const formulario = elementoFormulario;
const elementoEmpresa = document.querySelector("#empresa");
if (!(elementoEmpresa instanceof HTMLInputElement)) {
    throw new Error("Campo Empresa não encontrado.");
}
const campoEmpresa = elementoEmpresa;
const elementoCargo = document.querySelector("#cargo");
if (!(elementoCargo instanceof HTMLInputElement)) {
    throw new Error("Campo Cargo não encontrado.");
}
const campoCargo = elementoCargo;
const elementoLink = document.querySelector("#link");
if (!(elementoLink instanceof HTMLInputElement)) {
    throw new Error("Campo Link não encontrado.");
}
const campoLink = elementoLink;
const elementoData = document.querySelector("#data");
if (!(elementoData instanceof HTMLInputElement)) {
    throw new Error("Campo Data não encontrado.");
}
const campoData = elementoData;
const hoje = new Date();
const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, "0");
const dia = String(hoje.getDate()).padStart(2, "0");
campoData.max = `${ano}-${mes}-${dia}`;
const elementoEtapa = document.querySelector("#etapa");
if (!(elementoEtapa instanceof HTMLSelectElement)) {
    throw new Error("Campo Etapa não encontrado.");
}
const campoEtapa = elementoEtapa;
const elementoLista = document.querySelector("#lista-candidaturas");
if (!(elementoLista instanceof HTMLUListElement)) {
    throw new Error("Lista de candidaturas não encontrada.");
}
const lista = elementoLista;
const elementoSalvar = document.querySelector("#botao-salvar");
if (!(elementoSalvar instanceof HTMLButtonElement)) {
    throw new Error("Botão Salvar não encontrado.");
}
const botaoSalvar = elementoSalvar;
const elementoCancelar = document.querySelector("#botao-cancelar");
if (!(elementoCancelar instanceof HTMLButtonElement)) {
    throw new Error("Botão Cancelar não encontrado.");
}
const botaoCancelar = elementoCancelar;
function mostrarCandidatura(candidatura) {
    const dataFormatada = candidatura.data.split("-").reverse().join("/");
    const item = document.createElement("li");
    const empresa = document.createElement("h3");
    empresa.textContent = candidatura.empresa;
    const cargo = document.createElement("p");
    cargo.classList.add("candidatura-cargo");
    cargo.textContent = candidatura.cargo;
    const etiqueta = document.createElement("span");
    etiqueta.classList.add("etapa", "etapa-" + candidatura.etapa);
    const nomesEtapas = {
        enviada: "Enviada",
        entrevista: "Entrevista",
        selecao: "Seleção",
        finalizada: "Finalizada",
    };
    etiqueta.textContent = nomesEtapas[candidatura.etapa] ?? candidatura.etapa;
    const detalhes = document.createElement("p");
    detalhes.classList.add("candidatura-detalhes");
    detalhes.textContent = "Candidatura em " + dataFormatada;
    item.append(empresa, cargo, etiqueta, detalhes);
    if (candidatura.historico && candidatura.historico.length > 0) {
        const painelHistorico = document.createElement("details");
        painelHistorico.classList.add("candidatura-historico");
        const resumo = document.createElement("summary");
        resumo.textContent = "Histórico de etapas";
        painelHistorico.appendChild(resumo);
        candidatura.historico.forEach(function (registro) {
            const linha = document.createElement("p");
            const nomeEtapa = nomesEtapas[registro.etapa] ?? registro.etapa;
            const momento = new Date(registro.data).toLocaleString("pt-BR");
            linha.textContent = nomeEtapa + " — " + momento;
            painelHistorico.appendChild(linha);
        });
        item.appendChild(painelHistorico);
    }
    const acoes = document.createElement("div");
    acoes.classList.add("candidatura-acoes");
    if (candidatura.link) {
        const linkVaga = document.createElement("a");
        linkVaga.textContent = "Ver vaga";
        linkVaga.href = candidatura.link;
        linkVaga.target = "_blank";
        linkVaga.rel = "noopener noreferrer";
        acoes.appendChild(linkVaga);
    }
    const botaoEditar = document.createElement("button");
    botaoEditar.textContent = "Editar";
    botaoEditar.type = "button";
    botaoEditar.classList.add("botao-editar");
    botaoEditar.addEventListener("click", function () {
        candidaturaEmEdicao = candidatura;
        tituloFormulario.textContent = "Editar candidatura";
        botaoSalvar.textContent = "Salvar alterações";
        botaoCancelar.hidden = false;
        campoEmpresa.value = candidatura.empresa;
        campoCargo.value = candidatura.cargo;
        campoLink.value = candidatura.link;
        campoData.value = candidatura.data;
        campoEtapa.value = candidatura.etapa;
    });
    acoes.appendChild(botaoEditar);
    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.type = "button";
    botaoExcluir.classList.add("botao-excluir");
    botaoExcluir.addEventListener("click", function () {
        const indice = candidaturas.indexOf(candidatura);
        if (indice !== -1) {
            if (candidaturaEmEdicao === candidatura) {
                encerrarEdicao();
            }
            candidaturas.splice(indice, 1);
            localStorage.setItem("candidaturas", JSON.stringify(candidaturas));
            atualizarLista();
        }
    });
    acoes.appendChild(botaoExcluir);
    item.appendChild(acoes);
    lista.appendChild(item);
}
formulario.addEventListener("submit", function (event) {
    event.preventDefault();
    campoEmpresa.value = campoEmpresa.value.trim();
    campoCargo.value = campoCargo.value.trim();
    campoLink.value = campoLink.value.trim();
    if (!formulario.reportValidity()) {
        return;
    }
    const candidatura = {
        empresa: campoEmpresa.value,
        cargo: campoCargo.value,
        link: campoLink.value,
        data: campoData.value,
        etapa: campoEtapa.value,
    };
    const momento = new Date().toISOString();
    if (candidaturaEmEdicao !== null) {
        if (candidaturaEmEdicao.etapa !== candidatura.etapa) {
            if (!candidaturaEmEdicao.historico) {
                candidaturaEmEdicao.historico = [];
            }
            candidaturaEmEdicao.historico.push({
                etapa: candidatura.etapa,
                data: momento,
            });
        }
        Object.assign(candidaturaEmEdicao, candidatura);
    }
    else {
        candidatura.historico = [
            {
                etapa: candidatura.etapa,
                data: momento,
            },
        ];
        candidaturas.push(candidatura);
    }
    localStorage.setItem("candidaturas", JSON.stringify(candidaturas));
    atualizarLista();
    encerrarEdicao();
});
function atualizarLista() {
    lista.textContent = "";
    const termo = campoBusca.value.trim().toLocaleLowerCase("pt-BR");
    const candidaturasFiltradas = candidaturas.filter(function (candidatura) {
        const correspondeBusca = candidatura.empresa.toLocaleLowerCase("pt-BR").includes(termo) ||
            candidatura.cargo.toLocaleLowerCase("pt-BR").includes(termo);
        const correspondeEtapa = filtroEtapa.value === "todas" || candidatura.etapa === filtroEtapa.value;
        return correspondeBusca && correspondeEtapa;
    });
    candidaturasFiltradas.sort(function (a, b) {
        if (campoOrdenacao.value === "antigas") {
            return a.data.localeCompare(b.data);
        }
        return b.data.localeCompare(a.data);
    });
    candidaturasFiltradas.forEach(function (candidatura) {
        mostrarCandidatura(candidatura);
    });
    const quantidade = candidaturasFiltradas.length;
    mensagemVazia.hidden = quantidade > 0;
    contadorCandidaturas.textContent =
        quantidade === 1
            ? "1 candidatura exibida"
            : quantidade + " candidaturas exibidas";
}
function encerrarEdicao() {
    candidaturaEmEdicao = null;
    formulario.reset();
    tituloFormulario.textContent = "Nova candidatura";
    botaoSalvar.textContent = "Cadastrar candidatura";
    botaoCancelar.hidden = true;
}
filtroEtapa.addEventListener("change", function () {
    atualizarLista();
});
botaoCancelar.addEventListener("click", function () {
    encerrarEdicao();
});
campoBusca.addEventListener("input", function () {
    atualizarLista();
});
campoOrdenacao.addEventListener("change", function () {
    atualizarLista();
});
const elementoExportar = document.querySelector("#botao-exportar");
if (!(elementoExportar instanceof HTMLButtonElement)) {
    throw new Error("Botão Exportar não encontrado.");
}
elementoExportar.addEventListener("click", function () {
    const conteudo = JSON.stringify(candidaturas, null, 2);
    const arquivo = new Blob([conteudo], {
        type: "application/json",
    });
    const endereco = URL.createObjectURL(arquivo);
    const linkDownload = document.createElement("a");
    linkDownload.href = endereco;
    linkDownload.download = "candidaturas.json";
    document.body.appendChild(linkDownload);
    linkDownload.click();
    linkDownload.remove();
    setTimeout(function () {
        URL.revokeObjectURL(endereco);
    }, 1000);
});
const elementoImportar = document.querySelector("#arquivo-importar");
if (!(elementoImportar instanceof HTMLInputElement)) {
    throw new Error("Campo de importação não encontrado.");
}
const campoImportar = elementoImportar;
campoImportar.addEventListener("change", async function () {
    const arquivo = campoImportar.files?.[0];
    if (!arquivo) {
        return;
    }
    try {
        const texto = await arquivo.text();
        const dados = JSON.parse(texto);
        if (!Array.isArray(dados) || !dados.every(ehCandidatura)) {
            throw new Error("O arquivo não contém uma lista válida de candidaturas.");
        }
        const importadas = dados;
        const confirmar = window.confirm(`Importar ${importadas.length} candidaturas? ` +
            "Elas serão adicionadas às existentes.");
        if (!confirmar) {
            return;
        }
        const listaAtualizada = candidaturas.concat(importadas);
        // Salva antes de modificar a lista exibida.
        localStorage.setItem("candidaturas", JSON.stringify(listaAtualizada));
        importadas.forEach(function (candidatura) {
            candidaturas.push(candidatura);
        });
        encerrarEdicao();
        atualizarLista();
        alert("Candidaturas importadas com sucesso!");
    }
    catch (erro) {
        console.error("Erro na importação:", erro);
        alert("Não foi possível importar. Confira se o arquivo é um JSON " +
            "de candidaturas válido e se o navegador permite salvar dados.");
    }
    finally {
        campoImportar.value = "";
    }
});
atualizarLista();
//# sourceMappingURL=script.js.map