/**
 * Main Game Logic for Dungeon Mage
 * Handles character creation, progression, battles, and gameplay
 */

import {
    getClass, getPrestigeOptions, buildSkillDatabase,
    getPlayerInitialSkills, getPlayerSkillsMax, getClassSkillKeys,
    getAvailableBaseClasses, isPrestigeClass, classKeyToName
} from './classes.js';
import {
    createEnemy, getEnemyLevel, getRandomEnemyType,
    getAvailableEnemyTypes
} from './enemies.js';
import { applySkill, applyDamage, universalSkillDatabase } from './skills.js';

// ==================== UTILITY FUNCTIONS ====================
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const $ = id => document.getElementById(id);

// ==================== GAME STATE ====================
let state = {
    player: null,
    enemy: null,
    roomsCleared: 0,
    inBattle: false,
    awaitingPlayerAction: true,
    currentClass: null,
    showPrestigeOffer: false
};

// ==================== CHARACTER CREATION ====================

/**
 * Initialize character creation UI
 */
function initializeCharacterCreation() {
    $('characterCreation').classList.remove('hidden');
    $('battleScreen').classList.add('hidden');
    $('roomScreen').classList.add('hidden');
    $('gameOver').classList.add('hidden');
    $('prestigeSelection').classList.add('hidden');

    const nameInput = $('nameInput');
    nameInput.value = '';
    nameInput.focus();

    const classSelection = $('classSelection');
    classSelection.innerHTML = '';

    getAvailableBaseClasses().forEach(baseClass => {
        const classDiv = document.createElement('div');
        classDiv.className = 'class-card';
        
        const avatar = document.createElement('div');
        avatar.className = 'class-avatar';
        avatar.textContent = baseClass.avatar;

        const name = document.createElement('h4');
        name.textContent = baseClass.name;

        const desc = document.createElement('p');
        desc.textContent = baseClass.description;

        const stats = document.createElement('div');
        stats.className = 'class-stats-preview';
        stats.innerHTML = `
            <div>Physical: ${baseClass.baseDmg}</div>
            <div>Magic: ${baseClass.magicDmg}</div>
            <div>Armor: ${baseClass.armor}</div>
            <div>HP: ${baseClass.maxHp}</div>
        `;

        const selectBtn = document.createElement('button');
        selectBtn.className = 'skill-btn';
        selectBtn.textContent = 'Select';
        selectBtn.onclick = () => selectClass(baseClass.key);

        classDiv.append(avatar, name, desc, stats, selectBtn);
        classSelection.append(classDiv);
    });
}

/**
 * Select class and create player
 */
function selectClass(classKey) {
    const nameInput = $('nameInput');
    const name = nameInput.value.trim();

    if (!name) {
        alert('Please enter a character name');
        return;
    }

    state.currentClass = classKey;
    state.player = createPlayer(name, classKey);
    
    // Hide character creation and show room selection
    $('characterCreation').classList.add('hidden');
    updateUI();
    updateSkills();
    showRooms();
}

/**
 * Create player object
 */
function createPlayer(name, classKey) {
    const classData = getClass(classKey);
    const skillKeys = getClassSkillKeys(classKey);
    const skillsMax = getPlayerSkillsMax(classKey);
    
    return {
        name,
        classKey,
        className: classData.name,
        level: 1,
        xp: 0,
        maxHp: classData.maxHp,
        hp: classData.maxHp,
        baseDmg: classData.baseDmg,
        magicDmg: classData.magicDmg,
        armor: classData.armor,
        weapon: 0,
        magicWeapon: 0,
        skills: getPlayerInitialSkills(classKey),
        skillsMax,
        skillKeys,
        skillDatabase: buildSkillDatabase(classKey),
        barrier: false,
        guard: false,
        poisoned: 0,
        bleedStacks: 0,
        paralyzed: false,
        frozen: false,
        potions: 2
    };
}

// ==================== PRESTIGE CLASS SELECTION ====================

/**
 * Show prestige class selection screen
 */
function showPrestigeSelection() {
    $('battleScreen').classList.add('hidden');
    $('roomScreen').classList.add('hidden');
    $('prestigeSelection').classList.remove('hidden');

    const prestigeOptions = $('prestigeOptions');
    prestigeOptions.innerHTML = '';

    const options = getPrestigeOptions(state.player.classKey);
    
    options.forEach(prestige => {
        const prestigeDiv = document.createElement('div');
        prestigeDiv.className = 'prestige-card';

        const avatar = document.createElement('div');
        avatar.className = 'class-avatar';
        avatar.textContent = prestige.avatar;

        const name = document.createElement('h4');
        name.textContent = prestige.name;

        const desc = document.createElement('p');
        desc.textContent = prestige.description;

        const stats = document.createElement('div');
        stats.className = 'class-stats-preview';
        stats.innerHTML = `
            <div>Physical: ${prestige.baseDmg}</div>
            <div>Magic: ${prestige.magicDmg}</div>
            <div>Armor: ${prestige.armor}</div>
            <div>HP: ${prestige.maxHp}</div>
        `;

        const selectBtn = document.createElement('button');
        selectBtn.className = 'skill-btn';
        selectBtn.textContent = 'Choose';
        selectBtn.onclick = () => choosePrestigeClass(prestige.key);

        prestigeDiv.append(avatar, name, desc, stats, selectBtn);
        prestigeOptions.append(prestigeDiv);
    });
}

/**
 * Apply prestige class upgrade
 */
function choosePrestigeClass(prestigeKey) {
    const prestige = getClass(prestigeKey);
    const player = state.player;

    player.classKey = prestigeKey;
    player.className = prestige.name;
    player.baseDmg = prestige.baseDmg;
    player.magicDmg = prestige.magicDmg;
    player.armor = prestige.armor;
    player.maxHp = prestige.maxHp;
    player.hp = prestige.maxHp;
    player.skillKeys = getClassSkillKeys(prestigeKey);
    player.skillDatabase = buildSkillDatabase(prestigeKey);
    player.skillsMax = getPlayerSkillsMax(prestigeKey);
    player.skills = { ...player.skillsMax };

    log(`${player.name} has become a ${player.className}!`);
    updateUI();
    $('prestigeSelection').classList.add('hidden');
    setTimeout(() => showRooms(), 800);
}

/**
 * Skip prestige selection
 */
function skipPrestige() {
    $('prestigeSelection').classList.add('hidden');
    setTimeout(() => showRooms(), 800);
}

// ==================== BATTLE SYSTEM ====================

/**
 * Log battle messages
 */
function log(text, who = 'battle') {
    const logContainer = who === 'enemy' ? $('enemyLog') : $('battleLog');
    const entry = document.createElement('div');
    entry.textContent = text;
    logContainer.prepend(entry);
}

/**
 * Update UI elements
 */
function updateUI() {
    if (!state.player) return;
    const player = state.player;
    const need = 20 + player.level * 15;
    
    $('xpText').textContent = `${player.xp}/${need}`;
    $('playerName').textContent = player.name;
    $('playerClass').textContent = player.className;
    $('playerLevel').textContent = player.level;
    $('playerTitle').textContent = `${player.name} the ${player.className} (Lv ${player.level})`;
    $('playerHpText').textContent = `HP: ${player.hp}/${player.maxHp}`;
    $('hpText').textContent = `${player.hp}/${player.maxHp}`;
    $('dmgPhysical').textContent = player.baseDmg + player.weapon;
    $('dmgMagic').textContent = player.magicDmg + player.magicWeapon;
    $('armorText').textContent = player.armor;
    $('playerHpFill').style.width = Math.max(0, (player.hp / player.maxHp) * 100) + '%';
    $('potionsCount').textContent = player.potions;
    $('playerAvatar').textContent = getClass(player.classKey).avatar;
    
    $('levelDisplay').classList.remove('hidden');

    if (state.enemy) {
        const enemy = state.enemy;
        $('enemyTitle').textContent = `${enemy.name} (Lv ${enemy.level})`;
        $('enemyHpText').textContent = `HP: ${enemy.hp}/${enemy.maxHp}`;
        $('enemyHpFill').style.width = Math.max(0, (enemy.hp / enemy.maxHp) * 100) + '%';
        $('enemyAvatar').textContent = enemy.avatar;
    }
}

/**
 * Build skill buttons for current player class
 */
function updateSkills() {
    const row = $('skillsRow');
    row.innerHTML = '';
    const player = state.player;
    
    if (!player) return;

    player.skillKeys.forEach(skillKey => {
        const skill = player.skillDatabase[skillKey];
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

/**
 * Use a skill in battle
 */
function useSkill(skillKey) {
    if (!state.inBattle || !state.awaitingPlayerAction) return;
    
    const player = state.player;
    const skill = player.skillDatabase[skillKey];
    
    if (!skill) {
        log(`Skill not found: ${skillKey}`);
        return;
    }

    if ((player.skills[skillKey] ?? 0) <= 0) {
        log(`No uses left for ${skill.name}.`);
        return;
    }

    player.skills[skillKey]--;
    updateSkills();
    
    const resultText = applySkill(player, state.enemy, skillKey, player.skillDatabase);
    log(resultText);
    
    // Apply poison damage to enemy
    if (state.enemy.poisoned > 0) {
        const poisonDmg = Math.max(1, Math.ceil((state.enemy.maxHp || 100) * 0.08 * state.enemy.poisoned));
        state.enemy.hp = Math.max(0, state.enemy.hp - poisonDmg);
        log(`${state.enemy.name} takes ${poisonDmg} poison damage!`);
    }

    // Apply bleed damage to enemy (trigger at 3 stacks)
    if (state.enemy.bleedStacks >= 3) {
        const bleedDmg = Math.ceil((state.enemy.maxHp || 100) * 0.2);
        state.enemy.hp = Math.max(0, state.enemy.hp - bleedDmg);
        state.enemy.bleedStacks = 0;
        log(`${state.enemy.name} takes ${bleedDmg} bleed damage from critical wounds!`);
    }
    
    state.awaitingPlayerAction = false;
    checkEnemy();
    
    if (state.inBattle) {
        setTimeout(enemyTurn, 700);
    }
}

/**
 * Enemy takes a turn
 */
function enemyTurn() {
    if (!state.inBattle) return;
    
    const enemy = state.enemy;
    const player = state.player;
    
    if (!enemy || !player) return;

    // Check if enemy is frozen
    if (enemy.frozen) {
        log(`${enemy.name} is frozen and cannot act!`);
        enemy.frozen = false;
        updateUI();
        state.awaitingPlayerAction = true;
        checkPlayer();
        return;
    }

    // Handle paralysis - 50% chance to miss
    if (enemy.paralyzed) {
        if (Math.random() < 0.5) {
            log(`${enemy.name} is paralyzed and misses their attack!`);
            enemy.paralyzed = false;
            updateUI();
            state.awaitingPlayerAction = true;
            checkPlayer();
            return;
        }
        enemy.paralyzed = false;
    }

    const skillKey = enemy.skills[rand(0, enemy.skills.length - 1)];
    const resultText = applySkill(enemy, player, skillKey, universalSkillDatabase);
    
    log(`${enemy.name} ${resultText}`, 'enemy');
    
    // Apply poison damage to player
    if (player.poisoned > 0) {
        const poisonDmg = Math.max(1, Math.ceil((player.maxHp || 100) * 0.08 * player.poisoned));
        player.hp = Math.max(0, player.hp - poisonDmg);
        log(`${player.className} takes ${poisonDmg} poison damage!`);
    }

    // Apply bleed damage to player (trigger at 3 stacks)
    if (player.bleedStacks >= 3) {
        const bleedDmg = Math.ceil((player.maxHp || 100) * 0.2);
        player.hp = Math.max(0, player.hp - bleedDmg);
        player.bleedStacks = 0;
        log(`${player.className} takes ${bleedDmg} bleed damage from critical wounds!`);
    }

    updateUI();
    state.awaitingPlayerAction = true;
    checkPlayer();
}

/**
 * Check if enemy is defeated
 */
function checkEnemy() {
    if (state.enemy && state.enemy.hp <= 0) {
        log(`${state.enemy.title || state.enemy.name} is defeated!`);
        
        const xp = 8 + state.enemy.level * 6;
        grantXP(xp);
        
        // Rewards
        const rewardRoll = Math.random();
        if (rewardRoll < 0.35) {
            const potions = rand(1, 3);
            state.player.potions += potions;
            log(`${state.enemy.name} dropped ${potions} potion(s).`);
        } else if (rewardRoll < 0.65) {
            const weaponBoost = 1 + Math.floor(state.roomsCleared / 8);
            state.player.weapon += weaponBoost;
            log(`${state.enemy.name} dropped a weapon (+${weaponBoost} physical).`);
        } else {
            const magicBoost = 1 + Math.floor(state.roomsCleared / 10);
            state.player.magicWeapon += magicBoost;
            log(`${state.enemy.name} dropped a tome (+${magicBoost} magic).`);
        }
        
        if (rewardRoll < 0.20) {
            const armorBoost = 1 + Math.floor(state.roomsCleared / 12);
            state.player.armor += armorBoost;
            log(`${state.enemy.name} dropped armor (+${armorBoost} armor).`);
        }

        state.enemy = null;
        state.inBattle = false;
        state.roomsCleared++;
        updateUI();
        setTimeout(() => showRooms(), 800);
    }
}

/**
 * Check if player is defeated
 */
function checkPlayer() {
    if (state.player.hp <= 0) {
        state.inBattle = false;
        $('battleScreen').classList.add('hidden');
        $('gameOver').classList.remove('hidden');
        $('finalClass').textContent = state.player.className;
        $('finalLevel').textContent = state.player.level;
        $('finalRooms').textContent = state.roomsCleared;
    }
}

/**
 * Start a battle
 */
function startBattle() {
    if (!state.enemy) return;
    
    state.inBattle = true;
    state.awaitingPlayerAction = true;
    $('characterCreation').classList.add('hidden');
    $('roomScreen').classList.add('hidden');
    $('gameOver').classList.add('hidden');
    $('battleScreen').classList.remove('hidden');
    $('battleLog').innerHTML = '';
    $('enemyLog').innerHTML = '';
    
    updateSkills();
    updateUI();
    log(`A wild ${state.enemy.name} appears!`);
}

/**
 * Spawn an enemy
 */
let spawnRunning = false;
function spawnEnemy() {
    if (spawnRunning) return;
    spawnRunning = true;
    
    try {
        const level = getEnemyLevel(state.roomsCleared);
        const type = getRandomEnemyType();
        state.enemy = createEnemy(type, level);
        startBattle();
    } finally {
        setTimeout(() => { spawnRunning = false; }, 120);
    }
}

// ==================== PROGRESSION ====================

/**
 * Grant XP and check for level up
 */
function grantXP(xpAmount) {
    const player = state.player;
    player.xp += xpAmount;
    const need = 20 + player.level * 15;
    
    if (player.xp >= need) {
        player.xp -= need;
        player.level++;
        player.maxHp += 12;
        player.baseDmg += 2;
        player.magicDmg += 2;
        player.armor += 1;
        player.hp = player.maxHp;
        
        // Restore some skills
        player.skillKeys.forEach(skillKey => {
            if (player.skillsMax[skillKey] !== undefined) {
                if (player.level % 3 === 0) {
                    player.skillsMax[skillKey]++;
                }
                player.skills[skillKey] = player.skillsMax[skillKey];
            }
        });
        
        log(`${player.name} leveled up to ${player.level}!`);
        
        // Check for prestige class unlock
        if (player.level === 5 && !isPrestigeClass(player.classKey)) {
            setTimeout(() => showPrestigeSelection(), 1000);
        }
        
        updateUI();
    }
}

// ==================== ROOM SYSTEM ====================

/**
 * Generate and show room choices
 */
function showRooms() {
    $('battleScreen').classList.add('hidden');
    $('roomScreen').classList.remove('hidden');
    
    const choices = $('roomChoices');
    choices.innerHTML = '';
    
    // Generate room options
    const opts = [];
    const restChance = 0.25 + Math.min(0.25, state.roomsCleared * 0.2);
    
    if (Math.random() < restChance) {
        opts.push({ type: 'rest', title: 'Rest Room', desc: 'Regain spells & HP', symbol: '🌙' });
    } else {
        if (Math.random() < 0.5) {
            opts.push({ type: 'weapon', title: 'Weapon Cache', desc: 'Physical damage', val: rand(1, 3), symbol: '⚔️' });
        } else {
            opts.push({ type: 'potions', title: 'Supply Cache', desc: 'Health potions', val: rand(1, 3), symbol: '🧪' });
        }
    }
    
    if (Math.random() < 0.6) {
        opts.push({ type: 'enemy', title: 'Dangerous Room', desc: 'Fight enemy', symbol: '💀' });
    } else {
        if (Math.random() < 0.5) {
            opts.push({ type: 'potions', title: 'Hidden Cache', desc: 'Health potions', val: rand(1, 3), symbol: '🧪' });
        } else {
            opts.push({ type: 'magic', title: 'Spellbook', desc: 'Magic damage', val: rand(1, 2), symbol: '📖' });
        }
    }
    
    opts.forEach(roomOption => {
        const roomDiv = document.createElement('div');
        roomDiv.className = 'room';
        
        const symbol = document.createElement('div');
        symbol.className = 'room-symbol';
        symbol.textContent = roomOption.symbol;
        
        const title = document.createElement('h4');
        title.textContent = roomOption.title;
        
        const desc = document.createElement('div');
        desc.className = 'room-desc';
        desc.textContent = roomOption.desc;
        
        roomDiv.append(symbol, title, desc);
        roomDiv.onclick = () => chooseRoom(roomOption);
        choices.append(roomDiv);
    });
}

/**
 * Handle room choice
 */
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
        log(`You found a weapon! Physical Damage +${roomOption.val}.`);
        updateUI();
        setTimeout(() => spawnEnemy(), 800);
    } else if (roomOption.type === 'magic') {
        state.player.magicWeapon += roomOption.val;
        log(`You found a spellbook! Magic Damage +${roomOption.val}.`);
        updateUI();
        setTimeout(() => spawnEnemy(), 800);
    } else if (roomOption.type === 'potions') {
        state.player.potions += roomOption.val;
        log(`You found ${roomOption.val} potion(s).`);
        updateUI();
        setTimeout(() => spawnEnemy(), 800);
    } else {
        spawnEnemy();
    }
}

// ==================== ITEMS AND CHARACTER SHEET ====================

/**
 * Open character sheet
 */
function openCharacterSheet() {
    if (!state.player) return;
    
    const player = state.player;
    const stats = $('sheetStats');
    stats.innerHTML = '';
    
    const addLine = (label, value) => {
        const div = document.createElement('div');
        div.className = 'sheet-stat-line';
        div.innerHTML = `<span>${label}:</span> <strong>${value}</strong>`;
        stats.append(div);
    };
    
    addLine('Name', player.name);
    addLine('Class', player.className);
    addLine('Level', player.level);
    addLine('XP', `${player.xp}/${20 + player.level * 15}`);
    addLine('HP', `${player.hp}/${player.maxHp}`);
    addLine('Physical DMG', player.baseDmg + player.weapon);
    addLine('Magic DMG', player.magicDmg + player.magicWeapon);
    addLine('Armor', player.armor);
    addLine('Potions', player.potions);
    addLine('Rooms Cleared', state.roomsCleared);
    
    $('sheetAvatar').textContent = getClass(player.classKey).avatar;
    $('modal').classList.remove('hidden');
    $('modal').setAttribute('aria-hidden', 'false');
}

/**
 * Close character sheet
 */
function closeCharacterSheet() {
    $('modal').classList.add('hidden');
    $('modal').setAttribute('aria-hidden', 'true');
}

/**
 * Use a potion
 */
function usePotion() {
    const player = state.player;
    
    if (!player || player.potions <= 0) {
        alert('No potions available');
        return;
    }
    
    if (!state.inBattle) {
        alert('Use potions during battle');
        return;
    }
    
    player.potions--;
    const healAmount = Math.ceil(player.maxHp * 0.45);
    player.hp = clamp(player.hp + healAmount, 0, player.maxHp);
    
    log(`${player.name} drinks a potion and recovers ${healAmount} HP.`);
    updateUI();
}

// ==================== SAVE/LOAD SYSTEM ====================

/**
 * Save game to localStorage
 */
function saveGame() {
    const saveData = {
        state,
        timestamp: new Date().toLocaleString()
    };
    
    localStorage.setItem('dungeonMageSave', JSON.stringify(saveData));
    alert('Game saved!');
}

/**
 * Load game from localStorage
 */
function loadGame() {
    const saveData = localStorage.getItem('dungeonMageSave');
    
    if (!saveData) {
        alert('No saved game found');
        return;
    }
    
    const data = JSON.parse(saveData);
    state = data.state;
    
    // Rebuild skill databases
    if (state.player) {
        state.player.skillDatabase = buildSkillDatabase(state.player.classKey);
        state.player.skillKeys = getClassSkillKeys(state.player.classKey);
        state.currentClass = state.player.classKey;
    }
    
    updateUI();
    updateSkills();
    
    if (state.inBattle) {
        startBattle();
    } else {
        $('characterCreation').classList.add('hidden');
        showRooms();
    }
    
    alert(`Loaded game from ${data.timestamp}`);
}

/**
 * Restart game
 */
function restartGame() {
    state = {
        player: null,
        enemy: null,
        roomsCleared: 0,
        inBattle: false,
        awaitingPlayerAction: true,
        currentClass: null,
        showPrestigeOffer: false
    };
    
    initializeCharacterCreation();
}

// ==================== EVENT LISTENERS ====================

document.addEventListener('DOMContentLoaded', () => {
    initializeCharacterCreation();
    
    // Character creation
    $('startBtn').addEventListener('click', () => {
        const classCards = document.querySelectorAll('.class-card');
        if (classCards.length === 0) selectClass(Object.keys(getAvailableBaseClasses())[0]);
    });
    
    // Battle
    $('bagBtn').addEventListener('click', openCharacterSheet);
    $('endTurnBtn').addEventListener('click', () => {
        // End turn is handled by skill usage
    });
    
    $('usePotionBtn').addEventListener('click', usePotion);
    $('closeModal').addEventListener('click', closeCharacterSheet);
    
    // Prestige
    $('skipPrestigeBtn').addEventListener('click', skipPrestige);
    
    // Game over
    $('restartBtn').addEventListener('click', restartGame);
    
    // Save/Load
    $('saveBtn').addEventListener('click', saveGame);
    $('loadBtn').addEventListener('click', loadGame);
});
