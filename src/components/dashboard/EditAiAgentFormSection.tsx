import { Stack, Typography } from '@mui/material'
import type { AiAgentRecord } from '../../data/aiAgents'
import AiAgentForm, { type AiAgentFormValues } from './AiAgentForm'

type EditAiAgentFormSectionProps = {
  agent: AiAgentRecord
  paidAgentCount?: number
  paidAgentLimit?: number
  submitting?: boolean
  submitError?: string | null
  onModeChange?: (mode: 'form' | 'avatar') => void
  onSubmitAgent: (agent: AiAgentRecord) => void | Promise<void>
  onCancel: () => void
}

function EditAiAgentFormSection({
  agent,
  paidAgentCount,
  paidAgentLimit,
  submitting = false,
  submitError = null,
  onModeChange,
  onSubmitAgent,
  onCancel,
}: EditAiAgentFormSectionProps) {
  const handleSubmit = async (values: AiAgentFormValues) => {
    const nextAgent: AiAgentRecord = {
      ...agent,
      name: values.name,
      subtitle: values.description || 'AI Agent configuration draft',
      language: values.language,
      channelLabel: values.channel,
      channelCount: values.channel === 'Messaging' ? 0 : 1,
      paymentStatus: values.paymentStatus,
    }

    await onSubmitAgent(nextAgent)
  }

  return (
    <Stack spacing={2}>
      {submitError ? (
        <Typography variant="body2" color="error.main">
          {submitError}
        </Typography>
      ) : null}
      <AiAgentForm
        initialName={agent.name}
        initialLanguage={agent.language}
        initialChannel={agent.channelLabel}
        initialDescription={agent.subtitle}
        initialPaymentStatus={agent.paymentStatus}
        paidAgentCount={paidAgentCount}
        paidAgentLimit={paidAgentLimit}
        submitting={submitting}
        onModeChange={onModeChange}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </Stack>
  )
}

export default EditAiAgentFormSection
