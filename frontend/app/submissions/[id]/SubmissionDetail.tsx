'use client';

import {
  Box,
  Container,
  Divider,
  Link as MuiLink,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import Link from 'next/link';
import { SubmissionDetail as SubmissionDetailType } from '@/lib/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import ChatIcon from '@mui/icons-material/Chat';
import BusinessIcon from '@mui/icons-material/Business';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface Props {
  data?: SubmissionDetailType;
  isLoading: boolean;
  isError: boolean;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string; glow: string }> = {
  new:       { bg: '#0a1628', color: '#3b82f6', border: '#1d4ed8', glow: '#1d4ed840' },
  in_review: { bg: '#0d1117', color: '#60a5fa', border: '#2563eb', glow: '#2563eb40' },
  closed:    { bg: '#052e16', color: '#4ade80', border: '#16a34a', glow: '#16a34a40' },
  lost:      { bg: '#1c0a0a', color: '#f87171', border: '#dc2626', glow: '#dc262640' },
};

const PRIORITY_STYLES: Record<string, { color: string; label: string }> = {
  high:   { color: '#fb923c', label: '▲ HIGH' },
  medium: { color: '#a3e635', label: '● MED' },
  low:    { color: '#475569', label: '▼ LOW' },
};

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Box display="flex" alignItems="center" gap={1.5} mb={3}>
      <Box sx={{ color: '#3b82f6' }}>{icon}</Box>
      <Typography sx={{
        fontFamily: '"DM Mono", monospace',
        fontSize: 11,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#475569',
      }}>
        {label}
      </Typography>
      <Box sx={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #1e2d40, transparent)' }} />
    </Box>
  );
}

export default function SubmissionDetail({ data, isLoading, isError }: Props) {
  const status = data?.status ?? 'new';
  const st = STATUS_STYLES[status] ?? STATUS_STYLES.new;
  const pr = PRIORITY_STYLES[data?.priority ?? 'low'];

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
        justifyContent: 'space-between',
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }} />
          <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: 13, color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Apollo Broker · Submission Tracker
          </Typography>
        </Box>
        <MuiLink component={Link} href="/submissions" underline="none" sx={{
          display: 'flex', alignItems: 'center', gap: 0.8,
          color: '#334155', fontSize: 13, fontFamily: '"DM Mono", monospace',
          letterSpacing: '0.05em',
          transition: 'color 0.15s',
          '&:hover': { color: '#60a5fa' },
        }}>
          <ArrowBackIcon sx={{ fontSize: 14 }} />
          Back to list
        </MuiLink>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {isLoading && (
          <Box display="flex" justifyContent="center" py={12}>
            <CircularProgress sx={{ color: '#3b82f6' }} />
          </Box>
        )}

        {isError && (
          <Box sx={{ background: '#1c0a0a', border: '1px solid #dc2626', borderRadius: '8px', p: 4 }}>
            <Typography sx={{ color: '#f87171', fontFamily: '"DM Mono", monospace', fontSize: 14 }}>
              ERROR · Failed to load submission
            </Typography>
          </Box>
        )}

        {data && (
          <Stack spacing={3}>

            {/* Hero header */}
            <Box sx={{
              background: 'linear-gradient(135deg, #080c14 0%, #0a1020 100%)',
              border: '1px solid #0f1e30',
              borderLeft: `3px solid ${st.border}`,
              borderRadius: '10px',
              p: 4,
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Glow blob */}
              <Box sx={{
                position: 'absolute', top: -40, right: -40,
                width: 200, height: 200,
                background: st.glow,
                borderRadius: '50%',
                filter: 'blur(60px)',
                pointerEvents: 'none',
              }} />

              <Stack spacing={3} sx={{ position: 'relative' }}>
                {/* Company name + badges */}
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <BusinessIcon sx={{ fontSize: 13, color: '#334155' }} />
                    <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: '#334155', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                      {data.company.industry} · {data.company.headquartersCity}
                    </Typography>
                  </Box>
                  <Typography sx={{
                    fontSize: { xs: 28, md: 40 },
                    fontWeight: 800,
                    fontFamily: '"Space Grotesk", sans-serif',
                    color: '#f1f5f9',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    mb: 2,
                  }}>
                    {data.company.legalName}
                  </Typography>

                  {/* Status + Priority badges */}
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Box sx={{
                      display: 'inline-flex', alignItems: 'center',
                      px: 2, py: 0.7,
                      borderRadius: '5px',
                      border: `1px solid ${st.border}`,
                      background: st.bg,
                      color: st.color,
                      fontSize: 12,
                      fontFamily: '"DM Mono", monospace',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      boxShadow: `0 0 12px ${st.glow}`,
                    }}>
                      {data.status.replace('_', ' ')}
                    </Box>
                    <Box sx={{
                      display: 'inline-flex', alignItems: 'center',
                      px: 2, py: 0.7,
                      borderRadius: '5px',
                      background: '#0d1117',
                      border: '1px solid #1e2d40',
                      color: pr.color,
                      fontSize: 12,
                      fontFamily: '"DM Mono", monospace',
                      letterSpacing: '0.12em',
                    }}>
                      {pr.label}
                    </Box>
                  </Box>
                </Box>

                {/* Meta grid */}
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                  pt: 2,
                  borderTop: '1px solid #0f1e30',
                }}>
                  {[
                    { label: 'Broker', value: data.broker.name },
                    { label: 'Owner', value: data.owner.fullName },
                    { label: 'Created', value: new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                    { label: 'Updated', value: new Date(data.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                  ].map((item) => (
                    <Box key={item.label}>
                      <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: '#334155', letterSpacing: '0.15em', textTransform: 'uppercase', mb: 0.3 }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Summary */}
                {data.summary && (
                  <Box sx={{
                    background: '#0a1020',
                    border: '1px solid #0f1e30',
                    borderRadius: '6px',
                    p: 2.5,
                  }}>
                    <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: '#334155', letterSpacing: '0.15em', textTransform: 'uppercase', mb: 1 }}>
                      Summary
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>
                      {data.summary}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>

            {/* Bottom grid: contacts + documents | notes */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>

              {/* Contacts */}
              <Box sx={{ background: '#080c14', border: '1px solid #0f1e30', borderRadius: '10px', p: 3 }}>
                <SectionHeader icon={<PersonIcon sx={{ fontSize: 16 }} />} label={`Contacts · ${data.contacts.length}`} />
                {data.contacts.length === 0 ? (
                  <Typography sx={{ color: '#334155', fontFamily: '"DM Mono", monospace', fontSize: 12 }}>No contacts on record.</Typography>
                ) : (
                  <Stack spacing={2}>
                    {data.contacts.map((c, i) => (
                      <Box key={c.id}>
                        {i > 0 && <Divider sx={{ borderColor: '#0f1e30', mb: 2 }} />}
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', mb: 0.3 }}>
                          {c.name}
                        </Typography>
                        {c.role && (
                          <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: '#3b82f6', letterSpacing: '0.08em', mb: 0.5 }}>
                            {c.role}
                          </Typography>
                        )}
                        <Typography sx={{ fontSize: 12, color: '#475569' }}>{c.email}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#475569' }}>{c.phone}</Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>

              {/* Documents */}
              <Box sx={{ background: '#080c14', border: '1px solid #0f1e30', borderRadius: '10px', p: 3 }}>
                <SectionHeader icon={<FolderIcon sx={{ fontSize: 16 }} />} label={`Documents · ${data.documents.length}`} />
                {data.documents.length === 0 ? (
                  <Typography sx={{ color: '#334155', fontFamily: '"DM Mono", monospace', fontSize: 12 }}>No documents attached.</Typography>
                ) : (
                  <Stack spacing={2}>
                    {data.documents.map((d, i) => (
                      <Box key={d.id}>
                        {i > 0 && <Divider sx={{ borderColor: '#0f1e30', mb: 2 }} />}
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box flex={1} mr={1}>
                            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', mb: 0.3 }}>
                              {d.title}
                            </Typography>
                            <Box display="flex" gap={1.5} alignItems="center">
                              <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: '#3b82f6', letterSpacing: '0.08em' }}>
                                {d.docType}
                              </Typography>
                              <Typography sx={{ fontSize: 11, color: '#334155' }}>
                                {new Date(d.uploadedAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          {d.fileUrl && (
                            <MuiLink href={d.fileUrl} target="_blank" rel="noopener" sx={{
                              color: '#334155',
                              '&:hover': { color: '#60a5fa' },
                              transition: 'color 0.15s',
                            }}>
                              <OpenInNewIcon sx={{ fontSize: 15 }} />
                            </MuiLink>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Box>

            {/* Notes - full width */}
            <Box sx={{ background: '#080c14', border: '1px solid #0f1e30', borderRadius: '10px', p: 3 }}>
              <SectionHeader icon={<ChatIcon sx={{ fontSize: 16 }} />} label={`Notes · ${data.notes.length}`} />
              {data.notes.length === 0 ? (
                <Typography sx={{ color: '#334155', fontFamily: '"DM Mono", monospace', fontSize: 12 }}>No notes yet.</Typography>
              ) : (
                <Stack spacing={0}>
                  {data.notes.map((n, i) => (
                    <Box key={n.id} sx={{
                      display: 'grid',
                      gridTemplateColumns: '140px 1fr',
                      gap: 3,
                      py: 2.5,
                      borderBottom: i < data.notes.length - 1 ? '1px solid #0b1520' : 'none',
                    }}>
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#60a5fa', mb: 0.3 }}>
                          {n.authorName.split(' ')[0]}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: '#334155' }}>
                          {n.authorName.split(' ').slice(1).join(' ')}
                        </Typography>
                        <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: '#1e2d40', mt: 1 }}>
                          {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, pt: 0.2 }}>
                        {n.body}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

          </Stack>
        )}
      </Container>
    </Box>
  );
}