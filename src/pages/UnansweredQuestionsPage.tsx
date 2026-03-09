import LearningReviewTablePage from '../components/learning/LearningReviewTablePage'

function UnansweredQuestionsPage() {
  return (
    <LearningReviewTablePage
      title="Unanswered Question Groups"
      description="Visitor questions that AI Agent didn't recognize are listed here. You can add these questions to topics or snippets to help extend the AI Agent's knowledge."
      searchPlaceholder="Search"
      columns={[
        { key: 'questionGroup', label: 'Question Group' },
        { key: 'questions', label: 'Questions', width: 160 },
        { key: 'createdTime', label: 'Created Time', width: 180 },
        { key: 'operations', label: 'Operations', width: 120, align: 'right' },
      ]}
      footerLinkText='View unanswered question groups labeled as "Out of Scope."'
    />
  )
}

export default UnansweredQuestionsPage
