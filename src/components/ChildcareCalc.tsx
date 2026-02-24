'use client'

import { useState, useEffect } from 'react'

function calcTakeHome(annualGross: number, numChildren: number) {
  const PA = 12570
  const BR_LIMIT = 50270
  const HR_LIMIT = 125140

  let tax = 0
  if (annualGross > PA) {
    const basicBand = Math.min(annualGross, BR_LIMIT) - PA
    tax += basicBand * 0.2
  }
  if (annualGross > BR_LIMIT) {
    const higherBand = Math.min(annualGross, HR_LIMIT) - BR_LIMIT
    tax += higherBand * 0.4
  }
  if (annualGross > HR_LIMIT) {
    tax += (annualGross - HR_LIMIT) * 0.45
  }

  let ni = 0
  if (annualGross > PA) {
    const primaryBand = Math.min(annualGross, BR_LIMIT) - PA
    ni += primaryBand * 0.08
  }
  if (annualGross > BR_LIMIT) {
    ni += (annualGross - BR_LIMIT) * 0.02
  }

  const annualNet = annualGross - tax - ni
  const monthlyNet = annualNet / 12

  const childcareCosts = [0, 800, 1600, 2400]
  const childcareCost = childcareCosts[Math.min(numChildren, 3)]
  const takeHome = monthlyNet - childcareCost

  return { monthlyNet: Math.round(monthlyNet), childcareCost, takeHome: Math.round(takeHome) }
}

export default function ChildcareCalc({ defaultSalary }: { defaultSalary: number }) {
  const [salary, setSalary] = useState(defaultSalary)
  const [children, setChildren] = useState(1)
  const [result, setResult] = useState(calcTakeHome(defaultSalary, 1))

  useEffect(() => {
    setResult(calcTakeHome(salary, children))
  }, [salary, children])

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="font-bold text-gray-900 mb-1">Childcare cost calculator</h3>
      <p className="text-xs text-gray-400 mb-4">Estimated UK take-home after childcare</p>

      <div className="space-y-3 mb-5">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Annual salary (£)</label>
          <input
            type="number"
            value={salary}
            onChange={e => setSalary(Number(e.target.value))}
            min={0}
            step={1000}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Number of children</label>
          <select
            value={children}
            onChange={e => setChildren(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value={0}>0 (no childcare costs)</option>
            <option value={1}>1 child (~£800/mo)</option>
            <option value={2}>2 children (~£1,600/mo)</option>
            <option value={3}>3+ children (~£2,400/mo)</option>
          </select>
        </div>
      </div>

      <div className="bg-teal-50 rounded-xl p-4 text-center">
        <p className="text-3xl font-bold text-teal-700">
          £{result.takeHome.toLocaleString()}
          <span className="text-sm font-normal text-teal-500">/mo</span>
        </p>
        <p className="text-xs text-teal-600 mt-1">estimated take-home after childcare</p>
        {children > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            Monthly pay £{result.monthlyNet.toLocaleString()} − £{result.childcareCost.toLocaleString()} childcare
          </p>
        )}
        <p className="text-xs text-gray-300 mt-3">Estimate only. Based on 2024/25 UK tax bands.</p>
      </div>
    </div>
  )
}
