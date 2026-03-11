import { http, HttpResponse } from 'msw'
import { instructionRows } from '../../data/dashboard'

export type InstructionRecord = {
  id: string
  content: string
}

const createSeedInstructions = (): InstructionRecord[] =>
  instructionRows.map((row) => ({ id: row.id, content: row.content }))

const instructionsByScope = new Map<string, InstructionRecord[]>()

const getRequiredQueryParams = (request: Request) => {
  const url = new URL(request.url)
  const siteId = url.searchParams.get('siteId')
  const aiAgentId = url.searchParams.get('aiAgentId')

  if (!siteId) {
    return {
      error: HttpResponse.json(
        { message: 'Missing required "siteId" query parameter.' },
        { status: 400 },
      ),
    }
  }

  if (!aiAgentId) {
    return {
      error: HttpResponse.json(
        { message: 'Missing required "aiAgentId" query parameter.' },
        { status: 400 },
      ),
    }
  }

  return { siteId, aiAgentId }
}

const getScopeKey = (siteId: string, aiAgentId: string) => `${siteId}:${aiAgentId}`

const getScopedInstructions = (siteId: string, aiAgentId: string) => {
  const scopeKey = getScopeKey(siteId, aiAgentId)
  const existing = instructionsByScope.get(scopeKey)

  if (existing) {
    return existing
  }

  const seeded = createSeedInstructions()
  instructionsByScope.set(scopeKey, seeded)
  return seeded
}

const createGuid = () => crypto.randomUUID()

export const instructionHandlers = [
  http.get('/api/aiagent/instructions', ({ request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    return HttpResponse.json(
      getScopedInstructions(requiredQueryParams.siteId, requiredQueryParams.aiAgentId),
    )
  }),

  http.post('/api/aiagent/instructions', async ({ request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    const body = (await request.json()) as { content: string }
    const created: InstructionRecord = {
      id: createGuid(),
      content: body.content,
    }

    const scoped = getScopedInstructions(
      requiredQueryParams.siteId,
      requiredQueryParams.aiAgentId,
    )
    scoped.unshift(created)

    return HttpResponse.json(created, { status: 201 })
  }),

  http.put('/api/aiagent/instructions/:instructionId', async ({ params, request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    const instructionId = String(params.instructionId ?? '')
    const scoped = getScopedInstructions(
      requiredQueryParams.siteId,
      requiredQueryParams.aiAgentId,
    )
    const index = scoped.findIndex((row) => row.id === instructionId)

    if (index === -1) {
      return HttpResponse.json(
        { message: `Instruction "${instructionId}" was not found.` },
        { status: 404 },
      )
    }

    const body = (await request.json()) as { content: string }
    const updated: InstructionRecord = {
      id: instructionId,
      content: body.content,
    }

    scoped[index] = updated
    return HttpResponse.json(updated)
  }),

  http.delete('/api/aiagent/instructions/:instructionId', ({ params, request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    const instructionId = String(params.instructionId ?? '')
    const scoped = getScopedInstructions(
      requiredQueryParams.siteId,
      requiredQueryParams.aiAgentId,
    )
    const index = scoped.findIndex((row) => row.id === instructionId)

    if (index === -1) {
      return HttpResponse.json(
        { message: `Instruction "${instructionId}" was not found.` },
        { status: 404 },
      )
    }

    scoped.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
