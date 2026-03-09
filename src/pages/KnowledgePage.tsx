import { useMemo, useState } from 'react'
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
import {
  Box,
  Button,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Page from '../components/common/Page'
import TestChatDrawer from '../components/common/TestChatDrawer'
import InstructionTable, {
  type InstructionTableBatchAction,
  type InstructionTableColumn,
} from '../components/dashboard/InstructionTable'
import StatsGrid from '../components/dashboard/StatsGrid'
import { knowledgeRows as initialKnowledgeRows, type KnowledgeRow } from '../data/dashboard'

function KnowledgePage() {
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('All')
  const [searchValue, setSearchValue] = useState('')
  const [rows, setRows] = useState<KnowledgeRow[]>(initialKnowledgeRows)

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
          <Button variant="contained">New Content</Button>
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

        <Box sx={{ mt: -1.5 }}>
          <InstructionTable
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
      <TestChatDrawer
        open={isTestDrawerOpen}
        onClose={() => setIsTestDrawerOpen(false)}
      />
    </>
  )
}

export default KnowledgePage
