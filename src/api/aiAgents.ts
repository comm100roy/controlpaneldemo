import type { AiAgentRecord } from '../data/aiAgents'

export async function getAiAgents(siteId: string): Promise<AiAgentRecord[]> {
  const searchParams = new URLSearchParams({ siteId })
  const response = await fetch(`/api/aiagent/aiagents?${searchParams.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to load AI agents (${response.status})`)
  }

  return response.json() as Promise<AiAgentRecord[]>
}
