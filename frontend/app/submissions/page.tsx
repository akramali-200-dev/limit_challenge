'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSubmissionDetail } from '@/lib/hooks/useSubmissions';
import SubmissionDetail from './SubmissionDetail';

export default function SubmissionDetailPage() {
  const [mounted, setMounted] = useState(false);
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';

  console.log('params:', params);
  console.log('id:', id);
  console.log('enabled:', !!id);

  const { data, isLoading, isError, error } = useSubmissionDetail(id);

  console.log('isLoading:', isLoading);
  console.log('isError:', isError);
  console.log('error:', error);
  console.log('data:', data);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <SubmissionDetail data={data} isLoading={isLoading} isError={isError} />;
}