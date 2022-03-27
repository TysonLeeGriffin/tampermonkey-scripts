// ==UserScript==
// UserScript Code for listing out current SHift Codes for Wonderlands and Borderlands on the gearbox rewards site.
// Set script update at https://github.com/TysonLeeGriffin/tampermonkey-scripts/blob/main/scripts/shiftCodes.js for updates
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

    const wonderlandsPurple = '#ff00ff';
    const borderlandsYellow = '#ffea02';

    function replaceDiv (target, content = '', codeList = []) {
        //todo test target
        let today = new Date();
        //todo change ul for div's and check boxes for used codes
        if(codeList.length){
            let list = codeList.filter(code => new Date(code[0]) >= today);
            content += `<ul>`;
            for(let i = 0; i < list.length; i++){
                content += `<li class="list-li" style="cursor: pointer" value="${list[i][1]}">${list[i][1]} - ${list[i][2]}</li>`;
            }
            content += `<ul>`;
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
        //todo update li styling
        //element.setAttribute('style', `background-color: ${wonderlandsPurple}`);
        codeInput.value = code;
    }

    function setClickListener() {
        const codeListItems = document.querySelectorAll('.list-li');
        codeListItems.forEach(item => {item.addEventListener('click', function clickIt (event) {handleClick(this)})});
    };

    async function updateWebpageList() {
        //todo create custome database and api for JSON
        //fast inplemented JSON page 
        const jsonURL = 'https://json.extendsclass.com/bin/5889041b3fa4';
        let response = await fetch(jsonURL);
        let data = await response.text();
        const listOfCodes = JSON.parse(data);

        updateCodeList('wonderland-list', listOfCodes.wonderlands);
        updateCodeList('borderlands3-list', listOfCodes.borderlands3);
        setClickListener();
    };

    (function editSite(){
        // replacing the main section to set up for add the SHiFT code for Wonderlands & Borderlands3
        const targetDiv = document.getElementsByClassName("sh_code_redemption_instructions_label")[0];

        const replaceContent = `
    <div><p>SHiFT Codes offer in-game rewards for a variety of Gearbox games.</p></div>
    <div><h2 style="color:white">Current list of SHiFT Codes</h2></div>
    <div><p style="color: ${wonderlandsPurple}; font-size: 18px">Tiny Tina's Wonderland</p><div id="wonderland-list">The list is loading</div></div>
    <div><p style="color: ${borderlandsYellow}; font-size: 18px">Borderlands 3</p><div id="borderlands3-list">The list is loading</div></div>
    `;
        replaceDiv(targetDiv, replaceContent);
        // moving on to updating the code list now
        updateWebpageList();
    })();

})();