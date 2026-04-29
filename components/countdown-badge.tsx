"use client"

import { cn } from "@/lib/utils"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"

interface CountdownBadgeProps {
  timeRemaining: number // en segundos
  formattedTime: string
  color: "green" | "yellow" | "red"
  progress: number // 0-100
  showProgress?: boolean
  size?: "sm" | "md" | "lg"
}

export function CountdownBadge({
  timeRemaining,
  formattedTime,
  color,
  progress,
  showProgress = true,
  size = "md"
}: CountdownBadgeProps) {
  const isExpired = timeRemaining <= 0

  const colorStyles = {
    green: {
      bg: "bg-[#7BB39C]/20",
      border: "border-[#7BB39C]",
      text: "text-[#7BB39C]",
      progressBg: "bg-[#7BB39C]",
      icon: Clock
    },
    yellow: {
      bg: "bg-[#e9e076]/30",
      border: "border-[#e9e076]",
      text: "text-[#655642]",
      progressBg: "bg-[#e9e076]",
      icon: Clock
    },
    red: {
      bg: "bg-[#d38488]/20",
      border: "border-[#d38488]",
      text: "text-[#d38488]",
      progressBg: "bg-[#d38488]",
      icon: AlertTriangle
    }
  }

  const sizeStyles = {
    sm: {
      container: "px-2 py-1",
      text: "text-xs",
      icon: "w-3 h-3"
    },
    md: {
      container: "px-3 py-2",
      text: "text-sm",
      icon: "w-4 h-4"
    },
    lg: {
      container: "px-4 py-3",
      text: "text-base",
      icon: "w-5 h-5"
    }
  }

  const styles = colorStyles[color]
  const sizes = sizeStyles[size]
  const Icon = isExpired ? CheckCircle : styles.icon

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 overflow-hidden transition-all duration-300",
        styles.bg,
        styles.border,
        sizes.container,
        isExpired && "animate-pulse",
        color === "red" && !isExpired && "shadow-lg shadow-[#d38488]/30"
      )}
    >
      {/* Barra de progreso de fondo */}
      {showProgress && !isExpired && (
        <div
          className={cn(
            "absolute bottom-0 left-0 h-1 transition-all duration-1000 ease-linear",
            styles.progressBg
          )}
          style={{ width: `${progress}%` }}
        />
      )}

      {/* Contenido */}
      <div className="relative flex items-center gap-2">
        <Icon
          className={cn(
            sizes.icon,
            styles.text,
            color === "red" && !isExpired && "animate-bounce"
          )}
        />
        <div className="flex flex-col">
          <span
            className={cn(
              "font-mono font-bold tabular-nums",
              sizes.text,
              styles.text
            )}
          >
            {isExpired ? "00:00" : formattedTime}
          </span>
          {isExpired && (
            <span className={cn("text-xs", styles.text)}>
              Tiempo cumplido
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
