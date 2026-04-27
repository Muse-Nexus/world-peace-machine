import { template as giftPrompt } from './gift-prompt.tsx'

// Registry of all transactional email templates available to send-transactional-email.
// Add new templates here.

export interface TemplateEntry {
  // React component to render (receives templateData as props)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any
  // Subject line — string, or function of templateData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subject: string | ((data: any) => string)
  // Optional friendly name shown in previews
  displayName?: string
  // Optional preview data used by preview-transactional-email
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previewData?: any
  // Optional default recipient (overridden by send call)
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  gift_prompt: giftPrompt,
}