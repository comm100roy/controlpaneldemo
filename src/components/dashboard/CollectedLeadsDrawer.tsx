import { Typography } from '@mui/material'
import SideDrawer from '../common/SideDrawer'
import DataTable, {
  type InstructionRow,
  type InstructionTableColumn,
} from '../common/DataTable'

type CollectedLeadRow = InstructionRow & {
  email: string
  phone: string
  company: string
}

const collectedLeadColumns: InstructionTableColumn<CollectedLeadRow>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (row) => <Typography variant="body2">{row.content}</Typography>,
  },
  {
    key: 'email',
    header: 'Email',
    render: (row) => <Typography variant="body2">{row.email}</Typography>,
  },
  {
    key: 'phone',
    header: 'Phone',
    render: (row) => <Typography variant="body2">{row.phone}</Typography>,
  },
  {
    key: 'company',
    header: 'Company',
    render: (row) => <Typography variant="body2">{row.company}</Typography>,
  },
]

const collectedLeadRows: CollectedLeadRow[] = []

type CollectedLeadsDrawerProps = {
  open: boolean
  onClose: () => void
}

function CollectedLeadsDrawer({ open, onClose }: CollectedLeadsDrawerProps) {
  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      title="Collected Leads"
      width={{ xs: '100%', lg: 1024 }}
    >
      <DataTable
        rows={collectedLeadRows}
        columns={collectedLeadColumns}
        emptyStateMinHeight={380}
        showDelete={false}
      />
    </SideDrawer>
  )
}

export default CollectedLeadsDrawer
