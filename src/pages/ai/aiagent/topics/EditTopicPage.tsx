import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import ScienceIcon from '@mui/icons-material/Science'
import {
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Page from '../../../../components/common/Page'
import TestChatDrawer from '../../../../components/common/TestChatDrawer'
import AnswerEditorCard from '../../../../components/topics/AnswerEditorCard'
import {
  topicCategories,
  topicDefinitions,
  type TopicAnswerMode,
} from '../../../../data/dashboard'
import { appRoutes, resolveAiAgentId } from '../../../../data/routes'

const buildTopicCategoryOptions = (
  categories: typeof topicCategories,
  parentPath = '',
): Array<{ id: string; label: string }> =>
  categories.flatMap((category) => {
    if (category.id === 'all') {
      return []
    }

    const currentPath =
      category.label === '/'
        ? '/'
        : parentPath === '/' || parentPath.length === 0
          ? `${parentPath}${category.label}`.replace(/^$/, category.label)
          : `${parentPath}/${category.label}`

    return [
      { id: category.id, label: currentPath },
      ...(category.children
        ? buildTopicCategoryOptions(category.children, currentPath)
        : []),
    ]
  })

function EditTopicPage() {
  const { aiAgentId, topicId } = useParams<{ aiAgentId: string; topicId: string }>()
  const navigate = useNavigate()
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const resolvedAiAgentId = resolveAiAgentId(aiAgentId)

  const topicDefinition = topicDefinitions.find((item) => item.id === topicId)

  const [name, setName] = useState(topicDefinition?.name ?? '')
  const [categoryId, setCategoryId] = useState(topicDefinition?.categoryId ?? 'root')
  const [description, setDescription] = useState(topicDefinition?.description ?? '')
  const [answerMode, setAnswerMode] = useState<TopicAnswerMode>(
    topicDefinition?.answerMode ?? 'workflow',
  )
  const [naturalLanguageInstructions, setNaturalLanguageInstructions] = useState(
    topicDefinition?.naturalLanguageInstructions ?? '',
  )
  const [selectedFunctionIds, setSelectedFunctionIds] = useState<string[]>(
    topicDefinition?.functionIds ?? [],
  )

  const categoryOptions = useMemo(
    () => buildTopicCategoryOptions(topicCategories),
    [],
  )

  if (!topicDefinition) {
    return <Navigate to={appRoutes.ai.aiAgentTopics(resolvedAiAgentId)} replace />
  }

  const handleViewSelectedFunction = (functionId: string) => {
    navigate(appRoutes.ai.aiAgentFunctionEdit(functionId, resolvedAiAgentId))
  }

  return (
    <>
      <Page
        title="Edit Topic"
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
        <Card>
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Name *"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
                  Use clear and specific topic names like &apos;Retrieve Password&apos; or
                  &apos;Check Order&apos;.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Category *"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                >
                  {categoryOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Description *"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <AnswerEditorCard
          answerMode={answerMode}
          onAnswerModeChange={setAnswerMode}
          naturalLanguageInstructions={naturalLanguageInstructions}
          onNaturalLanguageInstructionsChange={setNaturalLanguageInstructions}
          selectedFunctionIds={selectedFunctionIds}
          onSelectedFunctionIdsChange={setSelectedFunctionIds}
          manageFunctionsTo={appRoutes.ai.aiAgentFunctions(resolvedAiAgentId)}
          onViewFunction={handleViewSelectedFunction}
        />

        <Stack direction="row" spacing={2}>
          <Button variant="contained">Save</Button>
          <Button variant="outlined">Save &amp; Leave</Button>
          <Button
            variant="outlined"
            onClick={() => navigate(appRoutes.ai.aiAgentTopics(resolvedAiAgentId))}
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

export default EditTopicPage
