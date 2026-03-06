const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const $ = id => document.getElementById(id);

let state = { player: null, enemy: null, roomsCleared: 0, inBattle: false, awaitingPlayerAction: true };

const skillsDef = {
    heal: { name: 'Heal', uses: 5 }, missile: { name: 'Magic Missile', uses: 15 }, fireball: { name: 'Fireball', uses: 10 }, barrier: { name: 'Barrier', uses: 6 }, icebolt: { name: `Ice Bolt`, uses: 8 }
};

const enemies = {
    Skeleton: { avatar: 'url("Skeleton Enemy.png")', skills: [{ name: 'Slash', type: 'atk', range: [4, 8] }, { name: 'Guard', type: 'buff' }, { name: 'Bite', type: 'atk', range: [3, 6] }, { name: 'Strong Slash', type: 'atk', range: [7, 12] }] },
    Slime: { avatar: 'url("Slime Enemy.png")', skills: [{ name: 'Dissolve', type: 'atk', range: [3, 7] }, { name: 'Whip', type: 'atk', range: [2, 5] }, { name: 'Defend', type: 'buff' }, { name: 'Slime Shot', type: 'atk', range: [4, 9] }] }
};

function createPlayer(name) {
    return {
        name, level: 1, xp: 0, maxHp: 100, hp: 100, baseDmg: 8, weapon: 0,
        skills: { heal: skillsDef.heal.uses, missile: skillsDef.missile.uses, fireball: skillsDef.fireball.uses, barrier: skillsDef.barrier.uses, icebolt: skillsDef.icebolt.uses },
        skillsMax: { heal: skillsDef.heal.uses, missile: skillsDef.missile.uses, fireball: skillsDef.fireball.uses, barrier: skillsDef.barrier.uses, icebolt: skillsDef.icebolt.uses }, barrier: false, potions: 2
    };
}

function createEnemy(rc) {
    const lvl = Math.max(1, Math.floor(1 + rc / 2 + rand(0, 1))), type = Math.random() < .5 ? 'Skeleton' : 'Slime', enemyTemplate = enemies[type], hp = 40 + lvl * 12 + rand(0, 10), dmg = 4 + lvl * 2 + rand(0, 3);
    return { type, avatar: enemyTemplate.avatar, title: type, level: lvl, maxHp: hp, hp: hp, baseDmg: dmg, skills: JSON.parse(JSON.stringify(enemyTemplate.skills)), guard: false };
}

function log(text, who = 'battle') {
    const el = who === 'enemy' ? $('enemyLog') : $('battleLog');
    const d = document.createElement('div'); d.textContent = text;
    el.prepend(d);
}

function updateUI() {
    if (!state.player) return; const player = state.player;
    const need = 20 + player.level * 15; $('xpText').textContent = `${player.xp}/${need}`;
    $('playerName').textContent = player.name; $('playerTitle').textContent = `${player.name} the Mage (Lv ${player.level})`;
    $('playerHpText').textContent = `HP: ${player.hp}/${player.maxHp}`; $('hpText').textContent = `${player.hp}/${player.maxHp}`; $('damageText').textContent = player.baseDmg + player.weapon;
    $('playerHpFill').style.width = Math.max(0, (player.hp / player.maxHp) * 100) + '%'; $('potionsCount').textContent = player.potions; $('playerAvatar').style.backgroundImage = 'url("Mage Class Avatar.png")'; $('playerAvatar').textContent = ''
    if (state.enemy) {
        const enemy = state.enemy; $('enemyTitle').textContent = `${enemy.title} (Lv ${enemy.level})`; $('enemyHpText').textContent = `HP: ${enemy.hp}/${enemy.maxHp}`;
        $('enemyHpFill').style.width = Math.max(0, (enemy.hp / enemy.maxHp) * 100) + '%'; $('enemyAvatar').style.backgroundImage = enemy.avatar; $('enemyAvatar').textContent = '';
    }
}

function updateSkills() {
    const row = $('skillsRow');
    while (row.firstChild) row.removeChild(row.firstChild);
    const player = state.player;
    [['heal', 'Heal'], ['missile', 'Magic Missile'], ['fireball', 'Fireball'], ['barrier', 'Barrier'], ['icebolt', 'Ice Bolt']].forEach(([skillKey, skillLabel]) => {
        const button = document.createElement('button');
        button.className = 'skill-btn';
        const title = document.createElement('div');
        title.textContent = skillLabel;
        const uses = document.createElement('div');
        uses.className = 'skill-uses';
        uses.textContent = `Uses: ${player.skills[skillKey]}`;
        const strong = document.createElement('strong');
        strong.textContent = player.skills[skillKey];
        uses.textContent = 'Uses: ';
        uses.appendChild(strong);
        button.appendChild(title);
        button.appendChild(uses);
        button.onclick = () => useSkill(skillKey);
        if (!state.inBattle) button.disabled = true;
        row.appendChild(button);
    });
}

function useSkill(skillKey) {
    if (!state.inBattle || !state.awaitingPlayerAction) return;
    const player = state.player;
    if (player.skills[skillKey] <= 0) {
        log(`No uses left for ${skillsDef[skillKey].name}.`);
        return;
    }
    player.skills[skillKey]--;
    updateSkills();
    if (skillKey === 'heal') {
        const healAmount = Math.ceil(player.maxHp * 0.3);
        player.hp = clamp(player.hp + healAmount, 0, player.maxHp);
        log(`${player.name} casts Heal and recovers ${healAmount} HP.`);
    } else if (skillKey === 'missile') {
        const hits = rand(1, 3);
        let total = 0;
        for (let i = 0; i < hits; i++) {
            const dmg = rand(3, 6) + Math.floor((player.baseDmg + player.weapon) / 6);
            total += dmg;
            damageEnemy(dmg);
        }
        log(`${player.name} fires Magic Missile (${hits} hits) for ${total} damage.`);
    } else if (skillKey === 'fireball') {
        const dmg = rand(12, 18) + Math.floor((player.baseDmg + player.weapon) / 2);
        damageEnemy(dmg);
        log(`${player.name} hurls Fireball for ${dmg} damage.`);
    } else if (skillKey === 'barrier') {
        player.barrier = true;
        log(`${player.name} raises a magical Barrier (blocks next attack).`);
    } else if (skillKey === 'icebolt') {
        const dmg = rand(10, 15) + Math.floor((player.baseDmg + player.weapon) / 4);
        damageEnemy(dmg);
        log(`${player.name} hurls Ice Bolt for ${dmg} damage.`);
    }
    state.awaitingPlayerAction = false;
    checkEnemy();
    if (state.inBattle) setTimeout(enemyTurn, 700);
}

function damageEnemy(damageAmount) {
    const enemy = state.enemy; if (!enemy) return;
    if (enemy.guard) {
        damageAmount = Math.ceil(damageAmount / 2); enemy.guard = false;
        log(`${enemy.title}'s guard reduces the damage.`);
    }
    enemy.hp = Math.max(0, enemy.hp - damageAmount); updateUI();
}

function enemyTurn() {
    if (!state.inBattle) return;
    const enemy = state.enemy, player = state.player;
    const currentSkill = enemy.skills[rand(0, enemy.skills.length - 1)];
    if (currentSkill.type === 'atk') {
        let damage = rand(currentSkill.range[0], currentSkill.range[1]) + Math.floor(enemy.baseDmg / 3);
        if (player.barrier) {
            player.barrier = false; log(`${player.name}'s Barrier absorbs the ${currentSkill.name}.`, 'enemy');
        }
        else {
            player.hp = Math.max(0, player.hp - damage); log(`${enemy.title} uses ${currentSkill.name} for ${damage} damage.`, 'enemy');
        }
    }
    else {
        enemy.guard = true; log(`${enemy.title} uses ${currentSkill.name} and braces (reduces next damage).`, 'enemy');
    }
    updateUI(); state.awaitingPlayerAction = true; checkPlayer();
}

function startBattle() {
    if (!state.enemy) return; state.inBattle = true;
    state.awaitingPlayerAction = true; $('intro').classList.add('hidden');
    $('roomScreen').classList.add('hidden');
    $('gameOver').classList.add('hidden');
    $('battleScreen').classList.remove('hidden');
    $('battleLog').innerHTML = '';
    $('enemyLog').innerHTML = '';
    updateSkills(); updateUI();
    log(`A wild ${state.enemy.title} appears!`);
}

function checkEnemy() {
    if (state.enemy && state.enemy.hp <= 0) {
        log(`${state.enemy.title} is defeated!`); const xp = 8 + state.enemy.level * 6;
        grantXP(xp);
        if (Math.random() < 0.35) {
            state.player.potions++;
            log(`${state.enemy.title} dropped 1 potion.`);
        }
        if (Math.random() < 0.15) {
            const b = 1 + Math.floor(state.roomsCleared / 8);
            state.player.weapon += b; log(`${state.enemy.title} dropped a weapon (+${b}).`);
        }
        state.enemy = null;
        state.inBattle = false; state.roomsCleared++;
        updateUI(); setTimeout(() => showRooms(), 800);
    }
}

function checkPlayer() {
    if (state.player.hp <= 0) {
        state.inBattle = false;
        $('battleScreen').classList.add('hidden');
        $('gameOver').classList.remove('hidden');
        $('finalRooms').textContent = state.roomsCleared;
    }
}

function showRooms() {
    $('battleScreen').classList.add('hidden');
    $('roomScreen').classList.remove('hidden');
    const choices = $('roomChoices');
    while (choices.firstChild) choices.removeChild(choices.firstChild);
    const opts = [];
    const restChance = 0.25 + Math.min(0.25, state.roomsCleared * 0.2);
    if (Math.random() < restChance) opts.push({ type: 'rest', title: 'Rest Room', desc: 'Regain spells' });
    else {
        if (Math.random() < 0.5) opts.push({ type: 'weapon', title: 'Weapon Chest', desc: 'Gain weapon', val: rand(1, 3) });
        else opts.push({ type: 'potions', title: 'Supply Cache', desc: 'Find potions', val: rand(1, 3) });
    }
    if (Math.random() < 0.6) opts.push({ type: 'enemy', title: 'Dangerous Room', desc: 'Fight' });
    else opts.push(Math.random() < 0.5 ? { type: 'potions', title: 'Hidden Cache', desc: 'Find potions', val: rand(1, 3) } : { type: 'weapon', title: 'Armory', desc: 'Gain weapon', val: rand(1, 2) });
    opts.forEach(roomOption => {
        const d = document.createElement('div');
        d.className = 'room';
        d.appendChild(Object.assign(document.createElement('h4'), { textContent: roomOption.title }));
        d.appendChild(Object.assign(document.createElement('div'), { textContent: roomOption.desc, className: 'room-desc' }));
        d.onclick = () => chooseRoom(roomOption);
        choices.appendChild(d);
    });
}

function chooseRoom(roomOption) {
    $('roomScreen').classList.add('hidden');
    if (roomOption.type === 'rest') {
        const player = state.player; player.skills = { ...player.skillsMax }; player.hp = player.maxHp;
        log('You rest and fully recover.');
        updateUI();
        setTimeout(() => spawnEnemy(), 800);
    }
    else if (roomOption.type === 'weapon') {
        state.player.weapon += roomOption.val;
        log(`You found a weapon! Damage +${roomOption.val}.`);
        updateUI();
        setTimeout(() => spawnEnemy(), 800);
    }
    else if (roomOption.type === 'potions') {
        state.player.potions += roomOption.val;
        log(`You found ${roomOption.val} potions.`);
        updateUI();
        setTimeout(() => spawnEnemy(), 800);
    }
    else spawnEnemy();
}

/* spawn guard */
(function () {
    function spawnInternal() {
        state.enemy = createEnemy(state.roomsCleared);
        startBattle();
    }
    let running = false; window.spawnEnemy = function () {
        if (running)
            return; running = true; try { return spawnInternal(); }
        finally { setTimeout(() => running = false, 120); }
    }
})();

function grantXP(xpAmount) {
    const player = state.player; player.xp += xpAmount; const need = 20 + player.level * 15; if (player.xp >= need) {
        player.xp -= need; player.level++; player.maxHp += 12; player.baseDmg += 2; player.hp = player.maxHp; if (player.level % 3 === 0) { player.skillsMax.heal++; player.skillsMax.missile++; player.skillsMax.fireball++; player.skillsMax.barrier++; player.skillsMax.icebolt++; player.skills = { ...player.skillsMax }; }
        log(`${player.name} leveled up to ${player.level}!`); updateUI();
    }
}

function openBag() {
    if (!state.player) return;
    const player = state.player;
    // update potion count
    $('bagContents').textContent = `Potions: ${player.potions}`;

    // build character sheet
    const sheet = $('characterSheet');
    while (sheet.firstChild) sheet.removeChild(sheet.firstChild);
    sheet.classList.remove('hidden');
    const container = document.createElement('div');
    container.className = 'character-sheet-container';

    const avatar = document.createElement('div');
    avatar.className = 'avatar character-avatar';
    avatar.style.backgroundImage = 'url("Mage Class Avatar.jpg")';
    container.appendChild(avatar);

    const stats = document.createElement('div');
    stats.className = 'character-stats';
    const addLine = txt => { const d = document.createElement('div'); d.textContent = txt; stats.appendChild(d); };
    addLine(`Name: ${player.name}`);
    addLine(`Level: ${player.level}`);
    addLine(`HP: ${player.hp}/${player.maxHp}`);
    addLine(`Base Damage: ${player.baseDmg}`);
    addLine(`Weapon Bonus: ${player.weapon}`);
    addLine(`Current Damage: ${player.baseDmg + player.weapon}`);
    addLine(`Potions: ${player.potions}`);
    container.appendChild(stats);
    sheet.appendChild(container);

    // show modal
    $('modal').classList.remove('hidden');
    $('modal').setAttribute('aria-hidden', 'false');
}

function closeBag() {
    $('modal').classList.add('hidden');
    $('modal').setAttribute('aria-hidden', 'true');
    const sheet = $('characterSheet');
    if(sheet){
        sheet.classList.add('hidden');
        while(sheet.firstChild) sheet.removeChild(sheet.firstChild);
    }
}

function usePotion() {
    const player = state.player; if (!player || player.potions <= 0) { alert('No potions'); return; } if (!state.inBattle) {
        alert('Use during fight');
        return;
    } player.potions--; const healAmount = Math.ceil(player.maxHp * 0.45); player.hp = clamp(player.hp + healAmount, 0, player.maxHp); log(`${player.name} drinks a potion and recovers ${healAmount} HP.`); updateUI(); closeBag();
}

function endTurn() {
    if (!state.inBattle || !state.awaitingPlayerAction) return; state.awaitingPlayerAction = false; log(`${state.player.name} waits...`); setTimeout(enemyTurn, 500);
}
function saveGame() {
    try { localStorage.setItem('dungeon_mage_save', JSON.stringify({ player: state.player, roomsCleared: state.roomsCleared })); alert('Saved'); } catch (e) { alert('Save failed'); }
}
function restart() { location.reload(); }

/* Event Listeners */
document.addEventListener('DOMContentLoaded', () => {
    $('modal')?.classList.add('hidden');
    $('startBtn').addEventListener('click', () => { const n = $('nameInput').value.trim() || 'Mage'; state.player = createPlayer(n); state.roomsCleared = 0; updateUI(); if (typeof spawnEnemy === 'function') spawnEnemy(); });
    $('bagBtn').addEventListener('click', openBag);
    $('closeModal').addEventListener('click', closeBag);
    $('usePotionBtn').addEventListener('click', usePotion);
    $('endTurnBtn').addEventListener('click', endTurn);
    $('saveBtn').addEventListener('click', saveGame);
    $('restartBtn').addEventListener('click', restart);
    $('nameInput').addEventListener('keydown', e => { if (e.key === 'Enter') $('startBtn').click(); });
    const backdrop = $('modalBackdrop');
    if (backdrop) backdrop.addEventListener('click', (ev) => { if (ev.target === backdrop) closeBag(); });
    updateSkills(); updateUI();
});