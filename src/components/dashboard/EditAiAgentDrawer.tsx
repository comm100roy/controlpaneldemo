import { useState } from 'react'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import { Stack, Typography } from '@mui/material'
import AiAgentForm from './AiAgentForm'
import SideDrawer from '../common/SideDrawer'

type EditAiAgentDrawerProps = {
  open: boolean
  onClose: () => void
  initialName: string
  initialLanguage: string
  initialChannel: string
  initialDescription: string
}

function EditAiAgentDrawer({
  open,
  onClose,
  initialName,
  initialLanguage,
  initialChannel,
  initialDescription,
}: EditAiAgentDrawerProps) {
  const [mode, setMode] = useState<'form' | 'avatar'>('form')

  const handleClose = () => {
    setMode('form')
    onClose()
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
      <AiAgentForm
        initialName={initialName}
        initialLanguage={initialLanguage}
        initialChannel={initialChannel}
        initialDescription={initialDescription}
        onModeChange={setMode}
        onSubmit={handleClose}
        onCancel={handleClose}
      />
    </SideDrawer>
  )
}

export default EditAiAgentDrawer
