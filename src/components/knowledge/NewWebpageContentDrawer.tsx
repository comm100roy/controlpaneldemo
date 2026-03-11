import { useState } from 'react'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import {
  Button,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CornerToggleButtonGroup from '../common/CornerToggleButtonGroup'
import SideDrawer from '../common/SideDrawer'

type WebpageSourceMode = 'reuse-existing' | 'new-website'

type NewWebpageContentDrawerProps = {
  open: boolean
  onClose: () => void
}

function NewWebpageContentDrawer({ open, onClose }: NewWebpageContentDrawerProps) {
  const [sourceMode, setSourceMode] = useState<WebpageSourceMode>('reuse-existing')
  const [selectedWebsite, setSelectedWebsite] = useState('')
  const [urlMatchingRule, setUrlMatchingRule] = useState('')
  const [singlePageUrls, setSinglePageUrls] = useState('')

  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      title="New Content - Webpage"
      width={{ xs: '100%', sm: 540 }}
    >
      <Stack spacing={2.5}>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 470, lineHeight: 1.5 }}>
          Content is the information resources AI Agent fetches and utilizes to interact with
          your visitors. Provide the accessible public URL for AI Agent to access relevant and
          up-to-date content.
        </Typography>

        <CornerToggleButtonGroup<WebpageSourceMode>
          value={sourceMode}
          onChange={setSourceMode}
          options={[
            { value: 'reuse-existing', label: 'Reuse Existing Website' },
            { value: 'new-website', label: 'New Website' },
          ]}
          fullWidth
          buttonSx={{ py: 1.2, fontSize: 16 }}
        />

        <Stack spacing={1}>
          <FormControl fullWidth size="small" required>
            <InputLabel>URL</InputLabel>
            <Select
              required
              label="URL"
              value={selectedWebsite}
              onChange={(event) => setSelectedWebsite(event.target.value)}
              sx={{ bgcolor: 'common.white' }}
            >
              <MenuItem value="https://support.comm100.com">https://support.comm100.com</MenuItem>
              <MenuItem value="https://docs.example.com">https://docs.example.com</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary">
            Providing your public help center homepage link is recommended.
          </Typography>
        </Stack>

        <Stack spacing={1}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            label="URL matching rule"
            value={urlMatchingRule}
            onChange={(event) => setUrlMatchingRule(event.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                alignItems: 'flex-start',
                bgcolor: 'common.white',
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            You can use several regular expressions to filter out the pages you want to sync. One
            entry per line.{' '}
            <Link href="#" underline="hover" sx={{ whiteSpace: 'nowrap' }}>
              Learn more <OpenInNewOutlinedIcon sx={{ fontSize: 14, verticalAlign: 'text-bottom' }} />
            </Link>
          </Typography>
        </Stack>

        <Stack spacing={1}>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Single Page URLs"
            value={singlePageUrls}
            onChange={(event) => setSinglePageUrls(event.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                alignItems: 'flex-start',
                bgcolor: 'common.white',
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            You can add additional Single Page URLs here. These URLs will be crawled independently
            without sub-pages. Starting URL Matching Rules will not affect to these URLs. One URL
            per line.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
          <Button variant="contained" disabled>
            Sync Now
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </SideDrawer>
  )
}

export default NewWebpageContentDrawer
