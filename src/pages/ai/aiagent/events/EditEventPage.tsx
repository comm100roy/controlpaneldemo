import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import ScienceIcon from '@mui/icons-material/Science'
import { Button, Stack } from '@mui/material'
import Page from '../../../../components/common/Page'
import TestChatDrawer from '../../../../components/common/TestChatDrawer'
import AnswerEditorCard from '../../../../components/topics/AnswerEditorCard'
import { eventDefinitions } from '../../../../data/dashboard'
import { type TopicAnswerMode } from '../../../../data/topics'
import { appRoutes, resolveAiAgentId } from '../../../../data/routes'

function EditEventPage() {
  const { aiAgentId, eventId } = useParams<{ aiAgentId: string; eventId: string }>()
  const navigate = useNavigate()
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const resolvedAiAgentId = resolveAiAgentId(aiAgentId)

  const eventDefinition = eventDefinitions.find((item) => item.id === eventId)

  const [answerMode, setAnswerMode] = useState<TopicAnswerMode>(
    eventDefinition?.answerMode ?? 'workflow',
  )
  const [naturalLanguageInstructions, setNaturalLanguageInstructions] = useState(
    eventDefinition?.naturalLanguageInstructions ?? '',
  )
  const [selectedFunctionIds, setSelectedFunctionIds] = useState<string[]>(
    eventDefinition?.functionIds ?? [],
  )

  if (!eventDefinition) {
    return <Navigate to={appRoutes.ai.aiAgentEvents(resolvedAiAgentId)} replace />
  }

  return (
    <>
      <Page
        title={eventDefinition.name}
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<ScienceIcon />}
              onClick={() => setIsTestDrawerOpen(true)}
            >
              Test
            </Button>
          </Stack>
        }
      >
        <AnswerEditorCard
          answerMode={answerMode}
          onAnswerModeChange={setAnswerMode}
          naturalLanguageInstructions={naturalLanguageInstructions}
          onNaturalLanguageInstructionsChange={setNaturalLanguageInstructions}
          selectedFunctionIds={selectedFunctionIds}
          onSelectedFunctionIdsChange={setSelectedFunctionIds}
          manageFunctionsTo={appRoutes.ai.aiAgentFunctions(resolvedAiAgentId)}
          onViewFunction={(functionId) =>
            navigate(appRoutes.ai.aiAgentFunctionEdit(functionId, resolvedAiAgentId))
          }
        />

        <Stack direction="row" spacing={2}>
          <Button variant="contained">Save</Button>
          <Button variant="outlined">Save &amp; Leave</Button>
          <Button
            variant="outlined"
            onClick={() => navigate(appRoutes.ai.aiAgentEvents(resolvedAiAgentId))}
          >
            Cancel
          </Button>
        </Stack>
      </Page>
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
    </>
  )
}

export default EditEventPage
