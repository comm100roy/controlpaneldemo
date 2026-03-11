import type { InstructionRecord } from '../mocks/handlers/instructions'

export type { InstructionRecord }

const buildInstructionsUrl = (siteId: string, aiAgentId: string, instructionId?: string) => {
  const searchParams = new URLSearchParams({ siteId, aiAgentId })
  const path = instructionId
    ? `/api/aiagent/instructions/${encodeURIComponent(instructionId)}`
    : '/api/aiagent/instructions'

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

export async function getInstructions(
  siteId: string,
  aiAgentId: string,
): Promise<InstructionRecord[]> {
  const response = await fetch(buildInstructionsUrl(siteId, aiAgentId))

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Failed to load instructions (${response.status})`),
    )
  }

  return response.json() as Promise<InstructionRecord[]>
}

export async function createInstruction(
  siteId: string,
  aiAgentId: string,
  content: string,
): Promise<InstructionRecord> {
  const response = await fetch(buildInstructionsUrl(siteId, aiAgentId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Failed to create instruction (${response.status})`),
    )
  }

  return response.json() as Promise<InstructionRecord>
}

export async function updateInstruction(
  siteId: string,
  aiAgentId: string,
  instructionId: string,
  content: string,
): Promise<InstructionRecord> {
  const response = await fetch(buildInstructionsUrl(siteId, aiAgentId, instructionId), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Failed to update instruction (${response.status})`),
    )
  }

  return response.json() as Promise<InstructionRecord>
}

export async function deleteInstruction(
  siteId: string,
  aiAgentId: string,
  instructionId: string,
): Promise<void> {
  const response = await fetch(buildInstructionsUrl(siteId, aiAgentId, instructionId), {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Failed to delete instruction (${response.status})`),
    )
  }
}
