"use client"

import React, { useState } from "react"

export default function SizeGuideModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-brand-teal transition-colors py-1 underline underline-offset-4 font-medium cursor-pointer"
      >
        <svg
          className="w-4 h-4 text-brand-teal"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M3 10h18M3 14h18M7 10v4M11 10v4M15 10v4M19 10v4"
          />
        </svg>
        <span>Guia de medidas</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                  Guia de Medidas
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tabela aproximada em centímetros (cm)
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-brand-teal/10 text-brand-teal uppercase font-bold">
                    <th className="py-2.5 px-3 rounded-l-md">Tamanho</th>
                    <th className="py-2.5 px-3">Busto (cm)</th>
                    <th className="py-2.5 px-3">Cintura (cm)</th>
                    <th className="py-2.5 px-3 rounded-r-md">Quadril (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-gray-900">PP / 36</td>
                    <td className="py-2.5 px-3">80 - 84</td>
                    <td className="py-2.5 px-3">62 - 66</td>
                    <td className="py-2.5 px-3">88 - 92</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="py-2.5 px-3 font-semibold text-gray-900">P / 38</td>
                    <td className="py-2.5 px-3">85 - 89</td>
                    <td className="py-2.5 px-3">67 - 71</td>
                    <td className="py-2.5 px-3">93 - 97</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-gray-900">M / 40</td>
                    <td className="py-2.5 px-3">90 - 94</td>
                    <td className="py-2.5 px-3">72 - 76</td>
                    <td className="py-2.5 px-3">98 - 102</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="py-2.5 px-3 font-semibold text-gray-900">G / 42</td>
                    <td className="py-2.5 px-3">95 - 99</td>
                    <td className="py-2.5 px-3">77 - 81</td>
                    <td className="py-2.5 px-3">103 - 107</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-gray-900">GG / 44</td>
                    <td className="py-2.5 px-3">100 - 104</td>
                    <td className="py-2.5 px-3">82 - 86</td>
                    <td className="py-2.5 px-3">108 - 112</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tip Box */}
            <div className="mt-6 bg-amber-50/80 border border-amber-200/60 rounded-xl p-3.5 text-[11px] text-amber-800 flex items-start gap-2.5">
              <span className="text-base">💡</span>
              <p>
                <strong>Dica Louise Castelatto:</strong> Use uma fita métrica sem apertar a pele. Caso suas medidas fiquem entre dois tamanhos, recomendamos escolher o tamanho maior para maior conforto.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-medium text-xs hover:bg-black transition-colors"
              >
                Entendi, fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
