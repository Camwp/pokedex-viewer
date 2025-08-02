(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))c(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function c(o){if(o.ep)return;o.ep=!0;const a=n(o);fetch(o.href,a)}})();const L="https://pokeapi.co/api/v2";function b(e,t,n){console.error(`[${e}] Fetch failed: ${t} — Status ${n.status} ${n.statusText}`)}async function j(e){const t=`${L}/pokemon/${e}`,n=await fetch(t);if(!n.ok)throw b("fetchPokemon",t,n),new Error("Pokémon not found");return n.json()}async function q(e){const t=`${L}/pokemon-species/${e}`,n=await fetch(t);return n.ok?n.json():(console.warn(`Species not found for query: ${e}`),{})}async function z(e){const t=`${L}/pokemon-form/${e}`,n=await fetch(t);if(!n.ok)throw b("fetchForm",t,n),new Error("Form not found");return n.json()}async function R(e){const t=await fetch(e);if(!t.ok)throw b("fetchEvolutionChain",e,t),new Error("Evolution chain not found");return t.json()}async function V(e){if(!e)return console.warn("[fetchAbility] Called with undefined or null ability name"),null;const t=`${L}/ability/${e}`,n=await fetch(t);if(!n.ok)throw b("fetchAbility",t,n),new Error(`Failed to fetch ability: ${e}`);return n.json()}async function G(e){try{const t=await j(e);if(!t)return{notFound:!0};const n=t.id,c=await q(n);let o={is_mega:!1};try{const f=await z(n);f&&(o=f)}catch{}let a={};try{c?.evolution_chain?.url&&(a=await R(c.evolution_chain.url))}catch{}const i=t.abilities?await Promise.all(t.abilities.map(f=>V(f.ability.name).catch(()=>null))):[];return{pokemon:t,species:c,form:o,evolution:a,abilities:i}}catch(t){return console.error("[loadFullPokemon] Unexpected error:",t),{notFound:!0}}}async function J(e){const t=await fetch(`https://pokeapi.co/api/v2/move/${e.toLowerCase()}`);if(!t.ok)throw new Error("Failed to fetch move data");return t.json()}async function K(e=1025,t=0){const n=`${L}/pokemon?limit=${e}&offset=${t}`,c=await fetch(n);if(!c.ok)throw b("fetchPokemonList",n,c),new Error("Failed to fetch Pokémon list");return(await c.json()).results}async function W(){}const H=document.getElementById("pokemonCard"),M=document.getElementById("loader"),S=document.getElementById("pokemonList"),X={normal:"#fffed4ff",fire:"#fee3cfff",water:"#d0dfffff",electric:"#fff6d4ff",grass:"#dff5e1",ice:"#d8fffdff",fighting:"#ffd0ceff",poison:"#ffc2feff",ground:"#ffefc7ff",flying:"#dfd4ffff",psychic:"#ffe2eaff",bug:"#f9ffcfff",rock:"#fff7ceff",ghost:"#e8d7ffff",dragon:"#e5daffff",dark:"#ffe8d9ff",steel:"#e4e4fdff",fairy:"#ffd7ebff"},Q={normal:"#A8A77A",fire:"#EE8130",water:"#6390F0",electric:"#F7D02C",grass:"#4CAF50",ice:"#96D9D6",fighting:"#C22E28",poison:"#A33EA1",ground:"#E2BF65",flying:"#A98FF3",psychic:"#F95587",bug:"#A6B91A",rock:"#B6A136",ghost:"#735797",dragon:"#6F35FC",dark:"#705746",steel:"#B7B7CE",fairy:"#D685AD"};async function Z({pokemon:e,species:t,form:n,evolution:c,abilities:o},a){if(!e||!t){O("Missing Pokémon or species data.");return}document.body.style.backgroundImage=`url('${a}')`,document.body.style.backgroundSize="cover",document.body.style.backgroundPosition="center",document.body.style.backgroundAttachment="fixed";const i=r=>r.charAt(0).toUpperCase()+r.slice(1),f=e.types[0]?.type?.name||"normal",g=X[f]||"#fff",l=Q[f]||"#fff",w=e.types.map(r=>i(r.type.name)).join(", "),$=e.stats.map(r=>`<tr><td>${i(r.stat.name)}</td><td>${r.base_stat}</td></tr>`).join(""),_=e.moves.map(r=>`
        <li class="clickable-move" data-move="${r.move.name}">${i(r.move.name)}</li>
      `).join(""),I=e.held_items.map(r=>`<li><strong style="color: ${l}">${i(r.item.name)}</strong>: ${r.version_details.map(h=>`${i(h.version.name)} (Rarity: ${h.rarity})`).join(", ")}</li>`).join("")||"<li>None</li>",E=e.game_indices.map(r=>i(r.version.name)).join(", "),p=e.abilities.map(r=>`${i(r.ability.name)} ${r.is_hidden?"(Hidden)":""}`).join(", "),k=t.genera.find(r=>r.language.name==="en")?.genus||"",s=t.flavor_text_entries.find(r=>r.language.name==="en")?.flavor_text||"",d=n?.is_mega,m=e.cries?.latest,u=e.sprites?.other?.["official-artwork"]?.front_default,B=e.sprites?.other?.["official-artwork"]?.front_shiny,C=e.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default,T=t.egg_groups.map(r=>i(r.name)).join(", "),N=o.map(r=>`<li><strong style="color: ${l}">${i(r.name)}</strong>: ${r.effect_entries.find(h=>h.language.name==="en")?.effect||"No info"}</li>`).join(""),P=await ee(c.chain,g);H.innerHTML=`
      <div class="pokedex-container" style="background-color: ${g}; border: 3px solid ${l};">

        <h2 style="color:${l}">#${e.id} ${i(e.name)} <small>${k}</small></h2>

        <div class="overview">
          <img src="${u}" alt="${e.name}" />
          <div class="info-box">
            <p><strong style="color: ${l}">Type:</strong> ${w}</p>
            <p><strong style="color: ${l}">Height:</strong> ${e.height}</p>
            <p><strong style="color: ${l}">Weight:</strong> ${e.weight}</p>
            <p><strong style="color: ${l}">Base XP:</strong> ${e.base_experience}</p>
            <p><strong style="color: ${l}">Abilities:</strong> ${p}</p>
            <p><strong style="color: ${l}">Egg Groups:</strong> ${T}</p>
            <p><strong style="color: ${l}">Color:</strong> ${i(t.color.name)}</p>
            <p><strong style="color: ${l}">Color:</strong> ${i(t?.color?.name??"Unknown")}</p>
            <p><strong style="color: ${l}">Capture Rate:</strong> ${t?.capture_rate??"Unknown"}</p>
            <p><strong style="color: ${l}">Base Happiness:</strong> ${t?.base_happiness??"Unknown"}</p>
            <p><strong style="color: ${l}">Legendary:</strong> ${t?.is_legendary?"Yes":"No"}</p>
            <p><strong style="color: ${l}">Mythical:</strong> ${t?.is_mythical?"Yes":"No"}</p>

            <p><strong style="color: ${l}">Is Mega:</strong> ${d}</p>
          </div>
        </div>

        <h3>Flavor Text</h3>
        <p class="flavor-text">${s}</p>

        <h3>Base Stats</h3>
        <table class="stats-table">
          <tbody>${$}</tbody>
        </table>

        <h3>Abilities (Detailed)</h3>
        <ul>${N}</ul>

        <h3>Held Items</h3>
        <ul>${I}</ul>

        <h3>Game Appearances</h3>
        <p>${E}</p>

        <h3>Moves</h3>
        <ul class="moves-list">${_}</ul>

        ${P?`
        <h3>Evolution Chain</h3>
        <div class="evolution-chain" style="background-color: ${g}">${P}</div>`:""}
        
        
        

        ${m?`
            <div class="cryContainer" style="text-align: center">
        <h3>Pokémon Cry</h3>
        <audio controls id="audioControls">
          <source src="${m}" type="audio/ogg">
        </audio>
        </div>`:""}

        <div class="spriteContainer" style="text-align: center">
        <h3>Sprites</h3>
        <div class="sprite-preview" style="display: inline-flex">
          ${u?`<div><p>Official</p><img src="${u}" /></div>`:""}
          ${B?`<div><p>Shiny</p><img src="${B}" /></div>`:""}
          ${C?`<div><p>Animated</p><img src="${C}" /></div>`:""}
        </div>
        </div>
      </div>
      <div id="movePopup" class="move-popup hidden"></div>

    `,document.querySelectorAll(".clickable-move").forEach(r=>{r.addEventListener("click",async h=>{const D=r.dataset.move,v=document.getElementById("movePopup");try{const y=await J(D),x=y.effect_entries.find(Y=>Y.language.name==="en"),U=x?x.short_effect.replace(/\$effect_chance/g,y.effect_chance):"No description.";v.innerHTML=`
              <strong>${i(y.name)}</strong><br>
              <strong>Type:</strong> ${i(y.type.name)}<br>
              <strong>Power:</strong> ${y.power??"—"}<br>
              <strong>Accuracy:</strong> ${y.accuracy??"—"}<br>
              <strong>PP:</strong> ${y.pp}<br>
              <strong>Effect:</strong> ${U}
            `;const F=r.getBoundingClientRect();v.style.top=`${window.scrollY+F.top-v.offsetHeight-10}px`,v.style.left=`${window.scrollX+F.left}px`,v.classList.remove("hidden")}catch{v.innerHTML="<strong>Error loading move.</strong>",v.classList.remove("hidden")}})}),document.addEventListener("click",r=>{const h=document.getElementById("movePopup");r.target.closest(".clickable-move")||h.classList.add("hidden")})}async function ee(e,t){if(!e)return"";const n=[];async function c(o,a=null){const i=o?.species?.name;if(i){try{const g=(await j(i)).sprites.front_default||"";n.push({name:i,img:g,minLevel:a})}catch(f){console.error("Failed to fetch evolution Pokémon:",i,f)}if(o.evolves_to?.length)for(const f of o.evolves_to){const g=f.evolution_details?.[0]?.min_level??null;await c(f,g)}}}return await c(e),n.map((o,a)=>`
        <div class="evolution-stage" style="background-color: ${t}">
            <img src="${o.img}" alt="${A(o.name)}" />
            <p>${A(o.name)}</p>
            ${o.minLevel!==null?`<div>Lv. ${o.minLevel}</div>`:"Lv. 1"}
        </div>
    `).join('<span class="arrow">➡</span>')}function te(e,t){S.innerHTML="",e.forEach(n=>{const c=document.createElement("li");c.textContent=A(n.name),c.style.cursor="pointer",c.addEventListener("click",()=>{document.getElementById("homeLink").click(),t(n.name)}),S.appendChild(c)})}function O(e){H.innerHTML=`<p style="color:red;">${e}</p>`}function ne(){M.classList.remove("hidden")}function oe(){M.classList.add("hidden")}function A(e){return e.charAt(0).toUpperCase()+e.slice(1)}document.addEventListener("DOMContentLoaded",async()=>{const e=document.getElementById("searchBtn"),t=document.getElementById("searchInput"),n=document.getElementById("homeLink"),c=document.getElementById("listLink"),o=document.getElementById("detailView"),a=document.getElementById("listView"),i=document.getElementById("prevBtn"),f=document.getElementById("nextBtn"),g=document.getElementById("clearHistoryBtn");if(!n||!c||!o||!a||!i||!f){console.error("One or more navigation elements not found in DOM.");return}let l=1,w="";g?.addEventListener("click",()=>{localStorage.removeItem($),E()});try{w=await W()}catch(s){console.error("Failed to fetch background:",s),w=""}const $="pokemonHistory";function _(s){if(window.innerWidth<768)return;let d=JSON.parse(localStorage.getItem($))||[];d=d.filter(m=>m.id!==s.id),d.unshift({id:s.id,name:s.name}),d=d.slice(0,10),localStorage.setItem($,JSON.stringify(d)),E()}function I(s){return s.charAt(0).toUpperCase()+s.slice(1)}function E(){const s=document.getElementById("historyList");if(!s)return;s.innerHTML="",(JSON.parse(localStorage.getItem($))||[]).forEach(m=>{const u=document.createElement("li");u.textContent=`#${m.id} ${I(m.name)}`,u.style.cursor="pointer",u.style.listStyle="none",u.addEventListener("click",()=>{document.getElementById("homeLink").click(),p(m.id)}),s.appendChild(u)})}const p=async s=>{try{ne();const{pokemon:d,species:m,form:u,evolution:B,abilities:C}=await G(s);Z({pokemon:d,species:m,form:u,evolution:B,abilities:C},w),l=d.id,_(d)}catch(d){O(d.message)}finally{oe()}};e.addEventListener("click",()=>{const s=t.value.trim().toLowerCase();s&&p(s)});function k(s){document.querySelectorAll("nav a").forEach(d=>d.classList.remove("active")),s.classList.add("active")}n.addEventListener("click",s=>{s.preventDefault(),o.classList.remove("hidden"),a.classList.add("hidden"),k(n)}),c.addEventListener("click",async s=>{s.preventDefault(),o.classList.add("hidden"),a.classList.remove("hidden"),k(c);const d=await K(1025,0);te(d,p)}),i.addEventListener("click",()=>{l>1&&p(l-1)}),f.addEventListener("click",()=>{p(l+1)}),p(1),E()});
