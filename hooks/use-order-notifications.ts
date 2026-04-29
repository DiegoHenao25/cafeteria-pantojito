"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: number
  tiempoRecogida: number
  createdAt: string
  estado: string
  clienteNombre?: string
  orderItems?: Array<{ product: { nombre: string } }>
}

interface NotifiedIntervals {
  [orderId: number]: Set<number>
}

// Hook para manejar notificaciones de pedidos
export function useOrderNotifications(orders: Order[], currentTime: number) {
  const { toast } = useToast()
  const notifiedIntervalsRef = useRef<NotifiedIntervals>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")

  // Inicializar audio
  useEffect(() => {
    // Crear audio element con un beep sintetizado
    audioRef.current = new Audio()
    audioRef.current.volume = 0.5
    
    // Solicitar permisos de notificacion
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission)
      })
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Funcion para reproducir sonido de alerta
  const playAlertSound = useCallback(() => {
    try {
      // Usar Web Audio API para generar un beep
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800 // Frecuencia del beep
      oscillator.type = "sine"
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
      
      // Segundo beep
      setTimeout(() => {
        const osc2 = audioContext.createOscillator()
        const gain2 = audioContext.createGain()
        osc2.connect(gain2)
        gain2.connect(audioContext.destination)
        osc2.frequency.value = 1000
        osc2.type = "sine"
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime)
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        osc2.start(audioContext.currentTime)
        osc2.stop(audioContext.currentTime + 0.2)
      }, 150)
    } catch {
      // Fallback silencioso si Web Audio no esta disponible
    }
  }, [])

  // Funcion para enviar notificacion del sistema
  const sendSystemNotification = useCallback((title: string, body: string) => {
    if (notificationPermission === "granted") {
      try {
        new Notification(title, {
          body,
          icon: "/logo.jpeg",
          badge: "/logo.jpeg",
          tag: `order-notification-${Date.now()}`,
          requireInteraction: false
        })
      } catch {
        // Silenciosamente fallar si no se puede crear notificacion
      }
    }
  }, [notificationPermission])

  // Funcion para vibrar en movil
  const vibrate = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([100, 50, 100])
    }
  }, [])

  // Verificar notificaciones cada segundo
  useEffect(() => {
    const activeOrders = orders.filter(o => 
      o.estado === "pendiente" || o.estado === "en_proceso"
    )

    activeOrders.forEach(order => {
      const created = new Date(order.createdAt).getTime()
      const deadline = created + order.tiempoRecogida * 60 * 1000
      const remainingMs = deadline - currentTime
      const remainingMinutes = Math.floor(remainingMs / 60000)

      // Inicializar set de intervalos notificados si no existe
      if (!notifiedIntervalsRef.current[order.id]) {
        notifiedIntervalsRef.current[order.id] = new Set()
      }

      const notified = notifiedIntervalsRef.current[order.id]

      // Intervalos de notificacion: cada 5 minutos
      const notificationIntervals = [30, 25, 20, 15, 10, 5, 3, 1, 0]
      
      notificationIntervals.forEach(interval => {
        // Notificar cuando el tiempo restante coincide con el intervalo
        // y no se ha notificado aun
        if (remainingMinutes <= interval && !notified.has(interval)) {
          notified.add(interval)

          const productName = order.orderItems?.[0]?.product?.nombre || "Pedido"
          
          let message: string
          if (interval === 0) {
            message = `Pedido #${order.id} - Tiempo cumplido!`
          } else if (interval <= 3) {
            message = `URGENTE: Pedido #${order.id} - Solo ${interval} min!`
          } else {
            message = `Pedido #${order.id} (${productName}) - ${interval} min restantes`
          }

          // Mostrar toast
          toast({
            title: interval <= 3 ? "Pedido Urgente!" : "Recordatorio de Pedido",
            description: message,
            variant: interval <= 3 ? "destructive" : "default",
            duration: interval <= 3 ? 8000 : 5000,
          })

          // Reproducir sonido
          playAlertSound()

          // Enviar notificacion del sistema
          sendSystemNotification(
            interval <= 3 ? "Pedido Urgente!" : "Pantojitos - Pedido",
            message
          )

          // Vibrar en movil para urgentes
          if (interval <= 5) {
            vibrate()
          }
        }
      })
    })

    // Limpiar intervalos de pedidos que ya no existen
    const activeOrderIds = new Set(orders.map(o => o.id))
    Object.keys(notifiedIntervalsRef.current).forEach(id => {
      if (!activeOrderIds.has(Number(id))) {
        delete notifiedIntervalsRef.current[Number(id)]
      }
    })
  }, [orders, currentTime, toast, playAlertSound, sendSystemNotification, vibrate])

  return {
    notificationPermission,
    requestPermission: () => {
      if (typeof window !== "undefined" && "Notification" in window) {
        Notification.requestPermission().then(setNotificationPermission)
      }
    }
  }
}
