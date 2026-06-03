/**
 * Skills Database and Damage Type System
 * Organized by damage type and class affinity
 */

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Damage Types
export const DAMAGE_TYPES = {
    PHYSICAL: 'physical',
    MAGICAL: 'magical',
    PURE: 'pure',
    PURIFICATION: 'purification',
    CORRUPTION: 'corruption',
    POISON: 'poison',
    BLEED: 'bleed',
    PARALYZE: 'paralyze',
    FROZEN: 'frozen',
    LIFESTEAL: 'lifesteal'
};

// ==================== WARRIOR SKILLS ====================
export const warriorSkills = {
    slash: {
        name: 'Slash',
        description: 'Basic melee attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [4, 8],
        uses: 12,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    powerStrike: {
        name: 'Power Strike',
        description: 'Strong physical attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [8, 14],
        uses: 6,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2)
    },
    deepCut: {
        name: 'Deep Cut',
        description: 'Bladed strike that causes bleeding',
        type: 'atk',
        target: 'enemy',
        effect: 'bleed',
        damageType: DAMAGE_TYPES.BLEED,
        range: [6, 10],
        uses: 5,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2)
    },
    shield: {
        name: 'Shield Bash',
        description: 'Defend and reduce damage',
        type: 'buff',
        target: 'self',
        effect: 'reduceDmg',
        uses: 9
    },
    whirlwind: {
        name: 'Whirlwind',
        description: 'Multi-hit physical attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage_multi',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [3, 6],
        hits: [2, 4],
        uses: 6,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 4)
    },
    rally: {
        name: 'Rally',
        description: 'Heal moderate HP',
        type: 'heal',
        target: 'self',
        effect: 'heal',
        damageType: DAMAGE_TYPES.PURE,
        damage: -0.15,
        uses: 5
    }
};

// ==================== MAGE SKILLS ====================
export const mageSkills = {
    fireball: {
        name: 'Fireball',
        description: 'High-damage fire spell',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.MAGICAL,
        range: [16, 24],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2)
    },
    frostbolt: {
        name: 'Frostbolt',
        description: 'Ice magic attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.MAGICAL,
        range: [9, 13],
        uses: 10,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    frozenBolt: {
        name: 'Frozen Bolt',
        description: 'Freeze enemy in place',
        type: 'atk',
        target: 'enemy',
        effect: 'frozen',
        damageType: DAMAGE_TYPES.FROZEN,
        range: [8, 12],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    arcaneShield: {
        name: 'Arcane Shield',
        description: 'Magical barrier',
        type: 'buff',
        target: 'self',
        effect: 'reduceDmg',
        uses: 12
    },
    magicMissile: {
        name: 'Magic Missile',
        description: 'Multiple magic projectiles',
        type: 'atk',
        target: 'enemy',
        effect: 'damage_multi',
        damageType: DAMAGE_TYPES.MAGICAL,
        range: [3, 6],
        hits: [2, 4],
        uses: 10,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 4)
    },
    heal: {
        name: 'Heal',
        description: 'Restore significant HP',
        type: 'heal',
        target: 'self',
        effect: 'heal',
        damageType: DAMAGE_TYPES.PURE,
        damage: -0.35,
        uses: 9
    }
};

// ==================== RANGER SKILLS ====================
export const rangerSkills = {
    powerShot: {
        name: 'Power Shot',
        description: 'Strong ranged attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [6, 10],
        uses: 10,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    multiShot: {
        name: 'Multi Shot',
        description: 'Multiple ranged attacks',
        type: 'atk',
        target: 'enemy',
        effect: 'damage_multi',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [4, 8],
        hits: [2, 3],
        uses: 8,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 4)
    },
    evasion: {
        name: 'Evasion',
        description: 'Dodge incoming attacks',
        type: 'buff',
        target: 'self',
        effect: 'reduceDmg',
        uses: 12
    },
    piercingShot: {
        name: 'Piercing Shot',
        description: 'Armor-piercing attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [8, 12],
        uses: 6,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2)
    },
    paralyzeShot: {
        name: 'Paralyze Shot',
        description: 'Stun the enemy with electric shock',
        type: 'atk',
        target: 'enemy',
        effect: 'paralyze',
        damageType: DAMAGE_TYPES.PARALYZE,
        range: [4, 8],
        uses: 5,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 4)
    },
    lastStand: {
        name: 'Last Stand',
        description: 'Heal and fortify',
        type: 'heal',
        target: 'self',
        effect: 'heal',
        damageType: DAMAGE_TYPES.PURE,
        damage: -0.3,
        uses: 9
    }
};

// ==================== PRESTIGE CLASS SKILLS ====================
// Knight (Warrior prestige - tanky defender)
export const knightSkills = {
    ironSkin: {
        name: 'Iron Skin',
        description: 'Greatly reduce damage',
        type: 'buff',
        target: 'self',
        effect: 'reduceDmg',
        uses: 6
    },
    heavySlash: {
        name: 'Heavy Slash',
        description: 'Powerful physical attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [10, 16],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2)
    },
    lastStand: {
        name: 'Last Stand',
        description: 'Heal significant HP',
        type: 'heal',
        target: 'self',
        effect: 'heal',
        damageType: DAMAGE_TYPES.PURE,
        damage: -0.4,
        uses: 3
    },
    shieldWall: {
        name: 'Shield Wall',
        description: 'Protective stance',
        type: 'buff',
        target: 'self',
        effect: 'reduceDmg',
        uses: 4
    },
    counterattack: {
        name: 'Counterattack',
        description: 'Riposte with weapon',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [6, 10],
        uses: 6,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    }
};

// Berserker (Warrior prestige - high damage)
export const berserkerSkills = {
    rage: {
        name: 'Rage',
        description: 'Boost damage significantly',
        type: 'buff',
        target: 'self',
        effect: 'damage_boost',
        uses: 4
    },
    executioners: {
        name: "Executioner's Blow",
        description: 'Devastating attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [15, 25],
        uses: 3,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) * 0.8)
    },
    cleave: {
        name: 'Cleave',
        description: 'Multi-hit attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage_multi',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [5, 9],
        hits: [2, 3],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    bloodlust: {
        name: 'Bloodlust',
        description: 'Drain enemy HP',
        type: 'atk',
        target: 'enemy',
        effect: 'damage_lifesteal',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [6, 11],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    secondWind: {
        name: 'Second Wind',
        description: 'Heal and recover',
        type: 'heal',
        target: 'self',
        effect: 'heal',
        damageType: DAMAGE_TYPES.PURE,
        damage: -0.35,
        uses: 3
    }
};

// Paladin (Warrior prestige - balanced)
export const paladinSkills = {
    holySmite: {
        name: 'Holy Smite',
        description: 'Balanced physical attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.MAGICAL,
        range: [8, 13],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2)
    },
    purify: {
        name: 'Purify',
        description: 'Strike to dispel enemy buffs and deal holy damage',
        type: 'atk',
        target: 'enemy',
        effect: 'purification',
        damageType: DAMAGE_TYPES.PURIFICATION,
        range: [6, 10],
        uses: 5,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    devotion: {
        name: 'Devotion',
        description: 'Reduce incoming damage',
        type: 'buff',
        target: 'self',
        effect: 'reduceDmg',
        uses: 4
    },
    divineLance: {
        name: 'Divine Lance',
        description: 'Multi-hit holy attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage_multi',
        damageType: DAMAGE_TYPES.MAGICAL,
        range: [5, 8],
        hits: [2, 3],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 4)
    },
    consecration: {
        name: 'Consecration',
        description: 'Holy barrier',
        type: 'buff',
        target: 'self',
        effect: 'reduceDmg',
        uses: 3
    },
    divineHealing: {
        name: 'Divine Healing',
        description: 'Restore health',
        type: 'heal',
        target: 'self',
        effect: 'heal',
        damageType: DAMAGE_TYPES.PURE,
        damage: -0.3,
        uses: 4
    }
};

// Elementalist (Mage prestige - element-focused)
export const elementalistSkills = {
    inferno: {
        name: 'Inferno',
        description: 'Massive fire spell',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.MAGICAL,
        range: [14, 22],
        uses: 3,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) * 0.6)
    },
    blizzard: {
        name: 'Blizzard',
        description: 'Ice storm attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage_multi',
        damageType: DAMAGE_TYPES.MAGICAL,
        range: [6, 10],
        hits: [2, 4],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    lightningBolt: {
        name: 'Lightning Bolt',
        description: 'Electric attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.MAGICAL,
        range: [11, 16],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2)
    },
    elementalShield: {
        name: 'Elemental Shield',
        description: 'Multi-element barrier',
        type: 'buff',
        target: 'self',
        effect: 'reduceDmg',
        uses: 4
    },
    manaRefresh: {
        name: 'Mana Refresh',
        description: 'Restore mana and HP',
        type: 'heal',
        target: 'self',
        effect: 'heal',
        damageType: DAMAGE_TYPES.PURE,
        damage: -0.3,
        uses: 4
    }
};

// Priest (Mage prestige - healing focused)
export const priestSkills = {
    heal: {
        name: 'Heal',
        description: 'Restore significant HP',
        type: 'heal',
        target: 'self',
        effect: 'heal',
        damageType: DAMAGE_TYPES.PURE,
        damage: -0.4,
        uses: 6
    },
    holyLight: {
        name: 'Holy Light',
        description: 'Holy damage attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.MAGICAL,
        range: [8, 12],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    purge: {
        name: 'Purge',
        description: 'Dispels enemy defenses with righteous force',
        type: 'atk',
        target: 'enemy',
        effect: 'purification',
        damageType: DAMAGE_TYPES.PURIFICATION,
        range: [7, 11],
        uses: 5,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    blessing: {
        name: 'Blessing',
        description: 'Grant protection',
        type: 'buff',
        target: 'self',
        effect: 'reduceDmg',
        uses: 6
    },
    resurrection: {
        name: 'Resurrection',
        description: 'Major HP recovery',
        type: 'heal',
        target: 'self',
        effect: 'heal',
        damageType: DAMAGE_TYPES.PURE,
        damage: -0.5,
        uses: 2
    },
    smite: {
        name: 'Smite',
        description: 'Righteous attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage_multi',
        damageType: DAMAGE_TYPES.MAGICAL,
        range: [4, 7],
        hits: [2, 3],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 4)
    }
};

// Dark Mage (Mage prestige - curse/dark magic)
export const darkMageSkills = {
    darkBolt: {
        name: 'Dark Bolt',
        description: 'Shadow magic attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.MAGICAL,
        range: [10, 16],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2)
    },
    corruptSoul: {
        name: 'Corrupt Soul',
        description: 'Dark strike that weakens enemy vitality',
        type: 'atk',
        target: 'enemy',
        effect: 'corruption',
        damageType: DAMAGE_TYPES.CORRUPTION,
        range: [9, 15],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2)
    },
    voidRend: {
        name: 'Void Rend',
        description: 'Corrupting attack that fractures enemy life',
        type: 'atk',
        target: 'enemy',
        effect: 'corruption',
        damageType: DAMAGE_TYPES.CORRUPTION,
        range: [7, 11],
        uses: 5,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    curse: {
        name: 'Curse',
        description: 'Poison the enemy with dark magic',
        type: 'atk',
        target: 'enemy',
        effect: 'poison',
        damageType: DAMAGE_TYPES.POISON,
        range: [3, 8],
        uses: 5,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 4)
    },
    shadowClone: {
        name: 'Shadow Clone',
        description: 'Multi-hit shadow attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage_multi',
        damageType: DAMAGE_TYPES.MAGICAL,
        range: [5, 9],
        hits: [2, 4],
        uses: 3,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    darkShield: {
        name: 'Dark Shield',
        description: 'Shadow protection',
        type: 'buff',
        target: 'self',
        effect: 'reduceDmg',
        uses: 4
    },
    lifeLeech: {
        name: 'Life Leech',
        description: 'Drain enemy life',
        type: 'atk',
        target: 'enemy',
        effect: 'damage_lifesteal',
        damageType: DAMAGE_TYPES.MAGICAL,
        range: [6, 11],
        uses: 3,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    }
};

// Marksman (Ranger prestige - pure ranged)
export const marksmanSkills = {
    precisionShot: {
        name: 'Precision Shot',
        description: 'Accurate ranged attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [9, 14],
        uses: 6,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2)
    },
    barrage: {
        name: 'Barrage',
        description: 'Rapid arrow attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage_multi',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [5, 9],
        hits: [3, 5],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 4)
    },
    dodge: {
        name: 'Dodge',
        description: 'Evade attacks',
        type: 'buff',
        target: 'self',
        effect: 'reduceDmg',
        uses: 6
    },
    headshot: {
        name: 'Headshot',
        description: 'Critical ranged attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [12, 18],
        uses: 3,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) * 0.7)
    },
    camouflage: {
        name: 'Camouflage',
        description: 'Hide and recover',
        type: 'heal',
        target: 'self',
        effect: 'heal',
        damageType: DAMAGE_TYPES.PURE,
        damage: -0.28,
        uses: 4
    }
};

// Assassin (Ranger prestige - burst damage)
export const assassinSkills = {
    backstab: {
        name: 'Backstab',
        description: 'Deadly attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [14, 20],
        uses: 3,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) * 0.7)
    },
    shadowStrike: {
        name: 'Shadow Strike',
        description: 'Quick multi-attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage_multi',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [6, 10],
        hits: [2, 4],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    shadowStep: {
        name: 'Shadow Step',
        description: 'Escape danger',
        type: 'buff',
        target: 'self',
        effect: 'reduceDmg',
        uses: 4
    },
    poisonDagger: {
        name: 'Poison Dagger',
        description: 'Poisoned attack that deals damage over time',
        type: 'atk',
        target: 'enemy',
        effect: 'poison',
        damageType: DAMAGE_TYPES.POISON,
        range: [5, 10],
        uses: 6,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    smokeScreen: {
        name: 'Smoke Screen',
        description: 'Hide and heal',
        type: 'heal',
        target: 'self',
        effect: 'heal',
        damageType: DAMAGE_TYPES.PURE,
        damage: -0.3,
        uses: 3
    }
};

// Beastmaster (Ranger prestige - summoner)
export const beastmasterSkills = {
    beastCall: {
        name: 'Beast Call',
        description: 'Summon beast attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage_multi',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [5, 10],
        hits: [2, 4],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    wildStrike: {
        name: 'Wild Strike',
        description: 'Ferocious attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [10, 15],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2)
    },
    packInstinct: {
        name: 'Pack Instinct',
        description: 'Pack protection',
        type: 'buff',
        target: 'self',
        effect: 'reduceDmg',
        uses: 4
    },
    feedingFrenzy: {
        name: 'Feeding Frenzy',
        description: 'Life drain attack',
        type: 'atk',
        target: 'enemy',
        effect: 'damage_lifesteal',
        damageType: DAMAGE_TYPES.PHYSICAL,
        range: [7, 12],
        uses: 3,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    primalBond: {
        name: 'Primal Bond',
        description: 'Beast and master heal',
        type: 'heal',
        target: 'self',
        effect: 'heal',
        damageType: DAMAGE_TYPES.PURE,
        damage: -0.35,
        uses: 3
    }
};

// ==================== ENEMY-EXCLUSIVE SKILLS ====================
export const enemySkills = {
    venomBite: {
        name: 'Venom Bite',
        description: 'Poisonous bite attack',
        type: 'atk',
        target: 'enemy',
        effect: 'poison',
        damageType: DAMAGE_TYPES.POISON,
        range: [5, 9],
        uses: 6,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2)
    },
    venomStrike: {
        name: 'Venom Strike',
        description: 'Poisonous strike dealing high damage',
        type: 'atk',
        target: 'enemy',
        effect: 'poison',
        damageType: DAMAGE_TYPES.POISON,
        range: [8, 14],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2)
    },
    iceBarrier: {
        name: 'Ice Barrier',
        description: 'Enemy solidifies ice defense',
        type: 'buff',
        target: 'self',
        effect: 'reduceDmg',
        uses: 5
    },
    chill: {
        name: 'Chill',
        description: 'Freeze enemy temporarily',
        type: 'atk',
        target: 'enemy',
        effect: 'frozen',
        damageType: DAMAGE_TYPES.FROZEN,
        range: [6, 10],
        uses: 3,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    },
    electricStrike: {
        name: 'Electric Strike',
        description: 'Stun with electricity',
        type: 'atk',
        target: 'enemy',
        effect: 'paralyze',
        damageType: DAMAGE_TYPES.PARALYZE,
        range: [7, 12],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2)
    },
    woundingClaw: {
        name: 'Wounding Claw',
        description: 'Claw attack causing bleeding',
        type: 'atk',
        target: 'enemy',
        effect: 'bleed',
        damageType: DAMAGE_TYPES.BLEED,
        range: [6, 11],
        uses: 5,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2)
    },
    splatter: {
        name: 'Splatter',
        description: 'Multi-hit attack causing bleeding',
        type: 'atk',
        target: 'enemy',
        effect: 'bleed_multi',
        damageType: DAMAGE_TYPES.BLEED,
        range: [3, 6],
        hits: [2, 3],
        uses: 4,
        damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 3)
    }
};

// ==================== UNIVERSAL SKILL DATABASE ====================
/**
 * Combines all skills from all classes for universal access
 */
export const universalSkillDatabase = {
    ...warriorSkills,
    ...mageSkills,
    ...rangerSkills,
    ...knightSkills,
    ...berserkerSkills,
    ...paladinSkills,
    ...elementalistSkills,
    ...priestSkills,
    ...darkMageSkills,
    ...marksmanSkills,
    ...assassinSkills,
    ...beastmasterSkills,
    ...enemySkills
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Apply damage with defense mechanics
 */
export function applyDamage(target, amount, sourceName = 'attack') {
    if (!target) return 0;
    amount = Number.isFinite(amount) ? amount : 0;
    if (target.barrier) {
        target.barrier = false;
        return 0;
    }
    if (target.guard) {
        amount = Math.ceil(amount / 2);
        target.guard = false;
    }
    // Apply armor reduction
    if (target.armor) {
        amount = Math.max(1, Math.ceil(amount * (1 - Math.min(0.8, target.armor / 100))));
    }
    target.hp = Math.max(0, target.hp - amount);
    return amount;
}

/**
 * Apply skill effect
 */
export function applySkill(caster, target, skillKey, skillDatabase) {
    const skill = skillDatabase[skillKey];
    if (!skill) {
        console.warn(`Missing skill data for key: ${skillKey}`);
        return `${caster.name || caster.title} fails with unknown skill ${skillKey}.`;
    }

    const actualTarget = skill.target === 'self' ? caster : target;
    const safeRange = Array.isArray(skill.range) && skill.range.length >= 2 ? skill.range : [0, 0];
    const safeHits = Array.isArray(skill.hits) && skill.hits.length >= 2 ? skill.hits : [1, 1];
    const bonusFn = typeof skill.damageBonus === 'function' ? skill.damageBonus : () => 0;

    if (skill.effect === 'heal') {
        const healAmount = Math.ceil(Math.abs(skill.damage || -0.3) * (caster.maxHp || 100));
        caster.hp = clamp((caster.hp || 0) + healAmount, 0, caster.maxHp || 100);
        return `${caster.name || caster.title} casts ${skill.name} and recovers ${healAmount} HP.`;
    }

    if (skill.effect === 'damage_multi') {
        const hits = rand(safeHits[0], safeHits[1]);
        let total = 0;
        for (let i = 0; i < hits; i++) {
            let dmg = rand(safeRange[0], safeRange[1]) + bonusFn(caster);
            dmg = Number.isFinite(dmg) ? dmg : rand(safeRange[0], safeRange[1]);
            total += applyDamage(actualTarget, dmg, skill.name);
        }
        return `${caster.name || caster.title} uses ${skill.name} (${hits} hits) for ${total} damage.`;
    }

    if (skill.effect === 'purification') {
        let dmg = rand(safeRange[0], safeRange[1]) + bonusFn(caster);
        dmg = Number.isFinite(dmg) ? dmg : rand(safeRange[0], safeRange[1]);
        const hadBarrier = actualTarget.barrier;
        const hadGuard = actualTarget.guard;
        const applied = applyDamage(actualTarget, dmg, skill.name);
        let removalText = '';
        if (hadBarrier) {
            removalText = ` ${actualTarget.name || actualTarget.title} loses their barrier.`;
        } else if (hadGuard) {
            removalText = ` ${actualTarget.name || actualTarget.title} loses their guard.`;
        }
        return `${caster.name || caster.title} uses ${skill.name} for ${applied} damage.${removalText}`;
    }

    if (skill.effect === 'corruption') {
        let dmg = rand(safeRange[0], safeRange[1]) + bonusFn(caster);
        dmg = Number.isFinite(dmg) ? dmg : rand(safeRange[0], safeRange[1]);
        const applied = applyDamage(actualTarget, dmg, skill.name);
        let corruptionText = '';
        if (Math.random() < 0.33) {
            const reduction = Math.max(1, Math.ceil((actualTarget.maxHp || 100) * 0.05));
            actualTarget.maxHp = Math.max(1, (actualTarget.maxHp || 100) - reduction);
            actualTarget.hp = Math.min(actualTarget.hp, actualTarget.maxHp);
            corruptionText = ` ${actualTarget.name || actualTarget.title} loses ${reduction} max HP.`;
        }
        return `${caster.name || caster.title} uses ${skill.name} for ${applied} damage.${corruptionText}`;
    }

    if (skill.effect === 'poison') {
        let dmg = rand(safeRange[0], safeRange[1]) + bonusFn(caster);
        dmg = Number.isFinite(dmg) ? dmg : rand(safeRange[0], safeRange[1]);
        const applied = applyDamage(actualTarget, dmg, skill.name);
        actualTarget.poisoned = (actualTarget.poisoned || 0) + 1;
        return `${caster.name || caster.title} uses ${skill.name} for ${applied} damage. ${actualTarget.name || actualTarget.title} is poisoned!`;
    }

    if (skill.effect === 'bleed') {
        let dmg = rand(safeRange[0], safeRange[1]) + bonusFn(caster);
        dmg = Number.isFinite(dmg) ? dmg : rand(safeRange[0], safeRange[1]);
        const applied = applyDamage(actualTarget, dmg, skill.name);
        actualTarget.bleedStacks = (actualTarget.bleedStacks || 0) + 1;
        return `${caster.name || caster.title} uses ${skill.name} for ${applied} damage. ${actualTarget.name || actualTarget.title} is bleeding! (${actualTarget.bleedStacks}/3)`;
    }

    if (skill.effect === 'bleed_multi') {
        const hits = rand(safeHits[0], safeHits[1]);
        let total = 0;
        let bleedHits = 0;
        for (let i = 0; i < hits; i++) {
            let dmg = rand(safeRange[0], safeRange[1]) + bonusFn(caster);
            dmg = Number.isFinite(dmg) ? dmg : rand(safeRange[0], safeRange[1]);
            total += applyDamage(actualTarget, dmg, skill.name);
            if (Math.random() < 0.6) bleedHits++;
        }
        actualTarget.bleedStacks = (actualTarget.bleedStacks || 0) + bleedHits;
        return `${caster.name || caster.title} uses ${skill.name} (${hits} hits) for ${total} damage and causes bleeding! (${actualTarget.bleedStacks}/3)`;
    }

    if (skill.effect === 'paralyze') {
        let dmg = rand(safeRange[0], safeRange[1]) + bonusFn(caster);
        dmg = Number.isFinite(dmg) ? dmg : rand(safeRange[0], safeRange[1]);
        const applied = applyDamage(actualTarget, dmg, skill.name);
        actualTarget.paralyzed = true;
        return `${caster.name || caster.title} uses ${skill.name} for ${applied} damage. ${actualTarget.name || actualTarget.title} is paralyzed!`;
    }

    if (skill.effect === 'frozen') {
        let dmg = rand(safeRange[0], safeRange[1]) + bonusFn(caster);
        dmg = Number.isFinite(dmg) ? dmg : rand(safeRange[0], safeRange[1]);
        const applied = applyDamage(actualTarget, dmg, skill.name);
        actualTarget.frozen = true;
        return `${caster.name || caster.title} uses ${skill.name} for ${applied} damage. ${actualTarget.name || actualTarget.title} is frozen and will skip their next turn!`;
    }

    if (skill.effect === 'damage' || skill.type === 'atk') {
        let dmg = rand(safeRange[0], safeRange[1]) + bonusFn(caster);
        dmg = Number.isFinite(dmg) ? dmg : rand(safeRange[0], safeRange[1]);
        const applied = applyDamage(actualTarget, dmg, skill.name);
        if (applied > 0) {
            return `${caster.name || caster.title} uses ${skill.name} for ${applied} damage.`;
        }
        return `${caster.name || caster.title} uses ${skill.name} but it was blocked.`;
    }

    if (skill.effect === 'damage_lifesteal') {
        let dmg = rand(safeRange[0], safeRange[1]) + bonusFn(caster);
        dmg = Number.isFinite(dmg) ? dmg : rand(safeRange[0], safeRange[1]);
        const applied = applyDamage(actualTarget, dmg, skill.name);
        const heal = Math.ceil(applied * 0.5);
        caster.hp = clamp(caster.hp + heal, 0, caster.maxHp);
        return `${caster.name || caster.title} uses ${skill.name} for ${applied} damage and drains ${heal} HP.`;
    }

    if (skill.effect === 'damage_over_time') {
        let dmg = rand(safeRange[0], safeRange[1]) + bonusFn(caster);
        dmg = Number.isFinite(dmg) ? dmg : rand(safeRange[0], safeRange[1]);
        const applied = applyDamage(actualTarget, dmg, skill.name);
        return `${caster.name || caster.title} applies ${skill.name} for ${applied} damage.`;
    }

    if (skill.effect === 'reduceDmg') {
        caster.guard = true;
        return `${caster.title || caster.name} uses ${skill.name} and defends.`;
    }

    if (skill.effect === 'damage_boost') {
        caster.damageBoost = (caster.damageBoost || 0) + 1.3;
        return `${caster.name || caster.title} uses ${skill.name} and enters a rage!`;
    }

    return `${caster.name || caster.title} attempts ${skill.name}, but nothing happens.`;
}
