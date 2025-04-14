const tooltipMap = {
    "pedro": "🧍 <strong>Pedro</strong><br>Instância da classe Pessoa.",
    "rita": "🧍 <strong>Rita</strong><br>Instância da classe Pessoa.",
    "jorge": "🧍 <strong>Jorge</strong><br>Instância da classe Pessoa.",
    "pessoa": "👤 <strong>Pessoa</strong><br>Classe abstrata representando indivíduos."
  };
  
  const nodesSet = new Set();
  const edgesSet = new Set();
  const nodes = new vis.DataSet();
  const edges = new vis.DataSet();
  
  function addNode(id) {
    if (nodesSet.has(id)) return;
    let label = id.charAt(0).toUpperCase() + id.slice(1);
    let icon = "", shape = "box";
    let color = {
      background: "#e0f7ff",
      border: "#007acc",
      highlight: { background: "#d0ebff", border: "#1c7ed6" },
      hover: { background: "#f1faff", border: "#339af0" }
    };
    if (id === "pessoa") {
      icon = "👤 "; shape = "ellipse";
      color = { background: "#f5f5f5", border: "#999" };
    } else if (id === "pedro" || id === "rita") {
      icon = "🧍 ";
    }
    nodes.add({
      id,
      label: icon + label,
      shape,
      color,
      font: { color: "#000", size: 16 }
    });
    nodesSet.add(id);
  }
  
  function expand(sujeito, predicado) {
    const predColors = {
      "eh": "#2b8a3e",
      "ama": "#d6336c",
      "conhece": "#6741d9",
      "default": "#444"
    };
    const color = predColors[predicado] || predColors["default"];
  
    triplas.forEach(([s, p, o]) => {
      if (s === sujeito && p === predicado) {
        if (!nodesSet.has(o)) addNode(o);
        const edgeId = `${s}-${p}-${o}`;
        if (!edgesSet.has(edgeId)) {
          edgesSet.add(edgeId);
  
          const sameDirection = Array.from(edgesSet).filter(id =>
            id.startsWith(`${s}-`) && id.endsWith(`-${o}`)
          );
  
          const curved = sameDirection.length % 2 === 0 ? "curvedCW" : "curvedCCW";
          const roundness = sameDirection.length * 0.2;
  
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
      }
    });
  }
  
  function collapse(sujeito, predicado) {
    triplas.forEach(([s, p, o]) => {
      if (s === sujeito && p === predicado) {
        const edgeId = `${s}-${p}-${o}`;
        edges.remove({ id: edgeId });
        edgesSet.delete(edgeId);
        const stillConnected = Array.from(edgesSet).some(eid =>
          eid.includes(`-${o}`) || eid.startsWith(`${o}-`)
        );
        if (!stillConnected) {
          nodes.remove({ id: o });
          nodesSet.delete(o);
        }
      }
    });
  }
  
  function styleButton(btn, bg) {
    btn.style.background = bg;
    btn.style.border = "1px solid #ccc";
    btn.style.borderRadius = "6px";
    btn.style.padding = "8px 12px";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "1px 1px 3px rgba(0,0,0,0.1)";
    btn.style.fontSize = "14px";
    btn.style.transition = "all 0.2s ease";
    btn.onmouseenter = () => btn.style.transform = "scale(1.05)";
    btn.onmouseleave = () => btn.style.transform = "scale(1)";
  }
  