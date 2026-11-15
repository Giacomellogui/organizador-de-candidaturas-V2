interface Candidatura {
  empresa: string;
  cargo: string;
  link: string;
  data: string;
  etapa: string;
}

const elementoMensagem = document.querySelector("#mensagem-vazia");
const elementoContador = document.querySelector("#contador-candidaturas");
const elementoTitulo = document.querySelector("#titulo-formulario");

if (!(elementoTitulo instanceof HTMLHeadingElement)) {
  throw new Error("Título do formulário não encontrado.");
}

const tituloFormulario: HTMLHeadingElement = elementoTitulo;

if (!(elementoMensagem instanceof HTMLParagraphElement)) {
  throw new Error("Mensagem de lista vazia não encontrada.");
}

if (!(elementoContador instanceof HTMLParagraphElement)) {
  throw new Error("Contador de candidaturas não encontrado.");
}

const mensagemVazia: HTMLParagraphElement = elementoMensagem;
const contadorCandidaturas: HTMLParagraphElement = elementoContador;

const elementoFiltro = document.querySelector("#filtro-etapa");

if (!(elementoFiltro instanceof HTMLSelectElement)) {
  throw new Error("Filtro de etapa não encontrado.");
}

const filtroEtapa: HTMLSelectElement = elementoFiltro;

const candidaturas: Candidatura[] = JSON.parse(
  localStorage.getItem("candidaturas") || "[]",
);

let candidaturaEmEdicao: Candidatura | null = null;

const elementoFormulario = document.querySelector("#formulario");

if (!(elementoFormulario instanceof HTMLFormElement)) {
  throw new Error("Formulário não encontrado na página.");
}

const formulario: HTMLFormElement = elementoFormulario;

const elementoEmpresa = document.querySelector("#empresa");

if (!(elementoEmpresa instanceof HTMLInputElement)) {
  throw new Error("Campo Empresa não encontrado.");
}

const campoEmpresa: HTMLInputElement = elementoEmpresa;

const elementoCargo = document.querySelector("#cargo");

if (!(elementoCargo instanceof HTMLInputElement)) {
  throw new Error("Campo Cargo não encontrado.");
}

const campoCargo: HTMLInputElement = elementoCargo;

const elementoLink = document.querySelector("#link");

if (!(elementoLink instanceof HTMLInputElement)) {
  throw new Error("Campo Link não encontrado.");
}

const campoLink: HTMLInputElement = elementoLink;

const elementoData = document.querySelector("#data");

if (!(elementoData instanceof HTMLInputElement)) {
  throw new Error("Campo Data não encontrado.");
}

const campoData: HTMLInputElement = elementoData;

const elementoEtapa = document.querySelector("#etapa");

if (!(elementoEtapa instanceof HTMLSelectElement)) {
  throw new Error("Campo Etapa não encontrado.");
}

const campoEtapa: HTMLSelectElement = elementoEtapa;

const elementoLista = document.querySelector("#lista-candidaturas");

if (!(elementoLista instanceof HTMLUListElement)) {
  throw new Error("Lista de candidaturas não encontrada.");
}

const lista: HTMLUListElement = elementoLista;

const elementoSalvar = document.querySelector("#botao-salvar");

if (!(elementoSalvar instanceof HTMLButtonElement)) {
  throw new Error("Botão Salvar não encontrado.");
}

const botaoSalvar: HTMLButtonElement = elementoSalvar;

const elementoCancelar = document.querySelector("#botao-cancelar");

if (!(elementoCancelar instanceof HTMLButtonElement)) {
  throw new Error("Botão Cancelar não encontrado.");
}

const botaoCancelar: HTMLButtonElement = elementoCancelar;

function mostrarCandidatura(candidatura: Candidatura): void {
  const dataFormatada = candidatura.data.split("-").reverse().join("/");
  const item = document.createElement("li");

  const empresa = document.createElement("h3");
  empresa.textContent = candidatura.empresa;

  const cargo = document.createElement("p");
  cargo.classList.add("candidatura-cargo");
  cargo.textContent = candidatura.cargo;

  const etiqueta = document.createElement("span");
  etiqueta.classList.add("etapa", "etapa-" + candidatura.etapa);

  const nomesEtapas: Record<string, string> = {
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

  const candidatura: Candidatura = {
    empresa: campoEmpresa.value,
    cargo: campoCargo.value,
    link: campoLink.value,
    data: campoData.value,
    etapa: campoEtapa.value,
  };

  if (candidaturaEmEdicao !== null) {
    Object.assign(candidaturaEmEdicao, candidatura);
  } else {
    candidaturas.push(candidatura);
  }

  localStorage.setItem("candidaturas", JSON.stringify(candidaturas));
  atualizarLista();
  encerrarEdicao();
});

function atualizarLista(): void {
  lista.textContent = "";

  candidaturas.forEach(function (candidatura) {
    if (
      filtroEtapa.value === "todas" ||
      candidatura.etapa === filtroEtapa.value
    ) {
      mostrarCandidatura(candidatura);
    }
  });

  const quantidade = lista.children.length;

  mensagemVazia.hidden = quantidade > 0;

  if (quantidade === 1) {
    contadorCandidaturas.textContent = "1 candidatura exibida";
  } else {
    contadorCandidaturas.textContent = quantidade + " candidaturas exibidas";
  }
}

function encerrarEdicao(): void {
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

atualizarLista();
