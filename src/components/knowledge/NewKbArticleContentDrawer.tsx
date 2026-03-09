import { useState } from 'react'
import { Button, Checkbox, FormControlLabel, MenuItem, Stack, TextField, Typography } from '@mui/material'
import SideDrawer from '../common/SideDrawer'

type KbOption = {
  id: string
  label: string
  visibility: 'Private' | 'Public'
}

const kbOptions: KbOption[] = [
  { id: 'private-kb', label: 'Private KB', visibility: 'Private' },
  { id: 'knowledge-base', label: 'Knowledge Base', visibility: 'Public' },
  { id: 'online-comm100-kb', label: 'Online Comm100 KB', visibility: 'Public' },
  { id: 'james-kb', label: 'James KB', visibility: 'Public' },
]

type NewKbArticleContentDrawerProps = {
  open: boolean
  onClose: () => void
}

function NewKbArticleContentDrawer({ open, onClose }: NewKbArticleContentDrawerProps) {
  const [selectedProduct, setSelectedProduct] = useState('Comm100 KB')
  const [selectedKbIds, setSelectedKbIds] = useState<string[]>([])

  const handleToggleKb = (kbId: string) => {
    setSelectedKbIds((current) =>
      current.includes(kbId) ? current.filter((id) => id !== kbId) : [...current, kbId],
    )
  }

  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      title="New Content - KB Article"
      width={{ xs: '100%', sm: 540 }}
    >
      <Stack spacing={3}>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 470, lineHeight: 1.5 }}>
          Content is the information resources AI Agent fetches and utilizes to interact with
          your visitors. Provide KBs to enable the AI Agent to access relevant and up-to-date
          content.
        </Typography>

        <Stack spacing={1}>
          <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700 }}>
            KB Product
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={selectedProduct}
            onChange={(event) => setSelectedProduct(event.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'common.white',
              },
            }}
          >
            <MenuItem value="Comm100 KB">Comm100 KB</MenuItem>
            <MenuItem value="Confluence Cloud">Confluence Cloud</MenuItem>
            <MenuItem value="ServiceNow">ServiceNow</MenuItem>
          </TextField>
        </Stack>

        <Stack spacing={0.75}>
          <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700 }}>
            Please Select The KBs You Want To Sync
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            All the published pages in this KB will be crawled as knowledge contents. Draft pages
            will not be crawled.
          </Typography>

          <Stack spacing={1}>
            {kbOptions.map((kb) => (
              <FormControlLabel
                key={kb.id}
                control={
                  <Checkbox
                    checked={selectedKbIds.includes(kb.id)}
                    onChange={() => handleToggleKb(kb.id)}
                    sx={{
                      color: '#546e7a',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body1" sx={{ color: '#263238' }}>
                    {kb.label}{' '}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 'inherit',
                        color: kb.visibility === 'Private' ? '#c49a53' : '#2b92c9',
                      }}
                    >
                      ({kb.visibility})
                    </Typography>
                  </Typography>
                }
                sx={{
                  m: 0,
                  alignItems: 'center',
                  '& .MuiFormControlLabel-label': {
                    lineHeight: 1.35,
                  },
                }}
              />
            ))}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
          <Button variant="contained" disabled={selectedKbIds.length === 0}>
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

export default NewKbArticleContentDrawer
