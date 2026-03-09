import { useState } from 'react'
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import CollapsibleSectionCard from '../common/CollapsibleSectionCard'
import DynamicInfoDrawer from '../common/DynamicInfoDrawer'
import RepeatableFieldSection from '../common/RepeatableFieldSection'
import type {
  FunctionFormValues,
  FunctionHeaderRow,
  FunctionInputRow,
  FunctionOutputRow,
} from '../../data/dashboard'
import { appRoutes, resolveAiAgentId } from '../../data/routes'

type FunctionFormProps = {
  initialValues: FunctionFormValues
}

const cloneInputRow = (row: FunctionInputRow): FunctionInputRow => ({ ...row })
const cloneHeaderRow = (row: FunctionHeaderRow): FunctionHeaderRow => ({ ...row })
const cloneOutputRow = (row: FunctionOutputRow): FunctionOutputRow => ({ ...row })

const createInputRow = (): FunctionInputRow => ({
  name: '',
  type: 'String',
  isRequired: 'No',
  description: '',
})

const createHeaderRow = (): FunctionHeaderRow => ({
  key: '',
  value: '',
})

const createOutputRow = (): FunctionOutputRow => ({
  responseKey: '',
  description: '',
  saveToVariable: '',
})

const reorderRows = <T,>(rows: T[], fromIndex: number, toIndex: number) => {
  const nextRows = [...rows]
  const [movedRow] = nextRows.splice(fromIndex, 1)
  nextRows.splice(toIndex, 0, movedRow)
  return nextRows
}

function FunctionForm({ initialValues }: FunctionFormProps) {
  const { aiAgentId } = useParams<{ aiAgentId: string }>()
  const [name, setName] = useState(initialValues.name)
  const [description, setDescription] = useState(initialValues.description)
  const [authorizationRequired, setAuthorizationRequired] = useState(
    initialValues.authorizationRequired,
  )
  const [method, setMethod] = useState(initialValues.method)
  const [url, setUrl] = useState(initialValues.url)
  const [inputRows, setInputRows] = useState<FunctionInputRow[]>(
    initialValues.inputs.map(cloneInputRow),
  )
  const [headerRows, setHeaderRows] = useState<FunctionHeaderRow[]>(
    initialValues.headers.map(cloneHeaderRow),
  )
  const [body, setBody] = useState(initialValues.body)
  const [outputRows, setOutputRows] = useState<FunctionOutputRow[]>(
    initialValues.outputs.map(cloneOutputRow),
  )
  const [dynamicInfoTargetIndex, setDynamicInfoTargetIndex] = useState<number | null>(null)
  const resolvedAiAgentId = resolveAiAgentId(aiAgentId)

  const updateInputRow = <K extends keyof FunctionInputRow>(
    index: number,
    key: K,
    value: FunctionInputRow[K],
  ) => {
    setInputRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row,
      ),
    )
  }

  const updateHeaderRow = <K extends keyof FunctionHeaderRow>(
    index: number,
    key: K,
    value: FunctionHeaderRow[K],
  ) => {
    setHeaderRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row,
      ),
    )
  }

  const updateOutputRow = <K extends keyof FunctionOutputRow>(
    index: number,
    key: K,
    value: FunctionOutputRow[K],
  ) => {
    setOutputRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row,
      ),
    )
  }

  const handleInsertDynamicInfo = (value: string) => {
    if (dynamicInfoTargetIndex === null) {
      return
    }

    updateHeaderRow(dynamicInfoTargetIndex, 'value', value)
    setDynamicInfoTargetIndex(null)
  }

  return (
    <>
      <Card>
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Name *" value={name} onChange={(event) => setName(event.target.value)} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
                The function name can only contain a-z, A-Z, 0-9, underscores, or dashes, with a
                maximum length of 256 characters.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} />
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <CollapsibleSectionCard title="Input">
        <RepeatableFieldSection
          rows={inputRows}
          emptyLabel="+ New Function Input"
          onAdd={() => setInputRows((current) => [...current, createInputRow()])}
          onRemove={(index) =>
            setInputRows((current) => current.filter((_, rowIndex) => rowIndex !== index))
          }
          onReorder={(fromIndex, toIndex) =>
            setInputRows((current) => reorderRows(current, fromIndex, toIndex))
          }
          renderRow={(row, index, controls) => (
            <Grid container spacing={1.5} alignItems="center">
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Name *"
                  value={row.name}
                  onChange={(event) => updateInputRow(index, 'name', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    label="Type"
                    value={row.type}
                    onChange={(event) => updateInputRow(index, 'type', event.target.value)}
                  >
                    <MenuItem value="String">String</MenuItem>
                    <MenuItem value="Integer">Integer</MenuItem>
                    <MenuItem value="Number">Number</MenuItem>
                    <MenuItem value="Boolean">Boolean</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Is Required</InputLabel>
                  <Select
                    label="Is Required"
                    value={row.isRequired}
                    onChange={(event) => updateInputRow(index, 'isRequired', event.target.value)}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Description"
                  value={row.description}
                  onChange={(event) => updateInputRow(index, 'description', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 1 }}>
                <Stack
                  direction="row"
                  spacing={0.5}
                  justifyContent="flex-start"
                  alignItems="center"
                  sx={{ width: 64, ml: 'auto' }}
                >
                  {controls.deleteButton}
                  {controls.addButton}
                </Stack>
              </Grid>
            </Grid>
          )}
        />
      </CollapsibleSectionCard>

      <CollapsibleSectionCard title="API Endpoint">
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={authorizationRequired}
                onChange={(event) => setAuthorizationRequired(event.target.checked)}
              />
            }
            label="Authorization Required"
          />
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Method</InputLabel>
                <Select label="Method" value={method} onChange={(event) => setMethod(event.target.value)}>
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="URL *"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            </Grid>
          </Grid>
        </Stack>
      </CollapsibleSectionCard>

      <CollapsibleSectionCard title="Header">
        <RepeatableFieldSection
          rows={headerRows}
          emptyLabel="+ New Header"
          onAdd={() => setHeaderRows((current) => [...current, createHeaderRow()])}
          onRemove={(index) =>
            setHeaderRows((current) => current.filter((_, rowIndex) => rowIndex !== index))
          }
          onReorder={(fromIndex, toIndex) =>
            setHeaderRows((current) => reorderRows(current, fromIndex, toIndex))
          }
          renderRow={(row, index, controls) => (
            <Grid container spacing={1.5} alignItems="center">
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Key *"
                  value={row.key}
                  onChange={(event) => updateHeaderRow(index, 'key', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Value *"
                  value={row.value}
                  onChange={(event) => updateHeaderRow(index, 'value', event.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          edge="end"
                          color="default"
                          onClick={() => setDynamicInfoTargetIndex(index)}
                        >
                          <DataObjectOutlinedIcon fontSize="small" color="action" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 1 }}>
                <Stack
                  direction="row"
                  spacing={0.5}
                  justifyContent="flex-start"
                  alignItems="center"
                  sx={{ width: 64, ml: 'auto' }}
                >
                  {controls.deleteButton}
                  {controls.addButton}
                </Stack>
              </Grid>
            </Grid>
          )}
        />
      </CollapsibleSectionCard>

      <CollapsibleSectionCard title="Body">
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
              px: 1.5,
              py: 1,
              bgcolor: 'rgba(22, 50, 79, 0.03)',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">{'{.}'}</Typography>
            <Typography variant="body2">≡</Typography>
          </Stack>
          <TextField
            fullWidth
            multiline
            minRows={8}
            variant="standard"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: {
                px: 1.5,
                py: 1.25,
                alignItems: 'flex-start',
                fontFamily: 'monospace',
                color: 'text.secondary',
              },
            }}
          />
        </Box>
      </CollapsibleSectionCard>

      <CollapsibleSectionCard title="Output">
        <RepeatableFieldSection
          rows={outputRows}
          emptyLabel="+ New Function Output"
          onAdd={() => setOutputRows((current) => [...current, createOutputRow()])}
          onRemove={(index) =>
            setOutputRows((current) => current.filter((_, rowIndex) => rowIndex !== index))
          }
          onReorder={(fromIndex, toIndex) =>
            setOutputRows((current) => reorderRows(current, fromIndex, toIndex))
          }
          renderRow={(row, index, controls) => (
            <Grid container spacing={1.5} alignItems="center">
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Response key *"
                  value={row.responseKey}
                  onChange={(event) => updateOutputRow(index, 'responseKey', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Description"
                  value={row.description}
                  onChange={(event) => updateOutputRow(index, 'description', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Save to Variable"
                  value={row.saveToVariable}
                  onChange={(event) => updateOutputRow(index, 'saveToVariable', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 1 }}>
                <Stack
                  direction="row"
                  spacing={0.5}
                  justifyContent="flex-start"
                  alignItems="center"
                  sx={{ width: 64, ml: 'auto' }}
                >
                  {controls.deleteButton}
                  {controls.addButton}
                </Stack>
              </Grid>
            </Grid>
          )}
        />
      </CollapsibleSectionCard>

      <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
        <Button variant="contained">Save</Button>
        <Button variant="outlined">Save &amp; Test</Button>
        <Button
          component={RouterLink}
          to={appRoutes.ai.aiAgentFunctions(resolvedAiAgentId)}
          variant="outlined"
        >
          Cancel
        </Button>
      </Stack>

      <DynamicInfoDrawer
        open={dynamicInfoTargetIndex !== null}
        onClose={() => setDynamicInfoTargetIndex(null)}
        onInsert={handleInsertDynamicInfo}
      />
    </>
  )
}

export default FunctionForm
