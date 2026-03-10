import { useEffect, useMemo, useRef, useState } from 'react'
import ScienceIcon from '@mui/icons-material/Science'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined'
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Snackbar,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  createTopicCategory,
  deleteTopicCategory,
  getTopicCategories,
  updateTopicCategory,
} from '../../../../api/topicCategories'
import {
  createTopic,
  deleteTopic,
  getTopics,
} from '../../../../api/topics'
import Page from '../../../../components/common/Page'
import SideDrawer from '../../../../components/common/SideDrawer'
import CategoryForm, {
  type CategoryFormOption,
  type CategoryFormValues,
} from '../../../../components/topics/CategoryForm'
import DataTable, {
  type InstructionRow,
} from '../../../../components/common/DataTable'
import TestChatDrawer from '../../../../components/common/TestChatDrawer'
import {
  type TopicDefinition,
} from '../../../../data/topics'
import { type TopicCategory } from '../../../../data/topicCategories'
import {
  buildTopicCategoryOptions,
  collectTopicCategoryIds,
  findTopicCategoryById,
  getRootTopicCategoryId,
  insertTopicCategory,
  moveTopicCategoryTree,
  removeTopicCategoryTree,
  updateTopicCategoryTree,
} from '../../../../data/topicUtils'
import {
  appRoutes,
  getSiteIdFromPathname,
  resolveAiAgentId,
  resolveSiteId,
} from '../../../../data/routes'

type TopicTreeItemProps = {
  node: TopicCategory
  depth?: number
  parentId?: string
  selectedCategoryId: string
  expandedCategoryIds: string[]
  onSelect: (categoryId: string) => void
  onToggle: (categoryId: string) => void
  onCreateCategory: (parentId: string) => void
  onEditCategory: (categoryId: string) => void
  onDeleteCategory: (categoryId: string) => void
}

type TopicDraft = {
  name: string
  categoryId: string
  description: string
}

type TopicTableRow = InstructionRow & {
  categoryId: string
}

const allCategoriesNode: TopicCategory = {
  id: 'all',
  label: 'All Categories',
}

const createTopicDraft = (categoryId = ''): TopicDraft => ({
  name: '',
  categoryId,
  description: '',
})

type CategoryDrawerMode = 'create' | 'edit' | null

function TopicTreeItem({
  node,
  depth = 0,
  parentId,
  selectedCategoryId,
  expandedCategoryIds,
  onSelect,
  onToggle,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory,
}: TopicTreeItemProps) {
  const hasChildren = Boolean(node.children?.length)
  const isExpanded = expandedCategoryIds.includes(node.id)
  const isSelected = selectedCategoryId === node.id
  const isAllCategories = node.id === 'all'
  const isRootCategory = !isAllCategories && !parentId
  const canCreateCategory = !isAllCategories
  const canEditOrDeleteCategory = !isAllCategories && !isRootCategory && Boolean(parentId)
  const showHoverActions = canCreateCategory || canEditOrDeleteCategory

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.25}
        sx={{
          minHeight: 37,
          pl: depth * 2,
          borderRadius: 1.5,
          color: isSelected ? 'primary.main' : 'text.secondary',
          bgcolor: isSelected ? 'rgba(25, 118, 210, 0.06)' : 'transparent',
          '&:hover': {
            bgcolor: showHoverActions ? 'rgba(22, 50, 79, 0.06)' : undefined,
          },
          '&:hover .topic-tree-actions, &:focus-within .topic-tree-actions, &:hover .topic-tree-drag, &:focus-within .topic-tree-drag': {
            opacity: showHoverActions ? 1 : 0,
          },
        }}
      >
        <Box sx={{ width: 28, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          {hasChildren ? (
            <IconButton
              size="small"
              onClick={() => onToggle(node.id)}
              sx={{ color: 'inherit' }}
            >
              {isExpanded ? (
                <ExpandMoreIcon fontSize="small" />
              ) : (
                <ChevronRightIcon fontSize="small" />
              )}
            </IconButton>
          ) : canEditOrDeleteCategory ? (
            <IconButton
              size="small"
              className="topic-tree-drag"
              onClick={(event) => event.stopPropagation()}
              sx={{
                color: 'text.secondary',
                opacity: 0,
                transition: 'opacity 0.15s ease',
              }}
            >
              <UnfoldMoreIcon fontSize="small" />
            </IconButton>
          ) : null}
        </Box>
        <Button
          variant="text"
          color="inherit"
          onClick={() => onSelect(node.id)}
          startIcon={
            isAllCategories ? (
              <LabelOutlinedIcon fontSize="small" />
            ) : hasChildren && isExpanded ? (
              <FolderOpenOutlinedIcon fontSize="small" />
            ) : (
              <FolderOutlinedIcon fontSize="small" />
            )
          }
          sx={{
            px: 0,
            minWidth: 0,
            width: '100%',
            flexGrow: 1,
            justifyContent: 'flex-start',
            textTransform: 'none',
            fontSize: 14,
            fontWeight: isSelected ? 600 : 500,
            color: 'inherit',
            textAlign: 'left',
          }}
        >
          {node.label}
        </Button>
        {showHoverActions ? (
          <Stack
            direction="row"
            spacing={0.25}
            className="topic-tree-actions"
            sx={{
              width: canEditOrDeleteCategory ? 84 : 28,
              justifyContent: 'flex-end',
              flexShrink: 0,
              opacity: 0,
              transition: 'opacity 0.15s ease',
            }}
          >
            <IconButton
              size="small"
              onClick={(event) => event.stopPropagation()}
              sx={{ color: 'text.secondary', p: 0.5 }}
              onClickCapture={() => onCreateCategory(node.id)}
            >
              <AddIcon fontSize="small" />
            </IconButton>
            {canEditOrDeleteCategory ? (
              <IconButton
                size="small"
                onClick={(event) => event.stopPropagation()}
                sx={{ color: 'text.secondary', p: 0.5 }}
                onClickCapture={() => onEditCategory(node.id)}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            ) : null}
            {canEditOrDeleteCategory ? (
              <IconButton
                size="small"
                onClick={(event) => event.stopPropagation()}
                sx={{ color: 'text.secondary', p: 0.5 }}
                onClickCapture={() => onDeleteCategory(node.id)}
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            ) : null}
          </Stack>
        ) : null}
      </Stack>

      {hasChildren && isExpanded ? (
        <Stack spacing={0.25} sx={{ mt: 0.25 }}>
          {node.children?.map((child) => (
            <TopicTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              parentId={node.id}
              selectedCategoryId={selectedCategoryId}
              expandedCategoryIds={expandedCategoryIds}
              onSelect={onSelect}
              onToggle={onToggle}
              onCreateCategory={onCreateCategory}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
            />
          ))}
        </Stack>
      ) : null}
    </Box>
  )
}

function TopicsPage() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const { aiAgentId } = useParams<{ aiAgentId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const resolvedAiAgentId = resolveAiAgentId(aiAgentId)
  const siteId = useMemo(
    () => resolveSiteId(getSiteIdFromPathname(location.pathname)),
    [location.pathname],
  )
  const layoutRef = useRef<HTMLDivElement | null>(null)
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([])
  const [categories, setCategories] = useState<TopicCategory[]>([])
  const [topics, setTopics] = useState<TopicDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [categoryPanelWidth, setCategoryPanelWidth] = useState(220)
  const [isResizing, setIsResizing] = useState(false)
  const [isTopicDrawerOpen, setIsTopicDrawerOpen] = useState(false)
  const [isCreatingTopic, setIsCreatingTopic] = useState(false)
  const [topicDraft, setTopicDraft] = useState<TopicDraft>(createTopicDraft())
  const [pendingDeleteTopic, setPendingDeleteTopic] = useState<TopicTableRow | null>(null)
  const [isDeletingTopic, setIsDeletingTopic] = useState(false)
  const [categoryDrawerMode, setCategoryDrawerMode] = useState<CategoryDrawerMode>(null)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [isSavingCategory, setIsSavingCategory] = useState(false)
  const [pendingDeleteCategoryId, setPendingDeleteCategoryId] = useState<string | null>(null)
  const [isDeletingCategory, setIsDeletingCategory] = useState(false)
  const [categoryDraft, setCategoryDraft] = useState<CategoryFormValues>({
    name: '',
    parentId: '',
  })
  const locationState = location.state as { successMessage?: string } | null

  useEffect(() => {
    let cancelled = false

    const loadTopics = async () => {
      setLoading(true)
      setError(null)

      try {
        const [nextCategories, nextTopics] = await Promise.all([
          getTopicCategories(siteId, resolvedAiAgentId),
          getTopics(siteId, resolvedAiAgentId),
        ])

        if (!cancelled) {
          setCategories(nextCategories)
          setTopics(nextTopics)
        }
      } catch (nextError) {
        if (!cancelled) {
          setCategories([])
          setTopics([])
          setError(nextError instanceof Error ? nextError.message : 'Failed to load topics.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadTopics()

    return () => {
      cancelled = true
    }
  }, [resolvedAiAgentId, siteId])

  useEffect(() => {
    if (!locationState?.successMessage) {
      return
    }

    setSuccessMessage(locationState.successMessage)
    navigate(`${location.pathname}${location.search}`, { replace: true, state: null })
  }, [location.pathname, location.search, locationState?.successMessage, navigate])

  const rootCategoryId = useMemo(() => getRootTopicCategoryId(categories) ?? '', [categories])

  useEffect(() => {
    if (selectedCategoryId === 'all') {
      return
    }

    if (!findTopicCategoryById(categories, selectedCategoryId)) {
      setSelectedCategoryId('all')
    }
  }, [categories, selectedCategoryId])

  useEffect(() => {
    if (topicDraft.categoryId && findTopicCategoryById(categories, topicDraft.categoryId)) {
      return
    }

    if (!rootCategoryId) {
      return
    }

    setTopicDraft((current) => ({
      ...current,
      categoryId: rootCategoryId,
    }))
  }, [categories, rootCategoryId, topicDraft.categoryId])

  useEffect(() => {
    if (!rootCategoryId) {
      return
    }

    setExpandedCategoryIds((current) =>
      current.includes(rootCategoryId) ? current : [rootCategoryId, ...current],
    )
  }, [rootCategoryId])

  useEffect(() => {
    if (!isDesktop || !isResizing) {
      return
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!layoutRef.current) {
        return
      }

      const bounds = layoutRef.current.getBoundingClientRect()
      const nextWidth = event.clientX - bounds.left
      setCategoryPanelWidth(Math.max(180, Math.min(360, nextWidth)))
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDesktop, isResizing])

  const visibleRows = useMemo<TopicTableRow[]>(() => {
    return topics
      .map((topic) => ({
        id: topic.id,
        content: topic.name,
        secondaryValue: topic.answerMode === 'workflow' ? 'Workflow' : 'Natural Language',
        categoryId: topic.categoryId,
      }))
      .filter((row) => {
        const inCategory = selectedCategoryId === 'all' || row.categoryId === selectedCategoryId
        const matchesSearch =
          searchValue.trim().length === 0 ||
          row.content.toLowerCase().includes(searchValue.trim().toLowerCase())

        return inCategory && matchesSearch
      })
  }, [searchValue, selectedCategoryId, topics])

  const categoryTree = useMemo<TopicCategory[]>(
    () => [allCategoriesNode, ...categories],
    [categories],
  )

  const topicCategoryOptions = useMemo<CategoryFormOption[]>(
    () => buildTopicCategoryOptions(categories),
    [categories],
  )

  const categoryFormOptions = useMemo(() => {
    if (categoryDrawerMode !== 'edit' || !editingCategoryId) {
      return topicCategoryOptions
    }

    const editingCategory = findTopicCategoryById(categories, editingCategoryId)
    if (!editingCategory) {
      return topicCategoryOptions
    }

    return buildTopicCategoryOptions(categories, collectTopicCategoryIds(editingCategory.node))
  }, [categories, categoryDrawerMode, editingCategoryId, topicCategoryOptions])

  const pendingDeleteCategory = useMemo(
    () =>
      pendingDeleteCategoryId
        ? findTopicCategoryById(categories, pendingDeleteCategoryId)?.node ?? null
        : null,
    [categories, pendingDeleteCategoryId],
  )

  const handleToggleCategory = (categoryId: string) => {
    setExpandedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    )
  }

  const handleOpenCreateCategoryDrawer = (parentId: string) => {
    setCategoryDrawerMode('create')
    setEditingCategoryId(null)
    setCategoryDraft({
      name: '',
      parentId: parentId === 'all' ? rootCategoryId : parentId,
    })
  }

  const handleOpenEditCategoryDrawer = (categoryId: string) => {
    const categoryMatch = findTopicCategoryById(categories, categoryId)
    if (!categoryMatch) {
      return
    }

    setCategoryDrawerMode('edit')
    setEditingCategoryId(categoryId)
    setCategoryDraft({
      name: categoryMatch.node.label,
      parentId: categoryMatch.parentId ?? rootCategoryId,
    })
  }

  const handleCloseCategoryDrawer = () => {
    setCategoryDrawerMode(null)
    setEditingCategoryId(null)
    setIsSavingCategory(false)
  }

  const handleSaveCategory = async () => {
    const trimmedName = categoryDraft.name.trim()
    const parentId = categoryDraft.parentId.trim()

    if (trimmedName.length === 0 || parentId.length === 0) {
      return
    }

    setIsSavingCategory(true)
    setError(null)

    try {
      if (categoryDrawerMode === 'create') {
        const createdCategory = await createTopicCategory(siteId, resolvedAiAgentId, {
          label: trimmedName,
          parentId,
        })

        setCategories((current) => insertTopicCategory(current, parentId, createdCategory))
        setExpandedCategoryIds((current) =>
          current.includes(parentId) ? current : [...current, parentId],
        )
        setSelectedCategoryId(createdCategory.id)
        setSuccessMessage('Category created successfully.')
        handleCloseCategoryDrawer()
        return
      }

      if (!editingCategoryId) {
        return
      }

      const currentParentId =
        findTopicCategoryById(categories, editingCategoryId)?.parentId ?? rootCategoryId

      await updateTopicCategory(siteId, resolvedAiAgentId, editingCategoryId, {
        label: trimmedName,
        parentId,
      })

      setCategories((current) => {
        const renamedCategories = updateTopicCategoryTree(current, editingCategoryId, (category) => ({
          ...category,
          label: trimmedName,
        }))

        return currentParentId === parentId
          ? renamedCategories
          : moveTopicCategoryTree(renamedCategories, editingCategoryId, parentId)
      })
      setExpandedCategoryIds((current) =>
        current.includes(parentId) ? current : [...current, parentId],
      )
      setSuccessMessage('Category updated successfully.')
      handleCloseCategoryDrawer()
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to save category.')
      setIsSavingCategory(false)
    }
  }

  const handleOpenTopicDrawer = () => {
    const nextCategoryId =
      selectedCategoryId !== 'all' && findTopicCategoryById(categories, selectedCategoryId)
        ? selectedCategoryId
        : rootCategoryId

    setTopicDraft(createTopicDraft(nextCategoryId))
    setIsTopicDrawerOpen(true)
  }

  const handleCloseTopicDrawer = () => {
    setIsTopicDrawerOpen(false)
    setIsCreatingTopic(false)
  }

  const handleCreateTopic = async () => {
    if (
      topicDraft.name.trim().length === 0 ||
      topicDraft.categoryId.trim().length === 0 ||
      topicDraft.description.trim().length === 0
    ) {
      return
    }

    setIsCreatingTopic(true)
    setError(null)

    try {
      const createdTopic = await createTopic(siteId, resolvedAiAgentId, {
        id: 'new',
        name: topicDraft.name.trim(),
        categoryId: topicDraft.categoryId,
        description: topicDraft.description.trim(),
        answerMode: 'workflow',
        naturalLanguageInstructions: '',
        functionIds: [],
      })

      setTopics((current) => [createdTopic, ...current])
      setSelectedCategoryId(createdTopic.categoryId)
      setSuccessMessage('Topic created successfully.')
      handleCloseTopicDrawer()
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to create topic.')
      setIsCreatingTopic(false)
    }
  }

  const handleCloseDeleteTopicDialog = () => {
    if (isDeletingTopic) {
      return
    }

    setPendingDeleteTopic(null)
  }

  const handleConfirmDeleteTopic = async () => {
    if (!pendingDeleteTopic) {
      return
    }

    setIsDeletingTopic(true)
    setError(null)

    try {
      await deleteTopic(siteId, resolvedAiAgentId, pendingDeleteTopic.id)
      setTopics((current) => current.filter((topic) => topic.id !== pendingDeleteTopic.id))
      setSuccessMessage('Topic deleted successfully.')
      setPendingDeleteTopic(null)
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to delete topic.')
    } finally {
      setIsDeletingTopic(false)
    }
  }

  const handleCloseDeleteCategoryDialog = () => {
    if (isDeletingCategory) {
      return
    }

    setPendingDeleteCategoryId(null)
  }

  const handleConfirmDeleteCategory = async () => {
    if (!pendingDeleteCategoryId) {
      return
    }

    setIsDeletingCategory(true)
    setError(null)

    try {
      await deleteTopicCategory(siteId, resolvedAiAgentId, pendingDeleteCategoryId)

      const removalResult = removeTopicCategoryTree(categories, pendingDeleteCategoryId)
      if (removalResult.removed) {
        const removedCategoryIds = new Set(collectTopicCategoryIds(removalResult.removed))

        setCategories(removalResult.nextCategories)
        setTopics((current) =>
          current.map((topic) =>
            removedCategoryIds.has(topic.categoryId)
              ? {
                  ...topic,
                  categoryId: rootCategoryId,
                }
              : topic,
          ),
        )

        if (removedCategoryIds.has(selectedCategoryId)) {
          setSelectedCategoryId('all')
        }
      }

      setSuccessMessage('Category deleted successfully. Topics moved to /.')
      setPendingDeleteCategoryId(null)
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to delete category.')
    } finally {
      setIsDeletingCategory(false)
    }
  }

  const isCreateTopicDisabled =
    isCreatingTopic ||
    topicDraft.name.trim().length === 0 ||
    topicDraft.categoryId.trim().length === 0 ||
    topicDraft.description.trim().length === 0

  const isSaveCategoryDisabled =
    isSavingCategory ||
    categoryDraft.name.trim().length === 0 ||
    categoryDraft.parentId.trim().length === 0

  return (
    <>
      <Page
        title="Topics"
        description="Topics guide conversations, helping the AI Agent understand intent and respond appropriately."
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
        <Stack spacing={1.5} sx={{ mt: -1 }}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button variant="contained" onClick={handleOpenTopicDrawer} disabled={loading}>
              New Topic
            </Button>
            <TextField
              size="small"
              placeholder="Search topic"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              sx={{
                width: { xs: '100%', sm: 260 },
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'common.white',
                },
              }}
              InputProps={{
                startAdornment: <SearchOutlinedIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Stack>

          <Stack
            ref={layoutRef}
            direction={{ xs: 'column', lg: 'row' }}
            alignItems="stretch"
            sx={{
              columnGap: { xs: 0, lg: 0.5 },
              rowGap: 1.75,
              userSelect: isResizing ? 'none' : 'auto',
            }}
          >
            <Card
              sx={{
                width: { xs: '100%', lg: categoryPanelWidth },
                flexShrink: 0,
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Categories
                  </Typography>
                  <Stack spacing={0.35}>
                    {categoryTree.map((node) => (
                      <TopicTreeItem
                        key={node.id}
                        node={node}
                        parentId={undefined}
                        selectedCategoryId={selectedCategoryId}
                        expandedCategoryIds={expandedCategoryIds}
                        onSelect={setSelectedCategoryId}
                        onToggle={handleToggleCategory}
                        onCreateCategory={handleOpenCreateCategoryDrawer}
                        onEditCategory={handleOpenEditCategoryDrawer}
                        onDeleteCategory={setPendingDeleteCategoryId}
                      />
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Box
              onMouseDown={() => setIsResizing(true)}
              sx={{
                display: { xs: 'none', lg: 'flex' },
                width: 8,
                flexShrink: 0,
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'col-resize',
                color: isResizing ? 'text.primary' : 'text.secondary',
              }}
            >
              <Stack spacing={0.35} alignItems="center">
                <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'currentColor' }} />
                <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'currentColor' }} />
                <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'currentColor' }} />
              </Stack>
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <DataTable
                rows={visibleRows}
                nameHeader="Name"
                secondaryHeader="Answer Type"
                showDelete={!loading}
                onEdit={(row) =>
                  navigate(appRoutes.ai.aiAgentTopicEdit(row.id, resolvedAiAgentId))
                }
                onDelete={(row) => setPendingDeleteTopic(row)}
                emptyStateMessage={
                  loading ? 'Loading topics...' : 'No topics are available for this AI agent.'
                }
                footer={
                  <Box
                    sx={{
                      px: 2,
                      py: 1.25,
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Rows per page: 50&nbsp;&nbsp;&nbsp; {visibleRows.length === 0 ? '0-0' : `1-${visibleRows.length}`} of {visibleRows.length}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Stack>
        </Stack>
      </Page>
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
      <SideDrawer
        open={isTopicDrawerOpen}
        onClose={handleCloseTopicDrawer}
        title="New Topic"
        width={{ xs: '100%', sm: 560 }}
      >
        <Stack spacing={2.5}>
          <Box>
            <TextField
              fullWidth
              label="Name *"
              value={topicDraft.name}
              onChange={(event) =>
                setTopicDraft((current) => ({ ...current, name: event.target.value }))
              }
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75, lineHeight: 1.5 }}
            >
              Use clear and specific topic names like &apos;Retrieve Password&apos; or
              &apos;Check Order&apos;.
            </Typography>
          </Box>

          <TextField
            select
            fullWidth
            label="Category *"
            value={topicDraft.categoryId}
            onChange={(event) =>
              setTopicDraft((current) => ({ ...current, categoryId: event.target.value }))
            }
          >
            {topicCategoryOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Description *"
            value={topicDraft.description}
            onChange={(event) =>
              setTopicDraft((current) => ({ ...current, description: event.target.value }))
            }
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              disabled={isCreateTopicDisabled}
              onClick={handleCreateTopic}
            >
              Create
            </Button>
            <Button variant="outlined" onClick={handleCloseTopicDrawer} disabled={isCreatingTopic}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </SideDrawer>
      <SideDrawer
        open={categoryDrawerMode !== null}
        onClose={handleCloseCategoryDrawer}
        title={categoryDrawerMode === 'edit' ? 'Edit Category' : 'New Category'}
        width={{ xs: '100%', sm: 560 }}
      >
        <CategoryForm
          values={categoryDraft}
          parentOptions={categoryFormOptions}
          onChange={setCategoryDraft}
          onSubmit={handleSaveCategory}
          onCancel={handleCloseCategoryDrawer}
          isSubmitDisabled={isSaveCategoryDisabled}
        />
      </SideDrawer>
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessMessage(null)}
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={Boolean(pendingDeleteTopic)}
        onClose={handleCloseDeleteTopicDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Topic?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {pendingDeleteTopic ? (
              <>
                Are you sure you want to delete <strong>{pendingDeleteTopic.content}</strong>?
                This action cannot be undone.
              </>
            ) : null}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            variant="outlined"
            onClick={handleCloseDeleteTopicDialog}
            disabled={isDeletingTopic}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDeleteTopic}
            disabled={isDeletingTopic}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(pendingDeleteCategory)}
        onClose={handleCloseDeleteCategoryDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Category?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {pendingDeleteCategory ? (
              <>
                Are you sure you want to delete <strong>{pendingDeleteCategory.label}</strong>?
                Nested topics will be moved to <strong>/</strong>.
              </>
            ) : null}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            variant="outlined"
            onClick={handleCloseDeleteCategoryDialog}
            disabled={isDeletingCategory}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDeleteCategory}
            disabled={isDeletingCategory}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TopicsPage
