import { useState } from 'react'
import { Button, Stack, TextField, Typography } from '@mui/material'
import SideDrawer from '../common/SideDrawer'

type NewSnippetContentDrawerProps = {
  open: boolean
  onClose: () => void
}

function NewSnippetContentDrawer({ open, onClose }: NewSnippetContentDrawerProps) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      title="New Content - Snippet"
      width={{ xs: '100%', sm: 1020 }}
    >
      <Stack spacing={3}>
        <TextField
          fullWidth
          size="small"
          label="Name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'common.white',
            },
          }}
        />

        <Stack spacing={1.25}>
          <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700 }}>
            Content <Typography component="span" sx={{ color: 'error.main' }}>*</Typography>
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={13}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                alignItems: 'flex-start',
                bgcolor: 'common.white',
              },
            }}
          />
        </Stack>

        <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
          <Button variant="contained">Save</Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </SideDrawer>
  )
}

export default NewSnippetContentDrawer
