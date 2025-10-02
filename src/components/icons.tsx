import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-6 h-6", props.className)}
            {...props}
        >
            <path d="m10.5 10.5 9-9" />
            <path d="M14.5 2.5a2.12 2.12 0 1 1-3 3l-1.5-1.5a2.12 2.12 0 1 1 3-3Z" />
            <path d="M4.5 19.5 10 14" />
            <path d="M13 15c-3 3-6 4-8.5 4.5S2.5 22 2.5 22s.5-2 1-4.5C4 15 5 12 8 9" />
            <circle cx="18" cy="18" r="2" />
        </svg>
    );
}
