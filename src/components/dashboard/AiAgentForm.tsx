import { useState } from 'react'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AgentAvatar from '../common/AgentAvatar'

export type AiAgentFormValues = {
  name: string
  language: string
  channel: string
  tone: string
  description: string
  instructions: string
  paymentStatus: 'Paid' | 'Trial'
}

type AiAgentFormProps = {
  initialName: string
  initialLanguage: string
  initialChannel: string
  initialTone?: string
  initialDescription: string
  initialInstructions?: string
  initialPaymentStatus?: 'Paid' | 'Trial'
  paidAgentCount?: number
  paidAgentLimit?: number
  submitLabel?: string
  cancelLabel?: string
  onSubmit: (values: AiAgentFormValues) => void
  onCancel: () => void
}

function AiAgentForm({
  initialName,
  initialLanguage,
  initialChannel,
  initialTone = 'Friendly',
  initialDescription,
  initialInstructions = '',
  initialPaymentStatus = 'Paid',
  paidAgentCount = 80,
  paidAgentLimit = 101,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onSubmit,
  onCancel,
}: AiAgentFormProps) {
  const [name, setName] = useState(initialName)
  const [language, setLanguage] = useState(initialLanguage)
  const [channel, setChannel] = useState(initialChannel)
  const [tone, setTone] = useState(initialTone)
  const [description, setDescription] = useState(initialDescription)
  const [instructions, setInstructions] = useState(initialInstructions)
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Trial'>(initialPaymentStatus)

  const handleSubmit = () => {
    onSubmit({
      name: name.trim(),
      language,
      channel,
      tone,
      description: description.trim(),
      instructions: instructions.trim(),
      paymentStatus,
    })
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 9 }}>
        <Stack spacing={2.25}>
          <TextField
            fullWidth
            label="Name *"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                fullWidth
                label="Language *"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                <MenuItem value="Chinese (Simplified)">Chinese (Simplified)</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                fullWidth
                label="Channels *"
                value={channel}
                onChange={(event) => setChannel(event.target.value)}
              >
                <MenuItem value="Live Chat">Live Chat</MenuItem>
                <MenuItem value="Anytime Chat">Anytime Chat</MenuItem>
                <MenuItem value="Messaging">Messaging</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                fullWidth
                label="Tone *"
                value={tone}
                onChange={(event) => setTone(event.target.value)}
              >
                <MenuItem value="Friendly">Friendly</MenuItem>
                <MenuItem value="Professional">Professional</MenuItem>
                <MenuItem value="Neutral">Neutral</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <Box>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Instructions"
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Guide your AI Agent&apos;s actions: define what it can and cannot do.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Payment Status
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Paid AI Agents: {paidAgentCount}/{paidAgentLimit}
            </Typography>
            <FormControl sx={{ mt: 1.5 }}>
              <RadioGroup
                value={paymentStatus}
                onChange={(event) =>
                  setPaymentStatus(event.target.value as 'Paid' | 'Trial')
                }
              >
                <FormControlLabel value="Paid" control={<Radio />} label="Paid" />
                <FormControlLabel value="Trial" control={<Radio />} label="Trial" />
              </RadioGroup>
            </FormControl>
          </Box>

          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <Button variant="contained" onClick={handleSubmit} disabled={name.trim().length === 0}>
              {submitLabel}
            </Button>
            <Button variant="outlined" onClick={onCancel}>
              {cancelLabel}
            </Button>
          </Stack>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, lg: 3 }}>
        <Stack
          alignItems="center"
          justifyContent="flex-start"
          sx={{ pt: { xs: 0, lg: 2 } }}
        >
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <AgentAvatar size={144} />
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                right: 6,
                bottom: 6,
                bgcolor: 'primary.main',
                color: 'common.white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default AiAgentForm
