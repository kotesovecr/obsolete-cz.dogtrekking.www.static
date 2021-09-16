---
layout: layout.liquid
title: Historie
---

<h4>Historie</h4>
<ul>
  {%- for year in years -%}
    <li><a href="/Terminovka/{{ year }}/">Rok {{ year }}</a></li>
  {%- endfor -%}
</ul>