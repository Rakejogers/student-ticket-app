import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Component() {
    return (
        <div className="container mx-auto py-10">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Terms of Service for Scholar Seats</CardTitle>
                    <p className="text-muted-foreground"><strong>Last Updated:</strong> 11/8/2024</p>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                        <div className="space-y-6">
                            <section>
                                <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
                                <p>
                                    By using Scholar Seats, you agree to abide by these Terms of Service. If you disagree with any part, please do not use the app.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">2. Account Registration</h2>
                                <p>
                                    You must be a verified student to create an account. You agree to provide accurate information and update it as necessary.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">3. User Responsibilities</h2>
                                <p>
                                    You agree to:
                                </p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>List only legitimate tickets that you have the right to sell.</li>
                                    <li>Not engage in fraudulent, illegal, or abusive behavior.</li>
                                    <li>Handle payments responsibly with the chosen platform (e.g., Venmo, Cash App).</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">4. Transactions</h2>
                                <p>
                                    Scholar Seats facilitates connections but does not handle payments. Users are responsible for managing their transactions directly.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">5. Disclaimers</h2>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>No Liability:</strong> We are not responsible for issues related to ticket transactions, including disputes, losses, or damages.</li>
                                    <li><strong>Service Availability:</strong> We reserve the right to modify, suspend, or discontinue the service at any time without notice.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">6. Limitation of Liability</h2>
                                <p>
                                    In no event will Scholar Seats, its officers, directors, employees, or agents be liable for any indirect, incidental, or consequential damages.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">7. Changes to Terms</h2>
                                <p>
                                    We may update these Terms periodically. Continued use of the app after any changes constitutes acceptance of the new Terms.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-2">8. Contact Us</h2>
                                <p>
                                    For questions about these Terms, please reach out at support@support.scholarseats.com
                                </p>
                            </section>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}