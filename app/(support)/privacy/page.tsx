import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PrivacyPage() {
    return (
        <div className="container mx-auto py-10">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Privacy Policy for Scholar Seats</CardTitle>
                    <p className="text-muted-foreground"><strong>Last Updated:</strong> 11/8/2024</p>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                        <div className="space-y-6">
                            <section>
                                <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
                                <p>
                                    Scholar Seats (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this policy carefully to understand our views and practices regarding your data.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">2. Information We Collect</h2>
                                <p><strong>Personal Information:</strong> When you register, we may collect personal details such as your name, university email address, and student ID for verification purposes.</p>
                                <p><strong>Usage Data:</strong> We collect information on how you access and use the app, including device information and browsing activities within the app.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Information</h2>
                                <p><strong>To Provide the Service:</strong> We use your information to facilitate transactions between buyers and sellers, verify students, and manage your account.</p>
                                <p><strong>To Improve Our Services:</strong> Usage data helps us optimize app performance and understand user needs.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">4. Sharing Your Information</h2>
                                <p>We do not share your information with third parties except as necessary for services such as:</p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>Service Providers:</strong> For technical support, hosting, and analytics.</li>
                                    <li><strong>Legal Requirements:</strong> If required to comply with legal obligations or protect our rights.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">5. Your Rights</h2>
                                <p>You have the right to:</p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Access, update, or delete your personal information.</li>
                                    <li>Request a copy of your data or ask questions about how it&apos;s used.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">6. Data Security</h2>
                                <p>We employ security measures to protect your information, but no method of transmission or storage is entirely secure. We cannot guarantee absolute security.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">7. Contact Us</h2>
                                <p>For questions or to exercise your rights, please contact us at support@support.scholarseats.com</p>
                            </section>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}