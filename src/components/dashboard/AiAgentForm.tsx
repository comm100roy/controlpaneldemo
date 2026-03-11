import { useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
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
import {
  agentAvatarPresets,
  type AgentAvatarVariantId,
} from '../common/agentAvatarPresets'

export type AiAgentFormValues = {
  name: string
  language: string
  channel: string
  tone: string
  description: string
  paymentStatus: 'Paid' | 'Trial'
}

type AiAgentFormProps = {
  initialName: string
  initialLanguage: string
  initialChannel: string
  initialTone?: string
  initialDescription: string
  initialPaymentStatus?: 'Paid' | 'Trial'
  paidAgentCount?: number
  paidAgentLimit?: number
  submitLabel?: string
  cancelLabel?: string
  submitting?: boolean
  onModeChange?: (mode: 'form' | 'avatar') => void
  onSubmit: (values: AiAgentFormValues) => void
  onCancel: () => void
}

function AiAgentForm({
  initialName,
  initialLanguage,
  initialChannel,
  initialTone = 'Friendly',
  initialDescription,
  initialPaymentStatus = 'Paid',
  paidAgentCount = 80,
  paidAgentLimit = 101,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  submitting = false,
  onModeChange,
  onSubmit,
  onCancel,
}: AiAgentFormProps) {
  const [name, setName] = useState(initialName)
  const [language, setLanguage] = useState(initialLanguage)
  const [channel, setChannel] = useState(initialChannel)
  const [tone, setTone] = useState(initialTone)
  const [description, setDescription] = useState(initialDescription)
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Trial'>(initialPaymentStatus)
  const [mode, setMode] = useState<'form' | 'avatar'>('form')
  const [selectedAvatarId, setSelectedAvatarId] = useState<AgentAvatarVariantId>('classic')
  const [pendingAvatarId, setPendingAvatarId] = useState<AgentAvatarVariantId>('classic')

  const handleOpenAvatarPicker = () => {
    setPendingAvatarId(selectedAvatarId)
    setMode('avatar')
    onModeChange?.('avatar')
  }

  const handleConfirmAvatar = () => {
    setSelectedAvatarId(pendingAvatarId)
    setMode('form')
    onModeChange?.('form')
  }

  const handleCancelAvatarPicker = () => {
    setPendingAvatarId(selectedAvatarId)
    setMode('form')
    onModeChange?.('form')
  }

  const handleSubmit = () => {
    onSubmit({
      name: name.trim(),
      language,
      channel,
      tone,
      description: description.trim(),
      paymentStatus,
    })
  }

  if (mode === 'avatar') {
    return (
      <Stack spacing={4}>
        {onModeChange ? null : (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Change Avatar
            </Typography>
            <HelpOutlineRoundedIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
          </Stack>
        )}

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'flex-start',
          }}
        >
          <Box
            component="button"
            type="button"
            sx={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              border: 0,
              background: '#f2f3f5',
              color: 'text.secondary',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <AddRoundedIcon sx={{ fontSize: 28 }} />
          </Box>

          {agentAvatarPresets.map((preset) => {
            const isSelected = pendingAvatarId === preset.id

            return (
              <Box
                key={preset.id}
                component="button"
                type="button"
                onClick={() => setPendingAvatarId(preset.id)}
                sx={{
                  width: 88,
                  height: 88,
                  p: 0,
                  border: 0,
                  borderRadius: '50%',
                  background: 'transparent',
                  position: 'relative',
                  cursor: 'pointer',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 3,
                    borderRadius: '50%',
                    border: '1px solid',
                    borderColor: isSelected ? '#27b022' : 'transparent',
                    transition: 'border-color 0.2s ease',
                  },
                  '&:hover::before': {
                    borderColor: '#27b022',
                  },
                }}
              >
                <Box sx={{ position: 'absolute', inset: 8 }}>
                  <AgentAvatar size={72} variantId={preset.id} />
                </Box>
                {isSelected ? (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: '#27b022',
                      color: 'common.white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(39, 176, 34, 0.24)',
                    }}
                  >
                    <CheckRoundedIcon sx={{ fontSize: 18 }} />
                  </Box>
                ) : null}
              </Box>
            )
          })}
        </Box>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleConfirmAvatar} disabled={submitting}>
            OK
          </Button>
          <Button variant="outlined" onClick={handleCancelAvatarPicker} disabled={submitting}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    )
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 9 }}>
        <Stack spacing={2.25}>
          <TextField
            fullWidth
            required
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                fullWidth
                required
                label="Language"
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
                required
                label="Channels"
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
                required
                label="Tone"
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
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || name.trim().length === 0}
            >
              {submitLabel}
            </Button>
            <Button variant="outlined" onClick={onCancel} disabled={submitting}>
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
            <AgentAvatar size={144} variantId={selectedAvatarId} />
            <IconButton
              size="small"
              onClick={handleOpenAvatarPicker}
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
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1.5, textAlign: 'center', maxWidth: 180 }}
          >
            Choose an avatar that fits your AI Agent&apos;s personality.
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default AiAgentForm
