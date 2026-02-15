'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Briefcase,
  FileText,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Building2,
  User,
  MapPin,
  Bot,
  X,
  Sparkles,
  Banknote,
  FileSignature,
  Send,
  ChevronDown,
  ChevronUp,
  Copy,
  RefreshCw,
} from 'lucide-react'
import { classifyBusiness, generateDocuments, chatWithAI, type BusinessDetails, type ClassificationResult } from '@/lib/api'

const US_STATES = [
  { value: 'DE', label: 'Delaware' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'NV', label: 'Nevada' },
  { value: 'TX', label: 'Texas' },
  { value: 'FL', label: 'Florida' },
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'CO', label: 'Colorado' },
]

const ENTITY_TYPES = [
  { value: 'LLC', label: 'LLC - Limited Liability Company', description: 'Best for flexibility and liability protection' },
  { value: 'C-Corp', label: 'C Corporation', description: 'Best for raising venture capital' },
  { value: 'S-Corp', label: 'S Corporation', description: 'Best for tax flexibility with pass-through taxation' },
]

interface AISuggestion {
  field: string
  value: string
  confidence: number
  explanation: string
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [classification, setClassification] = useState<ClassificationResult | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false)

  const [companyDetails, setCompanyDetails] = useState({
    companyName: '',
    companyPurpose: '',
    principalAddress: '',
    city: '',
    state: '',
    zipCode: '',
    entityType: searchParams.get('type')?.toUpperCase() || 'LLC',
    email: '',
    phone: '',
  })

  const [directors, setDirectors] = useState([
    { firstName: '', lastName: '', title: '', email: '', address: '' }
  ])

  const [shareholders, setShareholders] = useState([
    { firstName: '', lastName: '', shares: 100, class: 'Common' }
  ])

  const [registeredAgent, setRegisteredAgent] = useState({
    sameAsPrincipal: true,
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: '',
  })

  const [taxBanking, setTaxBanking] = useState({
    ein: '',
    sCorpElection: false,
    bankAccount: false,
    paymentProcessor: '',
  })

  const steps = [
    { number: 1, title: 'Company Details', description: 'Basic information about your company', icon: Building2 },
    { number: 2, title: 'Directors & Officers', description: 'Who manages the company', icon: User },
    { number: 3, title: 'Shareholders', description: 'Company ownership', icon: Briefcase },
    { number: 4, title: 'Registered Agent', description: 'Legal representative', icon: MapPin },
    { number: 5, title: 'Tax & Banking', description: 'EIN and banking setup', icon: Banknote },
    { number: 6, title: 'Review & Sign', description: 'Final review and signing', icon: FileSignature },
  ]

  const totalSteps = steps.length

  const generateAISuggestions = async (step: number) => {
    setGeneratingSuggestions(true)
    setShowSuggestions(true)

    let prompt = ''
    switch (step) {
      case 1:
        prompt = `For a ${companyDetails.entityType} company called "${companyDetails.companyName}" with purpose "${companyDetails.companyPurpose}", suggest: 1) A concise company purpose statement (50 words), 2) Recommended principal address format, 3) Best state for formation based on ${companyDetails.companyPurpose || 'general business'}. Return as JSON with fields: purpose_statement, address_format, recommended_state.`
        break
      case 2:
        prompt = `For a ${companyDetails.entityType} company, suggest appropriate director titles and responsibilities. Return 3 common director positions with titles and brief descriptions as JSON.`
        break
      case 3:
        prompt = `For a ${companyDetails.entityType} with ${directors.length} director(s), suggest a fair shareholder structure. Return suggested shares for 1-2 founders as JSON with class and percentage.`
        break
      default:
        prompt = `Provide helpful tips for this step of business formation.`
    }

    try {
      const response = await chatWithAI(prompt, `Step ${step}: ${steps[step - 1].title}`)
      const suggestionText = response.response

      const newSuggestions: AISuggestion[] = [
        {
          field: 'AI Tip',
          value: suggestionText.substring(0, 200) + '...',
          confidence: 95,
          explanation: 'Based on your inputs, here are AI-generated suggestions to help fill this form.',
        }
      ]
      setAiSuggestions(newSuggestions)
    } catch (error) {
      console.error('AI suggestions failed:', error)
    } finally {
      setGeneratingSuggestions(false)
    }
  }

  const applySuggestion = (suggestion: AISuggestion) => {
    switch (currentStep) {
      case 1:
        if (suggestion.field.includes('purpose') || suggestion.field.includes('Purpose')) {
          setCompanyDetails(prev => ({ ...prev, companyPurpose: suggestion.value }))
        }
        break
    }
    setShowSuggestions(false)
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage = { role: 'user', content: chatInput }
    setChatMessages((prev) => [...prev, userMessage])
    setChatInput('')
    setIsLoading(true)

    try {
      const context = `Current step: ${steps[currentStep - 1].title}. Company: ${companyDetails.companyName}, Entity: ${companyDetails.entityType}`
      const response = await chatWithAI(chatInput, context)
      setChatMessages((prev) => [...prev, { role: 'assistant', content: response.response }])
    } catch (error) {
      console.error('Chat failed:', error)
      setChatMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return companyDetails.companyName && companyDetails.entityType && companyDetails.email
      case 2:
        return directors.every(d => d.firstName && d.lastName && d.title)
      case 3:
        return shareholders.every(s => s.firstName && s.lastName && s.shares > 0)
      case 4:
        return registeredAgent.sameAsPrincipal || (registeredAgent.name && registeredAgent.address)
      case 5:
        return true
      case 6:
        return true
      default:
        return false
    }
  }

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsLoading(true)
      try {
        const details: BusinessDetails = {
          businessName: companyDetails.companyName,
          businessDescription: companyDetails.companyPurpose,
          entityType: companyDetails.entityType,
          owners: directors.map(d => ({ name: `${d.firstName} ${d.lastName}`, address: d.address, ownershipPercentage: 100 / directors.length })),
          registeredAgent,
          state: companyDetails.state,
          email: companyDetails.email,
        }
        await generateDocuments(details)
      } catch (error) {
        console.error('Generation failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BizFormAI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/')}>
              Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Start Your Company</h1>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          <div className="grid grid-cols-6 gap-2 mt-4">
            {steps.map((s) => {
              const Icon = s.icon
              const isActive = currentStep === s.number
              const isCompleted = currentStep > s.number

              return (
                <button
                  key={s.number}
                  onClick={() => currentStep > s.number && setCurrentStep(s.number)}
                  disabled={currentStep < s.number}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                    isActive ? 'bg-blue-50 border-2 border-blue-500' :
                    isCompleted ? 'bg-green-50 border-2 border-green-500 cursor-pointer hover:border-green-600' :
                    'bg-gray-50 border-2 border-gray-200 opacity-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-medium text-center">{s.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Step 1: Company Details */}
            {currentStep === 1 && (
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Company Details
                  </CardTitle>
                  <CardDescription>
                    Tell us about your company. Our AI will help you complete this form.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        placeholder="e.g., Acme Technologies Inc."
                        value={companyDetails.companyName}
                        onChange={(e) => setCompanyDetails({ ...companyDetails, companyName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entityType">Entity Type *</Label>
                      <Select
                        value={companyDetails.entityType}
                        onValueChange={(value) => setCompanyDetails({ ...companyDetails, entityType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ENTITY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-muted-foreground">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyPurpose">Company Purpose *</Label>
                    <Textarea
                      id="companyPurpose"
                      placeholder="Describe what your company will do..."
                      className="min-h-[100px]"
                      value={companyDetails.companyPurpose}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, companyPurpose: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground">
                      Be specific. This appears in your formation documents.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="principalAddress">Principal Address</Label>
                    <Input
                      id="principalAddress"
                      placeholder="123 Main Street"
                      value={companyDetails.principalAddress}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, principalAddress: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="San Francisco"
                        value={companyDetails.city}
                        onChange={(e) => setCompanyDetails({ ...companyDetails, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select
                        value={companyDetails.state}
                        onValueChange={(value) => setCompanyDetails({ ...companyDetails, state: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="94102"
                        value={companyDetails.zipCode}
                        onChange={(e) => setCompanyDetails({ ...companyDetails, zipCode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="founder@company.com"
                        value={companyDetails.email}
                        onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={companyDetails.phone}
                        onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => generateAISuggestions(1)}
                    disabled={generatingSuggestions}
                    className="w-full"
                  >
                    {generatingSuggestions ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Get AI Help for This Step
                  </Button>

                  {showSuggestions && aiSuggestions.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-purple-700">AI Suggestions</span>
                      </div>
                      <div className="space-y-2">
                        {aiSuggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Checkbox
                              id={`suggestion-${index}`}
                              onCheckedChange={() => applySuggestion(suggestion)}
                            />
                            <div>
                              <Label htmlFor={`suggestion-${index}`} className="font-medium">
                                {suggestion.field}
                              </Label>
                              <p className="text-sm text-muted-foreground">{suggestion.explanation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Directors & Officers */}
            {currentStep === 2 && (
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Directors & Officers
                  </CardTitle>
                  <CardDescription>
                    Add people who will manage your company. You need at least 1 director.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {directors.map((director, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Director {index + 1}
                        </h4>
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newDirectors = [...directors]
                              newDirectors.splice(index, 1)
                              setDirectors(newDirectors)
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>First Name *</Label>
                          <Input
                            placeholder="John"
                            value={director.firstName}
                            onChange={(e) => {
                              const newDirectors = [...directors]
                              newDirectors[index].firstName = e.target.value
                              setDirectors(newDirectors)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name *</Label>
                          <Input
                            placeholder="Doe"
                            value={director.lastName}
                            onChange={(e) => {
                              const newDirectors = [...directors]
                              newDirectors[index].lastName = e.target.value
                              setDirectors(newDirectors)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title *</Label>
                          <Select
                            value={director.title}
                            onValueChange={(value) => {
                              const newDirectors = [...directors]
                              newDirectors[index].title = value
                              setDirectors(newDirectors)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select title" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="President">President</SelectItem>
                              <SelectItem value="Secretary">Secretary</SelectItem>
                              <SelectItem value="Treasurer">Treasurer</SelectItem>
                              <SelectItem value="CEO">CEO</SelectItem>
                              <SelectItem value="CTO">CTO</SelectItem>
                              <SelectItem value="CFO">CFO</SelectItem>
                              <SelectItem value="Director">Director</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            placeholder="john@company.com"
                            value={director.email}
                            onChange={(e) => {
                              const newDirectors = [...directors]
                              newDirectors[index].email = e.target.value
                              setDirectors(newDirectors)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Address</Label>
                          <Input
                            placeholder="123 Main St, City, State"
                            value={director.address}
                            onChange={(e) => {
                              const newDirectors = [...directors]
                              newDirectors[index].address = e.target.value
                              setDirectors(newDirectors)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => setDirectors([...directors, { firstName: '', lastName: '', title: '', email: '', address: '' }])}
                  >
                    + Add Another Director
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => generateAISuggestions(2)}
                    disabled={generatingSuggestions}
                    className="w-full"
                  >
                    {generatingSuggestions ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Get AI Suggestions for Roles
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Shareholders */}
            {currentStep === 3 && (
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Shareholders
                  </CardTitle>
                  <CardDescription>
                    Define who owns the company and how many shares they hold.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {companyDetails.entityType === 'LLC' ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-amber-800">
                        <strong>Note:</strong> LLCs use "Members" instead of "Shareholders".
                        Your ownership percentages will be set based on the information provided in the next step.
                      </p>
                    </div>
                  ) : (
                    <>
                      {shareholders.map((shareholder, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              Shareholder {index + 1}
                            </h4>
                            {index > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newShareholders = [...shareholders]
                                  newShareholders.splice(index, 1)
                                  setShareholders(newShareholders)
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>First Name *</Label>
                              <Input
                                placeholder="John"
                                value={shareholder.firstName}
                                onChange={(e) => {
                                  const newShareholders = [...shareholders]
                                  newShareholders[index].firstName = e.target.value
                                  setShareholders(newShareholders)
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Last Name *</Label>
                              <Input
                                placeholder="Doe"
                                value={shareholder.lastName}
                                onChange={(e) => {
                                  const newShareholders = [...shareholders]
                                  newShareholders[index].lastName = e.target.value
                                  setShareholders(newShareholders)
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Shares *</Label>
                              <Input
                                type="number"
                                placeholder="100"
                                value={shareholder.shares}
                                onChange={(e) => {
                                  const newShareholders = [...shareholders]
                                  newShareholders[index].shares = parseInt(e.target.value) || 0
                                  setShareholders(newShareholders)
                                }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Share Class</Label>
                            <Select
                              value={shareholder.class}
                              onValueChange={(value) => {
                                const newShareholders = [...shareholders]
                                newShareholders[index].class = value
                                setShareholders(newShareholders)
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Common">Common Stock</SelectItem>
                                <SelectItem value="Preferred">Preferred Stock</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        onClick={() => setShareholders([...shareholders, { firstName: '', lastName: '', shares: 0, class: 'Common' }])}
                      >
                        + Add Another Shareholder
                      </Button>
                    </>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Ownership Summary</h4>
                    <div className="space-y-2">
                      {shareholders.map((s, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{s.firstName} {s.lastName || '(Unnamed)'}</span>
                          <span className="font-medium">{companyDetails.entityType === 'LLC' ? 'Member' : `${s.shares} shares`}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => generateAISuggestions(3)}
                    disabled={generatingSuggestions}
                    className="w-full"
                  >
                    {generatingSuggestions ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Get AI Suggestions for Equity
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Registered Agent */}
            {currentStep === 4 && (
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Registered Agent
                  </CardTitle>
                  <CardDescription>
                    Your registered agent receives legal documents on behalf of your company.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAsPrincipal"
                      checked={registeredAgent.sameAsPrincipal}
                      onCheckedChange={(checked) => setRegisteredAgent({ ...registeredAgent, sameAsPrincipal: checked as boolean })}
                    />
                    <Label htmlFor="sameAsPrincipal" className="font-medium">
                      Use principal address as registered agent address
                    </Label>
                  </div>

                  {!registeredAgent.sameAsPrincipal && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="agentName">Agent Name *</Label>
                        <Input
                          id="agentName"
                          placeholder="Agent or Company Name"
                          value={registeredAgent.name}
                          onChange={(e) => setRegisteredAgent({ ...registeredAgent, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="agentAddress">Agent Address *</Label>
                        <Input
                          id="agentAddress"
                          placeholder="123 Agent Street"
                          value={registeredAgent.address}
                          onChange={(e) => setRegisteredAgent({ ...registeredAgent, address: e.target.value })}
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>City</Label>
                          <Input
                            placeholder="Wilmington"
                            value={registeredAgent.city}
                            onChange={(e) => setRegisteredAgent({ ...registeredAgent, city: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>State</Label>
                          <Select
                            value={registeredAgent.state}
                            onValueChange={(value) => setRegisteredAgent({ ...registeredAgent, state: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {US_STATES.map((state) => (
                                <SelectItem key={state.value} value={state.value}>
                                  {state.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>ZIP Code</Label>
                          <Input
                            placeholder="19801"
                            value={registeredAgent.zipCode}
                            onChange={(e) => setRegisteredAgent({ ...registeredAgent, zipCode: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            placeholder="agent@service.com"
                            value={registeredAgent.email}
                            onChange={(e) => setRegisteredAgent({ ...registeredAgent, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={registeredAgent.phone}
                            onChange={(e) => setRegisteredAgent({ ...registeredAgent, phone: e.target.value })}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">Why do I need a registered agent?</h4>
                    <p className="text-sm text-green-700">
                      A registered agent is required by law to receive legal documents, tax notices, and official correspondence
                      on behalf of your business. They ensure you never miss important deadlines or lawsuits.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Tax & Banking */}
            {currentStep === 5 && (
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <Banknote className="w-5 h-5" />
                    Tax & Banking Setup
                  </CardTitle>
                  <CardDescription>
                    Set up your EIN and banking preferences. These can be done after incorporation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">EIN (Employer Identification Number)</h4>
                    <p className="text-sm text-blue-700 mb-4">
                      An EIN is like a Social Security Number for your business. It's required to open a bank account,
                      hire employees, and file taxes.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="needEin"
                        checked={!taxBanking.ein}
                        onCheckedChange={(checked) => setTaxBanking({ ...taxBanking, ein: !(checked as boolean) })}
                      />
                      <Label htmlFor="needEin">I'll apply for EIN myself after incorporation</Label>
                    </div>
                  </div>

                  {companyDetails.entityType === 'C-Corp' && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sCorpElection"
                          checked={taxBanking.sCorpElection}
                          onCheckedChange={(checked) => setTaxBanking({ ...taxBanking, sCorpElection: checked as boolean })}
                        />
                        <Label htmlFor="sCorpElection" className="font-medium">
                          File S-Corp Election (Form 2553)
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        S-Corp election can save you money on self-employment taxes. Requires all shareholders to consent.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bankAccount"
                        checked={taxBanking.bankAccount}
                        onCheckedChange={(checked) => setTaxBanking({ ...taxBanking, bankAccount: checked as boolean })}
                      />
                      <Label htmlFor="bankAccount" className="font-medium">
                        I need help opening a business bank account
                      </Label>
                    </div>
                    {taxBanking.bankAccount && (
                      <div className="ml-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-700">
                          After incorporation, you'll receive incorporation documents that you can use to open a bank account.
                          We recommend banks like Mercury, Chase, or Bank of America for startups.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentProcessor">Preferred Payment Processor (Optional)</Label>
                    <Select
                      value={taxBanking.paymentProcessor}
                      onValueChange={(value) => setTaxBanking({ ...taxBanking, paymentProcessor: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select processor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="none">Not needed yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 6: Review & Sign */}
            {currentStep === 6 && (
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <FileSignature className="w-5 h-5" />
                    Review & Sign
                  </CardTitle>
                  <CardDescription>
                    Review your information and sign the formation documents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Company Summary */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Company Information
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Company Name:</span> {companyDetails.companyName}</div>
                      <div><span className="text-muted-foreground">Entity Type:</span> {companyDetails.entityType}</div>
                      <div><span className="text-muted-foreground">State:</span> {companyDetails.state}</div>
                      <div><span className="text-muted-foreground">Email:</span> {companyDetails.email}</div>
                    </div>
                  </div>

                  {/* Directors Summary */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Directors & Officers ({directors.length})
                    </h4>
                    <div className="space-y-2">
                      {directors.map((d, i) => (
                        <div key={i} className="text-sm">
                          {d.firstName} {d.lastName} - {d.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Agent Summary */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Registered Agent
                    </h4>
                    <div className="text-sm">
                      {registeredAgent.sameAsPrincipal ? (
                        <span>Same as principal address</span>
                      ) : (
                        <span>{registeredAgent.name}, {registeredAgent.address}</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Next Steps:</strong> After submitting, you'll receive an email to electronically sign
                      the formation documents. Once signed, we'll file with the state. This typically takes 5-7 business days.
                    </p>
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit & File <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
              >
                {currentStep === totalSteps ? 'Complete' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bot className="w-5 h-5 text-purple-600" />
                  AI Formation Assistant
                </CardTitle>
                <CardDescription className="text-xs">
                  Ask me anything about forming your company
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-64 overflow-y-auto p-3 space-y-3">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-4">
                      <Bot className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Hi! I'm here to help you with your business formation. Ask me anything!
                      </p>
                      <div className="mt-3 space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => {
                            setChatInput('What is an LLC?')
                            handleSendMessage()
                          }}
                        >
                          What is an LLC?
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => {
                            setChatInput('Which state should I incorporate in?')
                            handleSendMessage()
                          }}
                        >
                          Which state is best?
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => {
                            setChatInput('What documents do I need?')
                            handleSendMessage()
                          }}
                        >
                          What documents do I need?
                        </Button>
                      </div>
                    </div>
                  ) : (
                    chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-lg text-sm ${
                          msg.role === 'user'
                            ? 'bg-blue-100 ml-4'
                            : 'bg-gray-100 mr-4'
                        }`}
                      >
                        {msg.content}
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="bg-gray-100 p-2 rounded-lg mr-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  )}
                </div>
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask a question..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="text-sm"
                    />
                    <Button size="sm" onClick={handleSendMessage} disabled={isLoading}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="mt-4 shadow-lg">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">Delaware is popular</p>
                  <p className="text-xs text-blue-700">Many startups incorporate in Delaware for favorable laws.</p>
                </div>
                <div className="text-sm p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-800">LLC vs Corporation</p>
                  <p className="text-xs text-green-700">LLCs are simpler; Corps are better for VC funding.</p>
                </div>
                <div className="text-sm p-3 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-800">EIN is free</p>
                  <p className="text-xs text-purple-700">You can get an EIN for free from the IRS website.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  )
}
