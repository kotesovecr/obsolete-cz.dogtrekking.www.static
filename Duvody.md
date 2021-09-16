---
layout: layout.liquid
title: Důvody tohoto projektu
---


<ul class='horizontal'>
  {%- for duvod in duvody -%}
    <li>{{ duvod }}</li>
  {%- endfor -%}
</ul>