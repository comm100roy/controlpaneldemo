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
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import Page from '../components/common/Page'
import SideDrawer from '../components/common/SideDrawer'
import CategoryForm, {
  type CategoryFormOption,
  type CategoryFormValues,
} from '../components/topics/CategoryForm'
import DataTable, {
  type InstructionRow,
} from '../components/dashboard/DataTable'
import TestChatDrawer from '../components/common/TestChatDrawer'
import {
  topicCategories,
  topicRows as initialTopicRows,
  type TopicCategory,
  type TopicRow,
} from '../data/dashboard'
import { appRoutes, resolveAiAgentId } from '../data/routes'

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
}

type TopicDraft = {
  name: string
  categoryId: string
  description: string
}

const createTopicDraft = (): TopicDraft => ({
  name: '',
  categoryId: 'root',
  description: '',
})

const cloneTopicCategories = (categories: TopicCategory[]): TopicCategory[] =>
  categories.map((category) => ({
    ...category,
    children: category.children ? cloneTopicCategories(category.children) : undefined,
  }))

const findCategoryById = (
  categories: TopicCategory[],
  categoryId: string,
  parentId?: string,
): { node: TopicCategory; parentId?: string } | null => {
  for (const category of categories) {
    if (category.id === categoryId) {
      return { node: category, parentId }
    }

    if (category.children?.length) {
      const match = findCategoryById(category.children, categoryId, category.id)
      if (match) {
        return match
      }
    }
  }

  return null
}

const collectCategoryIds = (category: TopicCategory): string[] => [
  category.id,
  ...(category.children?.flatMap(collectCategoryIds) ?? []),
]

const buildCategoryOptions = (
  categories: TopicCategory[],
  excludedIds: string[] = [],
  parentPath = '',
): CategoryFormOption[] =>
  categories.flatMap((category) => {
    if (category.id === 'all' || excludedIds.includes(category.id)) {
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
        ? buildCategoryOptions(category.children, excludedIds, currentPath)
        : []),
    ]
  })

const insertChildCategory = (
  categories: TopicCategory[],
  parentId: string,
  child: TopicCategory,
): TopicCategory[] =>
  categories.map((category) =>
    category.id === parentId
      ? {
          ...category,
          children: [...(category.children ?? []), child],
        }
      : {
          ...category,
          children: category.children
            ? insertChildCategory(category.children, parentId, child)
            : undefined,
        },
  )

const updateCategoryNode = (
  categories: TopicCategory[],
  categoryId: string,
  updater: (category: TopicCategory) => TopicCategory,
): TopicCategory[] =>
  categories.map((category) =>
    category.id === categoryId
      ? updater(category)
      : {
          ...category,
          children: category.children
            ? updateCategoryNode(category.children, categoryId, updater)
            : undefined,
        },
  )

const removeCategoryNode = (
  categories: TopicCategory[],
  categoryId: string,
): { removed?: TopicCategory; nextCategories: TopicCategory[] } => {
  let removedCategory: TopicCategory | undefined

  const nextCategories = categories
    .filter((category) => {
      if (category.id === categoryId) {
        removedCategory = category
        return false
      }

      return true
    })
    .map((category) => {
      if (!category.children?.length) {
        return category
      }

      const result = removeCategoryNode(category.children, categoryId)
      removedCategory = removedCategory ?? result.removed

      return {
        ...category,
        children: result.nextCategories,
      }
    })

  return {
    removed: removedCategory,
    nextCategories,
  }
}

const moveCategoryNode = (
  categories: TopicCategory[],
  categoryId: string,
  nextParentId: string,
): TopicCategory[] => {
  const { removed, nextCategories } = removeCategoryNode(categories, categoryId)

  if (!removed) {
    return categories
  }

  return insertChildCategory(nextCategories, nextParentId, removed)
}

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
}: TopicTreeItemProps) {
  const hasChildren = Boolean(node.children?.length)
  const isExpanded = expandedCategoryIds.includes(node.id)
  const isSelected = selectedCategoryId === node.id
  const isAllCategories = node.id === 'all'
  const isRootCategory = node.id === 'root'
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
  const navigate = useNavigate()
  const resolvedAiAgentId = resolveAiAgentId(aiAgentId)
  const layoutRef = useRef<HTMLDivElement | null>(null)
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>(['root'])
  const [categories, setCategories] = useState<TopicCategory[]>(() =>
    cloneTopicCategories(topicCategories),
  )
  const [rows, setRows] = useState<TopicRow[]>(initialTopicRows)
  const [categoryPanelWidth, setCategoryPanelWidth] = useState(220)
  const [isResizing, setIsResizing] = useState(false)
  const [isTopicDrawerOpen, setIsTopicDrawerOpen] = useState(false)
  const [topicDraft, setTopicDraft] = useState<TopicDraft>(createTopicDraft())
  const [categoryDrawerMode, setCategoryDrawerMode] = useState<CategoryDrawerMode>(null)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [categoryDraft, setCategoryDraft] = useState<CategoryFormValues>({
    name: '',
    parentId: 'root',
  })

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

  const visibleRows = useMemo(() => {
    return rows.filter((row) => {
      const inCategory = selectedCategoryId === 'all' || row.categoryId === selectedCategoryId
      const matchesSearch =
        searchValue.trim().length === 0 ||
        row.content.toLowerCase().includes(searchValue.trim().toLowerCase())

      return inCategory && matchesSearch
    })
  }, [rows, searchValue, selectedCategoryId])

  const topicCategoryOptions = useMemo(
    () => buildCategoryOptions(categories),
    [categories],
  )

  const categoryFormOptions = useMemo(() => {
    if (categoryDrawerMode !== 'edit' || !editingCategoryId) {
      return topicCategoryOptions
    }

    const editingCategory = findCategoryById(categories, editingCategoryId)
    if (!editingCategory) {
      return topicCategoryOptions
    }

    return buildCategoryOptions(categories, collectCategoryIds(editingCategory.node))
  }, [categories, categoryDrawerMode, editingCategoryId, topicCategoryOptions])

  const handleToggleCategory = (categoryId: string) => {
    setExpandedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    )
  }

  const handleDeleteTopic = (row: InstructionRow) => {
    setRows((current) => current.filter((item) => item.id !== row.id))
  }

  const handleOpenCreateCategoryDrawer = (parentId: string) => {
    setCategoryDrawerMode('create')
    setEditingCategoryId(null)
    setCategoryDraft({
      name: '',
      parentId,
    })
  }

  const handleOpenEditCategoryDrawer = (categoryId: string) => {
    const categoryMatch = findCategoryById(categories, categoryId)
    if (!categoryMatch) {
      return
    }

    setCategoryDrawerMode('edit')
    setEditingCategoryId(categoryId)
    setCategoryDraft({
      name: categoryMatch.node.label,
      parentId: categoryMatch.parentId ?? 'root',
    })
  }

  const handleCloseCategoryDrawer = () => {
    setCategoryDrawerMode(null)
    setEditingCategoryId(null)
  }

  const handleSaveCategory = () => {
    if (categoryDraft.name.trim().length === 0 || categoryDraft.parentId.trim().length === 0) {
      return
    }

    if (categoryDrawerMode === 'create') {
      const nextCategoryId = `category-${Date.now()}`
      setCategories((current) =>
        insertChildCategory(current, categoryDraft.parentId, {
          id: nextCategoryId,
          label: categoryDraft.name.trim(),
        }),
      )
      setExpandedCategoryIds((current) =>
        current.includes(categoryDraft.parentId)
          ? current
          : [...current, categoryDraft.parentId],
      )
      setSelectedCategoryId(nextCategoryId)
      handleCloseCategoryDrawer()
      return
    }

    if (!editingCategoryId) {
      return
    }

    const currentParentId = findCategoryById(categories, editingCategoryId)?.parentId ?? 'root'

    setCategories((current) => {
      const renamedCategories = updateCategoryNode(current, editingCategoryId, (category) => ({
        ...category,
        label: categoryDraft.name.trim(),
      }))

      if (categoryDraft.parentId === currentParentId) {
        return renamedCategories
      }

      return moveCategoryNode(renamedCategories, editingCategoryId, categoryDraft.parentId)
    })
    handleCloseCategoryDrawer()
  }

  const handleOpenTopicDrawer = () => {
    setTopicDraft(createTopicDraft())
    setIsTopicDrawerOpen(true)
  }

  const handleCloseTopicDrawer = () => {
    setIsTopicDrawerOpen(false)
  }

  const handleCreateTopic = () => {
    if (
      topicDraft.name.trim().length === 0 ||
      topicDraft.categoryId.trim().length === 0 ||
      topicDraft.description.trim().length === 0
    ) {
      return
    }

    const nextTopic: TopicRow = {
      id: `topic-${Date.now()}`,
      content: topicDraft.name.trim(),
      secondaryValue: 'Workflow',
      categoryId: topicDraft.categoryId,
    }

    setRows((current) => [nextTopic, ...current])
    setSelectedCategoryId(topicDraft.categoryId)
    setIsTopicDrawerOpen(false)
  }

  const isCreateTopicDisabled =
    topicDraft.name.trim().length === 0 ||
    topicDraft.categoryId.trim().length === 0 ||
    topicDraft.description.trim().length === 0

  const isSaveCategoryDisabled =
    categoryDraft.name.trim().length === 0 || categoryDraft.parentId.trim().length === 0

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
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: -1 }}>
          <Button variant="contained" onClick={handleOpenTopicDrawer}>
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
            mt: -1,
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
                  {categories.map((node) => (
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
              onEdit={(row) =>
                navigate(appRoutes.ai.aiAgentTopicEdit(row.id, resolvedAiAgentId))
              }
              onDelete={handleDeleteTopic}
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
                    Rows per page: 50&nbsp;&nbsp;&nbsp; 1-{visibleRows.length} of {visibleRows.length}
                  </Typography>
                </Box>
              }
            />
          </Box>
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
            <Button variant="outlined" onClick={handleCloseTopicDrawer}>
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
    </>
  )
}

export default TopicsPage
