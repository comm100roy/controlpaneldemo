import { http, HttpResponse } from 'msw'
import {
  spotlightDefinitions,
  type SpotlightCampaign,
  type SpotlightDefinition,
  type SpotlightFormValues,
} from '../../data/aiInsights'

const cloneCampaign = (campaign: SpotlightCampaign): SpotlightCampaign => ({ ...campaign })

const cloneSpotlight = (spotlight: SpotlightDefinition): SpotlightDefinition => ({
  ...spotlight,
  campaigns: spotlight.campaigns.map(cloneCampaign),
})

const createSeedSpotlights = () => spotlightDefinitions.map(cloneSpotlight)

const spotlightsBySite = new Map<string, SpotlightDefinition[]>()

const getRequiredSiteId = (request: Request) => {
  const siteId = new URL(request.url).searchParams.get('siteId')

  if (!siteId) {
    return {
      error: HttpResponse.json(
        { message: 'Missing required "siteId" query parameter.' },
        { status: 400 },
      ),
    }
  }

  return { siteId }
}

const getSiteSpotlights = (siteId: string) => {
  const existingSpotlights = spotlightsBySite.get(siteId)

  if (existingSpotlights) {
    return existingSpotlights
  }

  const seededSpotlights = createSeedSpotlights()
  spotlightsBySite.set(siteId, seededSpotlights)
  return seededSpotlights
}

const createGuid = () => crypto.randomUUID()

export const spotlightHandlers = [
  http.get('/api/aiinsights/spotlights', ({ request }) => {
    const requiredSiteId = getRequiredSiteId(request)
    if ('error' in requiredSiteId) {
      return requiredSiteId.error
    }

    return HttpResponse.json(getSiteSpotlights(requiredSiteId.siteId))
  }),

  http.get('/api/aiinsights/spotlights/:spotlightId', ({ params, request }) => {
    const requiredSiteId = getRequiredSiteId(request)
    if ('error' in requiredSiteId) {
      return requiredSiteId.error
    }

    const spotlightId = String(params.spotlightId ?? '')
    const spotlight = getSiteSpotlights(requiredSiteId.siteId).find(
      (item) => item.id === spotlightId,
    )

    if (!spotlight) {
      return HttpResponse.json(
        { message: `Spotlight "${spotlightId}" was not found.` },
        { status: 404 },
      )
    }

    return HttpResponse.json(spotlight)
  }),

  http.post('/api/aiinsights/spotlights', async ({ request }) => {
    const requiredSiteId = getRequiredSiteId(request)
    if ('error' in requiredSiteId) {
      return requiredSiteId.error
    }

    const values = (await request.json()) as SpotlightFormValues
    const createdSpotlight: SpotlightDefinition = {
      id: createGuid(),
      name: values.name,
      description: values.description,
      channels: 0,
      updatedBy: 'Agent Terry',
      campaigns: [],
    }

    const siteSpotlights = getSiteSpotlights(requiredSiteId.siteId)
    siteSpotlights.unshift(createdSpotlight)

    return HttpResponse.json(createdSpotlight, { status: 201 })
  }),

  http.put('/api/aiinsights/spotlights/:spotlightId', async ({ params, request }) => {
    const requiredSiteId = getRequiredSiteId(request)
    if ('error' in requiredSiteId) {
      return requiredSiteId.error
    }

    const spotlightId = String(params.spotlightId ?? '')
    const siteSpotlights = getSiteSpotlights(requiredSiteId.siteId)
    const spotlightIndex = siteSpotlights.findIndex((item) => item.id === spotlightId)

    if (spotlightIndex === -1) {
      return HttpResponse.json(
        { message: `Spotlight "${spotlightId}" was not found.` },
        { status: 404 },
      )
    }

    const values = (await request.json()) as SpotlightFormValues
    const updatedSpotlight: SpotlightDefinition = {
      ...siteSpotlights[spotlightIndex],
      name: values.name,
      description: values.description,
    }

    siteSpotlights[spotlightIndex] = updatedSpotlight
    return HttpResponse.json(updatedSpotlight)
  }),

  http.delete('/api/aiinsights/spotlights/:spotlightId', ({ params, request }) => {
    const requiredSiteId = getRequiredSiteId(request)
    if ('error' in requiredSiteId) {
      return requiredSiteId.error
    }

    const spotlightId = String(params.spotlightId ?? '')
    const siteSpotlights = getSiteSpotlights(requiredSiteId.siteId)
    const spotlightIndex = siteSpotlights.findIndex((item) => item.id === spotlightId)

    if (spotlightIndex === -1) {
      return HttpResponse.json(
        { message: `Spotlight "${spotlightId}" was not found.` },
        { status: 404 },
      )
    }

    siteSpotlights.splice(spotlightIndex, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
