import type { FunctionFormValues } from '../data/dashboard'

const buildFunctionsUrl = (siteId: string, aiAgentId: string, functionId?: string) => {
  const searchParams = new URLSearchParams({ siteId, aiAgentId })
  const path = functionId
    ? `/api/aiagent/functions/${encodeURIComponent(functionId)}`
    : '/api/aiagent/functions'

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

export async function getFunctions(
  siteId: string,
  aiAgentId: string,
): Promise<FunctionFormValues[]> {
  const response = await fetch(buildFunctionsUrl(siteId, aiAgentId))

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Failed to load functions (${response.status})`))
  }

  return response.json() as Promise<FunctionFormValues[]>
}

export async function getFunction(
  siteId: string,
  aiAgentId: string,
  functionId: string,
): Promise<FunctionFormValues> {
  const response = await fetch(buildFunctionsUrl(siteId, aiAgentId, functionId))

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Failed to load function (${response.status})`))
  }

  return response.json() as Promise<FunctionFormValues>
}

export async function createFunction(
  siteId: string,
  aiAgentId: string,
  functionDefinition: FunctionFormValues,
): Promise<FunctionFormValues> {
  const response = await fetch(buildFunctionsUrl(siteId, aiAgentId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(functionDefinition),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Failed to create function (${response.status})`),
    )
  }

  return response.json() as Promise<FunctionFormValues>
}

export async function updateFunction(
  siteId: string,
  aiAgentId: string,
  functionDefinition: FunctionFormValues,
): Promise<FunctionFormValues> {
  const response = await fetch(buildFunctionsUrl(siteId, aiAgentId, functionDefinition.id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(functionDefinition),
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Failed to update function (${response.status})`),
    )
  }

  return response.json() as Promise<FunctionFormValues>
}

export async function deleteFunction(
  siteId: string,
  aiAgentId: string,
  functionId: string,
): Promise<void> {
  const response = await fetch(buildFunctionsUrl(siteId, aiAgentId, functionId), {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Failed to delete function (${response.status})`),
    )
  }
}
