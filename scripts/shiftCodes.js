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

    const wonderlandsPurple = '#ff00ff';
    const borderlandsYellow = '#ffea02';

    const codeList = {
        wonderlands: [
            [new Date('Febuary 28 2022'), 'EXPIRED-NOT-REAL-HAHA-JOKE', 'key'],
            [new Date('March, 28, 2022'), 'B36T3-KSZ6F-K5TKK-JJ3B3-B6B3J', 'Skeleton Key'],
            [new Date('March 31, 2022'), 'JBRTT-BZH6F-CC3W5-3TTTB-XB9HH', 'Skeleton Key'],
        ],
        borderlands3: [
            [new Date('June, 01, 2099'),'CZ5JT-HFH99-KXKRZ-6BTJJ-BS5WB', 'Saurian Synth Head'],
            [new Date('June, 01, 2099'),'CSWJT-FS9H9-W6KFS-R3TTT-RFCHR','1 diamond key'],
            [new Date('June, 01, 2099'),'C95TB-3RJZ9-K6WFH-R3BTJ-RJJSJ','3 golden keys'],
            [new Date('June, 01, 2099'),'Z65B3-JCXX6-5JXW3-3B33J-9SWT6','3 golden keys'],
            [new Date('June, 01, 2099'),'ZRWBJ-ST6XR-CBFKT-JT3J3-FRXJ5','3 golden keys'],
            [new Date('June, 01, 2099'),'9XCBT-WBXFR-5TRWJ-JJJ33-TX53Z','3 golden keys'],
            [new Date('June, 01, 2099'),'ZFKJ3-TT6FF-KTFKT-T3JJT-JWX36','1 golden key'],
            [new Date('June, 01, 2099'),'HXKBT-XJ6FR-WBRKJ-J3TTB-RSBHR','1 golden key'],
            [new Date('June, 01, 2099'),'ZFKJ3-TT3BB-JTBJT-T3JJT-JWX9H','3 golden keys'],
            [new Date('June, 01, 2099'),'CSKBB-SZTSZ-WXWXZ-FJTTB-JWR3R','3 Golden Keys'],
            [new Date('June, 01, 2099'),'59WBB-FSWR9-KFC69-R3B3B-3FKST','Mercenary Day cosmetics'],
            [new Date('June, 01, 2099'),'CZ5BB-3BWZZ-W65FS-FJ33B-ZK3K5','Few Golden Keys'],
            [new Date('June, 01, 2099'),'WCCJB-JWJRF-FSB63-JJJ3T-WWSSJ','5 Golden Keys'],
            [new Date('June, 01, 2099'),'ZRWBJ-ST6XR-CBFKT-JT3J3-FRXJ5','1 Diamond Key'],
            [new Date('June, 01, 2099'),'Z65B3-JCXX6-5JXW3-3B33J-9SWT6','1 Diamond Key'],
            [new Date('June, 01, 2099'),'HXKBT-XJ6FR-WBRKJ-J3TTB-RSBHR','1 Diamond Key'],
            [new Date('June, 01, 2099'),'9XCBT-WBXFR-5TRWJ-JJJ33-TX53Z','1 Diamond Key'],
            [new Date('June, 01, 2099'),'ZFKJ3-TT6FF-KTFKT-T3JJT-JWX36','1 Diamond Key'],
        ],
    };

    function replaceDiv (target, content = '', codeList = []) {
        // test target
        let today = new Date();
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
        //element.setAttribute('style', `background-color: ${wonderlandsPurple}`);
        codeInput.value = code;
    }

    function setClickListener() {
        const codeListItems = document.querySelectorAll('.list-li');
        codeListItems.forEach(item => {item.addEventListener('click', function clickIt (event) {handleClick(this)})});
    };

    async function updateWebpageList() {
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