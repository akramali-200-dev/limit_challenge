
'use client';

import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Link as MuiLink,
  InputAdornment,
} from '@mui/material';
import Link from 'next/link';
import { useMemo, useState , useEffect} from 'react';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import ArticleIcon from '@mui/icons-material/Article';
import NoteIcon from '@mui/icons-material/Note';

import { useBrokerOptions } from '@/lib/hooks/useBrokerOptions';
import { useSubmissionsList } from '@/lib/hooks/useSubmissions';
import { SubmissionStatus } from '@/lib/types';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const STATUS_OPTIONS: { label: string; value: SubmissionStatus | '' }[] = [
  { label: 'All Statuses', value: '' },
  { label: 'New', value: 'new' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Closed', value: 'closed' },
  { label: 'Lost', value: 'lost' },
];

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  new:       { bg: '#0a1628', color: '#3b82f6', border: '#1d4ed8' },
  in_review: { bg: '#0d1117', color: '#60a5fa', border: '#2563eb' },
  closed:    { bg: '#052e16', color: '#4ade80', border: '#16a34a' },
  lost:      { bg: '#1c0a0a', color: '#f87171', border: '#dc2626' },
};

const PRIORITY_STYLES: Record<string, { bg: string; color: string }> = {
  high:   { bg: '#1a0a00', color: '#fb923c' },
  medium: { bg: '#0f1a00', color: '#a3e635' },
  low:    { bg: '#0a0a14', color: '#94a3b8' },
};

const sxInput = {
  '& .MuiOutlinedInput-root': {
    background: '#0d1117',
    color: '#e2e8f0',
    borderRadius: '6px',
    '& fieldset': { borderColor: '#1e2d40' },
    '&:hover fieldset': { borderColor: '#2563eb' },
    '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1px' },
  },
  '& .MuiInputLabel-root': { color: '#475569' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
  '& .MuiSelect-icon': { color: '#475569' },
  '& .MuiInputAdornment-root svg': { color: '#475569' },
  '& .MuiFormHelperText-root': { display: 'none' },
};



export default function SubmissionsPage() {
  // Read initial state from URL
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [status, setStatus] = useState(searchParams.get('status') ?? '');
    const [brokerId, setBrokerId] = useState(searchParams.get('brokerId') ?? '');
    const [companyQuery, setCompanyQuery] = useState(searchParams.get('companySearch') ?? '');

    useEffect(() => {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (brokerId) params.set('brokerId', brokerId);
      if (companyQuery) params.set('companySearch', companyQuery);
      router.replace(`${pathname}?${params.toString()}`);
    }, [status, brokerId, companyQuery]);

  const filters = useMemo(() => ({
    status: status || undefined,
    brokerId: brokerId || undefined,
    companySearch: companyQuery || undefined,
  }), [status, brokerId, companyQuery]);

  const { data, isLoading, isError } = useSubmissionsList(filters);
  const { data: brokers } = useBrokerOptions();

  return (
    <Box sx={{ minHeight: '100vh', background: '#060a10', color: '#e2e8f0' }}>
      {/* Top bar */}
      <Box sx={{
        borderBottom: '1px solid #0f1e30',
        background: '#080c14',
        px: { xs: 3, md: 6 },
        py: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        <Box sx={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#3b82f6',
          boxShadow: '0 0 10px #3b82f6',
        }} />
        <Typography sx={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 13,
          color: '#3b82f6',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Apollo Broker · Submission Tracker
        </Typography>
      </Box>

      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Stack spacing={5}>

          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-end">
            <Box>
              <Typography sx={{
                fontFamily: '"DM Mono", monospace',
                fontSize: 11,
                color: '#3b82f6',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                mb: 0.5,
              }}>
                Operations Dashboard
              </Typography>
              <Typography sx={{
                fontSize: { xs: 32, md: 44 },
                fontWeight: 700,
                fontFamily: '"Space Grotesk", sans-serif',
                color: '#f1f5f9',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                Submissions
              </Typography>
            </Box>
            {data && (
              <Box sx={{
                background: '#0d1829',
                border: '1px solid #1d4ed8',
                borderRadius: '6px',
                px: 2.5,
                py: 1.5,
                textAlign: 'right',
              }}>
                <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: 28, fontWeight: 700, color: '#3b82f6', lineHeight: 1 }}>
                  {data.count}
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Results
                </Typography>
              </Box>
            )}
          </Box>

          {/* Filter bar */}
          <Box sx={{
            background: '#080c14',
            border: '1px solid #0f1e30',
            borderRadius: '10px',
            p: 2.5,
          }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <TuneIcon sx={{ fontSize: 14, color: '#3b82f6' }} />
              <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: '#475569', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Filters
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField select label="Status" value={status}
                onChange={(e) => setStatus(e.target.value as SubmissionStatus | '')}
                fullWidth sx={sxInput}>
                {STATUS_OPTIONS.map((o) => (
                  <MenuItem key={o.value || 'all'} value={o.value}
                    sx={{ background: '#0d1117', color: '#e2e8f0', '&:hover': { background: '#0a1628' } }}>
                    {o.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField select label="Broker" value={brokerId}
                onChange={(e) => setBrokerId(e.target.value)}
                fullWidth sx={sxInput}>
                <MenuItem value="" sx={{ background: '#0d1117', color: '#e2e8f0', '&:hover': { background: '#0a1628' } }}>
                  All Brokers
                </MenuItem>
                {brokers?.map((b) => (
                  <MenuItem key={b.id} value={String(b.id)}
                    sx={{ background: '#0d1117', color: '#e2e8f0', '&:hover': { background: '#0a1628' } }}>
                    {b.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField label="Company Search" value={companyQuery}
                onChange={(e) => setCompanyQuery(e.target.value)}
                fullWidth sx={sxInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 16 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Box>

          {/* Loading */}
          {isLoading && (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress sx={{ color: '#3b82f6' }} />
            </Box>
          )}

          {/* Error */}
          {isError && (
            <Box sx={{ background: '#1c0a0a', border: '1px solid #dc2626', borderRadius: '8px', p: 3 }}>
              <Typography sx={{ color: '#f87171', fontFamily: '"DM Mono", monospace', fontSize: 13 }}>
                ERROR · Failed to load submissions
              </Typography>
            </Box>
          )}

          {/* Table */}
          {data && (
            <Box sx={{
              background: '#080c14',
              border: '1px solid #0f1e30',
              borderRadius: '10px',
              overflow: 'hidden',
            }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: '#060a10' }}>
                    {['Company', 'Broker', 'Status', 'Priority', 'Owner', 'Docs', 'Notes', 'Created'].map((h) => (
                      <TableCell key={h} sx={{
                        color: '#334155',
                        fontFamily: '"DM Mono", monospace',
                        fontSize: 11,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid #0f1e30',
                        py: 1.5,
                      }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.results.map((s, i) => (
                    <TableRow key={s.id} sx={{
                      borderBottom: '1px solid #0b1520',
                      transition: 'background 0.15s',
                      '&:hover': { background: '#0a1020' },
                      '&:last-child td': { borderBottom: 'none' },
                    }}>
                      <TableCell sx={{ py: 2.5, borderBottom: 'none' }}>
                        <MuiLink component={Link} href={`/submissions/${s.id}`}
                          underline="none" sx={{
                            color: '#60a5fa',
                            fontWeight: 600,
                            fontSize: 14,
                            '&:hover': { color: '#93c5fd' },
                            transition: 'color 0.15s',
                          }}>
                          {s.company.legalName}
                        </MuiLink>
                        <Typography sx={{ fontSize: 11, color: '#334155', mt: 0.3, fontFamily: '"DM Mono", monospace' }}>
                          {s.company.industry}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ color: '#64748b', fontSize: 13, borderBottom: 'none' }}>
                        {s.broker.name}
                      </TableCell>

                      <TableCell sx={{ borderBottom: 'none' }}>
                        {(() => {
                          const st = STATUS_STYLES[s.status] ?? STATUS_STYLES.new;
                          return (
                            <Box sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              px: 1.5, py: 0.4,
                              borderRadius: '4px',
                              border: `1px solid ${st.border}`,
                              background: st.bg,
                              color: st.color,
                              fontSize: 11,
                              fontFamily: '"DM Mono", monospace',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                            }}>
                              {s.status.replace('_', ' ')}
                            </Box>
                          );
                        })()}
                      </TableCell>

                      <TableCell sx={{ borderBottom: 'none' }}>
                        {(() => {
                          const pr = PRIORITY_STYLES[s.priority] ?? PRIORITY_STYLES.low;
                          return (
                            <Box sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              px: 1.5, py: 0.4,
                              borderRadius: '4px',
                              background: pr.bg,
                              color: pr.color,
                              fontSize: 11,
                              fontFamily: '"DM Mono", monospace',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                            }}>
                              {s.priority}
                            </Box>
                          );
                        })()}
                      </TableCell>

                      <TableCell sx={{ color: '#94a3b8', fontSize: 13, borderBottom: 'none' }}>
                        {s.owner.fullName}
                      </TableCell>

                      <TableCell align="center" sx={{ borderBottom: 'none' }}>
                        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                          <ArticleIcon sx={{ fontSize: 13, color: '#334155' }} />
                          <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: 13, color: s.documentCount > 0 ? '#60a5fa' : '#334155' }}>
                            {s.documentCount}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell align="center" sx={{ borderBottom: 'none' }}>
                        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                          <NoteIcon sx={{ fontSize: 13, color: '#334155' }} />
                          <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: 13, color: s.noteCount > 0 ? '#60a5fa' : '#334155' }}>
                            {s.noteCount}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ borderBottom: 'none' }}>
                        <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: 12, color: '#334155' }}>
                          {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}