
"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';

// This is a placeholder component.
// The user wants to see the Maestros page instead of this one.
// We will redirect them.
export default function DataPageRedirect() {
    const router = useRouter();
    React.useEffect(() => {
        router.replace('/dashboard/maestros');
    }, [router]);

    return null;
}
