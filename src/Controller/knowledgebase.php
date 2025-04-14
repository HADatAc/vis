<?php

/**
 * Base de conhecimento RDF em forma de array PHP.
 * Cada pessoa tem suas triplas organizadas individualmente.
 */

 return [
    'pedro' => [
      ['pedro', 'eh', 'pessoa'],
      ['pedro', 'conhece', 'pedro']
    ],
    'rita' => [
      ['rita', 'eh', 'pessoa'],
      ['rita', 'ama', 'pedro'],
      ['rita', 'conhece', 'pedro']
    ],
    'jorge' => [
      ['jorge', 'ama', 'rita']
    ],
    'pessoa' => [
        ['pessoa', 'tem instancia','rita'],
        ['pessoa', 'tem instancia','jorge'],
        ['pessoa', 'tem instancia','pedro'],
    ]
  ];
  
  