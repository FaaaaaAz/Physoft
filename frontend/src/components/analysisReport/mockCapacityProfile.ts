// ============================================
// MOCK DATA: Capacity Profile
// ============================================
// UI-only placeholder data for the 8 capacity cards. Also the single
// source of truth for the 7-axis radar chart (Card 1 in Main Charts), so
// the radar and the capacity cards never show inconsistent numbers.
// ============================================

import { IconType } from 'react-icons'
import {
    IoBarbellOutline,
    IoFlashOutline,
    IoSpeedometerOutline,
    IoHeartOutline,
    IoBodyOutline,
    IoWalkOutline,
    IoAccessibilityOutline,
    IoScaleOutline
} from 'react-icons/io5'
import type { CapacityStatus } from './mockExecutiveSummary'

export type CapacityKey =
    | 'strength'
    | 'power'
    | 'speed'
    | 'endurance'
    | 'flexibility'
    | 'mobility'
    | 'posturalControl'
    | 'freeComposition'

export interface CapacityItem {
    key: CapacityKey
    label: string
    icon: IconType
    value: number
    maxValue: number
    status: CapacityStatus
}

export const capacityProfileMock: CapacityItem[] = [
    { key: 'strength', label: 'Strength', icon: IoBarbellOutline, value: 68, maxValue: 100, status: 'Medium' },
    { key: 'power', label: 'Power', icon: IoFlashOutline, value: 72, maxValue: 100, status: 'High' },
    { key: 'speed', label: 'Speed', icon: IoSpeedometerOutline, value: 69, maxValue: 100, status: 'Medium' },
    { key: 'endurance', label: 'Endurance', icon: IoHeartOutline, value: 64, maxValue: 100, status: 'Medium' },
    { key: 'flexibility', label: 'Flexibility', icon: IoBodyOutline, value: 48, maxValue: 100, status: 'Low' },
    { key: 'mobility', label: 'Mobility', icon: IoWalkOutline, value: 52, maxValue: 100, status: 'Low' },
    { key: 'posturalControl', label: 'Postural Control', icon: IoAccessibilityOutline, value: 55, maxValue: 100, status: 'Medium' },
    { key: 'freeComposition', label: 'FREE (Composition)', icon: IoScaleOutline, value: 61, maxValue: 100, status: 'Medium' }
]

/** The 7 axes used by the Capacity Radar chart (excludes FREE Composition). */
export const radarAxesMock = capacityProfileMock
    .filter((item) => item.key !== 'freeComposition')
    .map((item) => ({ label: item.label, value: item.value }))
