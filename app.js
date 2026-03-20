import { skillDatabase, playerSkillKeys, getPlayerInitialSkills, getPlayerSkillsMax, getEnemySkillSet, getEnemyAvatar, enemies, getEnemyStats, getRandomEnemyType, applyDamage, applySkill } from './skills.js';

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const $ = id => document.getElementById(id);

let state = { player: null, enemy: null, roomsCleared: 0, inBattle: false, awaitingPlayerAction: true };

function createPlayer(name) {
    const skillsMax = getPlayerSkillsMax();
    return {
        name,
        level: 1,
        xp: 0,
        maxHp: 100,
        hp: 100,
        baseDmg: 8,
        weapon: 0,
        skills: getPlayerInitialSkills(),
        skillsMax,
        barrier: false,
        potions: 2
    };
}

function createEnemy(rc) {
    const lvl = Math.max(1, Math.floor(1 + rc / 2 + rand(0, 1)));
    const type = getRandomEnemyType();
    const templateStats = getEnemyStats(type, lvl) || { hp: 40 + lvl * 12, dmg: 4 + lvl * 2 };
    const hp = templateStats.hp + rand(0, 10);
    const dmg = templateStats.dmg + rand(0, 3);
    return {
        type,
        avatar: getEnemyAvatar(type),
        title: type,
        level: lvl,
        maxHp: hp,
        hp,
        baseDmg: dmg,
        skills: getEnemySkillSet(type),
        guard: false
    };
}

function log(text, who = 'battle') {
    const logContainer = who === 'enemy' ? $('enemyLog') : $('battleLog');
    const entry = document.createElement('div');
    entry.textContent = text;
    logContainer.prepend(entry);
}

function updateUI() {
    if (!state.player) return;
    const player = state.player;
    const need = 20 + player.level * 15;
    $('xpText').textContent = `${player.xp}/${need}`;
    $('playerName').textContent = player.name;
    $('playerTitle').textContent = `${player.name} the Mage (Lv ${player.level})`;
    $('playerHpText').textContent = `HP: ${player.hp}/${player.maxHp}`;
    $('hpText').textContent = `${player.hp}/${player.maxHp}`;
    $('damageText').textContent = player.baseDmg + player.weapon;
    $('playerHpFill').style.width = Math.max(0, (player.hp / player.maxHp) * 100) + '%';
    $('potionsCount').textContent = player.potions;
    $('playerAvatar').style.backgroundImage = 'url("mage_class_avatar.png")';
    $('playerAvatar').textContent = '';
    if (state.enemy) {
        const enemy = state.enemy;
        $('enemyTitle').textContent = `${enemy.title} (Lv ${enemy.level})`;
        $('enemyHpText').textContent = `HP: ${enemy.hp}/${enemy.maxHp}`;
        $('enemyHpFill').style.width = Math.max(0, (enemy.hp / enemy.maxHp) * 100) + '%';
        $('enemyAvatar').style.backgroundImage = enemy.avatar;
        $('enemyAvatar').textContent = '';
    }
}

function updateSkills() {
    const row = $('skillsRow');
    while (row.firstChild) row.removeChild(row.firstChild);
    const player = state.player;
    if (!player) return;
    playerSkillKeys.forEach(skillKey => {
        const skill = skillDatabase[skillKey];
        if (!skill) return;
        const button = document.createElement('button');
        button.className = 'skill-btn';
        const title = document.createElement('div');
        title.textContent = skill.name;
        const uses = document.createElement('div');
        uses.className = 'skill-uses';
        const strong = document.createElement('strong');
        strong.textContent = player.skillsMax[skillKey] ?? 0;
        uses.textContent = `Uses: ${player.skills[skillKey] ?? 0}/`;
        uses.append(strong);
        button.append(title, uses);
        button.onclick = () => useSkill(skillKey);
        button.disabled = !state.inBattle;
        row.append(button);
    });
}

function useSkill(skillKey) {
    if (!state.inBattle || !state.awaitingPlayerAction) return;
    const player = state.player;
    if ((player.skills[skillKey] ?? 0) <= 0) {
        log(`No uses left for ${skillDatabase[skillKey]?.name || skillKey}.`);
        return;
    }
    player.skills[skillKey]--;
    updateSkills();
    const resultText = applySkill(player, state.enemy, skillKey);
    log(resultText);
    state.awaitingPlayerAction = false;
    checkEnemy();
    if (state.inBattle) setTimeout(enemyTurn, 700);
}

function enemyTurn() {
    if (!state.inBattle) return;
    const enemy = state.enemy;
    const player = state.player;
    if (!enemy || !player) return;
    const skillKey = enemy.skills[rand(0, enemy.skills.length - 1)];
    const resultText = applySkill(enemy, player, skillKey);
    log(`${enemy.title} ${resultText}`, 'enemy');
    updateUI();
    state.awaitingPlayerAction = true;
    checkPlayer();
}

function startBattle() {
    if (!state.enemy) return;
    state.inBattle = true;
    state.awaitingPlayerAction = true;
    $('intro').classList.add('hidden');
    $('roomScreen').classList.add('hidden');
    $('gameOver').classList.add('hidden');
    $('battleScreen').classList.remove('hidden');
    $('battleLog').innerHTML = '';
    $('enemyLog').innerHTML = '';
    updateSkills();
    updateUI();
    log(`A wild ${state.enemy.title} appears!`);
}

function checkEnemy() {
    if (state.enemy && state.enemy.hp <= 0) {
        log(`${state.enemy.title} is defeated!`);
        const xp = 8 + state.enemy.level * 6;
        grantXP(xp);
        if (Math.random() < 0.35) {
            state.player.potions++;
            log(`${state.enemy.title} dropped 1 potion.`);
        }
        if (Math.random() < 0.15) {
            const b = 1 + Math.floor(state.roomsCleared / 8);
            state.player.weapon += b;
            log(`${state.enemy.title} dropped a weapon (+${b}).`);
        }
        state.enemy = null;
        state.inBattle = false;
        state.roomsCleared++;
        updateUI();
        setTimeout(() => showRooms(), 800);
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
    else { if (Math.random() < 0.5) opts.push({ type: 'weapon', title: 'Weapon Chest', desc: 'Gain weapon', val: rand(1,3) }); else opts.push({ type: 'potions', title: 'Supply Cache', desc: 'Find potions', val: rand(1,3) }); }
    if (Math.random() < 0.6) opts.push({ type: 'enemy', title: 'Dangerous Room', desc: 'Fight' });
    else opts.push(Math.random() < 0.5 ? { type: 'potions', title: 'Hidden Cache', desc: 'Find potions', val: rand(1,3) } : { type: 'weapon', title: 'Armory', desc: 'Gain weapon', val: rand(1,2) });
    opts.forEach(roomOption => {
        const roomDiv = document.createElement('div');
        roomDiv.className = 'room';
        roomDiv.append(Object.assign(document.createElement('h4'), { textContent: roomOption.title }));
        roomDiv.append(Object.assign(document.createElement('div'), { textContent: roomOption.desc, className: 'room-desc' }));
        roomDiv.onclick = () => chooseRoom(roomOption);
        choices.append(roomDiv);
    });
}

function chooseRoom(roomOption) {
    $('roomScreen').classList.add('hidden');
    if (roomOption.type === 'rest') {
        const player = state.player;
        player.skills = { ...player.skillsMax };
        player.hp = player.maxHp;
        log('You rest and fully recover.');
        updateUI();
        setTimeout(() => spawnEnemy(), 800);
    } else if (roomOption.type === 'weapon') {
        state.player.weapon += roomOption.val;
        log(`You found a weapon! Damage +${roomOption.val}.`);
        updateUI();
        setTimeout(() => spawnEnemy(), 800);
    } else if (roomOption.type === 'potions') {
        state.player.potions += roomOption.val;
        log(`You found ${roomOption.val} potions.`);
        updateUI();
        setTimeout(() => spawnEnemy(), 800);
    } else {
        spawnEnemy();
    }
}

let spawnRunning = false;
export function spawnEnemy() {
    if (spawnRunning) return;
    spawnRunning = true;
    try {
        state.enemy = createEnemy(state.roomsCleared);
        startBattle();
    } finally {
        setTimeout(() => { spawnRunning = false; }, 120);
    }
}

function grantXP(xpAmount) {
    const player = state.player;
    player.xp += xpAmount;
    const need = 20 + player.level * 15;
    if (player.xp >= need) {
        player.xp -= need;
        player.level++;
        player.maxHp += 12;
        player.baseDmg += 2;
        player.hp = player.maxHp;
        if (player.level % 3 === 0) {
            playerSkillKeys.forEach(skillKey => {
                if (player.skillsMax[skillKey] !== undefined) player.skillsMax[skillKey]++;
            });
            player.skills = { ...player.skillsMax };
        }
        log(`${player.name} leveled up to ${player.level}!`);
        updateUI();
    }
}

function openBag() {
    if (!state.player) return;
    const player = state.player;
    $('bagContents').textContent = `Potions: ${player.potions}`;
    const sheet = $('characterSheet');
    while (sheet.firstChild) sheet.removeChild(sheet.firstChild);
    sheet.classList.remove('hidden');
    const container = document.createElement('div');
    container.className = 'character-sheet-container';
    const avatar = document.createElement('div');
    avatar.className = 'avatar character-avatar';
    avatar.style.backgroundImage = 'url("mage_class_avatar.jpg")';
    container.append(avatar);
    const stats = document.createElement('div');
    stats.className = 'character-stats';
    const addLine = txt => { const div = document.createElement('div'); div.textContent = txt; stats.append(div); };
    addLine(`Name: ${player.name}`);
    addLine(`Level: ${player.level}`);
    addLine(`HP: ${player.hp}/${player.maxHp}`);
    addLine(`Base Damage: ${player.baseDmg}`);
    addLine(`Weapon Bonus: ${player.weapon}`);
    addLine(`Current Damage: ${player.baseDmg + player.weapon}`);
    addLine(`Potions: ${player.potions}`);
    container.append(stats);
    sheet.append(container);
    $('modal').classList.remove('hidden');
    $('modal').setAttribute('aria-hidden', 'false');
}

function closeBag() {
    $('modal').classList.add('hidden');
    $('modal').setAttribute('aria-hidden', 'true');
    const sheet = $('characterSheet');
    if (sheet) {
        sheet.classList.add('hidden');
        while (sheet.firstChild) sheet.removeChild(sheet.firstChild);
    }
}

function usePotion() {
    const player = state.player;
    if (!player || player.potions <= 0) { alert('No potions'); return; }
    if (!state.inBattle) { alert('Use during fight'); return; }
    player.potions--;
    const healAmount = Math.ceil(player.maxHp * 0.45);
    player.hp = clamp(player.hp + healAmount, 0, player.maxHp);
    log(`${player.name} drinks a potion and recovers ${healAmount} HP.`);
    updateUI();
    closeBag();
}

function endTurn() {
    if (!state.inBattle || !state.awaitingPlayerAction) return;
    state.awaitingPlayerAction = false;
    log(`${state.player.name} waits...`);
    setTimeout(enemyTurn, 500);
}

function saveGame() {
    try { localStorage.setItem('dungeon_mage_save', JSON.stringify({ player: state.player, roomsCleared: state.roomsCleared })); alert('Saved'); }
    catch (e) { alert('Save failed'); }
}

function loadGame() {
    try {
        const data = JSON.parse(localStorage.getItem('dungeon_mage_save'));
        if (data && data.player) {
            state.player = data.player;
            state.roomsCleared = data.roomsCleared || 0;
            updateUI();
            $('intro').classList.add('hidden');
            showRooms();
            alert('Game Loaded');
        } else { alert('No Save File Found'); }
    } catch (e) { alert('Load failed'); }
}

function restart() { location.reload(); }

document.addEventListener('DOMContentLoaded', () => {
    $('modal').classList.add('hidden');
    $('startBtn').addEventListener('click', () => {
        const n = $('nameInput').value.trim() || 'Mage';
        state.player = createPlayer(n);
        state.roomsCleared = 0;
        updateUI();
        spawnEnemy();
    });
    $('bagBtn').addEventListener('click', openBag);
    $('closeModal').addEventListener('click', closeBag);
    $('usePotionBtn').addEventListener('click', usePotion);
    $('endTurnBtn').addEventListener('click', endTurn);
    $('saveBtn').addEventListener('click', saveGame);
    $('loadBtn').addEventListener('click', loadGame);
    $('restartBtn').addEventListener('click', restart);
    $('nameInput').addEventListener('keydown', e => { if (e.key === 'Enter') $('startBtn').click(); });
    const backdrop = $('modalBackdrop');
    if (backdrop) backdrop.addEventListener('click', ev => { if (ev.target === backdrop) closeBag(); });
    updateSkills(); updateUI();
});
