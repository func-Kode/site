# OAuth Security Architecture

## Overview

This project implements a dual OAuth setup for maximum security and isolation between production and development environments.

## Architecture

### Production Environment
- **GitHub OAuth App**: Managed by project maintainers
- **Supabase Project**: Production database and auth
- **Redirect URLs**: `https://func-kode.netlify.app/*`
- **Access**: Limited to deployed production site

### Development Environment  
- **GitHub OAuth App**: Created by each contributor
- **Supabase Project**: Personal development database
- **Redirect URLs**: `http://localhost:3000/*`
- **Access**: Individual contributor's local machine only

## Benefits

### Security
- Production credentials never shared with contributors
- No risk of accidental production data access
- Each developer works in complete isolation

### Flexibility
- Contributors can experiment freely
- No interference between different development setups
- Easy to test OAuth flows without affecting others

### Compliance
- Follows OAuth best practices
- Maintains proper separation of environments
- Reduces attack surface for production system

## Implementation

### For Maintainers
- Keep production OAuth credentials secure
- Production Supabase configured for live domain only
- GitHub OAuth app restricted to production URLs

### For Contributors
- Follow [Development Setup Guide](./DEVELOPMENT_SETUP.md)
- Create personal GitHub OAuth app for localhost
- Set up individual Supabase project for development
- Use provided `.env.example` as template

## OAuth Flow

### Development Flow
1. Developer clicks "Sign in with GitHub" on localhost:3000
2. Redirects to developer's personal GitHub OAuth app
3. GitHub redirects back to localhost:3000/auth/callback
4. Auth tokens processed by developer's Supabase project
5. User authenticated in local development environment

### Production Flow
1. User clicks "Sign in with GitHub" on production site
2. Redirects to production GitHub OAuth app
3. GitHub redirects back to production/auth/callback  
4. Auth tokens processed by production Supabase project
5. User authenticated in production environment

## Environment Variables

### Production (.env.production)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=production-anon-key
```

### Development (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://personal-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=personal-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

This architecture ensures that contributors can develop safely while maintaining production security and stability.
