export const hasActiveSubscription = (
  user: { subscribedUntil: Date | null } | null | undefined
) => {
  return !!user?.subscribedUntil && user.subscribedUntil>=new Date()
}