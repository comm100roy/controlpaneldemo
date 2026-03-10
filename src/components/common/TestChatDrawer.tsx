import { useMemo, useState } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined'
import ScienceIcon from '@mui/icons-material/Science'
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined'
import SystemUpdateAltOutlinedIcon from '@mui/icons-material/SystemUpdateAltOutlined'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import {
  alpha,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AgentAvatar from './AgentAvatar'

type TestChatDrawerProps = {
  open: boolean
  onClose: () => void
}

type ChatMessage = {
  id: string
  sender: 'assistant' | 'visitor'
  text: string
}

const initialMessages: ChatMessage[] = [
  {
    id: 'assistant-intro',
    sender: 'assistant',
    text:
      "Hi there! I'm your Order Management Specialist here to help check order status or start a new purchase. How can I help you today?",
  },
]

function TestChatDrawer({ open, onClose }: TestChatDrawerProps) {
  const [draftMessage, setDraftMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)

  const nextMessageId = useMemo(() => messages.length + 1, [messages.length])

  const handleSendMessage = () => {
    const trimmedMessage = draftMessage.trim()

    if (!trimmedMessage) {
      return
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `visitor-${nextMessageId}`,
        sender: 'visitor',
        text: trimmedMessage,
      },
    ])
    setDraftMessage('')
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 540 },
          borderRadius: 0,
          overflow: 'hidden',
          border: 0,
          boxShadow: '0 18px 60px rgba(15, 23, 42, 0.16)',
          backgroundColor: '#f3f5f8',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            px: 2.5,
            py: 2,
            bgcolor: '#eceef2',
          }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <ScienceIcon sx={{ color: '#293745', fontSize: 22 }} />
            <Typography sx={{ fontSize: 18, color: '#293745' }}>Test</Typography>
            <Chip
              label="Live Chat"
              size="small"
              sx={{
                height: 28,
                bgcolor: alpha('#000000', 0.08),
                color: '#293745',
                '& .MuiChip-label': {
                  px: 1.25,
                },
              }}
            />
          </Stack>

          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" sx={{ color: '#6b7787' }}>
              <SystemUpdateAltOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: '#6b7787' }}>
              <HistoryOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onClose} sx={{ color: '#6b7787' }}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        <Divider />

        <Box
          sx={{
            flexGrow: 1,
            px: 2.5,
            py: 3,
            overflowY: 'auto',
          }}
        >
          <Stack spacing={2} justifyContent="flex-end" sx={{ minHeight: '100%' }}>
            {messages.map((message) =>
              message.sender === 'assistant' ? (
                <Stack key={message.id} direction="row" spacing={1.5} alignItems="flex-end">
                  <AgentAvatar size={38} />

                  <Box sx={{ position: 'relative', maxWidth: 360 }}>
                    <Box
                      sx={{
                        bgcolor: '#ffffff',
                        borderRadius: 2,
                        px: 2.25,
                        py: 2,
                        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                      }}
                    >
                      <Typography sx={{ fontSize: 16, lineHeight: 1.55, color: '#293745' }}>
                        {message.text}
                      </Typography>
                    </Box>
                    <AutoAwesomeIcon
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        fontSize: 16,
                        color: '#8f98a5',
                      }}
                    />
                  </Box>
                </Stack>
              ) : (
                <Stack key={message.id} direction="row" justifyContent="flex-end">
                  <Box
                    sx={{
                      maxWidth: 340,
                      bgcolor: '#0d7bdc',
                      color: '#ffffff',
                      borderRadius: 2,
                      px: 2.25,
                      py: 1.5,
                      boxShadow: '0 8px 24px rgba(13, 123, 220, 0.16)',
                    }}
                  >
                    <Typography sx={{ fontSize: 15, lineHeight: 1.5 }}>{message.text}</Typography>
                  </Box>
                </Stack>
              ),
            )}
          </Stack>
        </Box>

        <Box sx={{ px: 1.75, pb: 1.75 }}>
          <Box
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 2,
              boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
              px: 1.5,
              py: 0.5,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                fullWidth
                variant="standard"
                placeholder="Write a reply..."
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    handleSendMessage()
                  }
                }}
                InputProps={{ disableUnderline: true }}
              />
              <IconButton size="small" sx={{ color: '#6b7787' }}>
                <SentimentSatisfiedAltOutlinedIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: '#6b7787' }} onClick={handleSendMessage}>
                <NearMeOutlinedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}

export default TestChatDrawer
