// ==UserScript==
// @name         Active Shift Codes updates
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Active Shift Code list for Wonderlands & Borderlands 3
// @author       Griffin
// @match        https://shift.gearboxsoftware.com/rewards
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gearboxsoftware.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const wonderlandsPurple = '#ff00ff';
    const borderlandsYellow = '#ffea02';
    const godfallGold = '#f1c068';

    function replaceDiv (target, content = '', codeList = []) {

        let today = new Date();

        if(codeList.length){
            content = '';
            let list = codeList.filter(code => new Date(code.expires) >= today || code.expires == 'Unknown');
            if(list.length){
                content += `<div class="keyList-wrapper">`;
                for(let i = 0; i < list.length; i++){
                    content += `<div class="list-item" style="cursor: pointer" value="${list[i].code}">${list[i].code} - ${list[i].reward}</div>`;
                }
                content += `</div>`;
            }else {
                content += `<div class="keyList-wrapper"><div class="list-item"><span>🕱<span><span>🕱<span><span>🕱<span> ABANDON HOPE ALL YE WHO ENTER <span>🕱<span><span>🕱<span><span>🕱<span></div></div>`;
            }
        }
        target.innerHTML = content;
    };

    function updateCodeList (target, list){
        const element = document.getElementById(target);
        replaceDiv(element, '', list);
    };

    function handleClick(element) {
        const code = element.getAttribute('value');
        const codeInput = document.getElementById('shift_code_input');
        codeInput.value = code;
    }

    function setClickListener() {
        const codeListItems = document.querySelectorAll('.list-item');
        codeListItems.forEach(item => {item.addEventListener('click', function clickIt (event) {handleClick(this)})});
    };

    async function updateWebpageList() {
        // Extendsclass.com JSON page
        const jsonURL = 'https://json.extendsclass.com/bin/a071429ea095';

        // Parse JSON into an OBJ
        let response = await fetch(jsonURL);
        let data = await response.text();
        const obj = JSON.parse(data);

        //Seperate OBJ in Array per Game
        const wonderlandsCodes = obj.codes.filter(code => code.game == 'Wonderlands');
        const borderlands3Codes = obj.codes.filter(code => code.game == 'Borderlands 3');
        const borderlands2Codes = obj.codes.filter(code => code.game == 'Borderlands 2');
        const borderlandsPreSequelCodes = obj.codes.filter(code => code.game == 'Borderlands: Pre-Sequel');
        const borderlands1Codes = obj.codes.filter(code => code.game == 'Borderlands 1');
        const godfallCodes = obj.codes.filter(code => code.game == 'Godfall');

        updateCodeList('wonderland-list', wonderlandsCodes);
        updateCodeList('borderlands3-list', borderlands3Codes);
        updateCodeList('borderlands2-list', borderlands2Codes);
        updateCodeList('borderlandsPre-list', borderlandsPreSequelCodes);
        updateCodeList('borderlands1-list', borderlands1Codes);
        updateCodeList('godfall-list', godfallCodes);


        setClickListener();

    };

    (function editSite(){
        // replacing the main section to set up for add the SHiFT code for Wonderlands & Borderlands3
        const styles =`
        .list-item {border: 1px #2C2C2C solid;padding: 5px;margin-top: 8px;}
        .list-title {margin-bottom: 25px;}
        .keyList-wrapper {margin-top: 10px;}
        details {user-select: none;}
        summary {display: flex; cursor: pointer; font-size: 18px}
        summary::-webkit-details-marker {display: none;}
        details > summary span.icon {width: 24px; height: 24px; transition: all 0.3s; margin-right: 10px; transform: rotate(-45deg)}
        details[open] summary span.icon {transform: rotate(50deg);}
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const targetDiv = document.getElementsByClassName("sh_code_redemption_instructions_label")[0];

        const replaceContent = `
<div><p>SHiFT Codes offer in-game rewards for a variety of Gearbox games.</p></div>
<div><h2 style="color:white">Current list of SHiFT Codes</h2></div>
<details class="list-title"><summary style="color: ${wonderlandsPurple};"><span class="icon">🔑</span>Tiny Tina's Wonderland</summary><div id="wonderland-list">NO CODES FOUND</div></details>
<details class="list-title"><summary style="color: ${borderlandsYellow};"><span class="icon">🔑</span>Borderlands 3</summary><div id="borderlands3-list">NO CODES FOUND</div></details>
<details class="list-title"><summary style="color: ${borderlandsYellow};"><span class="icon">🔑</span>Borderlands 2</summary><div id="borderlands2-list">NO CODES FOUND</div></details>
<details class="list-title"><summary style="color: ${borderlandsYellow};"><span class="icon">🔑</span>Borderlands: The Pre-Squel</summary><div id="borderlandsPre-list">NO CODES FOUND</div></details>
<details class="list-title"><summary style="color: ${borderlandsYellow};"><span class="icon">🔑</span>Borderlands</summary><div id="borderlands1-list">NO CODES FOUND</div></details>
<details class="list-title"><summary style="color: ${godfallGold};"><span class="icon">🔑</span>GodFall</summary><div id="godfall-list">NO CODES FOUND</div></details>
    `;
        replaceDiv(targetDiv, replaceContent);
        // moving on to updating the code list now
        updateWebpageList();
    })();

})();