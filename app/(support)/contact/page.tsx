'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/hooks/use-toast"
import pb from '@/app/pocketbase'

const faqs = [
    { question: "How does the ticket marketplace work?", answer: "Our app allows students to buy and sell tickets directly from one another. Sellers list their tickets with event details, and buyers can browse, message, and finalize deals directly with them. It's a peer-to-peer, fee-free marketplace made just for students!" },
    { question: "How do I verify my student status?", answer: "You sign in with your official university's Single Sign-On, which automatically verifies that you attend that university. We never handle or see your university credentials; they are managed by your university." },
    { question: "Are there any fees for using Scholar Seats?", answer: "Scholar Seats is completely free for students to use. We don't charge any fees for listing or purchasing tickets." },
    { question: "How is the app kept safe for students?", answer: "We require student verification at sign-up, so only verified students can use the platform. Plus, we have a reputation and rating system to help ensure trust and accountability among users." },
    { question: "How are payments handled?", answer: "Payments are made directly between the buyer and seller, using platforms like Venmo, Cash App, or any payment method you agree on. This keeps things simple and flexible!" },
    { question: "What univeristies are supported?", answer: "Currently we are only supported at the Univerity of Kentucky, but we plan to roll out to other universites soon!" },
  ]

export default function ContactPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [contactType, setContactType] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !email || !message || !contactType) {
            toast({
                title: "Error",
                description: "Please fill out all fields.",
                variant: "destructive",
            })
            return
        }

        try {
            await pb.collection('support').create({
                name,
                email,
                message,
                type: contactType,
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
        setContactType('')
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
            
            {/* <div className="grid md:grid-cols-2 gap-8 mb-12"> */}
            <div className="mb-12 mx-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Send us a message</CardTitle>
                        <CardDescription>We&apos;ll get back to you as soon as possible.</CardDescription>
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
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="contactType">Contact Reason</Label>
                                    <Select onValueChange={setContactType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a reason" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bug">Bug/Error</SelectItem>
                                            <SelectItem value="feedback">Feedback</SelectItem>
                                            <SelectItem value="report">Report</SelectItem>
                                            <SelectItem value="business">Business Contact</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Your message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full mt-4">Send Message</Button>
                        </form>
                    </CardContent>
                </Card>
                
                {/* <Card>
                    <CardHeader>
                        <CardTitle>Other Ways to Reach Us</CardTitle>
                        <CardDescription>Choose the method that works best for you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Mail className="h-5 w-5" />
                            <span></span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="h-5 w-5" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5" />
                            <span>123 Example St, City, State 12345</span>
                        </div>
                    </CardContent>
                </Card> */}
            </div>
            
            <Card className="mb-8 mx-4">
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Find quick answers to common questions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full text-sm">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                </CardContent>
            </Card>
            
            {/* <Card>
                <CardHeader>
                    <CardTitle>Need More Help?</CardTitle>
                    <CardDescription>Check out our help center for detailed guides and tutorials.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Our help center contains a wealth of information to help you get the most out of our product.</p>
                </CardContent>
                <CardFooter>
                    <Link href="/help-center">
                        <Button variant="outline">Visit Help Center</Button>
                    </Link>
                </CardFooter>
            </Card> */}
        </div>
    )
}