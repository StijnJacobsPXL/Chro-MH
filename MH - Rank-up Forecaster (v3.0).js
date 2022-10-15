 // ==UserScript==
// @name         MouseHunt - Location-based rank-up forecaster (v3.0)
// @author       A Mistake
// @namespace    ?????????????????????
// @version      
// @description  
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// ==/UserScript==


/**
 * Fetch overall/total completion data from getstat.php
 */
function updateOverallData() {
    const xhr = new XMLHttpRequest();
    xhr.open(
    "POST",
    `https://www.mousehuntgame.com/managers/ajax/pages/page.php?page_class=HunterProfile&page_arguments%5Btab%5D=mice&page_arguments%5Bsub_tab%5D=location&uh=${user.unique_hash}`
    );

    xhr.onload = function () {
    const response = JSON.parse(xhr.responseText);
    const locations =
        response.page.tabs.mice.subtabs[1].mouse_list.categories;
    if (locations) {
        const masterObj = {};

        locations.forEach(el => {
        const obj = {};
        obj["caught"] = el.caught;
        obj["total"] = el.total;
        obj["type"] = el.type;
        masterObj[el.name] = obj;
        });

        console.log(
        "tsitu-location-overall-stats",
        JSON.stringify(masterObj)
        );
        // localStorage.setItem("tsitu-location-overall-updated", Date.now());
        // render();
    }
    };

    xhr.onerror = function () {
    console.error(xhr.statusText);
    };

    xhr.send();
}

/**
 * Fetch individual location data from getstat.php
 * @param {number} category Location category string
 * @param {string} locationName
 */
function requestLocation(category, locationName) {
    const xhr = new XMLHttpRequest();
    xhr.open(
    "POST",
    `https://www.mousehuntgame.com/managers/ajax/mice/mouse_list.php?action=get_environment&category=${category}&user_id=${user.user_id}&display_mode=stats&view=ViewMouseListEnvironments&uh=${user.unique_hash}`,
    true
    );

    xhr.onload = function () {
    const response = JSON.parse(xhr.responseText);
    const stats = response.mouse_list_category.subgroups[0].mice;
    if (stats) {
        const missedArr = [];
        const caughtArr = [];

        stats.forEach(el => {
        const caught =
            typeof el.num_catches === "string"
            ? parseInt(el.num_catches.replace(/,/g, ""))
            : el.num_catches;
        if (caught === 0) {
            missedArr.push(el.name);
        } else if (caught > 0) {
            caughtArr.push([el.name, caught]);
        }
        });

        const obj = {};
        obj["missing"] = missedArr;
        obj["caught"] = caughtArr;
        obj["date"] = Date.now();

        const cacheRaw = localStorage.getItem("tsitu-location-detailed-stats");
        if (cacheRaw) {
        const cache = JSON.parse(cacheRaw);
        cache[locationName] = obj;
        localStorage.setItem(
            "tsitu-location-detailed-stats",
            JSON.stringify(cache)
        );
        } else {
        const cache = {};
        cache[locationName] = obj;
        localStorage.setItem(
            "tsitu-location-detailed-stats",
            JSON.stringify(cache)
        );
        }

        cacheOpenedDetails();
        render();
    }
    };

    xhr.onerror = function () {
    console.error(xhr.statusText);
    };

    xhr.send();
}
