'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CiAt, CiCircleAlert, CiLock, CiUser } from "react-icons/ci"
import Input46 from '@/components/orginui/phoneInput'
import pb from '@/app/pocketbase'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { Filter } from 'bad-words'

const formFields = [
  { id: 'name', label: 'Name', icon: CiUser, type: 'text', placeholder: 'Your Name' },
  { id: 'email', label: 'Student Email', icon: CiAt, type: 'email', placeholder: 'your.name@uky.edu' },
  { id: 'phone', label: 'Phone Number', icon: null, type: 'phone', placeholder: '' },
  { id: 'password', label: 'Password', icon: CiLock, type: 'password', placeholder: 'Enter your password' },
  { id: 'confirmPassword', label: 'Confirm Password', icon: CiLock, type: 'password', placeholder: 'Confirm your password' },
  { id: 'inviteCode', label: 'Invite Code', icon: null, type: 'text', placeholder: 'Enter your invite code' },
]

export default function AnimatedSignUpForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    inviteCode: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const validateStep = () => {
    const currentField = formFields[currentStep]
    const value = formData[currentField.id as keyof typeof formData]

    if (!value) {
      toast({
          title: `No ${currentField.label} entered`,
          description: `Please enter your ${currentField.label.toLowerCase()}`,
          variant: "destructive",
      });
    //   setError(`Please enter your ${currentField.label.toLowerCase()}`)
      return false
    }

    if (currentField.id === 'name' && value.length < 2) {
        toast({
            title: "Invalid Name",
            description: 'Name must be at least 2 characters long',
            variant: "destructive",
        });
        return false
    }

    const filter = new Filter();
    if (currentField.id === 'name' && filter.clean(value) !== value) {
        toast({
            title: "Invalid Name",
            description: "Name can not use inappropriate language.",
            variant: "destructive",
        });
        return false
    }

    if (currentField.id === 'email' && !value.endsWith('@uky.edu')) {
        toast({
            title: "Invalid Email",
            description: 'Please use a valid uky.edu email address',
            variant: "destructive",
        });
        // setError('Please use a valid uky.edu email address')
        return false
    }

    if (currentField.id === 'password' && value.length < 8) {
        toast({
            title: "Invalid Password",
            description: 'Password must be at least 8 characters long',
            variant: "destructive",
        });
        // setError('Password must be at least 8 characters long')
        return false
    }

    if (currentField.id === 'confirmPassword' && value !== formData.password) {
        toast({
            title: "Passwords do not match",
            description: 'Both passwords have to match',
            variant: "destructive",
        });
        // setError('Passwords do not match')
        return false
    }

    if (currentField.id === 'inviteCode' && value !== 'UKY2024-Beta-1') {
        toast({
            title: "Invalid Code",
            description: 'Please enter a valid invite code',
            variant: "destructive",
        });
        // setError('Invalid invite code')
        return false
    }

    if (currentField.id === 'phone') {
      const phoneRegex = /^\+?1?\s*\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/
      if (!phoneRegex.test(value) || value.length < 12) {
        toast({
            title: "Invalid Number",
            description: "Please enter a valid phone number.",
            variant: "destructive",
        });
        // setError("Please enter a valid phone number.")
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

  const login = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password)
      await pb.collection('users').requestVerification(email)
      setIsLoading(false)
      router.push('/signup/verify')
    } catch (error) {
      console.error('Login failed:', error)
      setError('Login failed. Please try again.')
    }
  }

  const register = async () => {
    setIsLoading(true)
    try {
      const data = {
        email: formData.email,
        emailVisibility: true,
        password: formData.password,
        passwordConfirm: formData.password,
        name: formData.name,
        seller_rating: 100,
        details: formData.inviteCode,
        phone: formData.phone
      }

      await pb.collection('users').create(data)
      await login(formData.email, formData.password)
    } catch (error) {
      console.error('Registration failed:', error)
      setError('Registration failed. Please try again.')
      setIsLoading(false)
    }
  }

  const handleSubmit = () => {
    if (validateStep()) {
      register()
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