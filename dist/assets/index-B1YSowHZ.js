(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))c(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function o(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function c(n){if(n.ep)return;n.ep=!0;const a=o(n);fetch(n.href,a)}})();const L="https://pokeapi.co/api/v2";function b(e,t,o){console.error(`[${e}] Fetch failed: ${t} — Status ${o.status} ${o.statusText}`)}async function j(e){const t=`${L}/pokemon/${e}`,o=await fetch(t);if(!o.ok)throw b("fetchPokemon",t,o),new Error("Pokémon not found");return o.json()}async function Y(e){const t=`${L}/pokemon-species/${e}`,o=await fetch(t);return o.ok?o.json():(console.warn(`Species not found for query: ${e}`),{})}async function q(e){const t=`${L}/pokemon-form/${e}`,o=await fetch(t);if(!o.ok)throw b("fetchForm",t,o),new Error("Form not found");return o.json()}async function z(e){const t=await fetch(e);if(!t.ok)throw b("fetchEvolutionChain",e,t),new Error("Evolution chain not found");return t.json()}async function R(e){if(!e)return console.warn("[fetchAbility] Called with undefined or null ability name"),null;const t=`${L}/ability/${e}`,o=await fetch(t);if(!o.ok)throw b("fetchAbility",t,o),new Error(`Failed to fetch ability: ${e}`);return o.json()}async function V(e){try{const t=await j(e);if(!t)return{notFound:!0};const o=t.id,c=await Y(o);let n={is_mega:!1};try{const f=await q(o);f&&(n=f)}catch{console.log("catch load full pokemon")}let a={};try{c?.evolution_chain?.url&&(a=await z(c.evolution_chain.url))}catch{console.log("catch load full pokemon")}const i=t.abilities?await Promise.all(t.abilities.map(f=>R(f.ability.name).catch(()=>null))):[];return{pokemon:t,species:c,form:n,evolution:a,abilities:i}}catch(t){return console.error("[loadFullPokemon] Unexpected error:",t),{notFound:!0}}}async function G(e){const t=await fetch(`https://pokeapi.co/api/v2/move/${e.toLowerCase()}`);if(!t.ok)throw new Error("Failed to fetch move data");return t.json()}async function J(e=1025,t=0){const o=`${L}/pokemon?limit=${e}&offset=${t}`,c=await fetch(o);if(!c.ok)throw b("fetchPokemonList",o,c),new Error("Failed to fetch Pokémon list");return(await c.json()).results}async function K(){}const H=document.getElementById("pokemonCard"),M=document.getElementById("loader"),S=document.getElementById("pokemonList"),W={normal:"#fffed4ff",fire:"#fee3cfff",water:"#d0dfffff",electric:"#fff6d4ff",grass:"#dff5e1",ice:"#d8fffdff",fighting:"#ffd0ceff",poison:"#ffc2feff",ground:"#ffefc7ff",flying:"#dfd4ffff",psychic:"#ffe2eaff",bug:"#f9ffcfff",rock:"#fff7ceff",ghost:"#e8d7ffff",dragon:"#e5daffff",dark:"#ffe8d9ff",steel:"#e4e4fdff",fairy:"#ffd7ebff"},X={normal:"#A8A77A",fire:"#EE8130",water:"#6390F0",electric:"#F7D02C",grass:"#4CAF50",ice:"#96D9D6",fighting:"#C22E28",poison:"#A33EA1",ground:"#E2BF65",flying:"#A98FF3",psychic:"#F95587",bug:"#A6B91A",rock:"#B6A136",ghost:"#735797",dragon:"#6F35FC",dark:"#705746",steel:"#B7B7CE",fairy:"#D685AD"};async function Q({pokemon:e,species:t,form:o,evolution:c,abilities:n},a){if(!e||!t){O("Missing Pokémon or species data.");return}document.body.style.backgroundImage=`url('${a}')`,document.body.style.backgroundSize="cover",document.body.style.backgroundPosition="center",document.body.style.backgroundAttachment="fixed";const i=r=>r.charAt(0).toUpperCase()+r.slice(1),f=e.types[0]?.type?.name||"normal",g=W[f]||"#fff",l=X[f]||"#fff",w=e.types.map(r=>i(r.type.name)).join(", "),$=e.stats.map(r=>`<tr><td>${i(r.stat.name)}</td><td>${r.base_stat}</td></tr>`).join(""),_=e.moves.map(r=>`
        <li class="clickable-move" data-move="${r.move.name}">${i(r.move.name)}</li>
      `).join(""),I=e.held_items.map(r=>`<li><strong style="color: ${l}">${i(r.item.name)}</strong>: ${r.version_details.map(y=>`${i(y.version.name)} (Rarity: ${y.rarity})`).join(", ")}</li>`).join("")||"<li>None</li>",E=e.game_indices.map(r=>i(r.version.name)).join(", "),p=e.abilities.map(r=>`${i(r.ability.name)} ${r.is_hidden?"(Hidden)":""}`).join(", "),k=t.genera.find(r=>r.language.name==="en")?.genus||"",s=t.flavor_text_entries.find(r=>r.language.name==="en")?.flavor_text||"",d=o?.is_mega,m=e.cries?.latest,u=e.sprites?.other?.["official-artwork"]?.front_default,B=e.sprites?.other?.["official-artwork"]?.front_shiny,C=e.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default,T=t.egg_groups.map(r=>i(r.name)).join(", "),N=n.map(r=>`<li><strong style="color: ${l}">${i(r.name)}</strong>: ${r.effect_entries.find(y=>y.language.name==="en")?.effect||"No info"}</li>`).join(""),P=await Z(c.chain,g);H.innerHTML=`
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

    `,document.querySelectorAll(".clickable-move").forEach(r=>{r.addEventListener("click",async()=>{const y=r.dataset.move,v=document.getElementById("movePopup");try{const h=await G(y),F=h.effect_entries.find(U=>U.language.name==="en"),D=F?F.short_effect.replace(/\$effect_chance/g,h.effect_chance):"No description.";v.innerHTML=`
              <strong>${i(h.name)}</strong><br>
              <strong>Type:</strong> ${i(h.type.name)}<br>
              <strong>Power:</strong> ${h.power??"—"}<br>
              <strong>Accuracy:</strong> ${h.accuracy??"—"}<br>
              <strong>PP:</strong> ${h.pp}<br>
              <strong>Effect:</strong> ${D}
            `;const x=r.getBoundingClientRect();v.style.top=`${window.scrollY+x.top-v.offsetHeight-10}px`,v.style.left=`${window.scrollX+x.left}px`,v.classList.remove("hidden")}catch{v.innerHTML="<strong>Error loading move.</strong>",v.classList.remove("hidden")}})}),document.addEventListener("click",r=>{const y=document.getElementById("movePopup");r.target.closest(".clickable-move")||y.classList.add("hidden")})}async function Z(e,t){if(!e)return"";const o=[];async function c(n,a=null){const i=n?.species?.name;if(i){try{const g=(await j(i)).sprites.front_default||"";o.push({name:i,img:g,minLevel:a})}catch(f){console.error("Failed to fetch evolution Pokémon:",i,f)}if(n.evolves_to?.length)for(const f of n.evolves_to){const g=f.evolution_details?.[0]?.min_level??null;await c(f,g)}}}return await c(e),o.map(n=>`
        <div class="evolution-stage" style="background-color: ${t}">
            <img src="${n.img}" alt="${A(n.name)}" />
            <p>${A(n.name)}</p>
            ${n.minLevel!==null?`<div>Lv. ${n.minLevel}</div>`:"Lv. 1"}
        </div>
    `).join('<span class="arrow">➡</span>')}function ee(e,t){S.innerHTML="",e.forEach(o=>{const c=document.createElement("li");c.textContent=A(o.name),c.style.cursor="pointer",c.addEventListener("click",()=>{document.getElementById("homeLink").click(),t(o.name)}),S.appendChild(c)})}function O(e){H.innerHTML=`<p style="color:red;">${e}</p>`}function te(){M.classList.remove("hidden")}function oe(){M.classList.add("hidden")}function A(e){return e.charAt(0).toUpperCase()+e.slice(1)}document.addEventListener("DOMContentLoaded",async()=>{const e=document.getElementById("searchBtn"),t=document.getElementById("searchInput"),o=document.getElementById("homeLink"),c=document.getElementById("listLink"),n=document.getElementById("detailView"),a=document.getElementById("listView"),i=document.getElementById("prevBtn"),f=document.getElementById("nextBtn"),g=document.getElementById("clearHistoryBtn");if(!o||!c||!n||!a||!i||!f){console.error("One or more navigation elements not found in DOM.");return}let l=1,w="";g?.addEventListener("click",()=>{localStorage.removeItem($),E()});try{w=await K()}catch(s){console.error("Failed to fetch background:",s),w=""}const $="pokemonHistory";function _(s){if(window.innerWidth<768)return;let d=JSON.parse(localStorage.getItem($))||[];d=d.filter(m=>m.id!==s.id),d.unshift({id:s.id,name:s.name}),d=d.slice(0,10),localStorage.setItem($,JSON.stringify(d)),E()}function I(s){return s.charAt(0).toUpperCase()+s.slice(1)}function E(){const s=document.getElementById("historyList");if(!s)return;s.innerHTML="",(JSON.parse(localStorage.getItem($))||[]).forEach(m=>{const u=document.createElement("li");u.textContent=`#${m.id} ${I(m.name)}`,u.style.cursor="pointer",u.style.listStyle="none",u.addEventListener("click",()=>{document.getElementById("homeLink").click(),p(m.id)}),s.appendChild(u)})}const p=async s=>{try{te();const{pokemon:d,species:m,form:u,evolution:B,abilities:C}=await V(s);Q({pokemon:d,species:m,form:u,evolution:B,abilities:C},w),l=d.id,_(d)}catch(d){O(d.message)}finally{oe()}};e.addEventListener("click",()=>{const s=t.value.trim().toLowerCase();s&&p(s)});function k(s){document.querySelectorAll("nav a").forEach(d=>d.classList.remove("active")),s.classList.add("active")}o.addEventListener("click",s=>{s.preventDefault(),n.classList.remove("hidden"),a.classList.add("hidden"),k(o)}),c.addEventListener("click",async s=>{s.preventDefault(),n.classList.add("hidden"),a.classList.remove("hidden"),k(c);const d=await J(1025,0);ee(d,p)}),i.addEventListener("click",()=>{l>1&&p(l-1)}),f.addEventListener("click",()=>{p(l+1)}),p(1),E()});
