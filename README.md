## Approach

### Backend
- Extended `SubmissionFilterSet` with `brokerId`, `companySearch`, `createdFrom`, `createdTo`, `hasDocuments`, and `hasNotes` filters
- Added `-created_at` ordering to eliminate pagination warnings and ensure consistent results
- Serializers return denormalized broker/company/owner objects on list to avoid N+1 fetches

### Frontend
- Built with MUI v7 + React Query for data fetching and caching
- Filters are synced to URL query params so results are shareable and survive page refresh
- camelcase-keys interceptor on axios normalizes snake_case API responses automatically
- Loading, error, and empty states handled at both list and detail level

### Tradeoffs
- Used client-side rendering (no SSR) on detail page to avoid MUI hydration conflicts with Next.js App Router
- No debounce on company search input — would add with `useDebouncedValue` in production

### Stretch Goals
- `hasDocuments` and `hasNotes` boolean filters
- `createdFrom` / `createdTo` date range filters
- Color-coded status/priority system with per-state visual theming

## How to Run

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_submissions  # optional but recommended
# add --force to rebuild the generated sample data
python manage.py runserver 0.0.0.0:8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # create if you want a custom API base
# NEXT_PUBLIC_API_BASE_URL defaults to http://localhost:8000/api
npm run dev
```

Open http://localhost:3000