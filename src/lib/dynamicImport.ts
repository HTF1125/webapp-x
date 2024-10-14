// utils/dynamicImport.ts
import dynamic from 'next/dynamic';

export const dynamicImport = (componentPath: string) =>
  dynamic(() => import(componentPath), { ssr: false });
