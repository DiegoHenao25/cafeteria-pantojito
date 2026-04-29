"use client"

import { useState, useEffect, useCallback } from "react"

// Hook para un timer global que actualiza cada segundo
// Evita crear multiples setInterval por cada pedido
export function useGlobalTimer() {
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Calcula el tiempo restante en segundos
  const getTimeRemaining = useCallback((createdAt: string, estimatedMinutes: number): number => {
    const created = new Date(createdAt).getTime()
    const deadline = created + estimatedMinutes * 60 * 1000
    const remaining = Math.floor((deadline - currentTime) / 1000)
    return Math.max(0, remaining)
  }, [currentTime])

  // Formatea segundos a MM:SS
  const formatTime = useCallback((seconds: number): string => {
    if (seconds <= 0) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  // Obtiene el color segun tiempo restante
  const getTimeColor = useCallback((seconds: number): "green" | "yellow" | "red" => {
    const minutes = seconds / 60
    if (minutes > 15) return "green"
    if (minutes >= 5) return "yellow"
    return "red"
  }, [])

  // Obtiene el porcentaje de progreso (para barra de progreso)
  const getProgress = useCallback((createdAt: string, estimatedMinutes: number): number => {
    const remaining = getTimeRemaining(createdAt, estimatedMinutes)
    const total = estimatedMinutes * 60
    return Math.max(0, Math.min(100, ((total - remaining) / total) * 100))
  }, [getTimeRemaining])

  return {
    currentTime,
    getTimeRemaining,
    formatTime,
    getTimeColor,
    getProgress
  }
}
