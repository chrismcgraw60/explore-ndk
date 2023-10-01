import dynamic from 'next/dynamic';

export const JsonViewerDynamic = dynamic(
    () => import('@/components/JsonViewer'), 
    {  ssr: false }
  );