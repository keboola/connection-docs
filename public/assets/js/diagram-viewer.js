/**
 * Interactive ER diagram viewer using D3.js v7 and ELKjs.
 * Toolbar: mode filter + layout direction.
 * Canvas controls: zoom in/out/fit, expand/collapse all, fullscreen.
 */
(function() {
  'use strict';

  // Tailwind 500 colors
  var COLORS = {
    project: '#3b82f6',       // blue-500
    organization: '#f43f5e',  // rose-500
    activity_center: '#22c55e' // green-500
  };
  var LAYOUT_BTN_ACTIVE = '#282D38';

  var EDGE_COLOR = '#999';
  var EDGE_HOVER_COLOR = '#333';
  var NODE_MIN_WIDTH = 200;
  var NODE_HEADER_HEIGHT = 36;
  var NODE_ROW_HEIGHT = 24;
  var NODE_PADDING = 8;
  var TRANSITION_DURATION = 300;
  var FONT_FAMILY = 'Lato, "Helvetica Neue", Arial, sans-serif';
  var CONTAINER_HEIGHT = 600;
  var ELK_NODE_SPACING = 50;
  var ELK_LAYER_SPACING = 100;

  // Font Awesome Free 6.x Solid SVG paths
  var FA_ICONS = {
    // fa-magnifying-glass-plus (512x512)
    zoomIn: { vb: '0 0 512 512', d: 'M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM184 296c0 13.3 10.7 24 24 24s24-10.7 24-24l0-64 64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-64 0 0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64-64 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l64 0 0 64z' },
    // fa-magnifying-glass-minus (512x512)
    zoomOut: { vb: '0 0 512 512', d: 'M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM136 184c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z' },
    // fa-compress (448x512)
    fit: { vb: '0 0 448 512', d: 'M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z' },
    // fa-chevron-down (512x512)
    expandAll: { vb: '0 0 512 512', d: 'M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z' },
    // fa-chevron-up (512x512)
    collapseAll: { vb: '0 0 512 512', d: 'M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z' },
    // fa-up-right-and-down-left-from-center (512x512)
    fullscreen: { vb: '0 0 512 512', d: 'M344 0L488 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512L24 512c-13.3 0-24-10.7-24-24L0 344c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z' },
    // fa-down-left-and-up-right-to-center (512x512)
    exitFullscreen: { vb: '0 0 512 512', d: 'M439 7c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8l-144 0c-13.3 0-24-10.7-24-24l0-144c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39L439 7zM72 272l144 0c13.3 0 24 10.7 24 24l0 144c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39L73 505c-9.4 9.4-24.6 9.4-33.9 0L7 473c-9.4-9.4-9.4-24.6 0-33.9l87-87L55 313c-6.9-6.9-8.9-17.2-5.2-26.2s12.5-14.8 22.2-14.8z' },
    // fa-key (512x512)
    key: { vb: '0 0 512 512', d: 'M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17l0 80c0 13.3 10.7 24 24 24l80 0c13.3 0 24-10.7 24-24l0-40 40 0c13.3 0 24-10.7 24-24l0-40 40 0c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z' },
    // fa-link (640x512)
    link: { vb: '0 0 640 512', d: 'M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z' }
  };

  function faIcon(iconObj, size) {
    size = size || 16;
    return '<svg width="' + size + '" height="' + size + '" viewBox="' + iconObj.vb + '" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
           '<path d="' + iconObj.d + '"/></svg>';
  }

  function injectStyles() {
    if (document.getElementById('dv-styles')) return;
    var style = document.createElement('style');
    style.id = 'dv-styles';
    style.textContent = [
      '.dv-container {',
      '  width: 100%;',
      '  height: ' + CONTAINER_HEIGHT + 'px;',
      '  background: #fff;',
      '  border: 1px solid #e0e0e0;',
      '  border-radius: 4px;',
      '  overflow: hidden;',
      '  position: relative;',
      '  font-family: ' + FONT_FAMILY + ';',
      '}',
      '.dv-container.dv-fullscreen {',
      '  position: fixed;',
      '  top: 0; left: 0; right: 0; bottom: 0;',
      '  width: 100%; height: 100%;',
      '  z-index: 100000;',
      '  border: none;',
      '  border-radius: 0;',
      '}',
      '.dv-toolbar {',
      '  display: flex;',
      '  flex-wrap: nowrap;',
      '  gap: 8px;',
      '  padding: 8px 12px;',
      '  background: #f8f9fa;',
      '  border-bottom: 1px solid #e0e0e0;',
      '  align-items: center;',
      '  font-size: 13px;',
      '  z-index: 10;',
      '  position: relative;',
      '}',
      '.dv-toolbar .dv-btn-group {',
      '  display: flex;',
      '  gap: 0;',
      '}',
      '.dv-toolbar .dv-btn-group .dv-btn {',
      '  border-radius: 0;',
      '  margin-left: -1px;',
      '}',
      '.dv-toolbar .dv-btn-group .dv-btn:first-child {',
      '  border-radius: 4px 0 0 4px;',
      '  margin-left: 0;',
      '}',
      '.dv-toolbar .dv-btn-group .dv-btn:last-child {',
      '  border-radius: 0 4px 4px 0;',
      '}',
      '.dv-btn {',
      '  padding: 4px 12px;',
      '  border: 1px solid #ccc;',
      '  background: #fff;',
      '  cursor: pointer;',
      '  font-size: 12px;',
      '  font-family: ' + FONT_FAMILY + ';',
      '  color: #333;',
      '  border-radius: 4px;',
      '  transition: background 0.15s, color 0.15s;',
      '  white-space: nowrap;',
      '}',
      '.dv-btn:hover { background: #e9ecef; }',
      '.dv-btn.active { color: #fff; }',
      '.dv-mode-btn.active[data-mode="project"] { background: #3b82f6; border-color: #3b82f6; }',
      '.dv-mode-btn.active[data-mode="organization"] { background: #f43f5e; border-color: #f43f5e; }',
      '.dv-mode-btn.active[data-mode="activity_center"] { background: #22c55e; border-color: #22c55e; }',
      '.dv-dir-btn.active { background: #282D38; border-color: #282D38; }',
      '.dv-separator {',
      '  width: 1px; height: 24px; background: #ddd; margin: 0 4px;',
      '}',
      '.dv-label {',
      '  font-size: 11px; color: #666; text-transform: uppercase;',
      '  letter-spacing: 0.5px; margin-right: 4px; white-space: nowrap;',
      '}',
      '.dv-canvas-wrap {',
      '  width: 100%;',
      '  position: absolute;',
      '  top: 0; left: 0; right: 0; bottom: 0;',
      '}',
      /* Floating controls panel - bottom right */
      '.dv-controls {',
      '  position: absolute;',
      '  bottom: 12px; right: 12px;',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 4px;',
      '  z-index: 20;',
      '}',
      '.dv-ctrl-group {',
      '  display: flex;',
      '  flex-direction: column;',
      '  background: #fff;',
      '  border: 1px solid #ddd;',
      '  border-radius: 6px;',
      '  box-shadow: 0 2px 6px rgba(0,0,0,0.1);',
      '  overflow: hidden;',
      '}',
      '.dv-ctrl-btn {',
      '  width: 36px; height: 36px;',
      '  display: flex; align-items: center; justify-content: center;',
      '  background: #fff;',
      '  border: none;',
      '  border-bottom: 1px solid #eee;',
      '  cursor: pointer;',
      '  color: #555;',
      '  padding: 0;',
      '  transition: background 0.1s, color 0.1s;',
      '}',
      '.dv-ctrl-btn:last-child { border-bottom: none; }',
      '.dv-ctrl-btn:hover { background: #f0f0f0; color: #111; }',
      '.dv-ctrl-btn:active { background: #e0e0e0; }',
      '.dv-ctrl-btn svg { display: block; }',
      /* Fullscreen button - top right on canvas */
      '.dv-fullscreen-btn {',
      '  position: absolute;',
      '  top: 12px; right: 12px;',
      '  z-index: 20;',
      '  width: 36px; height: 36px;',
      '  display: flex; align-items: center; justify-content: center;',
      '  background: #fff;',
      '  border: 1px solid #ddd;',
      '  border-radius: 6px;',
      '  box-shadow: 0 2px 6px rgba(0,0,0,0.1);',
      '  cursor: pointer;',
      '  color: #555;',
      '  padding: 0;',
      '  transition: background 0.1s, color 0.1s;',
      '}',
      '.dv-fullscreen-btn:hover { background: #f0f0f0; color: #111; }',
      '.dv-fullscreen-btn svg { display: block; }',
      '.dv-tooltip {',
      '  position: absolute;',
      '  background: rgba(0,0,0,0.8);',
      '  color: #fff;',
      '  padding: 4px 8px;',
      '  border-radius: 3px;',
      '  font-size: 12px;',
      '  pointer-events: none;',
      '  white-space: nowrap;',
      '  z-index: 100;',
      '  display: none;',
      '}',
      '.dv-empty {',
      '  display: flex; align-items: center; justify-content: center;',
      '  height: 100%; color: #999; font-size: 14px;',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function waitForData(callback) {
    if (window.TELEMETRY_DIAGRAM) { callback(window.TELEMETRY_DIAGRAM); return; }
    var attempts = 0;
    var interval = setInterval(function() {
      attempts++;
      if (window.TELEMETRY_DIAGRAM) { clearInterval(interval); callback(window.TELEMETRY_DIAGRAM); }
      else if (attempts >= 100) { clearInterval(interval); }
    }, 100);
  }

  function measureTextWidth(text, fontSize) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.font = fontSize + 'px Lato, Helvetica Neue, Arial, sans-serif';
    return ctx.measureText(text).width;
  }

  function computeNodeSize(table, expanded) {
    var headerWidth = measureTextWidth(table.id, 13) + 40;
    var width = Math.max(NODE_MIN_WIDTH, headerWidth);
    var height = NODE_HEADER_HEIGHT;
    if (expanded && table.columns && table.columns.length > 0) {
      table.columns.forEach(function(col) {
        var w = measureTextWidth(col.name, 12) + 40;
        if (w + 16 > width) width = w + 16;
      });
      height += table.columns.length * NODE_ROW_HEIGHT + NODE_PADDING;
    }
    return { width: Math.ceil(width), height: Math.ceil(height) };
  }

  function getConnectionPoint(node, targetNode, direction) {
    var dx = (targetNode.x + targetNode.width / 2) - (node.x + node.width / 2);
    var dy = (targetNode.y + targetNode.height / 2) - (node.y + node.height / 2);
    if (direction === 'RIGHT') {
      return dx > 0
        ? { x: node.x + node.width, y: node.y + node.height / 2 }
        : { x: node.x, y: node.y + node.height / 2 };
    }
    return dy > 0
      ? { x: node.x + node.width / 2, y: node.y + node.height }
      : { x: node.x + node.width / 2, y: node.y };
  }

  function getTargetConnectionPoint(node, sourceNode, direction) {
    var dx = (node.x + node.width / 2) - (sourceNode.x + sourceNode.width / 2);
    var dy = (node.y + node.height / 2) - (sourceNode.y + sourceNode.height / 2);
    if (direction === 'RIGHT') {
      return dx > 0
        ? { x: node.x, y: node.y + node.height / 2 }
        : { x: node.x + node.width, y: node.y + node.height / 2 };
    }
    return dy > 0
      ? { x: node.x + node.width / 2, y: node.y }
      : { x: node.x + node.width / 2, y: node.y + node.height };
  }

  function computeEdgePath(sourceNode, targetNode, direction) {
    var sp = getConnectionPoint(sourceNode, targetNode, direction);
    var tp = getTargetConnectionPoint(targetNode, sourceNode, direction);
    if (direction === 'RIGHT') {
      var mx = (sp.x + tp.x) / 2;
      return 'M' + sp.x + ',' + sp.y + ' C' + mx + ',' + sp.y + ' ' + mx + ',' + tp.y + ' ' + tp.x + ',' + tp.y;
    }
    var my = (sp.y + tp.y) / 2;
    return 'M' + sp.x + ',' + sp.y + ' C' + sp.x + ',' + my + ' ' + tp.x + ',' + my + ' ' + tp.x + ',' + tp.y;
  }

  function init(data) {
    var container = document.getElementById('diagram-viewer');
    if (!container) return;

    injectStyles();
    container.classList.add('dv-container');

    var state = {
      mode: 'activity_center',
      direction: 'RIGHT',
      expanded: {},
      nodePositions: {},
      tables: data.tables || [],
      relationships: data.relationships || [],
      isFullscreen: false
    };

    state.tables.forEach(function(t) { state.expanded[t.id] = false; });

    // ── Toolbar (compact: mode + layout only) ──
    var toolbar = document.createElement('div');
    toolbar.className = 'dv-toolbar';
    toolbar.innerHTML = [
      '<span class="dv-label">Mode:</span>',
      '<div class="dv-btn-group">',
      '  <button class="dv-btn dv-mode-btn" data-mode="project">Project</button>',
      '  <button class="dv-btn dv-mode-btn" data-mode="organization">Organization</button>',
      '  <button class="dv-btn dv-mode-btn active" data-mode="activity_center">Activity Center</button>',
      '</div>',
      '<div class="dv-separator"></div>',
      '<span class="dv-label">Layout:</span>',
      '<div class="dv-btn-group">',
      '  <button class="dv-btn dv-dir-btn active" data-dir="RIGHT">Left \u2192 Right</button>',
      '  <button class="dv-btn dv-dir-btn" data-dir="DOWN">Top \u2192 Bottom</button>',
      '</div>'
    ].join('');
    container.appendChild(toolbar);

    // ── Canvas ──
    var canvasWrap = document.createElement('div');
    canvasWrap.className = 'dv-canvas-wrap';
    canvasWrap.style.top = toolbar.offsetHeight + 'px';
    container.appendChild(canvasWrap);

    // ── Floating controls (bottom-right on canvas) ──
    var controls = document.createElement('div');
    controls.className = 'dv-controls';
    controls.innerHTML = [
      '<div class="dv-ctrl-group">',
      '  <button class="dv-ctrl-btn" data-action="zoom-in" title="Zoom in">' + faIcon(FA_ICONS.zoomIn) + '</button>',
      '  <button class="dv-ctrl-btn" data-action="fit" title="Fit to screen">' + faIcon(FA_ICONS.fit) + '</button>',
      '  <button class="dv-ctrl-btn" data-action="zoom-out" title="Zoom out">' + faIcon(FA_ICONS.zoomOut) + '</button>',
      '</div>',
      '<div class="dv-ctrl-group">',
      '  <button class="dv-ctrl-btn" data-action="expand-all" title="Expand all tables">' + faIcon(FA_ICONS.expandAll) + '</button>',
      '  <button class="dv-ctrl-btn" data-action="collapse-all" title="Collapse all tables">' + faIcon(FA_ICONS.collapseAll) + '</button>',
      '</div>'
    ].join('');
    canvasWrap.appendChild(controls);

    // ── Fullscreen button (top-right on canvas) ──
    var fsBtn = document.createElement('button');
    fsBtn.className = 'dv-fullscreen-btn';
    fsBtn.title = 'Toggle fullscreen';
    fsBtn.innerHTML = faIcon(FA_ICONS.fullscreen);
    canvasWrap.appendChild(fsBtn);

    // ── Tooltip ──
    var tooltip = document.createElement('div');
    tooltip.className = 'dv-tooltip';
    container.appendChild(tooltip);

    requestAnimationFrame(function() {
      canvasWrap.style.top = toolbar.offsetHeight + 'px';
    });

    // ── SVG setup ──
    var svgEl = d3.select(canvasWrap).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('display', 'block');

    var defs = svgEl.append('defs');
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 0 10 7').attr('refX', 10).attr('refY', 3.5)
      .attr('markerWidth', 8).attr('markerHeight', 6).attr('orient', 'auto')
      .append('polygon').attr('points', '0 0, 10 3.5, 0 7').attr('fill', EDGE_COLOR);
    defs.append('marker')
      .attr('id', 'arrowhead-hover')
      .attr('viewBox', '0 0 10 7').attr('refX', 10).attr('refY', 3.5)
      .attr('markerWidth', 8).attr('markerHeight', 6).attr('orient', 'auto')
      .append('polygon').attr('points', '0 0, 10 3.5, 0 7').attr('fill', EDGE_HOVER_COLOR);

    var filter = defs.append('filter')
      .attr('id', 'shadow-filter')
      .attr('x', '-10%').attr('y', '-10%').attr('width', '130%').attr('height', '130%');
    filter.append('feDropShadow')
      .attr('dx', '0').attr('dy', '2').attr('stdDeviation', '3').attr('flood-color', 'rgba(0,0,0,0.15)');

    var g = svgEl.append('g').attr('class', 'dv-root');
    var edgeGroup = g.append('g').attr('class', 'dv-edges');
    var nodeGroup = g.append('g').attr('class', 'dv-nodes');

    var zoom = d3.zoom()
      .scaleExtent([0.05, 6])
      .on('zoom', function(event) { g.attr('transform', event.transform); });
    svgEl.call(zoom);

    var elk = new ELK();

    // ── Helpers ──
    function getVisibleTables() {
      return state.tables.filter(function(t) {
        if (state.mode === 'project') return t.mode === 'project';
        if (state.mode === 'organization') return t.mode === 'project' || t.mode === 'organization';
        return true;
      });
    }

    function getVisibleRelationships(visibleIds) {
      var s = {}; visibleIds.forEach(function(id) { s[id] = true; });
      return state.relationships.filter(function(r) { return s[r.from] && s[r.to]; });
    }

    function fitToScreen() {
      var bounds = g.node().getBBox();
      if (bounds.width === 0 || bounds.height === 0) return;
      var svgRect = svgEl.node().getBoundingClientRect();
      var pad = 40;
      var scaleX = (svgRect.width - pad * 2) / bounds.width;
      var scaleY = (svgRect.height - pad * 2) / bounds.height;
      var scale = Math.min(scaleX, scaleY, 1.5);
      var tx = (svgRect.width - bounds.width * scale) / 2 - bounds.x * scale;
      var ty = (svgRect.height - bounds.height * scale) / 2 - bounds.y * scale;
      svgEl.transition().duration(TRANSITION_DURATION)
        .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    }

    function zoomBy(factor) {
      svgEl.transition().duration(200).call(zoom.scaleBy, factor);
    }

    // ── Layout ──
    // shouldFit: true to fit-to-screen after layout, false to keep current zoom/pan
    function runLayout(animate, shouldFit) {
      var visibleTables = getVisibleTables();
      var visibleIds = visibleTables.map(function(t) { return t.id; });
      var visibleRels = getVisibleRelationships(visibleIds);

      if (visibleTables.length === 0) {
        edgeGroup.selectAll('*').remove();
        nodeGroup.selectAll('*').remove();
        if (!canvasWrap.querySelector('.dv-empty')) {
          var empty = document.createElement('div');
          empty.className = 'dv-empty';
          empty.textContent = 'No tables to display for the selected mode.';
          canvasWrap.appendChild(empty);
        }
        return;
      }
      var existingEmpty = canvasWrap.querySelector('.dv-empty');
      if (existingEmpty) existingEmpty.remove();

      var elkNodes = visibleTables.map(function(t) {
        var size = computeNodeSize(t, state.expanded[t.id]);
        return { id: t.id, width: size.width, height: size.height };
      });

      var elkEdges = visibleRels.map(function(r, i) {
        return { id: 'e' + i, sources: [r.from], targets: [r.to] };
      });

      elk.layout({
        id: 'root',
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': state.direction,
          'elk.spacing.nodeNode': String(ELK_NODE_SPACING),
          'elk.layered.spacing.nodeNodeBetweenLayers': String(ELK_LAYER_SPACING),
          'elk.layered.spacing.edgeNodeBetweenLayers': String(ELK_LAYER_SPACING / 2),
          'elk.edgeRouting': 'SPLINES'
        },
        children: elkNodes,
        edges: elkEdges
      }).then(function(result) {
        var nodeMap = {};
        result.children.forEach(function(n) {
          state.nodePositions[n.id] = { x: n.x, y: n.y, width: n.width, height: n.height };
          nodeMap[n.id] = state.nodePositions[n.id];
        });
        renderNodes(visibleTables, nodeMap, animate);
        renderEdges(visibleRels, nodeMap, animate);
        if (shouldFit !== false) {
          setTimeout(function() { fitToScreen(); }, animate ? TRANSITION_DURATION + 50 : 50);
        }
      });
    }

    // ── Render nodes ──
    function renderNodes(tables, nodeMap, animate) {
      var nodeData = tables.map(function(t) {
        return { table: t, pos: nodeMap[t.id], expanded: state.expanded[t.id] };
      });

      var nodes = nodeGroup.selectAll('.dv-node').data(nodeData, function(d) { return d.table.id; });
      nodes.exit().remove();

      var enter = nodes.enter().append('g')
        .attr('class', 'dv-node')
        .attr('transform', function(d) { return 'translate(' + d.pos.x + ',' + d.pos.y + ')'; });

      enter.append('rect').attr('class', 'dv-node-bg')
        .attr('rx', 6).attr('ry', 6).attr('fill', '#fff')
        .attr('stroke', '#ddd').attr('stroke-width', 1).attr('filter', 'url(#shadow-filter)');
      enter.append('rect').attr('class', 'dv-node-header')
        .attr('rx', 6).attr('ry', 6).attr('height', NODE_HEADER_HEIGHT).style('cursor', 'pointer');
      enter.append('rect').attr('class', 'dv-node-header-cover')
        .attr('y', NODE_HEADER_HEIGHT - 6).attr('height', 6).style('cursor', 'pointer');
      enter.append('text').attr('class', 'dv-node-title')
        .attr('y', NODE_HEADER_HEIGHT / 2).attr('dy', '0.35em').attr('fill', '#fff')
        .attr('font-weight', 'bold').attr('font-size', '13px').attr('font-family', FONT_FAMILY)
        .style('cursor', 'pointer').style('pointer-events', 'none');
      enter.append('g').attr('class', 'dv-node-columns');

      var merged = enter.merge(nodes);

      var t = animate ? merged.transition().duration(TRANSITION_DURATION) : merged;
      t.attr('transform', function(d) { return 'translate(' + d.pos.x + ',' + d.pos.y + ')'; });

      merged.each(function(d) {
        var sel = d3.select(this);
        var color = COLORS[d.table.mode] || COLORS.project;
        var size = d.pos;

        var bgS = animate ? sel.select('.dv-node-bg').transition().duration(TRANSITION_DURATION) : sel.select('.dv-node-bg');
        bgS.attr('width', size.width).attr('height', size.height);

        var hdrS = animate ? sel.select('.dv-node-header').transition().duration(TRANSITION_DURATION) : sel.select('.dv-node-header');
        hdrS.attr('width', size.width).attr('fill', color);

        var covS = animate ? sel.select('.dv-node-header-cover').transition().duration(TRANSITION_DURATION) : sel.select('.dv-node-header-cover');
        covS.attr('width', size.width).attr('fill', color).attr('opacity', d.expanded ? 1 : 0);

        sel.select('.dv-node-title').attr('x', size.width / 2).attr('text-anchor', 'middle').text(d.table.id);

        var colGroup = sel.select('.dv-node-columns');
        colGroup.selectAll('*').remove();

        if (d.expanded && d.table.columns && d.table.columns.length > 0) {
          d.table.columns.forEach(function(col, i) {
            var y = NODE_HEADER_HEIGHT + i * NODE_ROW_HEIGHT;
            // Alternating row background
            colGroup.append('rect')
              .attr('x', 1).attr('y', y).attr('width', size.width - 2).attr('height', NODE_ROW_HEIGHT)
              .attr('fill', i % 2 === 0 ? '#f8f9fa' : '#fff');
            // Column name (left-aligned, no icon offset)
            colGroup.append('text')
              .attr('x', 10).attr('y', y + NODE_ROW_HEIGHT / 2).attr('dy', '0.35em')
              .attr('font-size', '12px').attr('font-family', FONT_FAMILY).attr('fill', '#333')
              .text(col.name);
            // PK/FK icon on the right side (Font Awesome)
            if (col.pk || col.fk) {
              var iconSize = 10;
              var iconX = size.width - iconSize - 8;
              var iconY = y + (NODE_ROW_HEIGHT - iconSize) / 2;
              var iconData = col.pk ? FA_ICONS.key : FA_ICONS.link;
              var vbParts = iconData.vb.split(' ');
              colGroup.append('svg')
                .attr('x', iconX).attr('y', iconY)
                .attr('width', iconSize).attr('height', iconSize)
                .attr('viewBox', iconData.vb)
                .append('path')
                  .attr('d', iconData.d)
                  .attr('fill', '#9ca3af');
            }
          });
        }

        sel.select('.dv-node-header').on('click', function(event) {
          event.stopPropagation();
          state.expanded[d.table.id] = !state.expanded[d.table.id];
          runLayout(true, false);
        });
        sel.select('.dv-node-header-cover').on('click', function(event) {
          event.stopPropagation();
          state.expanded[d.table.id] = !state.expanded[d.table.id];
          runLayout(true, false);
        });

        sel.call(d3.drag()
          .on('start', function(event) { event.sourceEvent.stopPropagation(); })
          .on('drag', function(event) {
            d.pos.x += event.dx; d.pos.y += event.dy;
            state.nodePositions[d.table.id].x = d.pos.x;
            state.nodePositions[d.table.id].y = d.pos.y;
            d3.select(this).attr('transform', 'translate(' + d.pos.x + ',' + d.pos.y + ')');
            var vIds = getVisibleTables().map(function(t) { return t.id; });
            renderEdges(getVisibleRelationships(vIds), state.nodePositions, false);
          })
        );
      });
    }

    // ── Render edges ──
    function renderEdges(rels, nodeMap, animate) {
      var edgeData = rels.map(function(r, i) {
        return { id: 'edge-' + r.from + '-' + r.to + '-' + i, rel: r, source: nodeMap[r.from], target: nodeMap[r.to] };
      }).filter(function(e) { return e.source && e.target; });

      var edges = edgeGroup.selectAll('.dv-edge').data(edgeData, function(d) { return d.id; });
      edges.exit().remove();

      var enter = edges.enter().append('path')
        .attr('class', 'dv-edge').attr('fill', 'none')
        .attr('stroke', EDGE_COLOR).attr('stroke-width', 1.5)
        .attr('marker-end', 'url(#arrowhead)').style('cursor', 'pointer');

      var merged = enter.merge(edges);

      if (animate) {
        merged.transition().duration(TRANSITION_DURATION)
          .attr('d', function(d) { return computeEdgePath(d.source, d.target, state.direction); });
      } else {
        merged.attr('d', function(d) { return computeEdgePath(d.source, d.target, state.direction); });
      }

      merged
        .on('mouseenter', function(event, d) {
          d3.select(this).attr('stroke', EDGE_HOVER_COLOR).attr('stroke-width', 2.5).attr('marker-end', 'url(#arrowhead-hover)');
          tooltip.textContent = d.rel.label || (d.rel.from + ' \u2192 ' + d.rel.to);
          tooltip.style.display = 'block';
          var cr = container.getBoundingClientRect();
          tooltip.style.left = (event.clientX - cr.left + 10) + 'px';
          tooltip.style.top = (event.clientY - cr.top - 30) + 'px';
        })
        .on('mousemove', function(event) {
          var cr = container.getBoundingClientRect();
          tooltip.style.left = (event.clientX - cr.left + 10) + 'px';
          tooltip.style.top = (event.clientY - cr.top - 30) + 'px';
        })
        .on('mouseleave', function() {
          d3.select(this).attr('stroke', EDGE_COLOR).attr('stroke-width', 1.5).attr('marker-end', 'url(#arrowhead)');
          tooltip.style.display = 'none';
        });
    }

    // ── Fullscreen toggle ──
    function toggleFullscreen() {
      state.isFullscreen = !state.isFullscreen;
      if (state.isFullscreen) {
        container.classList.add('dv-fullscreen');
        document.body.style.overflow = 'hidden';
        fsBtn.innerHTML = faIcon(FA_ICONS.exitFullscreen);
        fsBtn.title = 'Exit fullscreen';
      } else {
        container.classList.remove('dv-fullscreen');
        document.body.style.overflow = '';
        fsBtn.innerHTML = faIcon(FA_ICONS.fullscreen);
        fsBtn.title = 'Toggle fullscreen';
      }
      requestAnimationFrame(function() {
        canvasWrap.style.top = toolbar.offsetHeight + 'px';
        setTimeout(function() { fitToScreen(); }, 100);
      });
    }

    // ── Mode button highlight helper ──
    // When a mode is selected, highlight all included modes
    function updateModeButtons() {
      var modeLevels = { project: 0, organization: 1, activity_center: 2 };
      var currentLevel = modeLevels[state.mode];
      toolbar.querySelectorAll('.dv-mode-btn').forEach(function(b) {
        var btnMode = b.getAttribute('data-mode');
        var btnLevel = modeLevels[btnMode];
        if (btnLevel <= currentLevel) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    }

    // ── Event handlers ──
    toolbar.addEventListener('click', function(e) {
      var btn = e.target.closest('.dv-mode-btn');
      if (btn) {
        state.mode = btn.getAttribute('data-mode');
        updateModeButtons();
        runLayout(true, true);
        return;
      }
      btn = e.target.closest('.dv-dir-btn');
      if (btn) {
        state.direction = btn.getAttribute('data-dir');
        toolbar.querySelectorAll('.dv-dir-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        runLayout(true, true);
      }
    });

    // Set initial mode button state
    updateModeButtons();

    controls.addEventListener('click', function(e) {
      var btn = e.target.closest('.dv-ctrl-btn');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      if (action === 'zoom-in') zoomBy(1.4);
      else if (action === 'zoom-out') zoomBy(1 / 1.4);
      else if (action === 'fit') fitToScreen();
      else if (action === 'expand-all') {
        getVisibleTables().forEach(function(t) { state.expanded[t.id] = true; });
        runLayout(true, false);
      } else if (action === 'collapse-all') {
        getVisibleTables().forEach(function(t) { state.expanded[t.id] = false; });
        runLayout(true, false);
      }
    });

    fsBtn.addEventListener('click', toggleFullscreen);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && state.isFullscreen) {
        toggleFullscreen();
      }
    });

    // ── Init ──
    runLayout(false);
    requestAnimationFrame(function() {
      canvasWrap.style.top = toolbar.offsetHeight + 'px';
      setTimeout(function() { fitToScreen(); }, 100);
    });
  }

  function start() {
    var container = document.getElementById('diagram-viewer');
    if (!container) return;
    waitForData(function(data) { init(data); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
