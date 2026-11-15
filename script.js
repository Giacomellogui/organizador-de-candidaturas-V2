const formulario = document.querySelector("#formulario");
const candidaturas = JSON.parse(localStorage.getItem("candidaturas") || "[]");
const lista = document.querySelector("#lista-candidaturas");
const filtroEtapa = document.querySelector("#filtro-etapa");
const botaoSalvar = document.querySelector("#botao-salvar");
const botaoCancelar = document.querySelector("#botao-cancelar");
const mensagemVazia = document.querySelector("#mensagem-vazia");
const contadorCandidaturas = document.querySelector("#contador-candidaturas");

let candidaturaEmEdicao = null;

formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  const empresa = document.querySelector("#empresa").value;
  const cargo = document.querySelector("#cargo").value;
  const link = document.querySelector("#link").value;
  const data = document.querySelector("#data").value;
  const etapa = document.querySelector("#etapa").value;

  const candidatura = {
    empresa: empresa,
    cargo: cargo,
    link: link,
    data: data,
    etapa: etapa,
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

function mostrarCandidatura(candidatura) {
  const dataFormatada = candidatura.data.split("-").reverse().join("/");

  const item = document.createElement("li");
  item.textContent =
    candidatura.empresa +
    " — " +
    candidatura.cargo +
    " — " +
    candidatura.etapa +
    " — " +
    dataFormatada;

  if (candidatura.link) {
    const linkVaga = document.createElement("a");
    linkVaga.textContent = " ver vaga ";
    linkVaga.href = candidatura.link;
    linkVaga.target = "_blank";
    linkVaga.rel = "noopener noreferrer";
    item.appendChild(linkVaga);
  }

  const botaoEditar = document.createElement("button");
  botaoEditar.textContent = "Editar";
  botaoEditar.type = "button";

  botaoEditar.addEventListener("click", function () {
    candidaturaEmEdicao = candidatura;
    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelar.hidden = false;

    document.querySelector("#empresa").value = candidatura.empresa;
    document.querySelector("#cargo").value = candidatura.cargo;
    document.querySelector("#link").value = candidatura.link;
    document.querySelector("#data").value = candidatura.data;
    document.querySelector("#etapa").value = candidatura.etapa;
  });

  item.appendChild(botaoEditar);

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

  item.appendChild(botaoExcluir);
  lista.appendChild(item);
}

function atualizarLista() {
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
    contadorCandidaturas.textContent =
      quantidade + " candidaturas exibidas";
  }
}

function encerrarEdicao() {
  candidaturaEmEdicao = null;
  formulario.reset();
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
