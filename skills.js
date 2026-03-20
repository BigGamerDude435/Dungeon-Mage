const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export const skillDatabase = {
    heal: { name: 'Heal', type: 'heal', target: 'self', effect: 'heal', damage: -0.3, damageType: 'maxHp' },
    missile: { name: 'Magic Missile', type: 'atk', target: 'enemy', effect: 'damage_multi', range: [3, 6], hits: [1, 3], damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 6) },
    fireball: { name: 'Fireball', type: 'atk', target: 'enemy', effect: 'damage', range: [12, 18], damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 2) },
    barrier: { name: 'Barrier', type: 'buff', target: 'self', effect: 'reduceDmg' },
    icebolt: { name: 'Ice Bolt', type: 'atk', target: 'enemy', effect: 'damage', range: [10, 15], damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 4) },
    poison: { name: 'Poison', type: 'atk', target: 'enemy', effect: 'damage_over_time', range: [2, 5], damageBonus: caster => Math.floor((caster.baseDmg + caster.weapon) / 4) },

    slash: { name: 'Slash', type: 'atk', target: 'enemy', effect: 'damage', range: [4, 8], damageBonus: caster => Math.floor(caster.baseDmg / 3) },
    guard: { name: 'Guard', type: 'buff', target: 'self', effect: 'reduceDmg' },
    bite: { name: 'Bite', type: 'atk', target: 'enemy', effect: 'damage', range: [3, 6], damageBonus: caster => Math.floor(caster.baseDmg / 3) },
    strongSlash: { name: 'Strong Slash', type: 'atk', target: 'enemy', effect: 'damage', range: [7, 12], damageBonus: caster => Math.floor(caster.baseDmg / 3) },
    dissolve: { name: 'Dissolve', type: 'atk', target: 'enemy', effect: 'damage', range: [3, 7], damageBonus: caster => Math.floor(caster.baseDmg / 3) },
    whip: { name: 'Whip', type: 'atk', target: 'enemy', effect: 'damage', range: [2, 5], damageBonus: caster => Math.floor(caster.baseDmg / 3) },
    defend: { name: 'Defend', type: 'buff', target: 'self', effect: 'reduceDmg' },
    slimeShot: { name: 'Slime Shot', type: 'atk', target: 'enemy', effect: 'damage', range: [4, 9], damageBonus: caster => Math.floor(caster.baseDmg / 3) }
};

export const playerSkillKeys = ['heal', 'missile', 'fireball', 'barrier', 'icebolt'];

export const enemies = {
    Skeleton: { avatar: 'url("skeleton_enemy.png")', skills: ['slash', 'guard', 'bite', 'strongSlash'], baseHp: 40, hpPerLevel: 12, baseDmg: 4, dmgPerLevel: 2 },
    Slime: { avatar: 'url("slime_enemy.png")', skills: ['dissolve', 'whip', 'defend', 'slimeShot'], baseHp: 40, hpPerLevel: 12, baseDmg: 4, dmgPerLevel: 2 }
};

export const enemyTypes = Object.keys(enemies);

export function getEnemyStats(type, level) {
    const template = enemies[type];
    if (!template) return null;
    const hp = template.baseHp + (level - 1) * template.hpPerLevel;
    const dmg = template.baseDmg + (level - 1) * template.dmgPerLevel;
    return { hp, dmg };
}

export function getRandomEnemyType() {
    const choices = Object.keys(enemies);
    return choices[Math.floor(Math.random() * choices.length)];
}

export function getPlayerInitialSkills() {
    return playerSkillKeys.reduce((acc, key) => {
        acc[key] = skillDatabase[key].uses || 0;
        return acc;
    }, {});
}

export function getPlayerSkillsMax() {
    return playerSkillKeys.reduce((acc, key) => {
        acc[key] = skillDatabase[key].uses || 0;
        return acc;
    }, {});
}

export function getEnemySkillSet(type) {
    const template = enemies[type];
    return template ? [...template.skills] : [];
}

export function getEnemyAvatar(type) {
    const template = enemies[type];
    return template ? template.avatar : 'url("?")';
}

export function applyDamage(target, amount, sourceName = 'attack') {
    if (!target) return 0;
    if (target.barrier) {
        target.barrier = false;
        return 0;
    }
    if (target.guard) {
        amount = Math.ceil(amount / 2);
        target.guard = false;
    }
    target.hp = Math.max(0, target.hp - amount);
    return amount;
}

export function applySkill(caster, target, skillKey) {
    const skill = skillDatabase[skillKey];
    if (!skill) {
        console.warn(`Missing skill data for key: ${skillKey}`);
        return `${caster.name || caster.title} fails with unknown skill ${skillKey}.`;
    }

    const actualTarget = (skill.target === 'self' ? caster : target);
    const safeRange = Array.isArray(skill.range) && skill.range.length >= 2 ? skill.range : [0, 0];
    const safeHits = Array.isArray(skill.hits) && skill.hits.length >= 2 ? skill.hits : [1, 1];
    const bonusFn = typeof skill.damageBonus === 'function' ? skill.damageBonus : () => 0;

    if (!actualTarget && skill.effect !== 'heal' && skill.effect !== 'reduceDmg') {
        console.warn(`No valid target for skill ${skillKey}`);
        return `${caster.name || caster.title} tries ${skill.name}, but there is no target.`;
    }

    if (skill.effect === 'heal') {
        const healAmount = Math.ceil((skill.damage || -0.3) * (skill.damageType === 'maxHp' ? (caster.maxHp || 100) : 1));
        caster.hp = clamp((caster.hp || 0) + healAmount, 0, caster.maxHp || 0);
        return `${caster.name || caster.title} casts ${skill.name} and recovers ${healAmount} HP.`;
    }

    if (skill.effect === 'damage_multi') {
        const hits = rand(safeHits[0], safeHits[1]);
        let total = 0;
        for (let i = 0; i < hits; i++) {
            const dmg = rand(safeRange[0], safeRange[1]) + bonusFn(caster);
            total += applyDamage(actualTarget, dmg, skill.name);
        }
        return `${caster.name || caster.title} uses ${skill.name} (${hits} hits) for ${total} damage.`;
    }

    if (skill.effect === 'damage' || skill.type === 'atk') {
        const dmg = rand(safeRange[0], safeRange[1]) + bonusFn(caster);
        const applied = applyDamage(actualTarget, dmg, skill.name);
        if (applied > 0) {
            return `${caster.name || caster.title} uses ${skill.name} for ${applied} damage.`;
        }
        return `${caster.name || caster.title} uses ${skill.name} but it was blocked.`;
    }

    if (skill.effect === 'reduceDmg') {
        caster.guard = true;
        return `${caster.title || caster.name} uses ${skill.name} and braces (reduces next damage).`;
    }

    if (skill.effect === 'damage_over_time') {
        const dmg = rand(safeRange[0], safeRange[1]) + bonusFn(caster);
        const applied = applyDamage(actualTarget, dmg, skill.name);
        return `${caster.name || caster.title} poisons the target for ${applied} damage.`;
    }

    return `${caster.name || caster.title} attempts ${skill.name}, but nothing happens.`;
}
