// Only the few operations that need the game's own JavaScript realm live here.
// No extension API, network or storage is exposed to the page.
(() => {
  document.addEventListener('hvut:game', ({target: el}) => {
    const [op, arg] = JSON.parse(el.getAttribute('data-request'));
    let value;
    switch (op) {
      case 'equipment': value = { equip: window.dynjs_equip || {}, store: window.dynjs_eqstore || {} }; break;
      case 'armoryReady':
        value = !!window.common && (arg === 'purchase' ? typeof dynjs_eqstore !== 'undefined' : !!window.dynjs_equip) &&
          (arg === 'organize' || typeof eqitems !== 'undefined') && (arg !== 'salvage' || typeof itemdata !== 'undefined'); break;
      case 'armory': value = { dynjs_eqstore: typeof dynjs_eqstore !== 'undefined' && dynjs_eqstore,
        eqitems: typeof eqitems !== 'undefined' && eqitems, itemdata: typeof itemdata !== 'undefined' && itemdata }; break;
      case 'assign':
        if (arg.dynjs_eqstore) { if (typeof dynjs_eqstore === 'undefined') window.dynjs_eqstore = {}; Object.assign(dynjs_eqstore, arg.dynjs_eqstore); }
        if (arg.eqitems) { if (typeof eqitems === 'undefined') window.eqitems = {}; Object.assign(eqitems, arg.eqitems); }
        if (arg.itemdata) { if (typeof itemdata === 'undefined') window.itemdata = {}; Object.assign(itemdata, arg.itemdata); }
        break;
      case 'count': curr_hover_eqid = 0; selectable_count = arg; window.update_selected_count(); break;
      case 'exp': value = window.total_exp; break;
      case 'simulate': window.total_exp = arg; window.update_usable_exp(); window.update_display('str'); value = window.total_exp; break;
      case 'training': value = window.end_time; break;
      case 'display':
        window.common.get_dynamic_digit_string = n => `<div class="fc4 far fcb"><div>${n.toLocaleString()}</div></div>`;
        const keydown = document.onkeydown;
        if (keydown) document.onkeydown = e => { if (!['INPUT', 'TEXTAREA'].includes(e.target.nodeName)) keydown(e); };
        break;
      default: return;
    }
    el.setAttribute('data-result', JSON.stringify(value ?? null));
  });
})();
