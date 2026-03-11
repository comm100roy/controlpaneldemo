import { useState } from 'react'
import { Button, Card, CardContent, Stack, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { SpotlightFormValues } from '../../data/aiInsights'

type SpotlightFormProps = {
  initialValues: SpotlightFormValues
  submitting?: boolean
  onSave?: (values: SpotlightFormValues) => void | Promise<void>
  cancelTo: string
}

function SpotlightForm({ initialValues, submitting = false, onSave, cancelTo }: SpotlightFormProps) {
  const navigate = useNavigate()
  const [name, setName] = useState(initialValues.name)
  const [description, setDescription] = useState(initialValues.description)

  const handleSave = async () => {
    if (!onSave) {
      navigate(cancelTo)
      return
    }

    await onSave({
      name: name.trim(),
      description: description.trim(),
    })
  }

  return (
    <>
      <Card>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              required
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              sx={{ maxWidth: 460 }}
            />
            <TextField
              fullWidth
              multiline
              minRows={4}
              required
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              sx={{ maxWidth: 460 }}
            />
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
        <Button
          variant="contained"
          onClick={() => void handleSave()}
          disabled={submitting || name.trim().length === 0 || description.trim().length === 0}
        >
          Save
        </Button>
        <Button variant="outlined" onClick={() => navigate(cancelTo)} disabled={submitting}>
          Cancel
        </Button>
      </Stack>
    </>
  )
}

export default SpotlightForm
