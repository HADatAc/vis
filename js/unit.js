const container = document.getElementById("rdf-grafo");
const data = { nodes, edges };
const options = {
  layout: { improvedLayout: true },
  physics: {
    enabled: true,
    solver: "forceAtlas2Based",
    forceAtlas2Based: {
      gravitationalConstant: -50,
      centralGravity: 0.005,
      springLength: 180,
      springConstant: 0.04,
      damping: 0.4
    },
    maxVelocity: 50,
    stabilization: {
      iterations: 100,
      updateInterval: 10
    }
  },
  edges: {
    arrows: "to",
    font: {
      align: "top",
      color: "#000",
      size: 16,
      strokeWidth: 4,
      strokeColor: "#fff"
    },
    width: 2
  },
  interaction: {
    hover: true,
    tooltipDelay: 200
  }
};

const network = new vis.Network(container, data, options);
network.setOptions({ physics: { enabled: true } });
network.stabilize();

const infoBox = document.getElementById("info-box");

network.on("click", function (params) {
  if (params.nodes.length > 0) {
    const selectedNode = params.nodes[0];
    showNodeDetails(selectedNode);
  }
});

function showNodeDetails(nodeId) {
    const desc = tooltipMap[nodeId] || "<strong>" + nodeId + "</strong>";
    const entradas = triplas.filter(([s, p, o]) => o === nodeId);
    const saidas = triplas.filter(([s, p, o]) => s === nodeId);
    let html = `<h3>🔍 <code>${nodeId}</code></h3><p>${desc}</p>`;
  
    // 🔁 ENTRADAS
    html += "<h4 style='margin-top:20px;'>🔁 Entrando</h4>";
    if (entradas.length > 0) {
      const entradaSet = new Set();
      html += "<div style='display: flex; flex-direction: column; gap: 8px;'>";
      entradas.forEach(([s, p]) => {
        const key = (p === 'tem instancia') ? `${s}-eh-${nodeId}` : `${s}-${p}-${nodeId}`;
        if (!entradaSet.has(key)) {
          entradaSet.add(key);
          html += `
            <div style="display:flex; align-items:center; justify-content:space-between; gap: 10px; background:#f1f1f1; border-left: 4px solid #339af0; padding: 8px 12px; border-radius: 6px;">
              <div><strong>${p}</strong> de <code>${s}</code></div>
              <div>
                <button onclick="focusAndExpand('${s}', '${p}', '${nodeId}')" style="margin-right:4px;">➕</button>
                <button onclick="collapseSingle('${s}', '${p}', '${nodeId}')">➖</button>
              </div>
            </div>`;
        }
      });
      html += "</div>";
    } else {
      html += "<p><em>Nenhuma entrada.</em></p>";
    }
  
    // ➡️ SAÍDAS
    html += "<h4 style='margin-top:20px;'>➡️ Saindo</h4>";
    if (saidas.length > 0) {
      const saidaSet = new Set();
      html += "<div style='display: flex; flex-direction: column; gap: 8px;'>";
      saidas.forEach(([s, p, o]) => {
        const key = (p === 'eh') ? `${o}-tem instancia-${s}` : `${s}-${p}-${o}`;
        if (!saidaSet.has(key)) {
          saidaSet.add(key);
          html += `
            <div style="display:flex; align-items:center; justify-content:space-between; gap: 10px; background:#fffbe6; border-left: 4px solid #fab005; padding: 8px 12px; border-radius: 6px;">
              <div><strong>${p}</strong> para <code>${o}</code></div>
              <div>
                <button onclick="focusAndExpand('${s}', '${p}', '${o}')" style="margin-right:4px;">➕</button>
                <button onclick="collapseSingle('${s}', '${p}', '${o}')">➖</button>
              </div>
            </div>`;
        }
      });
      html += "</div>";
    } else {
      html += "<p><em>Nenhuma saída.</em></p>";
    }
  
    infoBox.innerHTML = html;
  }
  
function carregarPessoa() {
  const select = document.getElementById("selectPessoa");
  const pessoa = select.value;

  if (!pessoa) {
    alert("Por favor, selecione uma pessoa.");
    return;
  }

  addNode(pessoa);
  showNodeDetails(pessoa);

  network.selectNodes([pessoa]);
  network.focus(pessoa, {
    scale: 1.2,
    animation: {
      duration: 500,
      easingFunction: "easeInOutQuad"
    }
  });

  // Esconde o botão de carregar e mostra o de esconder tudo
document.getElementById("carregar-bloco").style.display = "none";
document.getElementById("esconder-bloco").style.display = "block";

}

function esconderTudo() {
  edgesSet.forEach(edgeId => {
    const [s, p, o] = edgeId.split("-");
    collapse(s, p);
  });

  nodes.getIds().forEach(id => {
    nodes.remove({ id });
    nodesSet.delete(id);
  });

  infoBox.innerHTML = "";

  // Mostrar novamente o botão "Carregar pessoa" e esconder o "Esconder tudo"
document.getElementById("carregar-bloco").style.display = "flex";
document.getElementById("esconder-bloco").style.display = "none";

}

function focusAndExpand(s, p, o) {
  addNode(s);
  addNode(o);

  const edgeId = `${s}-${p}-${o}`;
  if (!edgesSet.has(edgeId)) {
    edgesSet.add(edgeId);

    const sameDirection = Array.from(edgesSet).filter(id =>
      id.startsWith(`${s}-`) && id.endsWith(`-${o}`)
    );
    const curved = sameDirection.length % 2 === 0 ? "curvedCW" : "curvedCCW";
    const roundness = sameDirection.length * 0.2;

    const predColors = {
      "eh": "#2b8a3e",
      "ama": "#d6336c",
      "conhece": "#6741d9",
      "tem instancia": "#4263eb",
      "default": "#444"
    };
    const color = predColors[p] || predColors["default"];

    edges.add({
      id: edgeId,
      from: s,
      to: o,
      label: p,
      arrows: "to",
      color: { color: color, opacity: 0.75 },
      font: {
        align: "top",
        color: "#000",
        size: 16,
        strokeWidth: 4,
        strokeColor: "#fff"
      },
      width: 2,
      smooth: { type: curved, roundness: roundness }
    });
  }

  showNodeDetails(o);
  network.selectNodes([o]);
  network.focus(o, {
    scale: 1.2,
    animation: {
      duration: 500,
      easingFunction: "easeInOutQuad"
    }
  });
}
function collapseSingle(sujeito, predicado, objeto) {
    const edgeId = `${sujeito}-${predicado}-${objeto}`;
    edges.remove({ id: edgeId });
    edgesSet.delete(edgeId);
  
    // Remove o nó destino se não estiver conectado a mais nada
    const stillConnected = Array.from(edgesSet).some(eid =>
      eid.includes(`-${objeto}`) || eid.startsWith(`${objeto}-`)
    );
    if (!stillConnected) {
      nodes.remove({ id: objeto });
      nodesSet.delete(objeto);
    }
  
    // Atualiza o painel lateral do sujeito original
    showNodeDetails(sujeito);
  }
  