import { http, HttpResponse } from 'msw'
import { aiAgentRecords, type AiAgentRecord } from '../../data/aiAgents'

const createSeedAiAgents = () =>
  aiAgentRecords.map((agent) => ({
    ...agent,
    channelKinds: [...agent.channelKinds],
  }))

const aiAgentsBySite = new Map<string, AiAgentRecord[]>()

const getRequiredSiteId = (request: Request) => {
  const siteId = new URL(request.url).searchParams.get('siteId')

  if (!siteId) {
    return {
      error: HttpResponse.json(
        {
          message: 'Missing required "siteId" query parameter.',
        },
        { status: 400 },
      ),
    }
  }

  return { siteId }
}

const getSiteAiAgents = (siteId: string) => {
  const existingAiAgents = aiAgentsBySite.get(siteId)

  if (existingAiAgents) {
    return existingAiAgents
  }

  const seededAiAgents = createSeedAiAgents()
  aiAgentsBySite.set(siteId, seededAiAgents)
  return seededAiAgents
}

const cloneAiAgent = (agent: AiAgentRecord): AiAgentRecord => ({
  ...agent,
  channelKinds: [...agent.channelKinds],
})

export const aiAgentHandlers = [
  http.get('/api/aiagent/aiagents', ({ request }) => {
    const requiredSiteId = getRequiredSiteId(request)
    if ('error' in requiredSiteId) {
      return requiredSiteId.error
    }

    return HttpResponse.json(getSiteAiAgents(requiredSiteId.siteId))
  }),

  http.post('/api/aiagent/aiagents', async ({ request }) => {
    const requiredSiteId = getRequiredSiteId(request)
    if ('error' in requiredSiteId) {
      return requiredSiteId.error
    }

    const nextAgent = cloneAiAgent((await request.json()) as AiAgentRecord)
    const siteAiAgents = getSiteAiAgents(requiredSiteId.siteId)

    if (siteAiAgents.some((agent) => agent.id === nextAgent.id)) {
      return HttpResponse.json(
        {
          message: `AI agent "${nextAgent.id}" already exists.`,
        },
        { status: 409 },
      )
    }

    siteAiAgents.unshift(nextAgent)
    return HttpResponse.json(nextAgent, { status: 201 })
  }),

  http.put('/api/aiagent/aiagents/:aiagentid', async ({ params, request }) => {
    const requiredSiteId = getRequiredSiteId(request)
    if ('error' in requiredSiteId) {
      return requiredSiteId.error
    }

    const aiAgentId = String(params.aiagentid ?? '')
    if (!aiAgentId) {
      return HttpResponse.json(
        {
          message: 'Missing AI agent id.',
        },
        { status: 400 },
      )
    }

    const siteAiAgents = getSiteAiAgents(requiredSiteId.siteId)
    const agentIndex = siteAiAgents.findIndex((agent) => agent.id === aiAgentId)

    if (agentIndex === -1) {
      return HttpResponse.json(
        {
          message: `AI agent "${aiAgentId}" was not found.`,
        },
        { status: 404 },
      )
    }

    const updatedAgent = cloneAiAgent({
      ...((await request.json()) as AiAgentRecord),
      id: aiAgentId,
    })

    siteAiAgents[agentIndex] = updatedAgent
    return HttpResponse.json(updatedAgent)
  }),

  http.delete('/api/aiagent/aiagents/:aiagentid', ({ params, request }) => {
    const requiredSiteId = getRequiredSiteId(request)
    if ('error' in requiredSiteId) {
      return requiredSiteId.error
    }

    const aiAgentId = String(params.aiagentid ?? '')
    if (!aiAgentId) {
      return HttpResponse.json(
        {
          message: 'Missing AI agent id.',
        },
        { status: 400 },
      )
    }

    const siteAiAgents = getSiteAiAgents(requiredSiteId.siteId)
    if (siteAiAgents.length <= 1) {
      return HttpResponse.json(
        {
          message: 'At least one AI agent must remain.',
        },
        { status: 409 },
      )
    }

    const agentIndex = siteAiAgents.findIndex((agent) => agent.id === aiAgentId)
    if (agentIndex === -1) {
      return HttpResponse.json(
        {
          message: `AI agent "${aiAgentId}" was not found.`,
        },
        { status: 404 },
      )
    }

    siteAiAgents.splice(agentIndex, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
