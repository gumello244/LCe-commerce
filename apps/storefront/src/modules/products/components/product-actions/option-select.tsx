"use client"

import { HttpTypes } from "@medusajs/types"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (optionId: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-1.5 flex-1 min-w-[140px]">
      <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
        {title}
      </label>

      <div className="relative w-full" data-testid={dataTestId}>
        <select
          value={current || ""}
          onChange={(e) => updateOption(option.id, e.target.value)}
          disabled={disabled}
          className="w-full h-11 pl-4 pr-10 rounded-full border border-gray-300 bg-white text-xs font-bold text-gray-900 uppercase tracking-wide appearance-none focus:outline-none focus:border-black transition-colors cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
          data-testid="option-select"
        >
          <option value="" disabled>
            SELECIONE
          </option>
          {filteredOptions.map((v) => (
            <option key={v} value={v}>
              {v.toUpperCase()}
            </option>
          ))}
        </select>

        {/* Custom Chevron Down SVG Icon */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default OptionSelect

