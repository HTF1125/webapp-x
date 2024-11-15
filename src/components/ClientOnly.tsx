// components/ClientOnly.tsx
'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
}

function ClientOnly({ children }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Render `null` on the server and content only on the client
  return isClient ? <>{children}</> : null;
}

export default ClientOnly;
