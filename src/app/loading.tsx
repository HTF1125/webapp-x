// app/loading.tsx
"use client";

import React from 'react';
import { Spinner } from '@nextui-org/react';

export default function Loading() {

  return (
    <div className="h-screen flex justify-center items-center bg-background">
      <div className="text-center">
        <Spinner size="lg" color="primary" />
        <div className="mt-5 text-foreground">Loading...</div>
      </div>
    </div>
  );
}
