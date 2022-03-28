// ==UserScript==
// @name         Active Shift Codes updates
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Active Shift Code list for Wonderlands & Borderlands 3
// @author       Griffin
// @match        https://shift.gearboxsoftware.com/rewards
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gearboxsoftware.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //todo feature: Add checkboxes and local storage for used codes
    //todo update JSON Storage with Dynamic JSON list
    // Dynamic JSON list of Active SHiFT Codes: https://shift.orcicorn.com/shift-code/index.json

    // #region TESTING
    // #endregion


    const wonderlandsPurple = '#ff00ff';
    const borderlandsYellow = '#ffea02';
    const godfallGold = '#f1c068';

    function replaceDiv (target, content = '', codeList = []) {

        let today = new Date();

        if(codeList.length){
            content = '';
            let list = codeList.filter(code => new Date(code.expires) >= today || code.expires == 'Unknown');
            if(list.length){
                content += `<div>`;
                for(let i = 0; i < list.length; i++){
                    content += `<div class="list-item" style="cursor: pointer" value="${list[i].code}">${list[i].code} - ${list[i].reward}</div>`;
                }
                content += `</div>`;
            }else {
                content += `<div>NO CODES FOUND</div>`;
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
        const styles =`.list-item {border: 1px #2C2C2C solid;padding: 5px;margin-top: 2px} .list-title {margin-bottom: 25px}`;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const targetDiv = document.getElementsByClassName("sh_code_redemption_instructions_label")[0];

        const replaceContent = `
    <div><p>SHiFT Codes offer in-game rewards for a variety of Gearbox games.</p></div>
    <div><h2 style="color:white">Current list of SHiFT Codes</h2></div>
    <div class="list-title"><p style="color: ${wonderlandsPurple}; font-size: 18px">Tiny Tina's Wonderland</p><div id="wonderland-list">NO CODES FOUND</div></div>
    <div class="list-title"><p style="color: ${borderlandsYellow}; font-size: 18px">Borderlands 3</p><div id="borderlands3-list">NO CODES FOUND</div></div>
    <div class="list-title"><p style="color: ${borderlandsYellow}; font-size: 18px">Borderlands 2</p><div id="borderlands2-list">NO CODES FOUND</div></div>
    <div class="list-title"><p style="color: ${borderlandsYellow}; font-size: 18px">Borderlands: The Pre-Squel</p><div id="borderlandsPre-list">NO CODES FOUND</div></div>
    <div class="list-title"><p style="color: ${borderlandsYellow}; font-size: 18px">Borderlands</p><div id="borderlands1-list">NO CODES FOUND</div></div>
    <div class="list-title"><p style="color: ${godfallGold}; font-size: 18px">GodFall</p><div id="godfall-list">NO CODES FOUND</div></div>
    `;
        replaceDiv(targetDiv, replaceContent);
        // moving on to updating the code list now
        updateWebpageList();
    })();

})();