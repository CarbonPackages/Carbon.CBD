(()=>{document.addEventListener("Neos.NodeCreated",t=>{let e=t.detail.element;e&&e.matches(".carbon-cbd--edit[data-reload]")&&window.location.reload()},!1);window.carbonCBDswitcher=t=>{let e=t.closest(".carbon-cbd"),n=e.querySelector(".carbon-cbd__live"),o=e.dataset.type;if(e.classList.contains("carbon-cbd--edit")){window.location.reload(),c({mode:"live",element:e,type:o});return}n&&setTimeout(()=>{n.remove()},10),e.classList.add("carbon-cbd--edit"),c({mode:"edit",element:e,type:o})};var c=t=>{setTimeout(()=>{let e;t||(t={}),window.CustomEvent?e=new CustomEvent("carbonCBD",{detail:t}):(e=document.createEvent("CustomEvent"),e.initCustomEvent("carbonCBD",!0,!0,t)),document.dispatchEvent(e)},20)};})();