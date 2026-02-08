/**
 * Radar chart from LLM_EVALUATION_DATA using Plotly.js (scatterpolar).
 * Run after LLM_EVALUATION_DATA and Plotly are loaded.
 */
(function () {
  'use strict';

  var data = window.LLM_EVALUATION_DATA;
  var container = document.getElementById('llm-eval-radar');
  if (!data || !container || typeof Plotly === 'undefined') return;

  var benchmarks = data.benchmarks;
  var models = data.models;

  function getModelLabel(m) {
    return m.provider + ' – ' + m.model;
  }

  function buildTrace(model, color, opacity) {
    var r = benchmarks.map(function (b) {
      return model[b] != null ? Number(model[b]) : 0;
    });
    return {
      type: 'scatterpolar',
      r: r,
      theta: benchmarks.slice(),
      name: getModelLabel(model),
      fill: 'toself',
      fillcolor: color,
      line: { color: color, width: 1.5 },
      opacity: opacity != null ? opacity : 1,
    };
  }

  var palette = window.CHART_PALETTE || ['#1e40af', '#0d9488'];
  var primaryColor = palette[0];
  var secondaryColor = palette[1];

  function getLayout() {
    return {
      polar: {
        radialaxis: {
          range: [0, 100],
          tickfont: { size: 10 },
          gridcolor: 'rgba(0,0,0,0.08)',
        },
        angularaxis: {
          tickfont: { size: 11 },
          gridcolor: 'rgba(0,0,0,0.08)',
        },
      },
      font: { family: '"Inter", sans-serif', size: 12 },
      paper_bgcolor: '#ffffff',
      plot_bgcolor: '#ffffff',
      margin: { t: 24, r: 24, b: 24, l: 24 },
      showlegend: true,
      legend: {
        x: 1,
        xanchor: 'right',
        y: 1,
        font: { size: 11 },
      },
      height: 420,
    };
  }

  function render(selectedIndices) {
    selectedIndices = selectedIndices || [0];
    var traces = selectedIndices.map(function (idx, i) {
      var model = models[idx];
      var color = i === 0 ? primaryColor : secondaryColor;
      return buildTrace(model, color, i === 0 ? 1 : 0.7);
    });
    Plotly.react(container, traces, getLayout(), {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    });
  }

  var select = document.getElementById('llm-eval-radar-select');
  if (select) {
    models.forEach(function (m, i) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = getModelLabel(m);
      if (i === 0) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', function () {
      render([parseInt(select.value, 10)]);
    });
  }

  render([0]);
})();
