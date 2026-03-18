import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Seuil d'XP pour passer au niveau supérieur (ex: Level * 1000)
const getLevelThreshold = (currentLevel: number) => currentLevel * 1000;

export async function addExperience(userId: string, pointsAwarded: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { badges: { include: { badge: true } } }
    });

    if (!user) throw new Error("User not found");

    const newExp = user.total_exp + pointsAwarded;
    let newLevel = user.level;
    let levelUp = false;

    // Check level up
    if (newExp >= getLevelThreshold(user.level)) {
      newLevel = user.level + 1;
      levelUp = true;
    }

    // Check new badges
    const allBadges = await prisma.badge.findMany();
    const lockedBadges = allBadges.filter(b => 
      !user.badges.some(ub => ub.badgeId === b.id) && b.condition_exp <= newExp
    );

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        total_exp: newExp,
        level: newLevel,
      }
    });

    // Award new badges
    const newBadgesAwarded = [];
    for (const badge of lockedBadges) {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id
        }
      });
      newBadgesAwarded.push(badge);
    }

    return {
      success: true,
      newExp,
      newLevel,
      levelUp,
      newBadges: newBadgesAwarded
    };
  } catch (error) {
    console.error("Gamification error:", error);
    return { success: false, error };
  }
}
