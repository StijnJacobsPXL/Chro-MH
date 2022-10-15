/// wisdom itself
let fullCookie = {};
const xhr = new XMLHttpRequest();
xhr.open(
    "GET",
    "https://www.mousehuntgame.com/item.php?item_type=wisdom_stat_item"
);
xhr.onload = function() {
    const data = xhr.responseText;
    const parser = new DOMParser();
    const dom = parser.parseFromString(data, "text/html");
    const wisdomItem = dom.querySelector(".itemView-sidebar-quantity");
    if (wisdomItem) {
    const wisdom = wisdomItem.textContent
        .split("Own: ")[1]
        .replace(/,/g, "");
    }
    fullCookie['actualWisdom'] = wisdom
}
xhr.send();
console.log(fullCookie)

/// fancy location stuff
const xhr = new XMLHttpRequest();
let locations = []
xhr.open(
    "POST",
    `https://www.mousehuntgame.com/managers/ajax/pages/page.php?page_class=HunterProfile&page_arguments%5Btab%5D=mice&page_arguments%5Bsub_tab%5D=location&uh=${user.unique_hash}`
    );
xhr.onload = function () {
    response = JSON.parse(xhr.responseText);
    const cats = response.page.tabs.mice.subtabs[1].mouse_list.categories;
    for (let i in cats) {
        locations[i]=cats[i]['type']
    }
};
xhr.send()

//TODO: add call for actual wisdom
await new Promise(r => setTimeout(r, 1000));
let totalSummary = {};
for (let i in locations){
    xhr.open(
        "POST",
        `https://www.mousehuntgame.com/managers/ajax/mice/mouse_list.php?action=get_environment&category=${locations[i]}&user_id=${user.user_id}&display_mode=stats&view=ViewMouseListEnvironments&uh=${user.unique_hash}`,
        true
        );
    xhr.onload = function (){
        const response = JSON.parse(xhr.responseText);
        const stats = response.mouse_list_category.subgroups[0].mice;
        if (!stats) {
            console.log(`no stats found for ${locations[i]}`)
        }else{
            const currentloc = {};
    
            stats.forEach(el => {
            const catches =
                typeof el.num_catches === "string"
                ? parseInt(el.num_catches.replace(/,/g, ""))
                : el.num_catches;
            const misses = 
                typeof el.num_misses === "string"
                ? parseInt(el.num_misses.replace(/,/g, ""))
                : el.num_misses;
            currentlresponseURLoc[el.name] = (catches, misses)
            });
            totalSummary[locations[i]] = currentloc
        }
        console.log(totalSummary)
    }
    xhr.send();
    
    await new Promise(r => setTimeout(r, 1000));
}




// ty tsitu :)
// Step 1: get data from server
async function getCatchStats(){
    let cookiematerial = {};
    let data;
    const xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        `https://www.mousehuntgame.com/managers/ajax/mice/getstat.php?sn=Hitgrab&hg_is_ajax=1&action=get_hunting_stats&uh=${user.unique_hash}`);
    xhr.onload = function() {
        data = JSON.parse(xhr.responseText);
        for(let j in data.hunting_stats){
            console.log(data.hunting_stats[j]);
            cookiematerial[data.hunting_stats[j].name] = {'catches': data.hunting_stats[j].num_catches, 'thumb':data.hunting_stats[j].thumb }
        };
    }
    xhr.send();
    await new Promise(r => setTimeout(r, 1000));
    localStorage.setItem("CMT_catchstats", JSON.stringify(cookiematerial));
}


// Take cookie & filter
async function listMiceOfCurrentLocation(){
    let currentLocation = user.environment_type;
    let mice= [];
    const xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        `https://www.mousehuntgame.com/managers/ajax/mice/mouse_list.php?action=get_environment&category=${currentLocation}&user_id=${user.user_id}&display_mode=stats&view=ViewMouseListEnvironments&uh=${user.unique_hash}`,
        true
        );
    xhr.onload = function (){
        const response = JSON.parse(xhr.responseText);
        const stats = response.mouse_list_category.subgroups[0].mice;
        console.log(stats);
        if (!stats) {
            console.log(`no stats found for ${currentLocation}`);
        }else{
            stats.forEach(el => {mice.push(el.name);});

        }
    }
    xhr.send();
    await new Promise(r => setTimeout(r, 1000));
    let storedData = JSON.parse(localStorage.getItem("CMT_catchstats"));
    mice.forEach(el=>{
        console.log(storedData[el])
    }
)
console.log(storedData)
}
