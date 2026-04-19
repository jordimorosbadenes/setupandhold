// ============================================================
//  PuzzleStudio Premium — Indicator & Download Gating
// ============================================================
//
//  Users can interact with ALL features freely.
//  Premium-tagged elements get a gold shimmer + hover tooltip.
//  If any premium feature is actively in use, the download
//  buttons are disabled with a full info panel + Gumroad link.
//
//  USAGE:
//    Add  data-premium="feature-name"  to ANY container element.
//
// ============================================================

const PremiumManager = (() => {

    const PREMIUM_FEATURES = {
        multicolor: { label: 'Modo Multicolor', code: 'MULTI2024' },
        advanced:   { label: 'Opciones Avanzadas', code: 'PRO2024' },
    };

    const GUMROAD_URL = 'https://jordimororock.gumroad.com/l/nbscvo';
    const STORAGE_KEY = 'puzzlestudio_premium';
    let _unlocked = {};
    let _usedFeatures = new Set();
    let _downloadPanel = null;
    let _tooltip = null;
    let _btnTooltip = null;
    // Snapshot of select values taken after applyDefaults() runs (used as baseline for change detection)
    let _selectBaseline = new Map();

    // ── Persistence ─────────────────────────────────────────

    function loadUnlocked() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            _unlocked = raw ? JSON.parse(raw) : {};
        } catch (_) { _unlocked = {}; }
    }

    function saveUnlocked() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(_unlocked));
        } catch (_) {}
    }

    function isUnlocked(feature) {
        return _unlocked[feature] === true;
    }

    // ── Cursor tooltip on hover over [data-premium] ─────────

    function setupTooltip() {
        _tooltip = document.createElement('div');
        _tooltip.className = 'premium-tooltip';
        document.body.appendChild(_tooltip);

        document.querySelectorAll('[data-premium]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                const f = el.getAttribute('data-premium');
                if (isUnlocked(f)) {
                    _tooltip.innerHTML = '<strong>\u2605 Premium</strong><span>Desbloqueado \u2714</span>';
                } else {
                    _tooltip.innerHTML = '<strong>\u2605 Premium</strong><span>Si usas esta opci\u00F3n, necesitar\u00E1s un c\u00F3digo premium para descargar</span>';
                }
                _tooltip.classList.add('visible');
            });
            el.addEventListener('mouseleave', () => {
                _tooltip.classList.remove('visible');
            });
            el.addEventListener('mousemove', (e) => {
                _tooltip.style.left = (e.clientX + 14) + 'px';
                _tooltip.style.top = (e.clientY + 14) + 'px';
            });
        });

        // Tooltip on disabled download buttons
        _btnTooltip = document.createElement('div');
        _btnTooltip.className = 'premium-tooltip';
        document.body.appendChild(_btnTooltip);
    }

    function setupButtonTooltips() {
        if (!_downloadPanel) return;
        _downloadPanel.querySelectorAll('.stl-download-buttons .btn').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                if (!btn.disabled) return;
                _btnTooltip.innerHTML = '<strong>\u2605 Premium</strong><span>Desbloquea Premium para descargar</span>';
                _btnTooltip.classList.add('visible');
            });
            btn.addEventListener('mouseleave', () => {
                _btnTooltip.classList.remove('visible');
            });
            btn.addEventListener('mousemove', (e) => {
                if (!btn.disabled) return;
                _btnTooltip.style.left = (e.clientX + 14) + 'px';
                _btnTooltip.style.top = (e.clientY + 14) + 'px';
            });
        });
    }

    // ── Feature usage tracking ──────────────────────────────

    function watchFeature(el) {
        el.addEventListener('change', checkFeatureUsage);
        el.addEventListener('input', checkFeatureUsage);
    }

    function checkFeatureUsage() {
        _usedFeatures.clear();
        document.querySelectorAll('[data-premium]').forEach(el => {
            const feature = el.getAttribute('data-premium');
            if (!feature) return;

            // Checkboxes: changed from default state = feature in use
            el.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                if (cb.checked !== cb.defaultChecked) _usedFeatures.add(feature);
            });

            // Selects: changed from baseline value (captured after page init) = in use
            el.querySelectorAll('select').forEach(sel => {
                const baseline = _selectBaseline.has(sel)
                    ? _selectBaseline.get(sel)
                    : (sel.querySelector('option') || {}).value;
                if (sel.value !== baseline) _usedFeatures.add(feature);
            });

            // Range/number: changed from default value = in use
            // Skip disabled inputs (they haven't been actively changed)
            el.querySelectorAll('input[type="range"], input[type="number"]').forEach(inp => {
                if (inp.disabled) return;
                var cur = parseFloat(inp.value), orig = parseFloat(inp.defaultValue);
                if (!isNaN(cur) && !isNaN(orig) && Math.abs(cur - orig) > 0.001) {
                    _usedFeatures.add(feature);
                }
            });
        });
        updateDownloadPanel();
    }

    // ── Download panel gating ───────────────────────────────

    function updateDownloadPanel() {
        if (!_downloadPanel) _downloadPanel = document.querySelector('.download-panel');
        if (!_downloadPanel) return;

        const lockedFeatures = [..._usedFeatures].filter(f => !isUnlocked(f));
        const needsLock = lockedFeatures.length > 0;

        let lockEl = _downloadPanel.querySelector('.premium-download-lock');

        if (needsLock) {
            // Disable all download buttons
            _downloadPanel.querySelectorAll('.stl-download-buttons .btn').forEach(b => {
                b.disabled = true;
            });

            // Build lock key for change detection
            const lockKey = lockedFeatures.sort().join(',');

            // Only rebuild if lock element doesn't exist or features changed
            if (!lockEl || lockEl.getAttribute('data-lock-key') !== lockKey) {
                if (lockEl) lockEl.remove();

                lockEl = document.createElement('div');
                lockEl.className = 'premium-download-lock';
                lockEl.setAttribute('data-lock-key', lockKey);
                const firstBtns = _downloadPanel.querySelector('.stl-download-buttons');
                if (firstBtns) firstBtns.parentNode.insertBefore(lockEl, firstBtns);
                else _downloadPanel.appendChild(lockEl);

                const labels = lockedFeatures.map(f =>
                    (PREMIUM_FEATURES[f] || {}).label || f
                );

                lockEl.innerHTML =
                    '<div class="premium-download-lock-header">' +
                        '<span class="premium-download-lock-icon">\u2605</span>' +
                        '<span class="premium-download-lock-title">Funciones Premium activas</span>' +
                    '</div>' +
                    '<p class="premium-download-lock-text">' +
                        'Est\u00E1s usando: <strong>' + _escHtml(labels.join(', ')) + '</strong>.<br>' +
                        'Para descargar el modelo necesitas desbloquear Premium.' +
                    '</p>' +
                    '<div class="premium-download-lock-actions">' +
                        '<a class="premium-gumroad-btn" href="' + GUMROAD_URL + '" target="_blank" rel="noreferrer">' +
                            '\u2605 Conseguir clave' +
                        '</a>' +
                        '<button class="btn premium-unlock-btn" type="button">Ya tengo clave</button>' +
                    '</div>' +
                    '<div class="premium-download-lock-input-row" style="display:none;">' +
                        '<input type="text" class="premium-code-input" placeholder="C\u00F3digo premium" autocomplete="off" spellcheck="false">' +
                        '<button class="btn premium-verify-btn" type="button">\u2605 Activar</button>' +
                    '</div>' +
                    '<div class="premium-download-lock-error" style="display:none;"></div>';

                // "Ya tengo clave" → show inline input
                lockEl.querySelector('.premium-unlock-btn').addEventListener('click', () => {
                    const row = lockEl.querySelector('.premium-download-lock-input-row');
                    row.style.display = '';
                    lockEl.querySelector('.premium-unlock-btn').style.display = 'none';
                    setTimeout(() => lockEl.querySelector('.premium-code-input').focus(), 50);
                });

                // Inline verify
                const verifyBtn = lockEl.querySelector('.premium-verify-btn');
                const inlineInput = lockEl.querySelector('.premium-code-input');
                const inlineError = lockEl.querySelector('.premium-download-lock-error');

                const tryInlineUnlock = () => {
                    const code = inlineInput.value.trim();
                    if (!code) {
                        inlineError.textContent = 'Introduce un c\u00F3digo.';
                        inlineError.style.display = '';
                        return;
                    }
                    let anySuccess = false;
                    lockedFeatures.forEach(f => {
                        if (validateCode(f, code)) {
                            _unlocked[f] = true;
                            anySuccess = true;
                        }
                    });
                    if (anySuccess) {
                        saveUnlocked();
                        checkFeatureUsage();
                        document.dispatchEvent(new CustomEvent('premium:unlocked', {}));
                    } else {
                        inlineError.textContent = 'C\u00F3digo no v\u00E1lido. Int\u00E9ntalo de nuevo.';
                        inlineError.style.display = '';
                        inlineInput.select();
                    }
                };

                verifyBtn.addEventListener('click', tryInlineUnlock);
                inlineInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') tryInlineUnlock();
                    inlineError.style.display = 'none';
                });
            }

            _downloadPanel.setAttribute('data-premium-download-locked', '');

        } else {
            // No premium features in use — enable everything
            if (lockEl) lockEl.remove();
            _downloadPanel.querySelectorAll('.stl-download-buttons .btn').forEach(b => {
                b.disabled = false;
            });
            _downloadPanel.removeAttribute('data-premium-download-locked');
        }
    }

    // ── Unlock dialog (fallback, called from public API) ────

    function showUnlockDialog(feature) {
        const info = PREMIUM_FEATURES[feature] || { label: feature };

        const existing = document.getElementById('premium-unlock-dialog');
        if (existing) existing.remove();

        const backdrop = document.createElement('div');
        backdrop.id = 'premium-unlock-dialog';
        backdrop.className = 'premium-dialog-backdrop';

        const dialog = document.createElement('div');
        dialog.className = 'premium-dialog';

        dialog.innerHTML =
            '<div class="premium-dialog-header">' +
                '<h3>\u2605 Desbloquear: ' + _escHtml(info.label) + '</h3>' +
                '<button class="modal-close premium-dialog-close">&times;</button>' +
            '</div>' +
            '<p class="premium-dialog-text">Introduce tu c\u00F3digo premium para activar esta funcionalidad.</p>' +
            '<div class="premium-dialog-input-row">' +
                '<input type="text" class="premium-code-input" placeholder="C\u00F3digo premium" autocomplete="off" spellcheck="false">' +
            '</div>' +
            '<div class="premium-dialog-error" style="display:none;"></div>' +
            '<div class="premium-dialog-actions">' +
                '<button class="btn btn-secondary premium-dialog-cancel">Cancelar</button>' +
                '<button class="btn btn-primary premium-dialog-submit">Activar</button>' +
            '</div>';

        backdrop.appendChild(dialog);
        document.body.appendChild(backdrop);

        const input = dialog.querySelector('.premium-code-input');
        const errorEl = dialog.querySelector('.premium-dialog-error');
        const submitBtn = dialog.querySelector('.premium-dialog-submit');
        const cancelBtn = dialog.querySelector('.premium-dialog-cancel');
        const closeBtn = dialog.querySelector('.premium-dialog-close');

        setTimeout(() => input.focus(), 50);
        const close = () => backdrop.remove();

        cancelBtn.addEventListener('click', close);
        closeBtn.addEventListener('click', close);
        backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

        const tryUnlock = () => {
            const code = input.value.trim();
            if (!code) {
                errorEl.textContent = 'Introduce un c\u00F3digo.';
                errorEl.style.display = '';
                return;
            }
            if (validateCode(feature, code)) {
                _unlocked[feature] = true;
                saveUnlocked();
                close();
                checkFeatureUsage();
                document.dispatchEvent(new CustomEvent('premium:unlocked', { detail: { feature } }));
            } else {
                errorEl.textContent = 'C\u00F3digo no v\u00E1lido.';
                errorEl.style.display = '';
                input.select();
            }
        };

        submitBtn.addEventListener('click', tryUnlock);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') tryUnlock();
            else if (e.key === 'Escape') close();
            errorEl.style.display = 'none';
        });
    }

    // ── Code validation ─────────────────────────────────────

    function validateCode(feature, code) {
        const info = PREMIUM_FEATURES[feature];
        if (!info || !info.code) return false;
        return code.toUpperCase() === info.code.toUpperCase();
    }

    // ── Init ────────────────────────────────────────────────

    function init() {
        loadUnlocked();

        document.querySelectorAll('[data-premium]').forEach(el => {
            watchFeature(el);
        });

        // Snapshot select values NOW — applyDefaults() in app.js runs before DOMContentLoaded
        // so this captures the real programmatic defaults, not the HTML first-option order.
        document.querySelectorAll('[data-premium] select').forEach(sel => {
            _selectBaseline.set(sel, sel.value);
        });

        setupTooltip();
        checkFeatureUsage();

        // Setup button tooltips after first render
        _downloadPanel = document.querySelector('.download-panel');
        setupButtonTooltips();
    }

    // ── Public API ──────────────────────────────────────────

    function unlock(feature) {
        _unlocked[feature] = true;
        saveUnlocked();
        checkFeatureUsage();
        document.dispatchEvent(new CustomEvent('premium:unlocked', { detail: { feature } }));
    }

    function lock(feature) {
        delete _unlocked[feature];
        saveUnlocked();
        checkFeatureUsage();
    }

    function isFeatureUnlocked(f) { return isUnlocked(f); }
    function isFeatureUsed(f) { return _usedFeatures.has(f); }

    function markUsed(f) { _usedFeatures.add(f); updateDownloadPanel(); }
    function markUnused(f) { _usedFeatures.delete(f); updateDownloadPanel(); }

    function resetAll() {
        Object.keys(_unlocked).forEach(f => delete _unlocked[f]);
        saveUnlocked();
        location.reload();
    }

    function _escHtml(s) {
        const d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        init, unlock, lock,
        isFeatureUnlocked, isFeatureUsed,
        markUsed, markUnused,
        resetAll, showUnlockDialog,
        updateDownloadPanel, checkFeatureUsage
    };
})();
