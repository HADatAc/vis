<?php

namespace Drupal\vis\Controller;

use Drupal\Core\Controller\ControllerBase;

class viscontroller extends ControllerBase {

  public function display() {
    $knowledgePath = \Drupal::root() . '/modules/custom/vis/src/Controller/knowledgebase.php';
    $knowledge = include $knowledgePath;

    $triplas = [];

    foreach ($knowledge as $lista) {
      foreach ($lista as $tripla) {
        $triplas[] = $tripla;

        // Equivalência entre "eh" e "tem instancia"
        list($s, $p, $o) = $tripla;
        if ($p === 'eh') {
          $triplas[] = [$o, 'tem instancia', $s];
        }
        if ($p === 'tem instancia') {
          $triplas[] = [$s, 'eh', $o];
        }
      }
    }

    $json_triplas = json_encode($triplas, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    $html = <<<HTML
<div style="font-family: Arial, sans-serif; max-width: 1200px; margin: 40px auto; padding: 20px;">
  <h2 style="text-align: center;">🌐 Grafo RDF – Visual Interativo</h2>
  <p style="text-align: center;">Clique em um nó para ver os predicados. Explore as relações abaixo 👇</p>

  <!-- ✅ Bloco de botões no topo -->
  <div style="display: flex; justify-content: flex-start; align-items: center; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">

    <!-- 🔘 Carregar pessoa (visível só no início) -->
    <div id="carregar-bloco" style="display: flex; align-items: center; gap: 8px;">
      <label for="selectPessoa" style="font-weight: bold;"><span style="font-size: 18px;">👤</span> Carregar pessoa:</label>
      <select id="selectPessoa" style="padding: 8px 10px; border-radius: 6px; border: 1px solid #ccc;">
        <option value="" disabled selected>Selecione...</option>
        <option value="pedro">Pedro</option>
        <option value="rita">Rita</option>
        <option value="jorge">Jorge</option>
        <option value="pessoa">Pessoa</option>
      </select>
      <button onclick="carregarPessoa()" style="background:#d3f9d8; padding: 8px 12px; border:1px solid #69db7c; border-radius:6px; cursor:pointer;">
        ➕ Carregar
      </button>
    </div>

    <!-- ❌ Esconder tudo (inicialmente escondido) -->
    <div id="esconder-bloco" style="display: none;">
      <button onclick="esconderTudo()" style="background:#ffe3e3; padding: 10px 16px; border:1px solid #ff6b6b; border-radius:8px; font-weight: bold; cursor:pointer;">
        ❌ Esconder tudo
      </button>
    </div>

  </div>

  <!-- 🔧 Grafo + painel lateral -->
  <div style="display: flex; gap: 20px;">
    <div style="flex: 3;">
      <div id="rdf-grafo" style="width: 100%; height: 550px; border: 1px solid #ccc; border-radius: 8px;"></div>
    </div>
    <div id="info-box" style="flex: 1.2; min-width: 250px; background: #ffffffee; border: 1px solid #ccc; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); padding: 20px; max-height: 550px; overflow-y: auto;">
      <h3>Detalhes do nó</h3>
      <p>Clique em um nó para ver entradas e saídas.</p>
    </div>
  </div>
</div>

<!-- Bibliotecas externas -->
<script src="https://unpkg.com/vis-network@9.1.2/dist/vis-network.min.js"></script>
<link href="https://unpkg.com/vis-network@9.1.2/dist/vis-network.min.css" rel="stylesheet" />

<!-- Dados dinâmicos -->
<script>
  const triplas = $json_triplas;
</script>

<!-- Scripts JS externos -->
<script src="/modules/custom/vis/js/function.js"></script>
<script src="/modules/custom/vis/js/unit.js"></script>
HTML;

    return [
      '#type' => 'inline_template',
      '#template' => '{{ html|raw }}',
      '#context' => ['html' => $html],
    ];
  }
}
