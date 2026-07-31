# Saarthi Bank – Loan Audit & Verification Platform

**Smart, Secure and AI-Powered Loan Verification**

A production-style, responsive web application for loan auditing and verification with role-based access for Customers, Loan Officers, Loan Auditors, and Admins.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, Recharts |
| Backend | Node.js, Express.js, MongoDB, JWT Auth |
| Infrastructure | AWS ECS Fargate, ECR, ALB, S3, CloudFront, Terraform |
| CI/CD | GitHub Actions, Docker |
| Monitoring | CloudWatch Logs |

## Quick Start

### Local Development

```bash
# Clone
git clone https://github.com/Shriram111/loan-.git
cd loan-

# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

### Docker

```bash
docker compose -f docker-compose.prod.yml up --build
```

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@saarthi.com | admin123 |
| Customer | customer@saarthi.com | customer123 |
| Loan Officer | officer@saarthi.com | officer123 |
| Loan Auditor | auditor@saarthi.com | auditor123 |

## AWS Deployment

### Prerequisites
- AWS CLI configured
- Terraform >= 1.0
- Docker

### 1. Provision Infrastructure
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
terraform init
terraform apply
```

### 2. Push Docker Image to ECR
```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com
docker build -t saarthi-bank-prod-backend ./backend
docker tag saarthi-bank-prod-backend:latest <ecr-url>:latest
docker push <ecr-url>:latest
```

### 3. Deploy Frontend to S3
```bash
cd frontend && npm run build
aws s3 sync dist/ s3://<your-bucket> --delete
```

### GitHub Secrets Required
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`

## Architecture

```
Users → CloudFront → S3 (React Frontend)
                  ↓
          Application Load Balancer
                  ↓
          ECS Fargate (Express Backend)
                  ↓
          MongoDB (Atlas/DocumentDB)
```

## Features

- 4 role-based dashboards (Customer, Officer, Auditor, Admin)
- Multi-step loan application with validation
- Document upload with drag-and-drop
- CIBIL, EPF, Salary verification (simulated)
- DigiLocker KYC integration
- Selfie capture and liveness detection
- Live video verification (WebRTC)
- AI verification notes with risk scoring
- Loan audit dashboard with scoring
- Downloadable audit reports
- EMI calculator with amortization
- Loan products and interest rate management
- Real-time notifications
- Full admin panel with analytics

## API Endpoints

- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Register
- `GET /api/loans` - List loans
- `POST /api/loans` - Create loan
- `POST /api/documents/upload` - Upload document
- `POST /api/verification/cibil` - CIBIL check
- `GET /api/admin/analytics` - Admin analytics
- `POST /api/financial/emi-calculator` - EMI Calculator

## Security

- JWT access + refresh tokens
- bcrypt password hashing (12 rounds)
- Rate limiting (1000 req/min)
- CORS configuration
- Helmet HTTP headers
- Role-based access control
- Input validation
- Audit logging

## License

MIT License
