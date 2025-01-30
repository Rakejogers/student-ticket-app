'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CiCircleAlert, CiUser } from "react-icons/ci"
import Input46 from '@/components/orginui/phoneInput'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { Filter } from 'bad-words'
import pb from '@/app/pocketbase'

const formFields = [
  { id: 'name', label: 'Name', icon: CiUser, type: 'text', placeholder: 'Your Name' },
  { id: 'phone', label: 'Phone Number (Optional)', icon: null, type: 'phone', placeholder: '' },
]

export default function AnimatedSignUpForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [isLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const validateStep = () => {
    const currentField = formFields[currentStep]
    const value = formData[currentField.id as keyof typeof formData]

    if (currentField.id === 'name') {
      if (!value) {
        toast({
          title: "No Name entered",
          description: "Please enter your name",
          variant: "destructive",
        });
        return false
      }

      if (value.length < 2) {
        toast({
          title: "Invalid Name",
          description: 'Name must be at least 2 characters long',
          variant: "destructive",
        });
        return false
      }

      const filter = new Filter();
      if (filter.clean(value) !== value) {
        toast({
          title: "Invalid Name",
          description: "Name cannot use inappropriate language.",
          variant: "destructive",
        });
        return false
      }
    }

    if (currentField.id === 'phone' && value) {
      const phoneRegex = /^\+?1?\s*\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/
      if (!phoneRegex.test(value) || value.length < 12) {
        toast({
          title: "Invalid Number",
          description: "Please enter a valid phone number or leave it empty for now.",
          variant: "destructive",
        });
        return false
      }
    }

    setError('')
    return true
  }

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < formFields.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (validateStep()) {
      // Handle the submission of name and phone
      await pb.collection('users').update(
        pb.authStore.model?.id,
        { name: formData.name,
          phone: formData.phone,
          emailVisibility: true, 
      })
      console.log('Form submitted:', formData)
      // Add your submission logic here
      router.push('/browse/events') // or wherever you want to redirect after
    }
  }

  const currentField = formFields[currentStep]

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor={currentField.id}>{currentField.label}</Label>
            {currentField.id === 'phone' && (
              <p className="text-sm text-muted-foreground">
                You can skip this step and add your phone number later in your profile settings.
              </p>
            )}
            <div className="relative">
              {currentField.icon && (
                <currentField.icon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              )}
              {currentField.type === 'phone' ? (
                <Input46
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                />
              ) : (
                <Input
                  id={currentField.id}
                  type={currentField.type}
                  placeholder={currentField.placeholder}
                  className={currentField.icon ? 'pl-8' : ''}
                  value={formData[currentField.id as keyof typeof formData]}
                  onChange={(e) => handleInputChange(currentField.id, e.target.value)}
                />
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <CiCircleAlert className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between mt-6">
        <Button onClick={prevStep} disabled={currentStep === 0 || isLoading}>
          Previous
        </Button>
        <Button onClick={nextStep} disabled={isLoading}>
          {currentStep === formFields.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Step {currentStep + 1} of {formFields.length}
      </div>
    </div>
  )
}