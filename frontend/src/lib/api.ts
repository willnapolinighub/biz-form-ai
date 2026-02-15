const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL

export interface BusinessDetails {
  businessName: string
  businessDescription: string
  entityType: string
  owners: {
    name: string
    address: string
    ownershipPercentage: number
  }[]
  registeredAgent: {
    name: string
    address: string
  }
  state: string
  email: string
}

export interface ClassificationResult {
  naics_code: string
  entity_recommendation: string
  required_licenses: string[]
  tax_estimate: number
  is_available: boolean
  reason?: string
}

export interface DocumentResult {
  success: boolean
  documents: {
    articles_of_organization?: string
    operating_agreement?: string
    ein_application?: string
  }
  filing_status: string
}

export async function classifyBusiness(
  businessName: string,
  businessDescription: string
): Promise<ClassificationResult> {
  const response = await fetch(`${N8N_WEBHOOK_URL}/business-classify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      business_name: businessName,
      business_description: businessDescription,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to classify business')
  }

  return response.json()
}

export async function checkNameAvailability(
  businessName: string,
  state: string
): Promise<{ available: boolean; reason?: string }> {
  const response = await fetch(`${N8N_WEBHOOK_URL}/check-name`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: businessName,
      state: state,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to check name availability')
  }

  return response.json()
}

export async function generateDocuments(
  details: BusinessDetails
): Promise<DocumentResult> {
  const response = await fetch(`${N8N_WEBHOOK_URL}/generate-docs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(details),
  })

  if (!response.ok) {
    throw new Error('Failed to generate documents')
  }

  return response.json()
}

export async function submitFiling(
  details: BusinessDetails
): Promise<{ success: boolean; filing_id?: string }> {
  const response = await fetch(`${N8N_WEBHOOK_URL}/submit-filing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(details),
  })

  if (!response.ok) {
    throw new Error('Failed to submit filing')
  }

  return response.json()
}

export async function chatWithAI(
  message: string,
  context?: string
): Promise<{ response: string }> {
  const response = await fetch(`${N8N_WEBHOOK_URL}/chat-assistant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      context: context || 'business_formation',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get AI response')
  }

  return response.json()
}
