import { http, HttpResponse } from 'msw'
import { functionDefinitions, type FunctionFormValues } from '../../data/dashboard'

const createSeedFunctions = () =>
  functionDefinitions.map((definition) => ({
    ...definition,
    inputs: definition.inputs.map((input) => ({ ...input })),
    headers: definition.headers.map((header) => ({ ...header })),
    outputs: definition.outputs.map((output) => ({ ...output })),
  }))

const functionsByScope = new Map<string, FunctionFormValues[]>()

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

const getScopedFunctions = (siteId: string, aiAgentId: string) => {
  const scopeKey = getScopeKey(siteId, aiAgentId)
  const existingDefinitions = functionsByScope.get(scopeKey)

  if (existingDefinitions) {
    return existingDefinitions
  }

  const seededDefinitions = createSeedFunctions()
  functionsByScope.set(scopeKey, seededDefinitions)
  return seededDefinitions
}

const cloneFunctionDefinition = (definition: FunctionFormValues): FunctionFormValues => ({
  ...definition,
  inputs: definition.inputs.map((input) => ({ ...input })),
  headers: definition.headers.map((header) => ({ ...header })),
  outputs: definition.outputs.map((output) => ({ ...output })),
})

const createGuid = () => crypto.randomUUID()

export const functionHandlers = [
  http.get('/api/aiagent/functions', ({ request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    return HttpResponse.json(
      getScopedFunctions(requiredQueryParams.siteId, requiredQueryParams.aiAgentId),
    )
  }),

  http.get('/api/aiagent/functions/:functionId', ({ params, request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    const functionId = String(params.functionId ?? '')
    const functionDefinition = getScopedFunctions(
      requiredQueryParams.siteId,
      requiredQueryParams.aiAgentId,
    ).find((definition) => definition.id === functionId)

    if (!functionDefinition) {
      return HttpResponse.json(
        { message: `Function "${functionId}" was not found.` },
        { status: 404 },
      )
    }

    return HttpResponse.json(functionDefinition)
  }),

  http.post('/api/aiagent/functions', async ({ request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    const nextDefinition = cloneFunctionDefinition(
      (await request.json()) as FunctionFormValues,
    )
    const createdDefinition: FunctionFormValues = {
      ...nextDefinition,
      id: createGuid(),
    }

    const scopedDefinitions = getScopedFunctions(
      requiredQueryParams.siteId,
      requiredQueryParams.aiAgentId,
    )
    scopedDefinitions.unshift(createdDefinition)

    return HttpResponse.json(createdDefinition, { status: 201 })
  }),

  http.put('/api/aiagent/functions/:functionId', async ({ params, request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    const functionId = String(params.functionId ?? '')
    const scopedDefinitions = getScopedFunctions(
      requiredQueryParams.siteId,
      requiredQueryParams.aiAgentId,
    )
    const functionIndex = scopedDefinitions.findIndex((definition) => definition.id === functionId)

    if (functionIndex === -1) {
      return HttpResponse.json(
        { message: `Function "${functionId}" was not found.` },
        { status: 404 },
      )
    }

    const nextDefinition = cloneFunctionDefinition(
      (await request.json()) as FunctionFormValues,
    )
    const updatedDefinition: FunctionFormValues = {
      ...nextDefinition,
      id: functionId,
    }

    scopedDefinitions[functionIndex] = updatedDefinition
    return HttpResponse.json(updatedDefinition)
  }),

  http.delete('/api/aiagent/functions/:functionId', ({ params, request }) => {
    const requiredQueryParams = getRequiredQueryParams(request)
    if ('error' in requiredQueryParams) {
      return requiredQueryParams.error
    }

    const functionId = String(params.functionId ?? '')
    const scopedDefinitions = getScopedFunctions(
      requiredQueryParams.siteId,
      requiredQueryParams.aiAgentId,
    )
    const functionIndex = scopedDefinitions.findIndex((definition) => definition.id === functionId)

    if (functionIndex === -1) {
      return HttpResponse.json(
        { message: `Function "${functionId}" was not found.` },
        { status: 404 },
      )
    }

    scopedDefinitions.splice(functionIndex, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
