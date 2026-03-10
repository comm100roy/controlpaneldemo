import { useMemo, useState, type ReactNode } from 'react'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import { Box, Button, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material'
import dayjs, { type Dayjs } from 'dayjs'
import DataTable, {
  type InstructionRow,
  type InstructionTableColumn,
} from '../common/DataTable'
import Page from '../common/Page'

type DateFilterValue = Dayjs | Date | string | null | undefined
type DateRangeValue = [Dayjs | null, Dayjs | null]

type LearningReviewTablePageProps<Row extends InstructionRow> = {
  title: string
  description: string
  rows: Row[]
  columns: InstructionTableColumn<Row>[]
  searchPlaceholder: string
  footerLinkText?: string
  getSearchText: (row: Row) => string
  getDateValue: (row: Row) => DateFilterValue
  onEdit?: (row: Row) => void
  emptyStateMessage?: ReactNode
  showOperations?: boolean
}

const defaultDateRange: DateRangeValue = [dayjs('2026-02-08'), dayjs('2026-03-09')]

function LearningReviewTablePage<Row extends InstructionRow>({
  title,
  description,
  rows,
  columns,
  searchPlaceholder,
  footerLinkText,
  getSearchText,
  getDateValue,
  onEdit,
  emptyStateMessage,
  showOperations = false,
}: LearningReviewTablePageProps<Row>) {
  const [searchValue, setSearchValue] = useState('')
  const [dateRange, setDateRange] = useState<DateRangeValue>(defaultDateRange)

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()
    const [startDate, endDate] = dateRange

    return rows.filter((row) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        getSearchText(row).toLowerCase().includes(normalizedSearch)

      const rowDate = dayjs(getDateValue(row))
      const hasValidRowDate = rowDate.isValid()
      const matchesStartDate =
        !startDate || !hasValidRowDate || !rowDate.isBefore(startDate.startOf('day'))
      const matchesEndDate =
        !endDate || !hasValidRowDate || !rowDate.isAfter(endDate.endOf('day'))

      return matchesSearch && matchesStartDate && matchesEndDate
    })
  }, [dateRange, getDateValue, getSearchText, rows, searchValue])

  const paginationLabel = useMemo(() => {
    if (filteredRows.length === 0) {
      return 'Rows per page: 50   0-0 of 0'
    }

    return `Rows per page: 50   1-${filteredRows.length} of ${filteredRows.length}`
  }, [filteredRows.length])

  return (
    <Page title={title} description={description}>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', lg: 'center' }}
        spacing={2}
        sx={{ mt: -1 }}
      >
        <Button
          variant="outlined"
          startIcon={<DownloadOutlinedIcon />}
          sx={{ alignSelf: { xs: 'flex-start', lg: 'center' } }}
        >
          Export
        </Button>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
              format="YYYY/MM/DD"
              slotProps={{
                field: {
                  dateSeparator: ' — ',
                },
                textField: {
                  size: 'small',
                  sx: {
                    minWidth: { xs: '100%', md: 260 },
                    '& .MuiPickersOutlinedInput-root': {
                      bgcolor: 'common.white',
                      borderRadius: 1,
                      height: 40,
                    },
                    '& .MuiPickersSectionList-root': {
                      fontSize: 13,
                      minHeight: 40,
                      alignItems: 'center',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            sx={{
              minWidth: { xs: '100%', md: 240 },
              '& .MuiOutlinedInput-root': {
                bgcolor: 'common.white',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>

      <DataTable
        rows={filteredRows}
        columns={columns}
        onEdit={onEdit}
        showDelete={false}
        showOperations={showOperations}
        emptyStateMessage={emptyStateMessage}
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
              {paginationLabel}
            </Typography>
          </Box>
        }
      />

      {footerLinkText ? (
        <Link component="button" type="button" underline="hover" sx={{ alignSelf: 'flex-start' }}>
          {footerLinkText}
        </Link>
      ) : null}
    </Page>
  )
}

export default LearningReviewTablePage
