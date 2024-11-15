'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import pb from '@/app/pocketbase'

export default function ContactPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !email || !message) {
            toast({
                title: "Error",
                description: "Please fill out all fields.",
                variant: "destructive",
            })
            return
        }


        try {
         //submit form
         await pb.collection('support').create({
            name,
            email,
            message,
            type: 'contact',
         })
         toast({
            title: "Message Sent",
            description: "We've received your message and will get back to you soon.",
            })
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            console.error('Error submitting form:', (error as any).response)
            toast({
                title: "Error",
                description: "An error occurred. Please try again.",
                variant: "destructive",
               })
        }
        // Reset form fields
        setName('')
        setEmail('')
        setMessage('')
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Contact Us</CardTitle>
                    <CardDescription>Send us a message and we&apos;ll get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="Your email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Your message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="submit" onClick={handleSubmit}>Send Message</Button>
                </CardFooter>
            </Card>
        </div>
    )
}