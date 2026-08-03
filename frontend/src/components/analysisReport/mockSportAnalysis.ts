// ============================================
// MOCK DATA: Sport Report Section
// ============================================
// Centralized per-sport maps (images, titles, placeholders) plus UI-only
// placeholder data for the inertial-force chart, interpretation and
// metrics. Adding a new sport later means adding one entry to each map
// below -- SportReportSection.tsx itself never needs to change.
// ============================================

import GolfImage from '@/assets/Result_Assessment/Golf.png'
import TennisImage from '@/assets/Result_Assessment/Tennis.png'
import PingPongImage from '@/assets/Result_Assessment/PingPong.png'
import PoloImage from '@/assets/Result_Assessment/Polo.png'
import AmericanFootballImage from '@/assets/Result_Assessment/AmericanFootball.png'
import BaseballBatterImage from '@/assets/Result_Assessment/BaseballBatter.png'
import BaseballPitcherImage from '@/assets/Result_Assessment/BaseballPitcher.png'
import SoccerGoalkeeperImage from '@/assets/Result_Assessment/SoccerGoalkeeper.png'
import SoccerPlayerImage from '@/assets/Result_Assessment/SoccerPlayer.png'

/** Sport name (as stored on Athlete.sport) -> illustrative image. Add one entry here per new sport. */
export const SPORT_IMAGES: Record<string, string> = {
    Golf: GolfImage,
    Tennis: TennisImage,
    'Ping Pong': PingPongImage,
    'Table Tennis': PingPongImage,
    Polo: PoloImage,
    'American Football': AmericanFootballImage,
    'Baseball Batter': BaseballBatterImage,
    'Baseball Pitcher': BaseballPitcherImage,
    'Soccer Goalkeeper': SoccerGoalkeeperImage,
    'Soccer Player': SoccerPlayerImage
}

/** Sentinel value AddAthlete/EditAthlete store on Athlete.sport for patients who aren't athletes. */
const NON_ATHLETE_SPORT = 'None'

/**
 * True when the patient has an actual sport recorded — false for patients
 * with no sport or the "not an athlete" sentinel. Callers use this to decide
 * whether to render the Sport Report section at all (as opposed to an
 * unsupported-but-present sport, which still renders with a placeholder).
 */
export function hasSportReport(sport?: string | null): boolean {
    return Boolean(sport && sport !== NON_ATHLETE_SPORT)
}

/**
 * Sport name -> section title override. Any sport without an explicit
 * entry here falls back to a generated `INERTIAL FORCE IN {SPORT}` title
 * (see SportReportSection.tsx), so this map only needs entries when a
 * sport requires different wording than that default.
 */
export const SPORT_TITLES: Record<string, string> = {
    Golf: 'INERTIAL FORCE IN GOLF'
}

/** Sport name -> short placeholder copy shown when no illustrative image exists yet. */
export const SPORT_PLACEHOLDERS: Record<string, string> = {}

export const DEFAULT_SPORT_PLACEHOLDER = 'No sport-specific illustration available yet.'

// --- Inertial Force line chart ---
export interface InertialForcePhase {
    phase: string
    value: number
}

export const inertialForcePhasesMock: InertialForcePhase[] = [
    { phase: 'Backswing', value: 38 },
    { phase: 'Transition', value: 62 },
    { phase: 'Impact', value: 82 },
    { phase: 'Follow Through', value: 48 }
]

// --- Interpretation card ---
export const sportInterpretationMock: string[] = [
    'Peak force generation occurs at impact, consistent with an efficient kinetic chain sequence.',
    'Transition phase shows a healthy build-up of force, suggesting good lower-body engagement.',
    'Follow-through deceleration is slightly below the expected range, which may indicate reduced eccentric control.',
    'Overall sequencing pattern is within the expected range for the patient\'s sport and experience level.'
]

// --- Metrics card ---
export interface SportMetric {
    label: string
    value: string
}

export const sportMetricsMock: SportMetric[] = [
    { label: 'Peak Force', value: '82%' },
    { label: 'Average Force', value: '57%' },
    { label: 'Control Index', value: '0.78' },
    { label: 'Variability', value: '±6%' }
]
