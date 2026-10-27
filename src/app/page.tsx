import { AgencyApp } from '@/agency/AgencyApp';
import type { Simulate } from '@/agency/types';

const SIMULATE: Simulate[] = ['normal', 'slow', 'fails', 'stalls'];

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const sim = typeof sp.simulate === 'string' && (SIMULATE as string[]).includes(sp.simulate) ? (sp.simulate as Simulate) : 'normal';
  return <AgencyApp simulate={sim} startAt={'demo' in sp ? 'Signed in' : 'Start page'} />;
}
