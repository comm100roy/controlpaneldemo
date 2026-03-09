import { useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem as MuiMenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import CornerToggleButtonGroup from '../common/CornerToggleButtonGroup'
import SideDrawer from '../common/SideDrawer'
import {
  functionDefinitions,
  type TopicAnswerMode,
} from '../../data/dashboard'
import TopicWorkflowPlaceholder from './TopicWorkflowPlaceholder'

type AnswerEditorCardProps = {
  answerMode: TopicAnswerMode
  onAnswerModeChange: (value: TopicAnswerMode) => void
  naturalLanguageInstructions: string
  onNaturalLanguageInstructionsChange: (value: string) => void
  selectedFunctionIds: string[]
  onSelectedFunctionIdsChange: (ids: string[]) => void
  manageFunctionsTo: string
  onViewFunction: (functionId: string) => void
}

function AnswerEditorCard({
  answerMode,
  onAnswerModeChange,
  naturalLanguageInstructions,
  onNaturalLanguageInstructionsChange,
  selectedFunctionIds,
  onSelectedFunctionIdsChange,
  manageFunctionsTo,
  onViewFunction,
}: AnswerEditorCardProps) {
  const [isAddFunctionsDrawerOpen, setIsAddFunctionsDrawerOpen] = useState(false)
  const [pendingFunctionIds, setPendingFunctionIds] = useState<string[]>(selectedFunctionIds)
  const [functionMenuAnchor, setFunctionMenuAnchor] = useState<null | HTMLElement>(null)
  const [activeFunctionId, setActiveFunctionId] = useState<string | null>(null)

  const linkedFunctions = useMemo(
    () =>
      functionDefinitions.filter((definition) =>
        selectedFunctionIds.includes(definition.id),
      ),
    [selectedFunctionIds],
  )

  const hasPendingFunctionChanges =
    pendingFunctionIds.length !== selectedFunctionIds.length ||
    pendingFunctionIds.some((id) => !selectedFunctionIds.includes(id))

  const handleOpenFunctionMenu = (
    event: React.MouseEvent<HTMLElement>,
    functionId: string,
  ) => {
    setFunctionMenuAnchor(event.currentTarget)
    setActiveFunctionId(functionId)
  }

  const handleCloseFunctionMenu = () => {
    setFunctionMenuAnchor(null)
    setActiveFunctionId(null)
  }

  const handleDeleteSelectedFunction = () => {
    if (!activeFunctionId) {
      return
    }

    onSelectedFunctionIdsChange(
      selectedFunctionIds.filter((id) => id !== activeFunctionId),
    )
    handleCloseFunctionMenu()
  }

  const handleViewSelectedFunction = () => {
    if (!activeFunctionId) {
      return
    }

    onViewFunction(activeFunctionId)
    handleCloseFunctionMenu()
  }

  const handleTogglePendingFunction = (functionId: string) => {
    setPendingFunctionIds((current) =>
      current.includes(functionId)
        ? current.filter((id) => id !== functionId)
        : [...current, functionId],
    )
  }

  const handleOpenAddFunctionsDrawer = () => {
    setPendingFunctionIds(selectedFunctionIds)
    setIsAddFunctionsDrawerOpen(true)
  }

  const handleCloseAddFunctionsDrawer = () => {
    setIsAddFunctionsDrawerOpen(false)
  }

  const handleAddFunctions = () => {
    onSelectedFunctionIdsChange(pendingFunctionIds)
    setIsAddFunctionsDrawerOpen(false)
  }

  return (
    <>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 2, pt: 2, pb: 1.5 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h6" sx={{ fontSize: 24, fontWeight: 700 }}>
                Answers
              </Typography>
              <CornerToggleButtonGroup<TopicAnswerMode>
                value={answerMode}
                onChange={onAnswerModeChange}
                options={[
                  { value: 'workflow', label: 'By Workflow' },
                  { value: 'natural-language', label: 'By Natural Language' },
                ]}
                buttonMinWidth={190}
                buttonSx={{ px: 2 }}
              />
            </Stack>
            {answerMode === 'workflow' ? (
              <Button variant="text" startIcon={<OpenInFullOutlinedIcon />}>
                Full Screen
              </Button>
            ) : null}
          </Stack>

          <Divider />

          <Box sx={{ p: 2 }}>
            {answerMode === 'workflow' ? (
              <TopicWorkflowPlaceholder />
            ) : (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                    Instructions
                  </Typography>
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
                      spacing={1}
                      alignItems="center"
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        color: 'text.secondary',
                      }}
                    >
                      <DataObjectOutlinedIcon fontSize="small" />
                      <OpenInFullOutlinedIcon fontSize="small" />
                    </Stack>
                    <TextField
                      fullWidth
                      multiline
                      minRows={8}
                      variant="standard"
                      value={naturalLanguageInstructions}
                      onChange={(event) =>
                        onNaturalLanguageInstructionsChange(event.target.value)
                      }
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          px: 1.5,
                          py: 1.25,
                          alignItems: 'flex-start',
                        },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.75, display: 'block' }}
                  >
                    Give the AI Agent instructions in plain language: specify actions,
                    restrictions, and desired results.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Functions
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, display: 'block' }}
                  >
                    Functions that the AI Agent executes to complete specific tasks.
                  </Typography>
                  {linkedFunctions.length > 0 ? (
                    <Stack spacing={1} sx={{ mt: 1.5 }}>
                      {linkedFunctions.map((definition) => (
                        <Stack
                          key={definition.id}
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            px: 1.5,
                            py: 1,
                            bgcolor: 'rgba(22, 50, 79, 0.06)',
                            borderRadius: 1,
                          }}
                        >
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Box
                              sx={{
                                minWidth: 28,
                                color: 'text.secondary',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography
                                component="span"
                                sx={{
                                  fontSize: 18,
                                  fontStyle: 'italic',
                                  fontWeight: 700,
                                  lineHeight: 1,
                                }}
                              >
                                fx
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {definition.name}
                            </Typography>
                          </Stack>
                          <IconButton
                            size="small"
                            color="default"
                            onClick={(event) => handleOpenFunctionMenu(event, definition.id)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      ))}
                    </Stack>
                  ) : null}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddFunctionsDrawer}
                    sx={{
                      mt: 1.5,
                      borderStyle: 'dashed',
                      color: 'text.secondary',
                      borderColor: 'divider',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Add Functions
                  </Button>
                </Box>
              </Stack>
            )}
          </Box>
        </CardContent>
      </Card>
      <SideDrawer
        open={isAddFunctionsDrawerOpen}
        onClose={handleCloseAddFunctionsDrawer}
        title="Add Functions"
        width={{ xs: '100%', sm: 560 }}
        titleActions={
          <Link
            component={RouterLink}
            to={manageFunctionsTo}
            underline="hover"
            color="primary.main"
            sx={{ fontSize: 16 }}
          >
            Manage Functions{' '}
            <OpenInNewOutlinedIcon
              sx={{ fontSize: 16, ml: 0.25, verticalAlign: 'text-bottom' }}
            />
          </Link>
        }
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700, mb: 1.5 }}>
              Select Functions
            </Typography>
            <List disablePadding>
              {functionDefinitions.map((definition) => (
                <ListItemButton
                  key={definition.id}
                  onClick={() => handleTogglePendingFunction(definition.id)}
                  sx={{ px: 0, borderRadius: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Checkbox
                      edge="start"
                      checked={pendingFunctionIds.includes(definition.id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={definition.name}
                    primaryTypographyProps={{ fontSize: 16 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              disabled={!hasPendingFunctionChanges}
              onClick={handleAddFunctions}
            >
              Add
            </Button>
            <Button variant="outlined" onClick={handleCloseAddFunctionsDrawer}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </SideDrawer>
      <Menu
        anchorEl={functionMenuAnchor}
        open={Boolean(functionMenuAnchor)}
        onClose={handleCloseFunctionMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiMenuItem onClick={handleViewSelectedFunction}>View</MuiMenuItem>
        <MuiMenuItem onClick={handleDeleteSelectedFunction}>Delete</MuiMenuItem>
      </Menu>
    </>
  )
}

export default AnswerEditorCard
