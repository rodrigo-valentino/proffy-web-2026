import type { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title: string
    disabled?: boolean
    className?: string
}

export function Button({ title, disabled, className = "", ...rest }: ButtonProps) {
    return (
        <button
        {...rest}
        disabled={disabled}
        className={`w-full p-5 border-none rounded-lg font-archivo-semibold mt-10 ${className}
            ${disabled
                ? "bg-gray-shape text-text-complement cursor-not-allowed"
                : "bg-green opacity-90 hover:bg-green hover:opacity-100 transition text-white cursor-pointer"
            }
        `}
        >
            {title}
        </button>
    )
}