import { http, HttpResponse } from 'msw'
import { aiAgentRecords } from '../../data/aiAgents'

export const aiAgentHandlers = [
  http.get('/api/aiagent/aiagents', ({ request }) => {
    const url = new URL(request.url)
    const siteId = url.searchParams.get('siteId')

    if (!siteId) {
      return HttpResponse.json(
        {
          message: 'Missing required "siteId" query parameter.',
        },
        { status: 400 },
      )
    }

    return HttpResponse.json(aiAgentRecords)
  }),
]
