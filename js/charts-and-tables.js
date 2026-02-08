/**
 * Plotly.js charts (beautiful report style) and sortable tables
 */

(function () {
  'use strict';

  // Shared Plotly theme: clean, minimal, matches page typography
  var fontFamily = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  var textColor = '#0a0a0a';
  var gridColor = 'rgba(0, 0, 0, 0.06)';
  var paperBg = '#ffffff';
  var plotBg = '#ffffff';
  var margin = { t: 40, r: 24, b: 56, l: 56 };

  var axisCommon = {
    showgrid: true,
    gridcolor: gridColor,
    gridwidth: 1,
    zeroline: false,
    showline: true,
    linecolor: gridColor,
    linewidth: 1,
    tickfont: { family: fontFamily, size: 11, color: '#737373' },
    titlefont: { family: fontFamily, size: 12, color: textColor },
  };

  var layoutBase = {
    font: { family: fontFamily, size: 12, color: textColor },
    paper_bgcolor: paperBg,
    plot_bgcolor: plotBg,
    margin: margin,
    autosize: true,
    xaxis: Object.assign({}, axisCommon),
    yaxis: Object.assign({}, axisCommon),
    hoverlabel: {
      bgcolor: 'rgba(255, 255, 255, 0.96)',
      bordercolor: '#e5e5e5',
      font: { family: fontFamily, size: 12, color: textColor },
    },
    showlegend: false,
    bargap: 0.36,
    bargroupgap: 0.1,
  };

  var config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    toImageButtonOptions: { format: 'png', scale: 2 },
  };

  var chartPalette = window.CHART_PALETTE || ['#1e40af', '#0d9488', '#166534', '#b45309', '#6d28d9'];

  // --- Chart 1: Refusal rate by category (vertical bars) ---
  var refusalEl = document.getElementById('chart-refusal-rate');
  if (refusalEl && typeof Plotly !== 'undefined') {
    var refusalCategories = [
      'Harmful instruction',
      'Jailbreak',
      'Paraphrase agreement',
      'Demographic parity',
    ];
    var refusalValues = [96.2, 91.1, 88.4, 85.0];

    Plotly.newPlot(
      refusalEl,
      [
        {
          x: refusalCategories,
          y: refusalValues,
          type: 'bar',
          marker: {
            color: refusalValues.map(function (_, i) {
              return chartPalette[i % chartPalette.length];
            }),
            line: { color: 'rgba(0, 0, 0, 0.12)', width: 1 },
          },
          text: refusalValues.map(function (v) {
            return v + '%';
          }),
          textposition: 'outside',
          textfont: { family: fontFamily, size: 11, color: '#737373' },
          hovertemplate: '%{x}<br>Refusal rate: %{y}%<extra></extra>',
        },
      ],
      Object.assign({}, layoutBase, {
        yaxis: Object.assign({}, axisCommon, {
          range: [0, 105],
          tickvals: [0, 25, 50, 75, 100],
          ticktext: ['0%', '25%', '50%', '75%', '100%'],
        }),
        xaxis: Object.assign({}, axisCommon, {
          tickangle: -18,
        }),
      }),
      config
    );
  }

  // --- Chart 2: Front-risk scores by category (horizontal bars) ---
  var scoresEl = document.getElementById('chart-front-risk-scores');
  if (scoresEl && typeof Plotly !== 'undefined') {
    var scoreCategories = [
      'Harmful instruction compliance',
      'Jailbreak resistance',
      'Misinformation / consistency',
      'Bias and fairness',
    ];
    var scoreValues = [0.94, 0.89, 0.91, 0.87];

    Plotly.newPlot(
      scoresEl,
      [
        {
          y: scoreCategories,
          x: scoreValues,
          type: 'bar',
          orientation: 'h',
          marker: {
            color: scoreValues.map(function (_, i) {
              return chartPalette[i % chartPalette.length];
            }),
            line: { color: 'rgba(0, 0, 0, 0.12)', width: 1 },
          },
          text: scoreValues.map(function (v) {
            return v.toFixed(2);
          }),
          textposition: 'outside',
          textfont: { family: fontFamily, size: 11, color: '#737373' },
          hovertemplate: '%{y}<br>Score: %{x}<extra></extra>',
        },
      ],
      Object.assign({}, layoutBase, {
        xaxis: Object.assign({}, axisCommon, {
          range: [0, 1.05],
          tickvals: [0, 0.25, 0.5, 0.75, 1],
          tickformat: '.2f',
        }),
        yaxis: Object.assign({}, axisCommon, {
          autorange: 'reversed',
        }),
        margin: Object.assign({}, margin, { l: 180 }),
      }),
      config
    );
  }

  // --- Sortable tables ---
  function parseCellValue(cell, type) {
    var raw =
      cell.getAttribute('data-value') != null
        ? cell.getAttribute('data-value')
        : (cell.textContent || '').trim();
    if (type === 'number') {
      var num = parseFloat(raw.replace(/[^0-9.-]/g, ''), 10);
      return isNaN(num) ? 0 : num;
    }
    return raw.toLowerCase();
  }

  function sortTable(table, colIndex, ascending, colType) {
    var tbody = table.querySelector('tbody');
    if (!tbody) return;
    var rows = Array.from(tbody.querySelectorAll('tr'));
    rows.sort(function (a, b) {
      var aCell = a.cells[colIndex];
      var bCell = b.cells[colIndex];
      if (!aCell || !bCell) return 0;
      var aVal = parseCellValue(aCell, colType);
      var bVal = parseCellValue(bCell, colType);
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return ascending ? aVal - bVal : bVal - aVal;
      }
      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
      return 0;
    });
    rows.forEach(function (r) {
      tbody.appendChild(r);
    });
  }

  document.querySelectorAll('table[data-sortable]').forEach(function (table) {
    var headers = table.querySelectorAll('thead th');
    headers.forEach(function (th, colIndex) {
      th.setAttribute('role', 'button');
      th.setAttribute('tabindex', '0');
      th.setAttribute('aria-sort', 'none');
      th.classList.add('sortable-th');
      var colType = th.getAttribute('data-type') || 'string';
      var direction = 1;
      function updateSort() {
        sortTable(table, colIndex, direction === 1, colType);
        th.setAttribute('aria-sort', direction === 1 ? 'ascending' : 'descending');
        table.querySelectorAll('thead th').forEach(function (h) {
          if (h !== th) h.setAttribute('aria-sort', 'none');
        });
        direction = -direction;
      }
      th.addEventListener('click', updateSort);
      th.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          updateSort();
        }
      });
    });
  });
})();
