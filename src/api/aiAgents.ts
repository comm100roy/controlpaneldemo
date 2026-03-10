import type { AiAgentRecord } from '../data/aiAgents'

const buildAiAgentsUrl = (siteId: string, aiAgentId?: string) => {
  const searchParams = new URLSearchParams({ siteId })
  const path = aiAgentId
    ? `/api/aiagent/aiagents/${encodeURIComponent(aiAgentId)}`
    : '/api/aiagent/aiagents'

  return `${path}?${searchParams.toString()}`
}

const getErrorMessage = async (response: Response, fallbackMessage: string) => {
  try {
    const data = (await response.json()) as { message?: string }
    return data.message ?? fallbackMessage
  } catch {
    return fallbackMessage
  }
}

export async function getAiAgents(siteId: string): Promise<AiAgentRecord[]> {
  const response = await fetch(buildAiAgentsUrl(siteId))

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Failed to load AI agents (${response.status})`))
  }

  return response.json() as Promise<AiAgentRecord[]>
}

export async function createAiAgent(siteId: string, agent: AiAgentRecord): Promise<AiAgentRecord> {
  const response = await fetch(buildAiAgentsUrl(siteId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agent),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Failed to create AI agent (${response.status})`),
    )
  }

  return response.json() as Promise<AiAgentRecord>
}

export async function updateAiAgent(siteId: string, agent: AiAgentRecord): Promise<AiAgentRecord> {
  const response = await fetch(buildAiAgentsUrl(siteId, agent.id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agent),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Failed to update AI agent (${response.status})`),
    )
  }

  return response.json() as Promise<AiAgentRecord>
}

export async function deleteAiAgent(siteId: string, aiAgentId: string): Promise<void> {
  const response = await fetch(buildAiAgentsUrl(siteId, aiAgentId), {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Failed to delete AI agent (${response.status})`),
    )
  }
}
