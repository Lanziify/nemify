<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Nemify - Agent Instructions

A Next.js 16 application with feature-based architecture, Better Auth, and Kysely ORM.

## Stack & Tools

- **Framework**: Next.js 16.2.9 (App Router), React 19.2.4
- **Package Manager**: Bun (required)
- **Database**: PostgreSQL with Kysely 0.29.2 query builder
- **Auth**: Better Auth 1.6.18 (email/password, Google OAuth, organizations)
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand for client state management
- **UI**: shadcn/ui components (copied, not installed), TailwindCSS 4
- **Linting**: Biome 2.2.0 (replaces ESLint + Prettier)
- **TypeScript**: Strict mode, path alias `@/*` → `./src/*`

## Development Commands

```bash
# Development
bun run dev              # Start dev server on localhost:3000
bun run build            # Production build
bun run start            # Start production server

# Database
bun run migrate:better-auth   # Run Better Auth migrations
bun run migrate:latest        # Run Kysely migrations (⚠️ has typo in package.json)
bun run generate:types        # Generate TypeScript types → src/db/db.d.ts

# Code Quality
bun run lint             # Run Biome linter
bun run format           # Format code with Biome
```

**⚠️ Known Issue**: `migrate:latest` script in package.json has typos ("kyesly mirgrate"). The correct command is `bunx --bun kysely migrate:latest`.

## Architecture

### Feature-Based Structure

All features follow this **strict layered architecture** under `src/feature/{feature-name}/`:

```
feature/
  {feature-name}/
    schema/        # Zod validation schemas + type inference
    repositories/  # Kysely database queries (data access layer)
    services/      # Business logic orchestrating repositories
    actions/       # Server actions ('use server') for client consumption
    components/    # Feature-specific UI components
```

**Layer rules:**

1. **Schema** defines validation + types (e.g., `signInEmailPasswordSchema`)
2. **Repository** executes database queries using Kysely (e.g., `findUserByEmail`)
3. **Service** contains business logic, orchestrates repositories (e.g., `createSystemAdminAccount`)
4. **Actions** wrap services for client-side use with `'use server'` directive
5. **Components** consume actions and render UI

**Never skip layers.** Always validate in schema, query in repository, orchestrate in service.

### Database Patterns

**Setup**: Kysely instance in [src/utils/db.ts](src/utils/db.ts) with PostgreSQL dialect.

**Type Generation Workflow**:

1. Create migration in `src/migrations/{timestamp}_{name}.ts`
2. Run `bun run migrate:better-auth` (for auth tables) or `bun run migrate:latest` (custom tables)
3. Run `bun run generate:types` to update `src/db/db.d.ts`
4. Import types: `import type { DB } from '@/db/db';`

**Migration Template**:

```typescript
import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // create tables/columns
}

export async function down(db: Kysely<any>): Promise<void> {
  // rollback changes
}
```

**Seeding**: Seeds in `src/seeds/` must use transactions:

```typescript
import type { Kysely } from 'kysely';
import type { DB } from '@/db/db';

export async function seed(db: Kysely<DB>): Promise<void> {
  const trx = await db.transaction().execute(async (trx) => {
    // seed operations
  });
}
```

**Repository Pattern**:

```typescript
// src/feature/auth/repositories/auth.repository.ts
import { db } from '@/utils/db';

export async function findUserByEmail(email: string) {
  return await db
    .selectFrom('user')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirst();
}
```

### Authentication

**Better Auth Configuration**: [src/utils/auth.ts](src/utils/auth.ts)

**⚠️ Critical Convention**: This codebase renames Better Auth's "organization" plugin to "Campus":

- `organization` → `campus`
- `member` → `campusMember`
- `invitation` → `campusInvitation`
- `organizationRole` → `campusRole`
- `activeOrganizationId` → `activeCampusId`

Always use "Campus" terminology in code and database queries.

**Platform Roles vs Campus Roles**:

- **Platform Role** (`platformRole` on User table): System-wide role
  - `system_admin` - can create/manage campuses
  - `system_user` - default role (set in Better Auth config)
- **Campus Role**: Per-campus roles managed by Better Auth's organization plugin

**Access Control**: [src/data/permissions.ts](src/data/permissions.ts) uses Better Auth's `createAccessControl`.

**Client-Side Auth**:

- **Client**: [src/utils/auth-client.ts](src/utils/auth-client.ts) - Better Auth client
- **Store**: [src/store/auth-store.ts](src/store/auth-store.ts) - Zustand store with `user`, `session`, `signIn`, `signOut`
- **Provider**: [src/components/provider/auth-provider.tsx](src/components/provider/auth-provider.tsx) - initializes session on mount

**Email**: [src/utils/email.ts](src/utils/email.ts) uses SMTP (dev) or SendGrid (prod).

### Error Handling

**Use Result Types, Not Exceptions**:

```typescript
import { safeCatch } from '@/lib/errors/safe-catch';
import { actionErrorParser } from '@/lib/errors/action-error-parser';

export const signInUserAccount = async (values: SignInValues) => {
  return await safeCatch(
    async () => await auth.api.signInEmail({ body: values }),
    { parser: actionErrorParser }
  );
};

// Client usage
const result = await signInUserAccount(credentials);
if (result.error) {
  toast.error(result.error.message);
  return;
}
// result.data is available
```

**Result Type**:

```typescript
type Result<T, E> = { data: T; error: null } | { data: null; error: E };
```

**Custom Errors**: [src/lib/errors/app-error.ts](src/lib/errors/app-error.ts)

- `BadRequestError` (400)
- `DatabaseError` (500)
- All extend `AppError` with `errorCode`, `statusCode`, `details`

**Error Parsers**:

- **Actions**: `actionErrorParser` - returns `{ code, message, details }` object
- **API Routes**: `apiErrorParser` - returns `NextResponse` with status code

Both handle: ZodError, Better Auth APIError, AppError, generic errors.

### API Routes

**API Handler Pattern**: [src/lib/api-handler.ts](src/lib/api-handler.ts)

```typescript
import {
  apiErrorHandler,
  requireSession,
  requiredInternalKey,
} from '@/lib/api-handler';

export const POST = apiErrorHandler(
  async (req: NextRequest) => {
    const body = await req.json();
    const values = signUpEmailSchema.parse(body);
    const admin = await createSystemAdminAccount(values);
    return NextResponse.json(admin, { status: 200 });
  },
  { guards: [requiredInternalKey] }
);
```

**Available Guards**:

- `requireSession` - ensures active Better Auth session
- `requiredInternalKey` - checks `x-internal-secret-key` header for internal-only routes

**Create Custom Guards**:

```typescript
type ApiGuard = (req: NextRequest, context: Context) => Promise<void>;

const myGuard: ApiGuard = async (req) => {
  if (!condition) throw new BadRequestError('Message');
};
```

### Component Organization

**UI Components**: [src/components/ui/](src/components/ui/) - shadcn/ui components (40+)

- Copied into project, not installed as dependency
- Use `class-variance-authority` for variants
- Based on Radix UI primitives
- Modify freely to fit project needs

**Custom Components**: [src/components/custom/](src/components/custom/) - app-specific components

**Feature Components**: [src/feature/{name}/components/](src/feature/auth/components/) - feature-specific UI

**Form Pattern**:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormValues>({
  resolver: zodResolver(mySchema),
});

const onSubmit = async (data: FormValues) => {
  const result = await myAction(data);
  if (result.error) {
    toast.error(result.error.message);
    return;
  }
  // success handling
};
```

**Utility Helpers**:

- `cn()` in [src/lib/utils.ts](src/lib/utils.ts) - merges classNames with `clsx` + `tailwind-merge`

## Code Style

**Biome** handles linting and formatting:

- 2-space indentation
- React and Next.js domains enabled
- Auto-organizes imports on save
- Run `bun run lint` before committing

**TypeScript**:

- Strict mode enabled
- Always use path alias `@/*` for imports from `src/`
- Prefer explicit types for function parameters and return values
- Use `type` for object shapes, `interface` for extension

## Important Conventions

1. **Always use Bun**: This project requires Bun, not npm/yarn/pnpm
2. **Feature isolation**: Keep features self-contained under `src/feature/`
3. **Campus not Organization**: Use "campus" terminology throughout
4. **Result types over throws**: Use `safeCatch` and check `result.error`
5. **Layer discipline**: Follow schema → repository → service → action flow
6. **Type generation**: Run `generate:types` after any migration
7. **Internal APIs**: Protect system-admin routes with `requiredInternalKey` guard

## Key Files Reference

- [package.json](package.json) - Scripts and dependencies
- [biome.json](biome.json) - Linting/formatting config
- [tsconfig.json](tsconfig.json) - TypeScript config with path aliases
- [src/utils/db.ts](src/utils/db.ts) - Kysely database instance
- [src/utils/auth.ts](src/utils/auth.ts) - Better Auth server config
- [src/utils/auth-client.ts](src/utils/auth-client.ts) - Better Auth client
- [src/lib/api-handler.ts](src/lib/api-handler.ts) - API error handling and guards
- [src/lib/errors/safe-catch.ts](src/lib/errors/safe-catch.ts) - Result type wrapper
- [src/data/permissions.ts](src/data/permissions.ts) - Access control definitions
