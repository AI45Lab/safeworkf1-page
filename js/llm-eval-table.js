/**
 * Build the LLM evaluation table from LLM_EVALUATION_DATA.
 * Keeps the same HTML structure and classes so CSS and sortable work.
 */
(function () {
  'use strict';

  var data = window.LLM_EVALUATION_DATA;
  var container = document.getElementById('llm-eval-table-container');
  if (!data || !container) return;

  var benchmarks = data.benchmarks;
  var models = data.models;
  var faviconBase = 'https://www.google.com/s2/favicons?domain=';
  var faviconSz = '&sz=32';

  var theadCells = ['Provider', 'Model'].concat(benchmarks);
  var table = document.createElement('table');
  table.className = 'sortable eval-table';
  table.setAttribute('data-sortable', '');

  var thead = document.createElement('thead');
  var headerRow = document.createElement('tr');
  theadCells.forEach(function (label, i) {
    var th = document.createElement('th');
    th.textContent = label;
    if (i === 0) th.className = 'eval-table__provider';
    if (i >= 2) th.setAttribute('data-type', 'number');
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  var tbody = document.createElement('tbody');
  models.forEach(function (row) {
    var tr = document.createElement('tr');

    var providerTd = document.createElement('td');
    providerTd.className = 'eval-table__provider';
    var iconSpan = document.createElement('span');
    iconSpan.className = 'eval-table__icon';
    iconSpan.setAttribute('aria-hidden', 'true');
    var img = document.createElement('img');
    img.src = faviconBase + encodeURIComponent(row.providerDomain) + faviconSz;
    img.width = 20;
    img.height = 20;
    img.alt = '';
    img.decoding = 'async';
    iconSpan.appendChild(img);
    providerTd.appendChild(iconSpan);
    providerTd.appendChild(document.createTextNode(row.provider));
    tr.appendChild(providerTd);

    var modelTd = document.createElement('td');
    modelTd.textContent = row.model;
    tr.appendChild(modelTd);

    benchmarks.forEach(function (b) {
      var val = row[b];
      var td = document.createElement('td');
      if (val != null) {
        td.setAttribute('data-value', String(val));
        td.textContent = val;
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
})();
