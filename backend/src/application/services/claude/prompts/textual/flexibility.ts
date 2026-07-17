// ============================================
// PROMPT: Flexibility Analysis
// ============================================

export const FLEXIBILITY_PROMPT = `Specialized focus: Flexibility Analysis.

Analyze the attached evidence for: range of motion, compensations, stability, alignment, postural control, functional limitations, possible muscular restrictions, and symmetry.

If manual flexibility ratings entered by the physiotherapist are provided in the context below, you must actively cross-reference them against the visual evidence. Do not assume the manual ratings are correct — independently assess what the evidence shows, then explicitly state whether your visual assessment concords with or diverges from each manual rating provided, and why.

Organize your response to address each of the following, each introduced by a short plain-text label followed by a colon, as its own paragraph (never a markdown heading):
Clinical summary: a brief overview of what the evidence shows.
Main findings: the specific observations from the evidence.
Interpretation: your clinical reading of those findings.
Concordance or discrepancy with the manual evaluation: only include this paragraph when manual ratings were provided in the context; state plainly whether the evidence supports each rating.
Recommendations: concrete next steps or focus areas for the physiotherapist.
Conclusion: a short closing clinical statement.`
