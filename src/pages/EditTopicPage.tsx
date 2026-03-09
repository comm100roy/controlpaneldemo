import { useMemo, useState } from 'react'
import { Link as RouterLink, Navigate, useNavigate, useParams } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import ScienceIcon from '@mui/icons-material/Science'
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import CheckIcon from '@mui/icons-material/Check'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem as MuiMenuItem,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import Page from '../components/common/Page'
import SideDrawer from '../components/common/SideDrawer'
import TestChatDrawer from '../components/common/TestChatDrawer'
import TopicWorkflowPlaceholder from '../components/topics/TopicWorkflowPlaceholder'
import {
  functionDefinitions,
  topicCategories,
  topicDefinitions,
  type TopicAnswerMode,
} from '../data/dashboard'

const buildTopicCategoryOptions = (
  categories: typeof topicCategories,
  parentPath = '',
): Array<{ id: string; label: string }> =>
  categories.flatMap((category) => {
    if (category.id === 'all') {
      return []
    }

    const currentPath =
      category.label === '/'
        ? '/'
        : parentPath === '/' || parentPath.length === 0
          ? `${parentPath}${category.label}`.replace(/^$/, category.label)
          : `${parentPath}/${category.label}`

    return [
      { id: category.id, label: currentPath },
      ...(category.children
        ? buildTopicCategoryOptions(category.children, currentPath)
        : []),
    ]
  })

function EditTopicPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const navigate = useNavigate()
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)

  const topicDefinition = topicDefinitions.find((item) => item.id === topicId)

  const [name, setName] = useState(topicDefinition?.name ?? '')
  const [categoryId, setCategoryId] = useState(topicDefinition?.categoryId ?? 'root')
  const [description, setDescription] = useState(topicDefinition?.description ?? '')
  const [answerMode, setAnswerMode] = useState<TopicAnswerMode>(
    topicDefinition?.answerMode ?? 'workflow',
  )
  const [naturalLanguageInstructions, setNaturalLanguageInstructions] = useState(
    topicDefinition?.naturalLanguageInstructions ?? '',
  )
  const [selectedFunctionIds, setSelectedFunctionIds] = useState<string[]>(
    topicDefinition?.functionIds ?? [],
  )
  const [isAddFunctionsDrawerOpen, setIsAddFunctionsDrawerOpen] = useState(false)
  const [pendingFunctionIds, setPendingFunctionIds] = useState<string[]>(
    topicDefinition?.functionIds ?? [],
  )
  const [functionMenuAnchor, setFunctionMenuAnchor] = useState<null | HTMLElement>(null)
  const [activeFunctionId, setActiveFunctionId] = useState<string | null>(null)

  const categoryOptions = useMemo(
    () => buildTopicCategoryOptions(topicCategories),
    [],
  )

  if (!topicDefinition) {
    return <Navigate to="/ai-agent/topics" replace />
  }

  const linkedFunctions = functionDefinitions.filter((definition) =>
    selectedFunctionIds.includes(definition.id),
  )
  const addableFunctions = functionDefinitions
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

    setSelectedFunctionIds((current) => current.filter((id) => id !== activeFunctionId))
    handleCloseFunctionMenu()
  }

  const handleViewSelectedFunction = () => {
    if (!activeFunctionId) {
      return
    }

    navigate(`/ai-agent/functions/${activeFunctionId}/edit`)
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
    setSelectedFunctionIds(pendingFunctionIds)
    setIsAddFunctionsDrawerOpen(false)
  }

  return (
    <>
      <Page
        title="Edit Topic"
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<ScienceIcon />}
              onClick={() => setIsTestDrawerOpen(true)}
            >
              Test
            </Button>
          </Stack>
        }
      >
        <Card>
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Name *"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
                  Use clear and specific topic names like &apos;Retrieve Password&apos; or
                  &apos;Check Order&apos;.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Category *"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                >
                  {categoryOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Description *"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

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
                <ToggleButtonGroup
                  exclusive
                  value={answerMode}
                  onChange={(_, value: TopicAnswerMode | null) => {
                    if (value) {
                      setAnswerMode(value)
                    }
                  }}
                  size="small"
                  sx={{
                    borderRadius: 1,
                    overflow: 'visible',
                    '& .MuiToggleButton-root': {
                      position: 'relative',
                      overflow: 'hidden',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2,
                      minWidth: 190,
                      borderRadius: 0,
                    },
                    '& .MuiToggleButtonGroup-firstButton': {
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    },
                    '& .MuiToggleButtonGroup-lastButton': {
                      borderTopRightRadius: 6,
                      borderBottomRightRadius: 6,
                    },
                    '& .MuiToggleButton-root.Mui-selected::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 0,
                      height: 0,
                      borderTop: '22px solid',
                      borderLeft: '22px solid transparent',
                      borderColor: 'primary.main transparent transparent transparent',
                    },
                    '& .MuiToggleButton-root.Mui-selected .topic-answer-check': {
                      opacity: 1,
                    },
                  }}
                >
                  <ToggleButton value="workflow">
                    By Workflow
                    <CheckIcon
                      className="topic-answer-check"
                      sx={{
                        position: 'absolute',
                        top: 1,
                        right: 1,
                        fontSize: 12,
                        color: 'common.white',
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                      }}
                    />
                  </ToggleButton>
                  <ToggleButton value="natural-language">
                    By Natural Language
                    <CheckIcon
                      className="topic-answer-check"
                      sx={{
                        position: 'absolute',
                        top: 1,
                        right: 1,
                        fontSize: 12,
                        color: 'common.white',
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                      }}
                    />
                  </ToggleButton>
                </ToggleButtonGroup>
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
                        onChange={(event) => setNaturalLanguageInstructions(event.target.value)}
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
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
                      Give the AI Agent instructions in plain language: specify actions, restrictions, and desired results.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Functions
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
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

        <Stack direction="row" spacing={2}>
          <Button variant="contained">Save</Button>
          <Button variant="outlined">Save &amp; Leave</Button>
          <Button variant="outlined">Cancel</Button>
        </Stack>
      </Page>
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
      <SideDrawer
        open={isAddFunctionsDrawerOpen}
        onClose={handleCloseAddFunctionsDrawer}
        title="Add Functions"
        width={{ xs: '100%', sm: 560 }}
        titleActions={
          <Link
            component={RouterLink}
            to="/ai-agent/functions"
            underline="hover"
            color="primary.main"
            sx={{ fontSize: 16 }}
          >
            Manage Functions <OpenInNewOutlinedIcon sx={{ fontSize: 16, ml: 0.25, verticalAlign: 'text-bottom' }} />
          </Link>
        }
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700, mb: 1.5 }}>
              Select Functions
            </Typography>
            <List disablePadding>
              {addableFunctions.map((definition) => (
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

export default EditTopicPage
