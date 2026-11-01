import { z } from 'zod';

export const createCaseSchema = z.object({ scenario: z.string().trim().min(30).max(1000), difficulty: z.enum(['easy','medium','hard']), category: z.enum(['murder','theft','missing_person','corporate_espionage','blackmail','general']) });
export const accusationSchema = z.object({ selectedSuspectId: z.string().min(1).max(30), reasoning: z.string().max(1000).optional().default('') });
export const blueprintSchema = z.object({
  title: z.string().min(3), description: z.string().min(20), location: z.string().min(1), incidentDate: z.string(),
  victim: z.object({ name: z.string(), age: z.number().optional(), occupation: z.string().optional() }).nullable().optional(),
  suspects: z.array(z.object({ suspectId: z.string(), name: z.string(), age: z.number(), occupation: z.string(), relationship: z.string(), background: z.string(), motive: z.string(), alibi: z.string(), isCulprit: z.boolean() })).min(3).max(5),
  culpritSuspectId: z.string(), motive: z.string(), method: z.string(), explanation: z.string(), redHerrings: z.string(),
  timeline: z.array(z.object({ time: z.string(), title: z.string(), description: z.string() })).min(3)
});
export const evidenceSchema = z.object({ evidence: z.array(z.object({
  evidenceId: z.string(), type: z.enum(['whatsapp','image','cctv','document','witness_statement','report']), title: z.string(), description: z.string(),
  content: z.record(z.string(), z.unknown()).default({}), timestamp: z.string().optional(), relatedSuspectIds: z.array(z.string()).default([]), isCritical: z.boolean(), clueExplanation: z.string()
})).min(5).max(14) });
