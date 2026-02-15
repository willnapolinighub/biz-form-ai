# BizFormAI - Automated Business Formation Platform

<p align="center">
  <img src="https://via.placeholder.com/400x100?text=BizFormAI" alt="BizFormAI Logo" />
</p>

<p align="center">
  AI-powered platform for automated business formation, document generation, and entity management
</p>

<p align="center">
  <a href="https://github.com/yourusername/bizform-ai/stargazers">
    <img src="https://img.shields.io/github/stars/yourusername/bizform-ai" alt="Stars" />
  </a>
  <a href="https://github.com/yourusername/bizform-ai/issues">
    <img src="https://img.shields.io/github/issues/yourusername/bizform-ai" alt="Issues" />
  </a>
  <a href="https://github.com/yourusername/bizform-ai/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/yourusername/bizform-ai" alt="License" />
  </a>
</p>

<p align="center">
  <img src="https://github.com/willnapolinighub/biz-form-ai/blob/main/banner-github-bizform-ai.png?raw=true" alt="BizFormAI Banner" />
</p>

## Overview

BizFormAI is a comprehensive platform that automates the business formation process using AI agents and workflow automation. Built with Next.js for the frontend and N8N for backend workflows, it provides an end-to-end solution for entrepreneurs to form LLCs, C-Corps, and S-Corps.
## Features

- **AI Business Classification**: Analyzes business descriptions to recommend optimal entity types
- **Automated Document Generation**: AI-powered drafting of Articles of Organization, Operating Agreements, and more
- **State Filing Automation**: Streamlined filing process with multiple state support
- **Real-time Chat Assistant**: AI-powered chatbot to answer business formation questions
- **Dashboard Management**: Track filing status and manage all your businesses
- **EIN Application Assistant**: Pre-fills IRS forms for quick EIN registration

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: N8N Workflow Automation, LangChain AI Agents
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4, LangChain
- **Document Generation**: PDFMonkey
- **Infrastructure**: Docker, GitHub Actions

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (for local development)
- An OpenAI API key
- A Supabase project

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bizform-ai.git
cd bizform-ai
```

### 2. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# N8N
N8N_USER=admin
N8N_PASSWORD=your-password
N8N_WEBHOOK_URL=http://localhost:5678

# OpenAI
OPENAI_API_KEY=sk-your-key

# Other keys...
```

### 3. Start Development Environment

Using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- Frontend at http://localhost:3000
- N8N at http://localhost:5678
- PostgreSQL at localhost:5432

### 4. Manual Setup (Alternative)

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

#### N8N Setup

```bash
# Using Docker
docker run -d --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=password \
  -e WEBHOOK_URL=http://localhost:5678 \
  n8nio/n8n
```

### 5. Import N8N Workflows

1. Open N8N at http://localhost:5678
2. Go to Workflows → Import from File
3. Import each workflow from `n8n/workflows/`:
   - `business-classification.json`
   - `document-generation.json`
   - `chat-assistant.json`

### 6. Database Setup

1. Create a new Supabase project or use local PostgreSQL
2. Run the migration script:

```bash
psql -h localhost -U youruser -d yourdb -f supabase/migrations/001_initial_schema.sql
```

Or use the Supabase CLI:

```bash
supabase db push
```

## Project Structure

```
bizform-ai/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities and API clients
│   ├── package.json
│   └── Dockerfile
├── n8n/                    # N8N workflow configurations
│   └── workflows/          # JSON workflow files
├── supabase/               # Database migrations
│   └── migrations/
├── .github/                # GitHub Actions workflows
│   └── workflows/
├── docker-compose.yml
└── README.md
```

## Usage

### Starting a New Business Formation

1. Visit http://localhost:3000
2. Click "Get Started" to access the formation wizard
3. Enter your business name and description
4. Review the AI's entity type recommendation
5. Add owner/member information
6. Complete the formation process

### Using the AI Chat Assistant

Click the chat icon in the bottom right corner to ask questions about:
- Business entity types
- Licensing requirements
- State formation processes
- Tax implications

## API Endpoints

The N8N instance provides these webhook endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/webhook/business-classify` | POST | Classify business and get recommendations |
| `/webhook/generate-docs` | POST | Generate formation documents |
| `/webhook/chat-assistant` | POST | Chat with AI assistant |
| `/webhook/submit-filing` | POST | Submit formation to state |

## Configuration

### N8N Credentials

Configure these credentials in N8N:

1. **OpenAI API**: For AI agent functionality
2. **Supabase**: Database credentials
3. **SendGrid**: Email delivery
4. **PDFMonkey**: Document generation
5. **State API**: Business name availability checks

### Environment Variables

See `.env.example` for all available configuration options.

## Deployment

### Frontend (Vercel)

```bash
# Using Vercel CLI
cd frontend
vercel --prod
```

### N8N (Production)

For production deployment, use a managed N8N instance or deploy with Docker:

```bash
docker-compose -f docker-compose.yml up -d
```

### Database

Run migrations on your production database:

```bash
supabase db push
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Create an issue for bugs or feature requests
- Join our community Discord for discussions
- Check the [wiki](https://github.com/yourusername/bizform-ai/wiki) for detailed documentation

## Acknowledgments

- [N8N](https://n8n.io/) - Powerful workflow automation
- [OpenAI](https://openai.com/) - AI capabilities
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Next.js](https://nextjs.org/) - The React Framework for the Web

---

<p align="center">
  Built with ❤️ using N8N and AI
</p>
