(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))c(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function o(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function c(r){if(r.ep)return;r.ep=!0;const a=o(r);fetch(r.href,a)}})();const k="https://pokeapi.co/api/v2";function L(e,t,o){console.error(`[${e}] Fetch failed: ${t} — Status ${o.status} ${o.statusText}`)}async function j(e){const t=`${k}/pokemon/${e}`,o=await fetch(t);if(!o.ok)throw L("fetchPokemon",t,o),new Error("Pokémon not found");return o.json()}async function q(e){const t=`${k}/pokemon-species/${e}`,o=await fetch(t);return o.ok?o.json():(console.warn(`Species not found for query: ${e}`),{})}async function Y(e){const t=`${k}/pokemon-form/${e}`,o=await fetch(t);if(!o.ok)throw L("fetchForm",t,o),new Error("Form not found");return o.json()}async function z(e){const t=await fetch(e);if(!t.ok)throw L("fetchEvolutionChain",e,t),new Error("Evolution chain not found");return t.json()}async function R(e){if(!e)return console.warn("[fetchAbility] Called with undefined or null ability name"),null;const t=`${k}/ability/${e}`,o=await fetch(t);if(!o.ok)throw L("fetchAbility",t,o),new Error(`Failed to fetch ability: ${e}`);return o.json()}async function V(e){try{const t=await j(e);if(!t)return{notFound:!0};const o=t.id,c=await q(o);let r={is_mega:!1};try{const f=await Y(o);f&&(r=f)}catch{console.log("catch load full pokemon")}let a={};try{c?.evolution_chain?.url&&(a=await z(c.evolution_chain.url))}catch{console.log("catch load full pokemon")}const i=t.abilities?await Promise.all(t.abilities.map(f=>R(f.ability.name).catch(()=>null))):[];return{pokemon:t,species:c,form:r,evolution:a,abilities:i}}catch(t){return console.error("[loadFullPokemon] Unexpected error:",t),{notFound:!0}}}async function G(e){const t=await fetch(`https://pokeapi.co/api/v2/move/${e.toLowerCase()}`);if(!t.ok)throw new Error("Failed to fetch move data");return t.json()}async function J(e=1025,t=0){const o=`${k}/pokemon?limit=${e}&offset=${t}`,c=await fetch(o);if(!c.ok)throw L("fetchPokemonList",o,c),new Error("Failed to fetch Pokémon list");return(await c.json()).results}async function K(){}const H=document.getElementById("pokemonCard"),M=document.getElementById("loader"),S=document.getElementById("pokemonList"),W={normal:"#fffed4ff",fire:"#fee3cfff",water:"#d0dfffff",electric:"#fff6d4ff",grass:"#dff5e1",ice:"#d8fffdff",fighting:"#ffd0ceff",poison:"#ffc2feff",ground:"#ffefc7ff",flying:"#dfd4ffff",psychic:"#ffe2eaff",bug:"#f9ffcfff",rock:"#fff7ceff",ghost:"#e8d7ffff",dragon:"#e5daffff",dark:"#ffe8d9ff",steel:"#e4e4fdff",fairy:"#ffd7ebff"},X={normal:"#A8A77A",fire:"#EE8130",water:"#6390F0",electric:"#F7D02C",grass:"#4CAF50",ice:"#96D9D6",fighting:"#C22E28",poison:"#A33EA1",ground:"#E2BF65",flying:"#A98FF3",psychic:"#F95587",bug:"#A6B91A",rock:"#B6A136",ghost:"#735797",dragon:"#6F35FC",dark:"#705746",steel:"#B7B7CE",fairy:"#D685AD"};async function Q({pokemon:e,species:t,form:o,evolution:c,abilities:r},a){if(!e||!t){O("Missing Pokémon or species data.");return}document.body.style.backgroundImage=`url('${a}')`,document.body.style.backgroundSize="cover",document.body.style.backgroundPosition="center",document.body.style.backgroundAttachment="fixed";const i=n=>n.charAt(0).toUpperCase()+n.slice(1),f=e.types[0]?.type?.name||"normal",p=W[f]||"#fff",l=X[f]||"#fff",w=e.types.map(n=>i(n.type.name)).join(", "),$=e.stats.map(n=>`<tr><td>${i(n.stat.name)}</td><td>${n.base_stat}</td></tr>`).join(""),_=e.moves.map(n=>`
        <li class="clickable-move" data-move="${n.move.name}">${i(n.move.name)}</li>
      `).join(""),I=e.held_items.map(n=>`<li><strong style="color: ${l}">${i(n.item.name)}</strong>: ${n.version_details.map(m=>`${i(m.version.name)} (Rarity: ${m.rarity})`).join(", ")}</li>`).join("")||"<li>None</li>",E=e.game_indices.map(n=>i(n.version.name)).join(", "),y=e.abilities.map(n=>`${i(n.ability.name)} ${n.is_hidden?"(Hidden)":""}`).join(", "),b=t.genera.find(n=>n.language.name==="en")?.genus||"",s=t.flavor_text_entries.find(n=>n.language.name==="en")?.flavor_text||"",d=o?.is_mega,g=e.cries?.latest,u=e.sprites?.other?.["official-artwork"]?.front_default,B=e.sprites?.other?.["official-artwork"]?.front_shiny,C=e.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default,T=t.egg_groups.map(n=>i(n.name)).join(", "),N=r.map(n=>`<li><strong style="color: ${l}">${i(n.name)}</strong>: ${n.effect_entries.find(m=>m.language.name==="en")?.effect||"No info"}</li>`).join(""),P=await Z(c.chain,p);H.innerHTML=`
      <div class="pokedex-container" style="background-color: ${p}; border: 3px solid ${l};">

        <h2 style="color:${l}">#${e.id} ${i(e.name)} <small>${b}</small></h2>

        <div class="overview">
          <img src="${u}" alt="${e.name}" />
          <div class="info-box">
            <p><strong style="color: ${l}">Type:</strong> ${w}</p>
            <p><strong style="color: ${l}">Height:</strong> ${e.height}</p>
            <p><strong style="color: ${l}">Weight:</strong> ${e.weight}</p>
            <p><strong style="color: ${l}">Base XP:</strong> ${e.base_experience}</p>
            <p><strong style="color: ${l}">Abilities:</strong> ${y}</p>
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
        <div class="evolution-chain" style="background-color: ${p}">${P}</div>`:""}
        
        
        

        ${g?`
            <div class="cryContainer" style="text-align: center">
        <h3>Pokémon Cry</h3>
        <audio controls id="audioControls">
          <source src="${g}" type="audio/ogg">
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

    `,document.querySelectorAll(".evolution-stage").forEach(n=>{n.style.cursor="pointer",n.addEventListener("click",()=>{const m=n.dataset.name;m&&window.loadPokemon&&(document.getElementById("homeLink")?.click(),window.loadPokemon(m))})}),document.querySelectorAll(".clickable-move").forEach(n=>{n.addEventListener("click",async()=>{const m=n.dataset.move,v=document.getElementById("movePopup");try{const h=await G(m),F=h.effect_entries.find(U=>U.language.name==="en"),D=F?F.short_effect.replace(/\$effect_chance/g,h.effect_chance):"No description.";v.innerHTML=`
              <strong>${i(h.name)}</strong><br>
              <strong>Type:</strong> ${i(h.type.name)}<br>
              <strong>Power:</strong> ${h.power??"—"}<br>
              <strong>Accuracy:</strong> ${h.accuracy??"—"}<br>
              <strong>PP:</strong> ${h.pp}<br>
              <strong>Effect:</strong> ${D}
            `;const x=n.getBoundingClientRect();v.style.top=`${window.scrollY+x.top-v.offsetHeight-10}px`,v.style.left=`${window.scrollX+x.left}px`,v.classList.remove("hidden")}catch{v.innerHTML="<strong>Error loading move.</strong>",v.classList.remove("hidden")}})}),document.addEventListener("click",n=>{const m=document.getElementById("movePopup");n.target.closest(".clickable-move")||m.classList.add("hidden")})}async function Z(e,t){if(!e)return"";const o=[];async function c(r,a=null){const i=r?.species?.name;if(i){try{const p=(await j(i)).sprites.front_default||"";o.push({name:i,img:p,minLevel:a})}catch(f){console.error("Failed to fetch evolution Pokémon:",i,f)}if(r.evolves_to?.length)for(const f of r.evolves_to){const p=f.evolution_details?.[0]?.min_level??null;await c(f,p)}}}return await c(e),o.map(r=>`
    <div class="evolution-stage" data-name="${r.name}" style="background-color: ${t}">
        <img src="${r.img}" alt="${A(r.name)}" />
        <p>${A(r.name)}</p>
        ${r.minLevel!==null?`<div>Lv. ${r.minLevel}</div>`:"Lv. 1"}
    </div>
`).join('<span class="arrow">➡</span>')}function ee(e,t){S.innerHTML="",e.forEach(o=>{const c=document.createElement("li");c.textContent=A(o.name),c.style.cursor="pointer",c.addEventListener("click",()=>{document.getElementById("homeLink").click(),t(o.name)}),S.appendChild(c)})}function O(e){H.innerHTML=`<p style="color:red;">${e}</p>`}function te(){M.classList.remove("hidden")}function oe(){M.classList.add("hidden")}function A(e){return e.charAt(0).toUpperCase()+e.slice(1)}document.addEventListener("DOMContentLoaded",async()=>{const e=document.getElementById("searchBtn"),t=document.getElementById("searchInput"),o=document.getElementById("homeLink"),c=document.getElementById("listLink"),r=document.getElementById("detailView"),a=document.getElementById("listView"),i=document.getElementById("prevBtn"),f=document.getElementById("nextBtn"),p=document.getElementById("clearHistoryBtn");if(!o||!c||!r||!a||!i||!f){console.error("One or more navigation elements not found in DOM.");return}let l=1,w="";p?.addEventListener("click",()=>{localStorage.removeItem($),E()});try{w=await K()}catch(s){console.error("Failed to fetch background:",s),w=""}const $="pokemonHistory";function _(s){if(window.innerWidth<768)return;let d=JSON.parse(localStorage.getItem($))||[];d=d.filter(g=>g.id!==s.id),d.unshift({id:s.id,name:s.name}),d=d.slice(0,10),localStorage.setItem($,JSON.stringify(d)),E()}function I(s){return s.charAt(0).toUpperCase()+s.slice(1)}function E(){const s=document.getElementById("historyList");if(!s)return;s.innerHTML="",(JSON.parse(localStorage.getItem($))||[]).forEach(g=>{const u=document.createElement("li");u.textContent=`#${g.id} ${I(g.name)}`,u.style.cursor="pointer",u.style.listStyle="none",u.addEventListener("click",()=>{document.getElementById("homeLink").click(),y(g.id)}),s.appendChild(u)})}const y=async s=>{try{te();const{pokemon:d,species:g,form:u,evolution:B,abilities:C}=await V(s);Q({pokemon:d,species:g,form:u,evolution:B,abilities:C},w),l=d.id,_(d)}catch(d){O(d.message)}finally{oe()}};window.loadPokemon=y,e.addEventListener("click",()=>{const s=t.value.trim().toLowerCase();s&&y(s)});function b(s){document.querySelectorAll("nav a").forEach(d=>d.classList.remove("active")),s.classList.add("active")}o.addEventListener("click",s=>{s.preventDefault(),r.classList.remove("hidden"),a.classList.add("hidden"),b(o)}),c.addEventListener("click",async s=>{s.preventDefault(),r.classList.add("hidden"),a.classList.remove("hidden"),b(c);const d=await J(1025,0);ee(d,y)}),i.addEventListener("click",()=>{l>1&&y(l-1)}),f.addEventListener("click",()=>{y(l+1)}),y(1),E()});
