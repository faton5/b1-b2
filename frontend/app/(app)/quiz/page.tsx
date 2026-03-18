"use client"

import { useEffect, useState } from "react"
import { pickRandomQuestions, type QuizQuestion, type OptionKey } from "./question-bank"

const TOTAL_QUESTIONS = 50

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<OptionKey | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setQuestions(pickRandomQuestions(TOTAL_QUESTIONS))
  }, [])

  const current = questions[index]
  const selectedOption = selected ? current?.options.find((opt) => opt.key === selected) : null
  const isAnswerCorrect = Boolean(confirmed && selected && current && selected === current.answer)

  const handleConfirm = () => {
    if (!selected || confirmed || !current) return
    setConfirmed(true)
    if (selected === current.answer) setScore((prev) => prev + 1)
  }

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      setFinished(true)
      return
    }
    setIndex(index + 1)
    setSelected(null)
    setConfirmed(false)
  }

  if (finished) return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full mx-auto p-12 text-center text-white bg-violet-900/60 rounded-[3rem] shadow-2xl border border-violet-300/30 backdrop-blur-sm">
        <h1 className="text-4xl font-black mb-6 tracking-tighter uppercase">Terminé !</h1>
        <p className="text-xl font-bold text-violet-100 uppercase">Votre score</p>
        <div className="text-7xl font-black text-fuchsia-200 my-8">{score} / {TOTAL_QUESTIONS}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-white text-violet-900 px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform"
        >
          RECOMMENCER
        </button>
      </div>
    </div>
  )

  if (!current) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 flex items-center justify-center p-6">
        <div className="text-white font-semibold">Chargement du quiz...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 py-10 px-4">
      <div className="max-w-3xl mx-auto p-12 bg-white/95 shadow-2xl rounded-[3rem] text-black border border-violet-100">
      
      <div className="flex justify-between items-center mb-12">
        <span className="bg-violet-700 text-white px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">
          Question {index + 1} sur {TOTAL_QUESTIONS}
        </span>
        <div className="h-3 w-40 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
          <div 
            className="h-full bg-violet-600 transition-all duration-500" 
            style={{ width: `${((index + 1) / TOTAL_QUESTIONS) * 100}%` }}
          ></div>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-16 leading-tight text-gray-900">
        {current.question}
      </h1>

      <div className="flex flex-col gap-8">
        {current.options.map((opt) => {
          const isSelected = selected === opt.key
          const isCorrect = confirmed && opt.key === current.answer
          const isWrong = confirmed && isSelected && opt.key !== current.answer

          return (
            <button
              key={opt.key}
              disabled={confirmed}
              onClick={() => setSelected(opt.key)}
              className={`group p-6 border-2 rounded-3xl text-left transition-all flex items-center gap-8
                ${isSelected ? "border-violet-500 bg-violet-50 scale-[1.02]" : "border-gray-100 hover:border-violet-200 hover:bg-gray-50"}
                ${isCorrect ? "bg-green-100 border-green-500 shadow-none scale-[1.02]" : ""}
                ${isWrong ? "bg-red-100 border-red-500 shadow-none scale-[1.02]" : ""}
              `}
            >
              <span className={`w-14 h-14 flex items-center justify-center rounded-2xl font-black text-2xl shadow-inner
                ${isSelected ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"}
                ${isCorrect ? "bg-green-500 text-white" : ""}
                ${isWrong ? "bg-red-500 text-white" : ""}
              `}>
                {opt.key}
              </span>
              <span className="text-xl font-bold text-gray-700">{opt.text}</span>
            </button>
          )
        })}
      </div>

      {confirmed && (
        <div className={`mt-8 rounded-2xl px-6 py-4 font-semibold ${isAnswerCorrect ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
          {isAnswerCorrect
            ? `Bonne réponse ! ${current.answer} est correct.`
            : `Mauvaise réponse. La bonne réponse est ${current.answer}${selectedOption ? ` (tu as choisi ${selectedOption.key}).` : "."}`}
        </div>
      )}

      <div className="mt-16 flex justify-end">
        {!confirmed ? (
          <button 
            disabled={!selected}
            onClick={handleConfirm}
            className="bg-violet-700 text-white px-16 py-5 rounded-[2.5rem] font-black text-xl hover:bg-violet-800 disabled:opacity-10 transition-all shadow-xl active:scale-95"
          >
            VÉRIFIER
          </button>
        ) : (
          <button 
            onClick={handleNext} 
            className="bg-violet-900 text-white px-16 py-5 rounded-[2.5rem] font-black text-xl hover:bg-violet-950 transition-all shadow-xl active:scale-95"
          >
            {index + 1 === TOTAL_QUESTIONS ? "VOIR RÉSULTATS" : "SUIVANT"}
          </button>
        )}
      </div>
      </div>
    </div>
  )
}