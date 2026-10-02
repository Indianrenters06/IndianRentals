// Direct URLs keep their truthful Coming Soon pages; navigation offers working tools.
export const plannedAdminRoutes = new Set([
  '/dashboard/notifications/email',
  '/dashboard/notifications/offers',
  '/dashboard/notifications/renewal',
  '/dashboard/notifications/sms',
  '/dashboard/notifications/payment',
  '/dashboard/settings/delivery',
  '/dashboard/settings/gst',
  '/dashboard/settings/subscriptions',
  '/dashboard/settings/payment-gateway',
  '/dashboard/settings/cancellations',
  '/dashboard/settings/late-fees',
  '/dashboard/payments/refunds',
  '/dashboard/payments/gst',
  '/dashboard/payments/subscriptions',
  '/dashboard/payments/late-fees',
]);

export function availableAdminNavigation(items, canPermission) {
  return items
    .filter(item => !plannedAdminRoutes.has(item.path) && (!item.permission || canPermission(item.permission)))
    .map(item => item.submenu ? {
      ...item,
      submenu: item.submenu.filter(child => !plannedAdminRoutes.has(child.path)),
    } : item);
}
