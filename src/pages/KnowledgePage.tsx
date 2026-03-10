import { useMemo, useState, type MouseEvent } from 'react'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined'
import ScienceIcon from '@mui/icons-material/Science'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined'
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import {
  Box,
  ButtonBase,
  Button,
  Divider,
  Link,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import NewFileContentDrawer from '../components/knowledge/NewFileContentDrawer'
import NewKbArticleContentDrawer from '../components/knowledge/NewKbArticleContentDrawer'
import NewSnippetContentDrawer from '../components/knowledge/NewSnippetContentDrawer'
import NewWebpageContentDrawer from '../components/knowledge/NewWebpageContentDrawer'
import Page from '../components/common/Page'
import TestChatDrawer from '../components/common/TestChatDrawer'
import DataTable, {
  type InstructionTableBatchAction,
  type InstructionTableColumn,
} from '../components/common/DataTable'
import StatsGrid from '../components/dashboard/StatsGrid'
import { knowledgeRows as initialKnowledgeRows, type KnowledgeRow } from '../data/dashboard'

function KnowledgePage() {
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const [newContentAnchorEl, setNewContentAnchorEl] = useState<HTMLElement | null>(null)
  const [isNewFileDrawerOpen, setIsNewFileDrawerOpen] = useState(false)
  const [isNewKbArticleDrawerOpen, setIsNewKbArticleDrawerOpen] = useState(false)
  const [isNewSnippetDrawerOpen, setIsNewSnippetDrawerOpen] = useState(false)
  const [isNewWebpageDrawerOpen, setIsNewWebpageDrawerOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('All')
  const [searchValue, setSearchValue] = useState('')
  const [rows, setRows] = useState<KnowledgeRow[]>(initialKnowledgeRows)

  const newContentOptions = [
    {
      label: 'Webpage',
      description: 'Support inputting URL to import associated webpages',
      icon: <PublicOutlinedIcon sx={{ color: '#546e7a', fontSize: 27 }} />,
    },
    {
      label: 'KB Article',
      description: 'Supported products: Comm100 KB, Confluence Cloud, ServiceNow',
      icon: <MenuBookOutlinedIcon sx={{ color: '#546e7a', fontSize: 26 }} />,
    },
    {
      label: 'Cloud File',
      description: 'Supported products: SharePoint Online, Google Drive',
      icon: <CloudOutlinedIcon sx={{ color: '#546e7a', fontSize: 27 }} />,
    },
    {
      label: 'File',
      description: 'Supported formats: docx, html, md, pdf, txt',
      icon: <DescriptionOutlinedIcon sx={{ color: '#546e7a', fontSize: 27 }} />,
    },
    {
      label: 'Snippet',
      description: 'Q&A pairs that support editing',
      icon: <EditNoteOutlinedIcon sx={{ color: '#546e7a', fontSize: 27 }} />,
    },
  ] as const

  const isNewContentPopoverOpen = Boolean(newContentAnchorEl)

  const handleOpenNewContentPopover = (event: MouseEvent<HTMLElement>) => {
    setNewContentAnchorEl(event.currentTarget)
  }

  const handleCloseNewContentPopover = () => {
    setNewContentAnchorEl(null)
  }

  const handleSelectNewContentOption = (optionLabel: (typeof newContentOptions)[number]['label']) => {
    handleCloseNewContentPopover()

    if (optionLabel === 'Webpage') {
      setIsNewWebpageDrawerOpen(true)
      return
    }

    if (optionLabel === 'KB Article') {
      setIsNewKbArticleDrawerOpen(true)
      return
    }

    if (optionLabel === 'File') {
      setIsNewFileDrawerOpen(true)
      return
    }

    if (optionLabel === 'Snippet') {
      setIsNewSnippetDrawerOpen(true)
    }
  }

  const stats = useMemo(
    () => [
      { label: 'Webpages', value: 0, caption: 'from 0 Websites' },
      { label: 'KB articles', value: 0, caption: 'from 0 KBs' },
      { label: 'Files', value: rows.filter((row) => row.type === 'File').length },
      { label: 'Snippet', value: rows.filter((row) => row.type === 'Snippet').length },
    ],
    [rows],
  )

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesType = selectedType === 'All' || row.type === selectedType
      const matchesSearch =
        searchValue.trim().length === 0 ||
        row.content.toLowerCase().includes(searchValue.trim().toLowerCase())

      return matchesType && matchesSearch
    })
  }, [rows, searchValue, selectedType])

  const columns: InstructionTableColumn<KnowledgeRow>[] = [
    {
      key: 'title',
      header: 'Title',
      sortAccessor: (row) => row.content,
      render: (row) => {
        const icon =
          row.fileKind === 'txt' ? (
            <DescriptionOutlinedIcon sx={{ color: 'text.secondary' }} fontSize="small" />
          ) : row.fileKind === 'pdf' ? (
            <PictureAsPdfOutlinedIcon sx={{ color: 'text.secondary' }} fontSize="small" />
          ) : (
            <NotesOutlinedIcon sx={{ color: 'text.secondary' }} fontSize="small" />
          )

        return (
          <Stack direction="row" spacing={1} alignItems="center">
            {icon}
            <Link href="#" underline="hover" color="primary.main" sx={{ fontSize: 14 }}>
              {row.content}
            </Link>
          </Stack>
        )
      },
    },
    {
      key: 'enabled',
      header: 'Enable',
      width: 88,
      sortAccessor: (row) => row.enabled,
      render: (row) => (
        <Box
          sx={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            bgcolor: row.enabled ? '#2db64d' : '#bdbdbd',
            mx: 'auto',
          }}
        />
      ),
      align: 'center',
    },
    {
      key: 'type',
      header: 'Type',
      width: 120,
      sortAccessor: (row) => row.type,
      render: (row) => (
        <Typography variant="body2" color="text.primary">
          {row.type}
        </Typography>
      ),
    },
    {
      key: 'updatedTime',
      header: 'Updated Time',
      width: 200,
      sortAccessor: (row) => row.updatedTime,
      render: (row) => (
        <Typography variant="body2" color="text.primary">
          {row.updatedTime}
        </Typography>
      ),
    },
  ]

  const batchActions: InstructionTableBatchAction<KnowledgeRow>[] = [
    {
      key: 'enable',
      label: 'Enable',
      icon: <ToggleOnOutlinedIcon fontSize="small" />,
      onClick: (selectedRows) => {
        const selectedIds = selectedRows.map((row) => row.id)
        setRows((current) =>
          current.map((row) =>
            selectedIds.includes(row.id) ? { ...row, enabled: true } : row,
          ),
        )
      },
    },
    {
      key: 'disable',
      label: 'Disable',
      icon: <ToggleOffOutlinedIcon fontSize="small" />,
      onClick: (selectedRows) => {
        const selectedIds = selectedRows.map((row) => row.id)
        setRows((current) =>
          current.map((row) =>
            selectedIds.includes(row.id) ? { ...row, enabled: false } : row,
          ),
        )
      },
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlineOutlinedIcon fontSize="small" />,
      onClick: (selectedRows) => {
        const selectedIds = selectedRows.map((row) => row.id)
        setRows((current) => current.filter((row) => !selectedIds.includes(row.id)))
      },
    },
    {
      key: 'show-reference',
      label: 'Show in Reference',
      icon: <VisibilityOutlinedIcon fontSize="small" />,
      onClick: (selectedRows) => {
        const selectedIds = selectedRows.map((row) => row.id)
        setRows((current) =>
          current.map((row) =>
            selectedIds.includes(row.id) ? { ...row, showInReference: true } : row,
          ),
        )
      },
    },
    {
      key: 'hide-reference',
      label: 'Hide in Reference',
      icon: <VisibilityOffOutlinedIcon fontSize="small" />,
      onClick: (selectedRows) => {
        const selectedIds = selectedRows.map((row) => row.id)
        setRows((current) =>
          current.map((row) =>
            selectedIds.includes(row.id) ? { ...row, showInReference: false } : row,
          ),
        )
      },
    },
  ]

  return (
    <>
      <Page
        title="Knowledge"
        description="Data sources used to train your AI Agent for accurate and relevant responses."
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
        <StatsGrid title="Data Sources:" stats={stats} />

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: -1 }}>
          <Button variant="contained" onClick={handleOpenNewContentPopover}>
            New Content
          </Button>
          <Stack direction="row" spacing={1.5}>
            <TextField
              select
              size="small"
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              sx={{
                minWidth: 160,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'common.white',
                },
              }}
            >
              <MenuItem value="All">Type</MenuItem>
              <MenuItem value="File">File</MenuItem>
              <MenuItem value="Snippet">Snippet</MenuItem>
            </TextField>
            <TextField
              size="small"
              placeholder="Search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              sx={{
                width: 260,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'common.white',
                },
              }}
              InputProps={{
                startAdornment: <SearchOutlinedIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Stack>
        </Stack>

        <Popover
          open={isNewContentPopoverOpen}
          anchorEl={newContentAnchorEl}
          onClose={handleCloseNewContentPopover}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{
            paper: {
              sx: {
                mt: 0.5,
                width: 316,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                overflow: 'hidden',
              },
            },
          }}
        >
          <Stack divider={<Divider />}>
            {newContentOptions.map((option) => (
              <ButtonBase
                key={option.label}
                onClick={() => handleSelectNewContentOption(option.label)}
                sx={{
                  display: 'flex',
                  width: '100%',
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                  px: 1.75,
                  py: 1.5,
                  bgcolor: 'common.white',
                  '&:hover': {
                    bgcolor: '#f3f5f7',
                  },
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box sx={{ pt: 0.2, flexShrink: 0 }}>{option.icon}</Box>
                  <Stack spacing={0.25}>
                    <Typography
                      variant="body2"
                      sx={{ color: '#263238', fontWeight: 700, lineHeight: 1.25 }}
                    >
                      {option.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', lineHeight: 1.35, maxWidth: 238 }}
                    >
                      {option.description}
                    </Typography>
                  </Stack>
                </Stack>
              </ButtonBase>
            ))}
          </Stack>
        </Popover>

        <Box sx={{ mt: -1.5 }}>
          <DataTable
            rows={filteredRows}
            columns={columns}
            selectable
            showOperations={false}
            batchActions={batchActions}
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
                  Rows per page: 10&nbsp;&nbsp;&nbsp; 1-{filteredRows.length} of {filteredRows.length}
                </Typography>
              </Box>
            }
          />
        </Box>
      </Page>
      <NewWebpageContentDrawer
        open={isNewWebpageDrawerOpen}
        onClose={() => setIsNewWebpageDrawerOpen(false)}
      />
      <NewKbArticleContentDrawer
        open={isNewKbArticleDrawerOpen}
        onClose={() => setIsNewKbArticleDrawerOpen(false)}
      />
      <NewFileContentDrawer
        open={isNewFileDrawerOpen}
        onClose={() => setIsNewFileDrawerOpen(false)}
      />
      <NewSnippetContentDrawer
        open={isNewSnippetDrawerOpen}
        onClose={() => setIsNewSnippetDrawerOpen(false)}
      />
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
    </>
  )
}

export default KnowledgePage
