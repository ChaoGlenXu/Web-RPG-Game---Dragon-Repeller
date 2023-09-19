
let xp = 0;
let health = 100;
let gold = 50;

let cur_weapon = 0;

let fighting = -1;
let monster_health;
let inventory = ["stick"];

const weapons = [
    {
        name: "stick",
        power: 5
    },{
        name: "dagger",
        power: 30
    },{
        name: "claw hammer",
        power: 50
    },{
        name: "sword",
        power: 100
    }
]

const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15
    },{
        name: "fanged beast",
        level: 8,
        health: 60
    },{
        name: "dragon",
        level: 20,
        health: 300
    }
]

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");

const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const monsterStats = document.querySelector("#monsterStats");

button1.onclick = go_store;
button2.onclick = go_cave;
button3.onclick = fight_dragon;

var image = document.querySelector("#image");



const locations = [
    {
        name: "Town Square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button functions": [go_store, go_cave, fight_dragon],
        text: "Yout are in the town square, You see a sign that says \"store\".",
        "pic": "welcomePic.png"
    },{
        name: "Store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button functions": [buy_health, buy_weapon, go_town],
        text: "Yout entered the store."  ,
        "pic": "storePic.png"    
    },{
        name: "Cave",
        "button text": ["Fight slime", "Fight beast", "Go to town square"],
        "button functions": [fight_slime, fight_beast, go_town],
        text: "Yout are fighting a monsters."  ,
        "pic": "cavePic.png"    
    },{
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, go_town],
        text: "Yout entered the cave. You see some monsters."  ,
        "pic": "cavePic.png"    
    },{
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [go_town, go_town, go_town],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'  ,
        "pic": "happyPic.png"    
    },{
        name: "lose",
        "button text": ["Replay?", "Replay?", "Replay?"],
        "button functions": [restart, restart, restart],
        text: "You died. " ,
        "pic": "losePic.png"    
    },{
        name: "win",
        "button text": ["Replay?", "Replay?", "Replay?"],
        "button functions": [restart, restart, restart],
        text: "You defeat the dragon! you win the game! " ,
        "pic": "winPic.png"    
    }

]

function update(location) {
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerText = location["text"];
    image.src = location["pic"];
}
 
function go_store() {
    update(locations[1])

}

function go_town() {
    update(locations[0])
}

function go_cave() {
    update(locations[2])
}



function buy_health() {
    
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "You do not have enough gold to buy health.";
    }

}

function buy_weapon() {
    if (cur_weapon < weapons.length - 1){
        if (gold >= 30) {
            gold -= 30;
            cur_weapon++;
            goldText.innerText = gold;
            let new_weapon = weapons[cur_weapon].name;
            text.innerText =  "You now have new weapon: " + new_weapon + ".";
            inventory.push(new_weapon);
            text.innerText += "In your inventory, you have: " + inventory;
        } else {
            text.innerText = "You do not have enough gold to buy weapon.";
        }
    }else{
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        buttton2.onclick = sell_weapon;
    }
}

function sell_weapon() { //the cur_weapon here does not come out of the scope
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let cur_weapon = inventory.shift();
        text.innerText = "You sold the weapon: " + cur_weapon + ".";
        text.innerText += "In your inventory, you have: " + inventory;
    }else {
        text.innerText = "Don't sell your weapon!. You need at least one weapon";
    }
}


function fight_slime() {
    fighting = 0;
    console.log('Fighting monster index hfj:', fighting);
    go_fight();
}

function fight_beast() {
    fighting = 1;
    go_fight();
}

function fight_dragon() {
    fighting = 2;
    go_fight();
}

function go_fight(){
    console.log('Fighting monster index:', fighting);
    update(locations[3]);
    monster_health = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monster_health;
}

function attack () {
    console.log(monsters[fighting]);
    console.log('Fighting monster index:', fighting);

    text.innerText = "The " + monsters[fighting].name + " attacks.";
    text.innerText += "You attack with your " + weapons[cur_weapon].name + ".";

    if (is_monster_hit()){
        health -= get_monster_attack_value(monsters[fighting].level);
    }else{
        text.innerText = "You missed.";
    }

    monster_health -= weapons[cur_weapon].power + Math.floor(Math.random() * xp) + 1;  
    healthText.innerText = health;
    monsterHealthText.innerText = monster_health;
    if (health <= 0) {
        lose();
    } else if (monster_health <= 0) {
        console.log('fdasdfas  Fighting monster index:', fighting);
        fighting === 2 ? win_Game() : defeat_monster();
    }
}

function get_monster_attack_value(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit;
}

function is_monster_hit() {
    return Math.random() > .2 || health < 20;
}

function dodge() {
    text.innerText = "you dodged the attack from the " + monsters[fighting].name + ".";
}

function defeat_monster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

function win_Game() {
    update(locations[6]);
}

function lose() {
    update(locations[5]);
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    cur_weapon = 0;
    inventory = ["stick"];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    go_town();
}
