/**
 * Scatter plot from LLM_EVALUATION_DATA using Plotly.js.
 * X and Y axes = two benchmarks; each point = one model.
 */
(function () {
  'use strict';

  var data = window.LLM_EVALUATION_DATA;
  var container = document.getElementById('llm-eval-scatter');
  if (!data || !container || typeof Plotly === 'undefined') return;

  var benchmarks = data.benchmarks;
  var models = data.models;

  function getModelLabel(m) {
    return m.provider + ' – ' + m.model;
  }

  function dataRange(arr, paddingPercent) {
    var valid = arr.filter(function (v) {
      return typeof v === 'number' && !isNaN(v);
    });
    if (valid.length === 0) return [0, 100];
    var min = Math.min.apply(null, valid);
    var max = Math.max.apply(null, valid);
    if (min === max) {
      min = min - 5;
      max = max + 5;
    } else {
      var pad = ((max - min) * (paddingPercent || 0.08)) || 1;
      min = min - pad;
      max = max + pad;
    }
    return [min, max];
  }

  function getLayout(xBench, yBench, xVal, yVal) {
    var xRange = dataRange(xVal);
    var yRange = dataRange(yVal);
    return {
      xaxis: {
        title: xBench,
        range: xRange,
        gridcolor: 'rgba(0,0,0,0.06)',
        zeroline: false,
        tickfont: { size: 11 },
        titlefont: { size: 12 },
      },
      yaxis: {
        title: yBench,
        range: yRange,
        gridcolor: 'rgba(0,0,0,0.06)',
        zeroline: false,
        tickfont: { size: 11 },
        titlefont: { size: 12 },
      },
      font: { family: '"Inter", sans-serif', size: 12 },
      paper_bgcolor: '#ffffff',
      plot_bgcolor: '#ffffff',
      margin: { t: 40, r: 40, b: 56, l: 56 },
      showlegend: false,
      hoverlabel: {
        bgcolor: 'rgba(255,255,255,0.98)',
        bordercolor: '#e5e5e5',
        font: { size: 12, color: '#0a0a0a' },
      },
      height: 400,
    };
  }

  function render(xBench, yBench) {
    xBench = xBench || benchmarks[0];
    yBench = yBench || benchmarks[1];
    var xVal = models.map(function (m) {
      return m[xBench] != null ? Number(m[xBench]) : 0;
    });
    var yVal = models.map(function (m) {
      return m[yBench] != null ? Number(m[yBench]) : 0;
    });
    var text = models.map(function (m) {
      return getModelLabel(m) + '<br>' + xBench + ': ' + (m[xBench] != null ? m[xBench] : '–') + '<br>' + yBench + ': ' + (m[yBench] != null ? m[yBench] : '–');
    });
    var palette = window.CHART_PALETTE || ['#1e40af', '#0d9488', '#166534', '#b45309', '#6d28d9', '#9f1239', '#0e7490', '#4338ca', '#0f766e', '#92400e'];
    var symbols = ['circle', 'square', 'diamond', 'triangle-up', 'star', 'hexagon', 'cross', 'x', 'triangle-down', 'pentagon'];
    var colors = models.map(function (_, i) {
      return palette[i % palette.length];
    });
    var symbolList = models.map(function (_, i) {
      return symbols[i % symbols.length];
    });
    var trace = {
      type: 'scatter',
      mode: 'markers',
      x: xVal,
      y: yVal,
      hovertext: text,
      hoverinfo: 'text',
      marker: {
        size: 14,
        color: colors,
        symbol: symbolList,
        line: { color: 'rgba(0, 0, 0, 0.2)', width: 1.5 },
      },
    };
    Plotly.react(container, [trace], getLayout(xBench, yBench, xVal, yVal), {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    });
  }

  var selectX = document.getElementById('llm-eval-scatter-x');
  var selectY = document.getElementById('llm-eval-scatter-y');
  benchmarks.forEach(function (b, i) {
    if (selectX) {
      var optX = document.createElement('option');
      optX.value = b;
      optX.textContent = b;
      if (i === 0) optX.selected = true;
      selectX.appendChild(optX);
    }
    if (selectY) {
      var optY = document.createElement('option');
      optY.value = b;
      optY.textContent = b;
      if (i === 1) optY.selected = true;
      selectY.appendChild(optY);
    }
  });

  function update() {
    var x = selectX ? selectX.value : benchmarks[0];
    var y = selectY ? selectY.value : benchmarks[1];
    render(x, y);
  }

  if (selectX) selectX.addEventListener('change', update);
  if (selectY) selectY.addEventListener('change', update);

  render(benchmarks[0], benchmarks[1]);
})();
