/**
 * @file        mockNotificationData.ts
 * @feature     Profile
 * @description Static in-app notification feed for dev/offline use with deep-link targets.
 * @data        MOCK_NOTIFICATIONS
 * @author      MiStarStudio
 */

import { subHours, subDays } from 'date-fns';

import type { AppNotification } from '../types/profile.types';

const now = new Date();

// TODO(api): replace with GET /users/me/notifications — remove static seed data
export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-001',
    type: 'BOOKING',
    title: 'Booking confirmed',
    body: 'Your booking for Massey Ferguson 375 has been confirmed by the owner.',
    read: false,
    createdAt: subHours(now, 2).toISOString(),
    link: { tab: 'Bookings', screen: 'Detail', params: { bookingId: 'bk-002' } },
  },
  {
    id: 'notif-002',
    type: 'BOOKING',
    title: 'New booking request',
    body: 'A farmer requested your John Deere 5075E for 3 days.',
    read: false,
    createdAt: subHours(now, 5).toISOString(),
    link: { tab: 'Bookings', screen: 'Detail', params: { bookingId: 'bk-001' } },
  },
  {
    id: 'notif-003',
    type: 'JOB',
    title: 'Hire request received',
    body: 'Demo User sent you a land clearing job request for Ejisu.',
    read: false,
    createdAt: subHours(now, 8).toISOString(),
    link: { tab: 'Jobs', screen: 'JobDetail', params: { jobId: 'job-001', viewerRole: 'worker' } },
  },
  {
    id: 'notif-004',
    type: 'PAYMENT',
    title: 'Payment successful',
    body: 'GHS 720 paid via MTN MoMo for your equipment rental.',
    read: true,
    createdAt: subDays(now, 1).toISOString(),
    link: { tab: 'Bookings', screen: 'History' },
  },
  {
    id: 'notif-005',
    type: 'REVIEW',
    title: 'New review received',
    body: 'Kwame Asante left a 5-star review on your tractor listing.',
    read: true,
    createdAt: subDays(now, 2).toISOString(),
    link: { tab: 'Listings', screen: 'MyListings' },
  },
  {
    id: 'notif-006',
    type: 'JOB',
    title: 'Job accepted',
    body: 'Yaw Ofori accepted your spraying job request in Tema.',
    read: true,
    createdAt: subDays(now, 3).toISOString(),
    link: { tab: 'LaborHub', screen: 'JobDetail', params: { jobId: 'job-002', viewerRole: 'farmer' } },
  },
  {
    id: 'notif-007',
    type: 'SYSTEM',
    title: 'Welcome to AgroRent Ghana',
    body: 'Complete your profile to get better matches for equipment and labor.',
    read: true,
    createdAt: subDays(now, 7).toISOString(),
  },
  {
    id: 'notif-008',
    type: 'PAYMENT',
    title: 'Payout processed',
    body: 'GHS 1,350 from completed bookings has been sent to your MoMo wallet.',
    read: false,
    createdAt: subDays(now, 10).toISOString(),
    link: { tab: 'Bookings', screen: 'Management' },
  },
];
