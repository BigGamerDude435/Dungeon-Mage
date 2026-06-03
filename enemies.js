/**
 * Enemy System for Dungeon Mage
 * Defines enemy types and framework for easy expansion
 */

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

/**
 * Enemy templates - easily add new enemies here
 */
export const enemies = {
    skeleton: {
        name: 'Skeleton',
        avatar: '💀',
        skills: ['slash', 'powerStrike', 'shield'],
        baseHp: 45,
        hpPerLevel: 14,
        baseDmg: 5,
        dmgPerLevel: 2.5,
        armor: 3
    },
    goblin: {
        name: 'Goblin',
        avatar: '👹',
        skills: ['powerShot', 'multiShot', 'evasion'],
        baseHp: 35,
        hpPerLevel: 10,
        baseDmg: 6,
        dmgPerLevel: 2,
        armor: 1
    },
    slime: {
        name: 'Slime',
        avatar: '🟢',
        skills: ['whirlwind', 'rally', 'shield'],
        baseHp: 50,
        hpPerLevel: 12,
        baseDmg: 3,
        dmgPerLevel: 1.5,
        armor: 2
    },
    orc: {
        name: 'Orc',
        avatar: '🗑️',
        skills: ['powerStrike', 'whirlwind', 'rally'],
        baseHp: 60,
        hpPerLevel: 16,
        baseDmg: 8,
        dmgPerLevel: 3,
        armor: 5
    },
    mage: {
        name: 'Enemy Mage',
        avatar: '🧙',
        skills: ['fireball', 'frostbolt', 'arcaneShield', 'magicMissile'],
        baseHp: 40,
        hpPerLevel: 10,
        baseDmg: 4,
        dmgPerLevel: 2,
        armor: 2
    },
    vampire: {
        name: 'Vampire',
        avatar: '🧛',
        skills: ['darkBolt', 'lifeLeech', 'darkShield', 'curse'],
        baseHp: 55,
        hpPerLevel: 13,
        baseDmg: 7,
        dmgPerLevel: 2.5,
        armor: 4
    },
    drake: {
        name: 'Drake',
        avatar: '🐉',
        skills: ['powerStrike', 'whirlwind', 'powerShot', 'inferno'],
        baseHp: 70,
        hpPerLevel: 18,
        baseDmg: 10,
        dmgPerLevel: 3.5,
        armor: 7
    },
    wraith: {
        name: 'Wraith',
        avatar: '👻',
        skills: ['shadowStrike', 'darkBolt', 'curse', 'shadowClone'],
        baseHp: 45,
        hpPerLevel: 11,
        baseDmg: 6,
        dmgPerLevel: 2.5,
        armor: 2
    },
    troll: {
        name: 'Troll',
        avatar: '🧌',
        skills: ['powerStrike', 'rally', 'shield', 'whirlwind'],
        baseHp: 80,
        hpPerLevel: 20,
        baseDmg: 7,
        dmgPerLevel: 3,
        armor: 6
    },
    spider: {
        name: 'Spider',
        avatar: '🕷️',
        skills: ['poisonDagger', 'shadowStrike', 'evasion', 'multiShot'],
        baseHp: 38,
        hpPerLevel: 9,
        baseDmg: 5,
        dmgPerLevel: 2,
        armor: 2
    }
};

/**
 * Get enemy stats for a given enemy type and level
 */
export function getEnemyStats(enemyType, level) {
    const template = enemies[enemyType];
    if (!template) {
        console.warn(`Unknown enemy type: ${enemyType}`);
        return {
            hp: 40 + (level - 1) * 12,
            dmg: 4 + (level - 1) * 2,
            armor: 2
        };
    }
    
    const hp = template.baseHp + (level - 1) * template.hpPerLevel;
    const dmg = template.baseDmg + (level - 1) * template.dmgPerLevel;
    const armor = template.armor || 0;
    
    return { hp, dmg, armor };
}

/**
 * Get random enemy type
 */
export function getRandomEnemyType() {
    const types = Object.keys(enemies);
    return types[Math.floor(Math.random() * types.length)];
}

/**
 * Get skill set for enemy type
 */
export function getEnemySkillSet(enemyType) {
    const template = enemies[enemyType];
    return template ? [...template.skills] : ['slash'];
}

/**
 * Get avatar for enemy type
 */
export function getEnemyAvatar(enemyType) {
    const template = enemies[enemyType];
    return template ? template.avatar : '?';
}

/**
 * Get name for enemy type
 */
export function getEnemyName(enemyType) {
    const template = enemies[enemyType];
    return template ? template.name : enemyType;
}

/**
 * Get all available enemy types
 */
export function getAvailableEnemyTypes() {
    return Object.keys(enemies);
}

/**
 * Create enemy object
 */
export function createEnemy(enemyType, level) {
    const stats = getEnemyStats(enemyType, level);
    const hp = stats.hp + rand(0, 10);
    const dmg = stats.dmg + rand(0, 3);
    
    return {
        type: enemyType,
        name: getEnemyName(enemyType),
        avatar: getEnemyAvatar(enemyType),
        level,
        maxHp: hp,
        hp,
        baseDmg: dmg,
        weapon: 0,
        magicWeapon: 0,
        armor: stats.armor || 0,
        skills: getEnemySkillSet(enemyType),
        barrier: false,
        guard: false,
        poisoned: 0,
        bleedStacks: 0,
        paralyzed: false,
        frozen: false
    };
}

/**
 * Scale enemy difficulty based on rooms cleared
 * Returns appropriate enemy level
 */
export function getEnemyLevel(roomsCleared) {
    return Math.max(1, Math.floor(1 + roomsCleared / 2 + rand(0, 1)));
}
