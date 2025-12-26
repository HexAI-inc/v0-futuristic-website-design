"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Drawer, 
  DrawerContent, 
  DrawerDescription, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger,
  DrawerClose,
  DrawerFooter
} from "@/components/ui/drawer"
import { Heart, Calendar, Loader2, CheckCircle, X } from "lucide-react"
import { toast } from "sonner"

const actionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please provide a bit more detail"),
})

type ActionFormData = z.infer<typeof actionSchema>

interface ResourceActionsProps {
  resourceId: string
  resourceName: string
  resourceType: "icca" | "park" | "biosphere"
}

export function ResourceActions({ resourceId, resourceName, resourceType }: ResourceActionsProps) {
  const [activeType, setActiveType] = useState<"support" | "visit" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ActionFormData>({
    resolver: zodResolver(actionSchema),
  })

  const onSubmit = async (data: ActionFormData) => {
    if (!activeType) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/communications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          type: activeType,
          target_id: resourceId,
          target_type: resourceType,
          target_name: resourceName,
          subject: activeType === "support" 
            ? `Support Request for ${resourceName}` 
            : `Visit Planning for ${resourceName}`,
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        toast.success("Request sent successfully!")
        reset()
      } else {
        toast.error("Failed to send request. Please try again.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setActiveType(null)
      setIsSuccess(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <Drawer onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={() => setActiveType("support")}
          >
            <Heart className="h-5 w-5" />
            Support this {resourceType.toUpperCase()}
          </Button>
        </DrawerTrigger>
        <DrawerTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full gap-2" 
            size="lg"
            onClick={() => setActiveType("visit")}
          >
            <Calendar className="h-5 w-5" />
            Plan a Visit
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <div className="mx-auto w-full max-w-lg">
            {isSuccess ? (
              <div className="py-12 text-center space-y-4 px-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold">Request Sent!</h3>
                <p className="text-muted-foreground">
                  Thank you for your interest in {resourceName}. Our team will get back to you shortly.
                </p>
                <DrawerClose asChild>
                  <Button className="mt-4 w-full">
                    Close
                  </Button>
                </DrawerClose>
              </div>
            ) : (
              <>
                <DrawerHeader className="text-left">
                  <DrawerTitle className="text-2xl">
                    {activeType === "support" ? "Support" : "Visit"} {resourceName}
                  </DrawerTitle>
                  <DrawerDescription>
                    {activeType === "support" 
                      ? `Tell us how you'd like to support this ${resourceType}.`
                      : `Let us know when you're planning to visit ${resourceName} and what you're interested in seeing.`}
                  </DrawerDescription>
                </DrawerHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4 pb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        {...register("name")} 
                        placeholder="Your name"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        {...register("email")} 
                        placeholder="your@email.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input id="phone" {...register("phone")} placeholder="+220 ..." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {activeType === "support" ? "How would you like to help?" : "Visit details"}
                    </Label>
                    <Textarea 
                      id="message" 
                      {...register("message")} 
                      placeholder={activeType === "support" 
                        ? "I'm interested in volunteering/donating/learning more..." 
                        : "I'm planning to visit in December with a group of 4..."}
                      className={`min-h-[120px] ${errors.message ? "border-red-500" : ""}`}
                    />
                    {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Request"
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
