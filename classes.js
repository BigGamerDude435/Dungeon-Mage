/**
 * Class System for Dungeon Mage
 * Defines base classes and prestige class progression
 */

import {
    warriorSkills, mageSkills, rangerSkills,
    knightSkills, berserkerSkills, paladinSkills,
    elementalistSkills, priestSkills, darkMageSkills,
    marksmanSkills, assassinSkills, beastmasterSkills
} from './skills.js';

// ==================== CLASS DEFINITIONS ====================

/**
 * Base class structure
 */
export const baseClasses = {
    warrior: {
        name: 'Warrior',
        description: 'Master of melee combat',
        baseDmg: 10,
        magicDmg: 2,
        armor: 8,
        maxHp: 120,
        skills: warriorSkills,
        skillKeys: ['slash', 'powerStrike', 'shield', 'whirlwind', 'rally'],
        avatar: '⚔️'
    },
    mage: {
        name: 'Mage',
        description: 'Master of magic and arcane arts',
        baseDmg: 4,
        magicDmg: 12,
        armor: 3,
        maxHp: 90,
        skills: mageSkills,
        skillKeys: ['fireball', 'frostbolt', 'arcaneShield', 'magicMissile', 'heal'],
        avatar: '✨'
    },
    ranger: {
        name: 'Ranger',
        description: 'Master of ranged combat and agility',
        baseDmg: 8,
        magicDmg: 5,
        armor: 5,
        maxHp: 100,
        skills: rangerSkills,
        skillKeys: ['powerShot', 'multiShot', 'evasion', 'piercingShot', 'lastStand'],
        avatar: '🏹'
    }
};

/**
 * Prestige classes - available at level 5
 */
export const prestigeClasses = {
    // Warrior prestige classes
    knight: {
        name: 'Knight',
        description: 'Master of defense and protection',
        baseClass: 'warrior',
        baseDmg: 10,
        magicDmg: 3,
        armor: 15,
        maxHp: 150,
        skills: knightSkills,
        skillKeys: ['ironSkin', 'heavySlash', 'lastStand', 'shieldWall', 'counterattack'],
        avatar: '👑'
    },
    berserker: {
        name: 'Berserker',
        description: 'Master of overwhelming damage',
        baseClass: 'warrior',
        baseDmg: 16,
        magicDmg: 2,
        armor: 4,
        maxHp: 110,
        skills: berserkerSkills,
        skillKeys: ['rage', 'executioners', 'cleave', 'bloodlust', 'secondWind'],
        avatar: '😤'
    },
    paladin: {
        name: 'Paladin',
        description: 'Master of holy light and balance',
        baseClass: 'warrior',
        baseDmg: 12,
        magicDmg: 8,
        armor: 10,
        maxHp: 130,
        skills: paladinSkills,
        skillKeys: ['holySmite', 'devotion', 'divineLance', 'consecration', 'divineHealing'],
        avatar: '⚡'
    },

    // Mage prestige classes
    elementalist: {
        name: 'Elementalist',
        description: 'Master of all elements',
        baseClass: 'mage',
        baseDmg: 5,
        magicDmg: 18,
        armor: 2,
        maxHp: 85,
        skills: elementalistSkills,
        skillKeys: ['inferno', 'blizzard', 'lightningBolt', 'elementalShield', 'manaRefresh'],
        avatar: '🌪️'
    },
    priest: {
        name: 'Priest',
        description: 'Master of healing and holy magic',
        baseClass: 'mage',
        baseDmg: 6,
        magicDmg: 10,
        armor: 6,
        maxHp: 110,
        skills: priestSkills,
        skillKeys: ['heal', 'holyLight', 'blessing', 'resurrection', 'smite'],
        avatar: '✝️'
    },
    darkMage: {
        name: 'Dark Mage',
        description: 'Master of shadow and curses',
        baseClass: 'mage',
        baseDmg: 7,
        magicDmg: 14,
        armor: 4,
        maxHp: 95,
        skills: darkMageSkills,
        skillKeys: ['darkBolt', 'curse', 'shadowClone', 'darkShield', 'lifeLeech'],
        avatar: '👿'
    },

    // Ranger prestige classes
    marksman: {
        name: 'Marksman',
        description: 'Master of precision archery',
        baseClass: 'ranger',
        baseDmg: 12,
        magicDmg: 4,
        armor: 3,
        maxHp: 95,
        skills: marksmanSkills,
        skillKeys: ['precisionShot', 'barrage', 'dodge', 'headshot', 'camouflage'],
        avatar: '🎯'
    },
    assassin: {
        name: 'Assassin',
        description: 'Master of burst damage and stealth',
        baseClass: 'ranger',
        baseDmg: 14,
        magicDmg: 6,
        armor: 3,
        maxHp: 85,
        skills: assassinSkills,
        skillKeys: ['backstab', 'shadowStrike', 'shadowStep', 'poisonDagger', 'smokeScreen'],
        avatar: '🗡️'
    },
    beastmaster: {
        name: 'Beastmaster',
        description: 'Master of wild beasts and primal power',
        baseClass: 'ranger',
        baseDmg: 10,
        magicDmg: 7,
        armor: 7,
        maxHp: 115,
        skills: beastmasterSkills,
        skillKeys: ['beastCall', 'wildStrike', 'packInstinct', 'feedingFrenzy', 'primalBond'],
        avatar: '🐻'
    }
};

/**
 * Get prestige options for a base class
 */
export function getPrestigeOptions(baseClass) {
    const options = [];
    for (const [key, prestigeClass] of Object.entries(prestigeClasses)) {
        if (prestigeClass.baseClass === baseClass) {
            options.push({ key, ...prestigeClass });
        }
    }
    return options;
}

/**
 * Get a class definition by key
 */
export function getClass(classKey) {
    return baseClasses[classKey] || prestigeClasses[classKey];
}

/**
 * Check if a class is a prestige class
 */
export function isPrestigeClass(classKey) {
    return classKey in prestigeClasses;
}

/**
 * Get the base class for a prestige class
 */
export function getBaseClass(classKey) {
    const prestigeClass = prestigeClasses[classKey];
    return prestigeClass ? prestigeClass.baseClass : classKey;
}

/**
 * Create class name from key
 */
export function classKeyToName(key) {
    const classData = getClass(key);
    return classData ? classData.name : key;
}

/**
 * Get all available base classes
 */
export function getAvailableBaseClasses() {
    return Object.entries(baseClasses).map(([key, data]) => ({
        key,
        ...data
    }));
}

/**
 * Get skill data for class
 */
export function getClassSkills(classKey) {
    const classData = getClass(classKey);
    if (!classData) return {};
    return classData.skills;
}

/**
 * Get skill keys for class
 */
export function getClassSkillKeys(classKey) {
    const classData = getClass(classKey);
    if (!classData) return [];
    return classData.skillKeys;
}

/**
 * Get initial skills for player with a class
 */
export function getPlayerInitialSkills(classKey) {
    const skillKeys = getClassSkillKeys(classKey);
    const skills = {};
    const classData = getClass(classKey);
    
    skillKeys.forEach(skillKey => {
        if (classData.skills && classData.skills[skillKey]) {
            skills[skillKey] = classData.skills[skillKey].uses || 0;
        }
    });
    
    return skills;
}

/**
 * Get max skill uses for player with a class
 */
export function getPlayerSkillsMax(classKey) {
    const skillKeys = getClassSkillKeys(classKey);
    const skillsMax = {};
    const classData = getClass(classKey);
    
    skillKeys.forEach(skillKey => {
        if (classData.skills && classData.skills[skillKey]) {
            skillsMax[skillKey] = classData.skills[skillKey].uses || 0;
        }
    });
    
    return skillsMax;
}

/**
 * Build complete skill database for a class
 */
export function buildSkillDatabase(classKey) {
    const classData = getClass(classKey);
    if (!classData || !classData.skills) return {};
    return classData.skills;
}
