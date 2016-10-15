import React from 'react';
import ReactDOM from 'react-dom';
import './js/script';
import './js/jquery-script';
import './css/index.css';
import App from './App';
import './js/iframeResizer.contentWindow.min';

let qs;
(window.onpopstate = function () {
    let match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = s => decodeURIComponent(s.replace(pl, ' ')),
        query  = window.location.search.substring(1);
    qs = {};
    match = search.exec(query);
    while (match) {
        qs[decode(match[1])] = decode(match[2]);
        match = search.exec(query);
    }
})();
let parseUser = function (qs) {

    // return {
    //     code: "123456",
    //     mail: "sara@hotmail.com",
    //     management_id: "700000123",
    //     name: "Sara PeÃ±alosa",
    //     papel: "CN",
    //     sector_id: "700000023"
    // };
    let user = null;
    try {
        if (!qs.p || !qs.p.length) return false;
        user = JSON.parse(atob(qs.p));
        let keys = ['name', 'mail', 'code', 'management_id', 'sector_id'];
        for (let i in keys) if (!user.hasOwnProperty(keys[i])) {
            console.error(`User property [${keys[i]}] is missing`);
            return null;
        }
    } catch (e) {
        console.error(e.message);
    }
    return user;

};

ReactDOM.render(<App user={parseUser(qs)}/>, document.getElementById('root'));
