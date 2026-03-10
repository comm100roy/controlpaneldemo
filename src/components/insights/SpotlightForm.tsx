import { useState } from 'react'
import { Button, Card, CardContent, Stack, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { SpotlightFormValues } from '../../data/aiInsights'

type SpotlightFormProps = {
  initialValues: SpotlightFormValues
  onSave?: (values: SpotlightFormValues) => void
  cancelTo: string
}

function SpotlightForm({ initialValues, onSave, cancelTo }: SpotlightFormProps) {
  const navigate = useNavigate()
  const [name, setName] = useState(initialValues.name)
  const [description, setDescription] = useState(initialValues.description)

  const handleSave = () => {
    onSave?.({
      name: name.trim(),
      description: description.trim(),
    })
    navigate(cancelTo)
  }

  return (
    <>
      <Card>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Name *"
              value={name}
              onChange={(event) => setName(event.target.value)}
              sx={{ maxWidth: 460 }}
            />
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Description *"
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
          onClick={handleSave}
          disabled={name.trim().length === 0 || description.trim().length === 0}
        >
          Save
        </Button>
        <Button variant="outlined" onClick={() => navigate(cancelTo)}>
          Cancel
        </Button>
      </Stack>
    </>
  )
}

export default SpotlightForm
