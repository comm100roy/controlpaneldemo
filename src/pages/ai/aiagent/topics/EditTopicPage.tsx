import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ScienceIcon from '@mui/icons-material/Science'
import {
  Alert,
  Button,
  Snackbar,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { getTopicCategories } from '../../../../api/topicCategories'
import { getTopic, updateTopic } from '../../../../api/topics'
import Page from '../../../../components/common/Page'
import TestChatDrawer from '../../../../components/common/TestChatDrawer'
import AnswerEditorCard from '../../../../components/topics/AnswerEditorCard'
import {
  type TopicAnswerMode,
  type TopicDefinition,
} from '../../../../data/topics'
import { type TopicCategory } from '../../../../data/topicCategories'
import { buildTopicCategoryOptions } from '../../../../data/topicUtils'
import {
  appRoutes,
  getSiteIdFromPathname,
  resolveAiAgentId,
  resolveSiteId,
} from '../../../../data/routes'

function EditTopicPage() {
  const { aiAgentId, topicId } = useParams<{ aiAgentId: string; topicId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const [topicDefinition, setTopicDefinition] = useState<TopicDefinition | null>(null)
  const [categories, setCategories] = useState<TopicCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const resolvedAiAgentId = resolveAiAgentId(aiAgentId)
  const siteId = useMemo(
    () => resolveSiteId(getSiteIdFromPathname(location.pathname)),
    [location.pathname],
  )
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [answerMode, setAnswerMode] = useState<TopicAnswerMode>('workflow')
  const [naturalLanguageInstructions, setNaturalLanguageInstructions] = useState('')
  const [selectedFunctionIds, setSelectedFunctionIds] = useState<string[]>([])

  useEffect(() => {
    if (!topicId) {
      setTopicDefinition(null)
      setCategories([])
      setLoading(false)
      setError('Topic id is missing.')
      return
    }

    let cancelled = false

    const loadTopic = async () => {
      setLoading(true)
      setError(null)

      try {
        const [nextTopic, nextCategories] = await Promise.all([
          getTopic(siteId, resolvedAiAgentId, topicId),
          getTopicCategories(siteId, resolvedAiAgentId),
        ])

        if (!cancelled) {
          setTopicDefinition(nextTopic)
          setCategories(nextCategories)
          setName(nextTopic.name)
          setCategoryId(nextTopic.categoryId)
          setDescription(nextTopic.description)
          setAnswerMode(nextTopic.answerMode)
          setNaturalLanguageInstructions(nextTopic.naturalLanguageInstructions)
          setSelectedFunctionIds(nextTopic.functionIds)
        }
      } catch (nextError) {
        if (!cancelled) {
          setTopicDefinition(null)
          setCategories([])
          setError(nextError instanceof Error ? nextError.message : 'Failed to load topic.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadTopic()

    return () => {
      cancelled = true
    }
  }, [resolvedAiAgentId, siteId, topicId])

  const categoryOptions = useMemo(
    () => buildTopicCategoryOptions(categories),
    [categories],
  )

  const handleViewSelectedFunction = (functionId: string) => {
    navigate(appRoutes.ai.aiAgentFunctionEdit(functionId, resolvedAiAgentId))
  }

  const handleSaveTopic = async (leaveAfterSave: boolean) => {
    if (
      !topicDefinition ||
      name.trim().length === 0 ||
      categoryId.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const updatedTopic = await updateTopic(siteId, resolvedAiAgentId, {
        ...topicDefinition,
        name: name.trim(),
        categoryId,
        description: description.trim(),
        answerMode,
        naturalLanguageInstructions: naturalLanguageInstructions.trim(),
        functionIds: selectedFunctionIds,
      })

      if (leaveAfterSave) {
        navigate(appRoutes.ai.aiAgentTopics(resolvedAiAgentId), {
          state: { successMessage: 'Topic saved successfully.' },
        })
        return
      }

      setTopicDefinition(updatedTopic)
      setSuccessMessage('Topic saved successfully.')
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to update topic.')
    } finally {
      setSubmitting(false)
    }
  }

  const isSaveDisabled =
    submitting ||
    !topicDefinition ||
    name.trim().length === 0 ||
    categoryId.trim().length === 0 ||
    description.trim().length === 0

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
        {error ? <Alert severity="error">{error}</Alert> : null}
        {loading ? <Alert severity="info">Loading topic...</Alert> : null}
        {topicDefinition ? (
          <>
            <Card>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label="Name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.75, display: 'block' }}
                    >
                      Use clear and specific topic names like &apos;Retrieve Password&apos; or
                      &apos;Check Order&apos;.
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      select
                      fullWidth
                      required
                      label="Category"
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
                      required
                      label="Description"
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
              <Button
                variant="contained"
                disabled={isSaveDisabled}
                onClick={() => void handleSaveTopic(false)}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                disabled={isSaveDisabled}
                onClick={() => void handleSaveTopic(true)}
              >
                Save &amp; Leave
              </Button>
              <Button
                variant="outlined"
                disabled={submitting}
                onClick={() => navigate(appRoutes.ai.aiAgentTopics(resolvedAiAgentId))}
              >
                Cancel
              </Button>
            </Stack>
          </>
        ) : null}
      </Page>
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessMessage(null)}
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default EditTopicPage
