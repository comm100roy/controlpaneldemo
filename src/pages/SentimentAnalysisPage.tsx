import { useState } from 'react'
import { Button, Stack, Switch, Typography } from '@mui/material'
import {
  AiInsightsHelpLink,
  AiInsightsInfoBanner,
  AiInsightsPanel,
} from '../components/common/AiInsightsElements'
import Page from '../components/common/Page'

function SentimentAnalysisPage() {
  const [enabled, setEnabled] = useState(true)
  const [savedValue, setSavedValue] = useState(true)
  const isDirty = enabled !== savedValue

  const handleSave = () => {
    setSavedValue(enabled)
  }

  const handleCancel = () => {
    setEnabled(savedValue)
  }

  return (
    <Page
      title="Sentiment Analysis"
      belowDescription={
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 980 }}>
          Analyze the customer tone and sentiment across all interactions to understand
          their emotions, empowering you to deliver tailored support and enhance overall
          customer satisfaction. <AiInsightsHelpLink label="How to use" />
        </Typography>
      }
    >
      <Stack spacing={3}>
        <AiInsightsInfoBanner>
          Sentiment Analysis feature consumes 1 AI Reply for every 5 chat messages.
        </AiInsightsInfoBanner>

        <AiInsightsPanel>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Stack spacing={0.75}>
              <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#37474f' }}>
                Enable Sentiment Analysis for Live Chat
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760 }}>
                While chatting with visitors, your agents can monitor the different
                emotional tone of visitor messages in real-time.
              </Typography>
            </Stack>
            <Switch checked={enabled} onChange={(_, checked) => setEnabled(checked)} />
          </Stack>
        </AiInsightsPanel>

        <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleSave} disabled={!isDirty}>
            Save
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Page>
  )
}

export default SentimentAnalysisPage
