import type { SpotlightDefinition, SpotlightFormValues } from '../data/aiInsights'

const buildSpotlightsUrl = (siteId: string, spotlightId?: string) => {
  const searchParams = new URLSearchParams({ siteId })
  const path = spotlightId
    ? `/api/aiinsights/spotlights/${encodeURIComponent(spotlightId)}`
    : '/api/aiinsights/spotlights'

  return `${path}?${searchParams.toString()}`
}

const getErrorMessage = async (response: Response, fallbackMessage: string) => {
  try {
    const body = (await response.json()) as { message?: string }
    if (body.message) {
      return body.message
    }
  } catch {
    // Ignore invalid JSON responses and use the fallback below.
  }

  return fallbackMessage
}

export async function getSpotlights(siteId: string) {
  const response = await fetch(buildSpotlightsUrl(siteId))

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to load spotlights.'))
  }

  return (await response.json()) as SpotlightDefinition[]
}

export async function getSpotlight(siteId: string, spotlightId: string) {
  const response = await fetch(buildSpotlightsUrl(siteId, spotlightId))

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to load spotlight.'))
  }

  return (await response.json()) as SpotlightDefinition
}

export async function createSpotlight(siteId: string, values: SpotlightFormValues) {
  const response = await fetch(buildSpotlightsUrl(siteId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to create spotlight.'))
  }

  return (await response.json()) as SpotlightDefinition
}

export async function updateSpotlight(
  siteId: string,
  spotlightId: string,
  values: SpotlightFormValues,
) {
  const response = await fetch(buildSpotlightsUrl(siteId, spotlightId), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to update spotlight.'))
  }

  return (await response.json()) as SpotlightDefinition
}

export async function deleteSpotlight(siteId: string, spotlightId: string) {
  const response = await fetch(buildSpotlightsUrl(siteId, spotlightId), {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to delete spotlight.'))
  }
}
