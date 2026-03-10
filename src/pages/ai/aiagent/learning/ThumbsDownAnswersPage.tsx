import { Typography } from '@mui/material'
import {
  type InstructionTableColumn,
} from '../../../../components/common/DataTable'
import LearningReviewTablePage from '../../../../components/learning/LearningReviewTablePage'
import { thumbsDownAnswerRows, type ThumbsDownAnswerRow } from '../../../../data/dashboard'

const thumbsDownAnswerColumns: InstructionTableColumn<ThumbsDownAnswerRow>[] = [
  {
    key: 'question',
    header: 'Question',
    width: '24%',
    sortAccessor: (row) => row.content,
    render: (row) => <Typography variant="body2">{row.content}</Typography>,
  },
  {
    key: 'answer',
    header: 'Answer',
    width: '36%',
    sortAccessor: (row) => row.answer,
    render: (row) => (
      <Typography variant="body2" color="text.secondary">
        {row.answer}
      </Typography>
    ),
  },
  {
    key: 'channel',
    header: 'Channel',
    width: 110,
    sortAccessor: (row) => row.channel,
    render: (row) => <Typography variant="body2">{row.channel}</Typography>,
  },
  {
    key: 'origin',
    header: 'Origin',
    width: 110,
    sortAccessor: (row) => row.origin,
    render: (row) => <Typography variant="body2">{row.origin}</Typography>,
  },
  {
    key: 'createdTime',
    header: 'Created Time',
    width: 180,
    sortAccessor: (row) => row.createdAt,
    render: (row) => <Typography variant="body2">{row.createdTime}</Typography>,
  },
]

function ThumbsDownAnswersPage() {
  return (
    <LearningReviewTablePage
      title="Thumbs Down Answers"
      description="Answers marked thumbs down by customers appear here. You can review these cases to understand why they were unhelpful and improve future responses."
      rows={thumbsDownAnswerRows}
      columns={thumbsDownAnswerColumns}
      searchPlaceholder="Search question"
      getSearchText={(row) =>
        `${row.content} ${row.answer} ${row.channel} ${row.origin}`
      }
      getDateValue={(row) => row.createdAt}
      emptyStateMessage="No thumbs down answers found."
    />
  )
}

export default ThumbsDownAnswersPage
