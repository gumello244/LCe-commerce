"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
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
    <div className="flex flex-col gap-y-2.5">
      <div className="flex items-center justify-between text-xs tracking-wider">
        <span className="font-bold text-gray-900 uppercase">
          {title}: <span className="font-normal text-gray-600 normal-case">{current || "Selecione"}</span>
        </span>
      </div>

      <div
        className="flex flex-wrap gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          const isSelected = v === current
          return (
            <button
              type="button"
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "min-w-[48px] px-3.5 h-9 rounded-md text-xs font-medium border transition-all duration-150 flex items-center justify-center cursor-pointer",
                {
                  "border-brand-teal bg-brand-teal text-white shadow-xs font-semibold scale-[1.02]": isSelected,
                  "border-gray-200 bg-white text-gray-700 hover:border-brand-teal hover:text-brand-teal": !isSelected,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
