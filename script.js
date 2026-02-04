let dados = {
    atributos: [],
    combate: [],
    pericias: [],
    habilidades: []
};

let nivelAtual = 1;

function irParaTela(n) {
    document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
    document.getElementById("tela" + n).classList.add("ativa");
    if (n === 3) carregarFicha();
}

/* IMAGEM */
imagemInput.addEventListener("change", e => {
    const reader = new FileReader();
    reader.onload = () => {
        previewImagem.src = reader.result;
        fotoFinal.src = reader.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

/* ===== FASE 2 ===== */
function addItem(tipo) {
    const campos = {
        atributos: ['attrNome','attrValor'],
        combate: ['combNome','combValor'],
        pericias: ['periNome','periValor']
    };

    const nome = document.getElementById(campos[tipo][0]).value;
    const valor = parseInt(document.getElementById(campos[tipo][1]).value);

    if (!nome) return;

    dados[tipo].push({ nome, valor });
    atualizarLista(tipo);
}

function addHabilidade() {
    dados.habilidades.push({
        nome: habNome.value,
        efeito: habEfeito.value
    });
    atualizarLista('habilidades');
}

function atualizarLista(tipo) {
    const mapas = {
        atributos: listaAtributos,
        combate: listaCombate,
        pericias: listaPericias,
        habilidades: listaHabilidades
    };

    mapas[tipo].innerHTML = '';
    dados[tipo].forEach(i => {
        const li = document.createElement("li");
        li.textContent = tipo === 'habilidades'
            ? `${i.nome} – ${i.efeito}`
            : `${i.nome}: ${i.valor}`;
        mapas[tipo].appendChild(li);
    });
}

/* ===== FASE 3 ===== */
function carregarFicha() {
    fichaNome.textContent = nome.value;
    fichaClasse.textContent = classe.value;
    historiaFinal.textContent = historia.value;
    nivelAtual = parseInt(nivel.value);
    nivelFinal.textContent = nivelAtual;

    renderValores('atributos', finalAtributos);
    renderValores('combate', finalCombate);
    renderValores('pericias', finalPericias);
    renderHabilidades();
}

function renderValores(tipo, ul) {
    ul.innerHTML = '';
    dados[tipo].forEach((i, index) => {
        const li = document.createElement("li");
        li.className = 'valor-editavel';
        li.innerHTML = `
            ${i.nome}: ${i.valor}
            <button onclick="alterarValor('${tipo}',${index},-1)">−</button>
            <button onclick="alterarValor('${tipo}',${index},1)">+</button>
        `;
        ul.appendChild(li);
    });
}

function alterarValor(tipo, index, delta) {
    dados[tipo][index].valor += delta;
    carregarFicha();
}

/* HABILIDADES */
function renderHabilidades() {
    finalHabilidades.innerHTML = '';
    dados.habilidades.forEach(h => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${h.nome}</strong>: ${h.efeito}`;
        finalHabilidades.appendChild(li);
    });
}

/* NÍVEL */
function alterarNivel(delta) {
    nivelAtual += delta;
    if (nivelAtual < 1) nivelAtual = 1;
    nivelFinal.textContent = nivelAtual;
}

/* BOTÃO + */
botaoMais.onclick = () => {
    menuMais.style.display = menuMais.style.display === 'block' ? 'none' : 'block';
};

function addExtra(tipo) {
    const nome = prompt("Nome:");
    const valor = parseInt(prompt("Valor:"));
    if (!nome || isNaN(valor)) return;

    dados[tipo].push({ nome, valor });
    carregarFicha();
    menuMais.style.display = 'none';
}

function addExtraHabilidade() {
    const nome = prompt("Nome da habilidade:");
    const efeito = prompt("Efeito:");
    if (!nome || !efeito) return;

    dados.habilidades.push({ nome, efeito });
    carregarFicha();
    menuMais.style.display = 'none';
}

function addInventario() {
    const item = prompt("Item do inventário:");
    if (item) {
        const li = document.createElement("li");
        li.innerHTML = `${item} <button onclick="this.parentElement.remove()">❌</button>`;
        inventarioLista.appendChild(li);
    }
    menuMais.style.display = 'none';
}

function toggleInspiracao() {
    inspiracao.style.display =
        inspiracao.style.display === 'none' ? 'block' : 'none';
    menuMais.style.display = 'none';
}
function salvarFicha() {
    const ficha = {
        nome: nome.value,
        classe: classe.value,
        nivel: nivelAtual,
        historia: historia.value,
        atributos: dados.atributos,
        combate: dados.combate,
        pericias: dados.pericias,
        habilidades: dados.habilidades,
        inventario: inventarioLista.innerHTML,
        inspiracao: inspiracao.style.display === 'block',
        imagem: fotoFinal.src
    };

    localStorage.setItem("fichaRPG", JSON.stringify(ficha));
    alert("Ficha salva com sucesso!");
}

function carregarFichaSalva() {
    const ficha = JSON.parse(localStorage.getItem("fichaRPG"));
    if (!ficha) {
        alert("Nenhuma ficha salva encontrada.");
        return;
    }

    nome.value = ficha.nome;
    classe.value = ficha.classe;
    nivelAtual = ficha.nivel;
    nivelFinal.textContent = ficha.nivel;
    historia.value = ficha.historia;

    dados.atributos = ficha.atributos;
    dados.combate = ficha.combate;
    dados.pericias = ficha.pericias;
    dados.habilidades = ficha.habilidades;

    inventarioLista.innerHTML = ficha.inventario;
    inspiracao.style.display = ficha.inspiracao ? 'block' : 'none';

    if (ficha.imagem) {
        fotoFinal.src = ficha.imagem;
        previewImagem.src = ficha.imagem;
    }

    carregarFicha();
}
