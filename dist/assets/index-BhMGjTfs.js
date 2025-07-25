(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const p="https://pokeapi.co/api/v2";function g(t,e,n){console.error(`[${t}] Fetch failed: ${e} — Status ${n.status} ${n.statusText}`)}async function I(t){const e=`${p}/pokemon/${t}`,n=await fetch(e);if(!n.ok)throw g("fetchPokemon",e,n),new Error("Pokémon not found");return n.json()}async function x(t){const e=`${p}/pokemon-species/${t}`,n=await fetch(e);return n.ok?n.json():(console.warn(`Species not found for query: ${t}`),{})}async function M(t){const e=`${p}/pokemon-form/${t}`,n=await fetch(e);if(!n.ok)throw g("fetchForm",e,n),new Error("Form not found");return n.json()}async function O(t){const e=await fetch(t);if(!e.ok)throw g("fetchEvolutionChain",t,e),new Error("Evolution chain not found");return e.json()}async function S(t){if(!t)return console.warn("[fetchAbility] Called with undefined or null ability name"),null;const e=`${p}/ability/${t}`,n=await fetch(e);if(!n.ok)throw g("fetchAbility",e,n),new Error(`Failed to fetch ability: ${t}`);return n.json()}async function N(t){try{const e=await I(t);if(!e)return{notFound:!0};const n=e.id,i=await x(n);let o={is_mega:!1};try{const d=await M(n);d&&(o=d)}catch{}let s={};try{i?.evolution_chain?.url&&(s=await O(i.evolution_chain.url))}catch{}const a=e.abilities?await Promise.all(e.abilities.map(d=>S(d.ability.name).catch(()=>null))):[];return{pokemon:e,species:i,form:o,evolution:s,abilities:a}}catch(e){return console.error("[loadFullPokemon] Unexpected error:",e),{notFound:!0}}}async function H(t=1025,e=0){const n=`${p}/pokemon?limit=${t}&offset=${e}`,i=await fetch(n);if(!i.ok)throw g("fetchPokemonList",n,i),new Error("Failed to fetch Pokémon list");return(await i.json()).results}async function T(){}const P=document.getElementById("pokemonCard"),C=document.getElementById("loader"),B=document.getElementById("pokemonList");async function D({pokemon:t,species:e,form:n,evolution:i,abilities:o},s){if(!t||!e){j("Missing Pokémon or species data.");return}document.body.style.backgroundImage=`url('${s}')`,document.body.style.backgroundSize="cover",document.body.style.backgroundPosition="center",document.body.style.backgroundAttachment="fixed";const a=r=>r.charAt(0).toUpperCase()+r.slice(1),d=t.types.map(r=>a(r.type.name)).join(", "),m=t.stats.map(r=>`<tr><td>${a(r.stat.name)}</td><td>${r.base_stat}</td></tr>`).join(""),f=t.moves.map(r=>`<li>${a(r.move.name)}</li>`).join(""),u=t.held_items.map(r=>`<li><strong>${a(r.item.name)}</strong>: ${r.version_details.map($=>`${a($.version.name)} (Rarity: ${$.rarity})`).join(", ")}</li>`).join("")||"<li>None</li>",y=t.game_indices.map(r=>a(r.version.name)).join(", "),c=t.abilities.map(r=>`${a(r.ability.name)} ${r.is_hidden?"(Hidden)":""}`).join(", "),l=e.genera.find(r=>r.language.name==="en")?.genus||"",w=e.flavor_text_entries.find(r=>r.language.name==="en")?.flavor_text||"",b=n?.is_mega,v=t.cries?.latest,h=t.sprites?.other?.["official-artwork"]?.front_default,E=t.sprites?.other?.["official-artwork"]?.front_shiny,k=t.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default,A=e.egg_groups.map(r=>a(r.name)).join(", "),F=o.map(r=>`<li><strong>${a(r.name)}</strong>: ${r.effect_entries.find($=>$.language.name==="en")?.effect||"No info"}</li>`).join(""),_=await U(i.chain);P.innerHTML=`
      <div class="pokedex-container">
        <h2>#${t.id} ${a(t.name)} <small>${l}</small></h2>

        <div class="overview">
          <img src="${h}" alt="${t.name}" />
          <div>
            <p><strong>Type:</strong> ${d}</p>
            <p><strong>Height:</strong> ${t.height}</p>
            <p><strong>Weight:</strong> ${t.weight}</p>
            <p><strong>Base XP:</strong> ${t.base_experience}</p>
            <p><strong>Abilities:</strong> ${c}</p>
            <p><strong>Egg Groups:</strong> ${A}</p>
            <p><strong>Color:</strong> ${a(e.color.name)}</p>
            <p><strong>Color:</strong> ${a(e?.color?.name??"Unknown")}</p>
            <p><strong>Capture Rate:</strong> ${e?.capture_rate??"Unknown"}</p>
            <p><strong>Base Happiness:</strong> ${e?.base_happiness??"Unknown"}</p>
            <p><strong>Legendary:</strong> ${e?.is_legendary?"Yes":"No"}</p>
            <p><strong>Mythical:</strong> ${e?.is_mythical?"Yes":"No"}</p>

            <p><strong>Is Mega:</strong> ${b}</p>
          </div>
        </div>

        <h3>Flavor Text</h3>
        <p class="flavor-text">${w}</p>

        <h3>Base Stats</h3>
        <table class="stats-table">
          <tbody>${m}</tbody>
        </table>

        <h3>Abilities (Detailed)</h3>
        <ul>${F}</ul>

        <h3>Held Items</h3>
        <ul>${u}</ul>

        <h3>Game Appearances</h3>
        <p>${y}</p>

        <h3>Moves</h3>
        <ul class="moves-list">${f}</ul>

        ${_?`
        <h3>Evolution Chain</h3>
        <div class="evolution-chain">${_}</div>`:""}

        ${v?`
        <h3>Pokémon Cry</h3>
        <audio controls id="audioControls">
          <source src="${v}" type="audio/ogg">
        </audio>`:""}

        <h3>Sprites</h3>
        <div class="sprite-preview">
          ${h?`<div><p>Official</p><img src="${h}" /></div>`:""}
          ${E?`<div><p>Shiny</p><img src="${E}" /></div>`:""}
          ${k?`<div><p>Animated</p><img src="${k}" /></div>`:""}
        </div>
      </div>
    `}async function U(t){if(!t)return"";const e=[];async function n(i){const o=i?.species?.name;if(o){try{const a=(await I(o)).sprites.front_default||"";e.push({name:o,img:a})}catch(s){console.error("Failed to fetch evolution Pokémon:",o,s)}if(i.evolves_to?.length)for(const s of i.evolves_to)await n(s)}}return await n(t),e.map(i=>`
        <div class="evolution-stage">
            <img src="${i.img}" alt="${L(i.name)}" />
            <p>${L(i.name)}</p>
        </div>
    `).join('<span class="arrow">➡</span>')}function V(t,e){B.innerHTML="",t.forEach(n=>{const i=document.createElement("li");i.textContent=L(n.name),i.style.cursor="pointer",i.addEventListener("click",()=>{document.getElementById("homeLink").click(),e(n.name)}),B.appendChild(i)})}function j(t){P.innerHTML=`<p style="color:red;">${t}</p>`}function q(){C.classList.remove("hidden")}function z(){C.classList.add("hidden")}function L(t){return t.charAt(0).toUpperCase()+t.slice(1)}document.addEventListener("DOMContentLoaded",async()=>{const t=document.getElementById("searchBtn"),e=document.getElementById("searchInput"),n=document.getElementById("homeLink"),i=document.getElementById("listLink"),o=document.getElementById("detailView"),s=document.getElementById("listView"),a=document.getElementById("prevBtn"),d=document.getElementById("nextBtn");if(!n||!i||!o||!s||!a||!d){console.error("One or more navigation elements not found in DOM.");return}let m=1,f="";try{f=await T()}catch(c){console.error("Failed to fetch background:",c),f=""}const u=async c=>{try{q();const{pokemon:l,species:w,form:b,evolution:v,abilities:h}=await N(c);D({pokemon:l,species:w,form:b,evolution:v,abilities:h},f),m=l.id}catch(l){j(l.message)}finally{z()}};t.addEventListener("click",()=>{const c=e.value.trim().toLowerCase();c&&u(c)});function y(c){document.querySelectorAll("nav a").forEach(l=>l.classList.remove("active")),c.classList.add("active")}n.addEventListener("click",c=>{c.preventDefault(),o.classList.remove("hidden"),s.classList.add("hidden"),y(n)}),i.addEventListener("click",async c=>{c.preventDefault(),o.classList.add("hidden"),s.classList.remove("hidden"),y(i);const l=await H(1025,0);V(l,u)}),a.addEventListener("click",()=>{m>1&&u(m-1)}),d.addEventListener("click",()=>{u(m+1)}),u(1)});
