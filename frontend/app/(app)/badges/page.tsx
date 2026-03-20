import { BadgesPage } from "@/components/badges-page"
import { BADGE_DEFINITIONS, getBadgeStatuses } from "@/lib/badges"
import { getSession } from "@/lib/session"

export default async function BadgesRoutePage() {
  const user = await getSession()
  const badgeStatuses = user
    ? await getBadgeStatuses(user.id)
    : BADGE_DEFINITIONS.map((badge) => ({
        ...badge,
        earned: false,
        earnedDate: null,
      }))

  return (
    <BadgesPage
      totalXp={user?.xp ?? 0}
      earnedBadges={badgeStatuses.filter((badge) => badge.earned)}
      lockedBadges={badgeStatuses.filter((badge) => !badge.earned)}
    />
  )
}

