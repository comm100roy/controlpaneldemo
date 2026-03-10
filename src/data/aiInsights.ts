export type SpotlightCampaign = {
  id: string
  name: string
}

export type SpotlightDefinition = {
  id: string
  name: string
  description: string
  channels: number
  updatedBy: string
  campaigns: SpotlightCampaign[]
}

export type SpotlightFormValues = {
  name: string
  description: string
}

export const spotlightDefinitions: SpotlightDefinition[] = [
  {
    id: 'abnormal-chat',
    name: 'Abnormal Chat',
    description: 'can not get any useful info from the chat or donot know want the visitor want to...',
    channels: 2,
    updatedBy: 'Agent Terry',
    campaigns: [
      { id: 'jacktest', name: 'jacktest' },
      { id: '55-terry-campaign', name: '55 Terry Campaign' },
    ],
  },
  {
    id: 'angry-customer',
    name: 'Angry Customer',
    description:
      'Client or user who expresses frustration, dissatisfaction, or annoyance during a...',
    channels: 2,
    updatedBy: 'Agent Terry',
    campaigns: [
      { id: 'frustration-watch', name: 'Frustration Watch' },
      { id: 'vip-follow-up', name: 'VIP Follow-up' },
    ],
  },
  {
    id: 'churn-risk',
    name: 'Churn Risk',
    description:
      'Customers expressing frustration or dissatisfaction, indicating a likelihood of...',
    channels: 3,
    updatedBy: 'Agent Terry',
    campaigns: [
      { id: 'retention-save', name: 'Retention Save' },
      { id: 'renewal-check-in', name: 'Renewal Check-in' },
      { id: 'high-value-risk', name: 'High Value Risk' },
    ],
  },
  {
    id: 'escalation',
    name: 'Escalation',
    description: 'Agent escalated this chat to senior support.',
    channels: 3,
    updatedBy: '',
    campaigns: [
      { id: 'senior-support', name: 'Senior Support' },
      { id: 'escalation-monitor', name: 'Escalation Monitor' },
      { id: 'supervisor-review', name: 'Supervisor Review' },
    ],
  },
  {
    id: 'installation-issue',
    name: 'Installation Issue',
    description:
      'Customer or visitor has problems or challenges encountered during the setup or...',
    channels: 2,
    updatedBy: 'Agent Terry',
    campaigns: [
      { id: 'onboarding-help', name: 'Onboarding Help' },
      { id: 'install-troubleshooting', name: 'Install Troubleshooting' },
    ],
  },
  {
    id: 'mark-test-spotlight',
    name: 'Mark Test Spotlight',
    description: '1',
    channels: 1,
    updatedBy: '1 1',
    campaigns: [{ id: 'mark-test', name: 'Mark Test' }],
  },
  {
    id: 'sales-opportunity',
    name: 'Sales Opportunity',
    description: 'Customers showing strong interest in purchasing, requiring personalized offers.',
    channels: 3,
    updatedBy: '',
    campaigns: [
      { id: 'upsell-opportunity', name: 'Upsell Opportunity' },
      { id: 'sales-demo', name: 'Sales Demo' },
      { id: 'pricing-follow-up', name: 'Pricing Follow-up' },
    ],
  },
]

export const emptySpotlightFormValues: SpotlightFormValues = {
  name: '',
  description: '',
}
