"use client";

import { useRouter } from "next/navigation";

export default function GoBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
    >
      Go Back
    </button>
  );
}
