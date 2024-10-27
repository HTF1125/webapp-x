// components/BackButton.tsx

import Link from 'next/link';

export default function BackButton({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <a className="text-blue-500 hover:underline mb-4 inline-block">&larr; {label}</a>
    </Link>
  );
}
