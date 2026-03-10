import { useState } from 'react'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import { Stack, Typography } from '@mui/material'
import SideDrawer from '../common/SideDrawer'
import type { AiAgentRecord } from '../../data/aiAgents'
import EditAiAgentFormSection from './EditAiAgentFormSection'

type EditAiAgentDrawerProps = {
  open: boolean
  onClose: () => void
  agent: AiAgentRecord
  onSubmitAgent: (agent: AiAgentRecord) => Promise<AiAgentRecord>
}

function EditAiAgentDrawer({
  open,
  onClose,
  agent,
  onSubmitAgent,
}: EditAiAgentDrawerProps) {
  const [mode, setMode] = useState<'form' | 'avatar'>('form')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleClose = () => {
    setMode('form')
    setIsSubmitting(false)
    setSubmitError(null)
    onClose()
  }

  const handleSubmit = async (nextAgent: AiAgentRecord) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await onSubmitAgent(nextAgent)
      handleClose()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to update AI agent.')
      setIsSubmitting(false)
    }
  }

  return (
    <SideDrawer
      open={open}
      onClose={handleClose}
      title={
        mode === 'avatar' ? (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Change Avatar
            </Typography>
            <HelpOutlineRoundedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
          </Stack>
        ) : (
          'Edit AI Agent'
        )
      }
      width={{ xs: '100%', lg: 1000 }}
    >
      <EditAiAgentFormSection
        agent={agent}
        submitting={isSubmitting}
        submitError={submitError}
        onModeChange={setMode}
        onSubmitAgent={handleSubmit}
        onCancel={handleClose}
      />
    </SideDrawer>
  )
}

export default EditAiAgentDrawer
