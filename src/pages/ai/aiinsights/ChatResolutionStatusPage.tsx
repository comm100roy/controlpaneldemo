import { useState } from 'react'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import {
  Box,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import {
  AiInsightsInfoBanner,
  AiInsightsPanel,
} from '../../../components/common/AiInsightsElements'
import FeatureSwitch from '../../../components/common/FeatureSwitch'
import Page from '../../../components/common/Page'

function ChatResolutionStatusPage() {
  const [enabled, setEnabled] = useState(true)

  return (
    <Page
      title="Chat Resolution Status"
      titleSuffix={
        <FeatureSwitch
          checked={enabled}
          onChange={(_, checked) => setEnabled(checked)}
        />
      }
      belowDescription={
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 1100, fontSize: 13, lineHeight: 1.45 }}
        >
          Chats are automatically analyzed and categorized into resolution statuses to
          improve tracking and efficiency: Pending Internal (agent follow-up required),
          Pending External (waiting for visitor input), Resolved, and Undefined.{' '}
          <Link
            component="button"
            type="button"
            underline="hover"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4 }}
          >
            Learn more
            <OpenInNewOutlinedIcon sx={{ fontSize: 15 }} />
          </Link>
        </Typography>
      }
    >
      <Stack spacing={2}>
        <AiInsightsInfoBanner>
          Chat resolution status feature consumes 1 AI Reply for each chat.
        </AiInsightsInfoBanner>

        <AiInsightsPanel>
          <Box
            sx={{
              minHeight: 520,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#ffffff',
            }}
          >
            <Box sx={{ position: 'relative', width: 520, height: 340 }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 58,
                  left: 74,
                  width: 156,
                  height: 238,
                  borderRadius: 3,
                  background: 'linear-gradient(180deg, #072b53 0%, #0d4474 100%)',
                  boxShadow: '0 14px 28px rgba(15, 23, 42, 0.14)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 44,
                  left: 136,
                  width: 270,
                  height: 250,
                  borderRadius: 4,
                  border: '14px solid #d7d9dc',
                  bgcolor: '#ffffff',
                  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
                }}
              >
                <Box sx={{ px: 4, pt: 3 }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#37474f' }}>
                    History
                  </Typography>
                  <Stack spacing={1.3} sx={{ mt: 2.5 }}>
                    {[1, 2, 3, 4].map((row) => (
                      <Box
                        key={row}
                        sx={{
                          height: 10,
                          borderRadius: 999,
                          bgcolor: '#e5e8eb',
                          width: row % 2 === 0 ? '72%' : '82%',
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: 128,
                  left: 206,
                  width: 180,
                  p: 2.25,
                  borderRadius: 3,
                  bgcolor: '#ffffff',
                  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.14)',
                }}
              >
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#7a8690' }}>
                  Resolution Status
                </Typography>
                <Stack direction="row" spacing={0.9} alignItems="center" sx={{ mt: 1.2 }}>
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: '#39b87f' }} />
                  <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#39b87f' }}>
                    Resolved
                  </Typography>
                </Stack>
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: 18,
                  left: 54,
                  width: 92,
                  height: 92,
                  borderRadius: '50%',
                  bgcolor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 16px 32px rgba(15, 23, 42, 0.14)',
                }}
              >
                <AutoAwesomeRoundedIcon sx={{ fontSize: 54, color: '#2bb673' }} />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: 30,
                  left: 144,
                  width: 108,
                  height: 110,
                  border: '2px dashed #7cc78d',
                  borderRight: 0,
                  borderBottom: 0,
                  borderTopLeftRadius: 22,
                }}
              />
            </Box>
          </Box>
        </AiInsightsPanel>
      </Stack>
    </Page>
  )
}

export default ChatResolutionStatusPage
