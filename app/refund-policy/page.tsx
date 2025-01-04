import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function RefundPolicy() {
    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-16 max-w-4xl pt-32">
                <h1 className={`${playfair.className} text-4xl font-bold mb-8`}>Refund Policy</h1>

                <div className="prose max-w-none space-y-12">
                    <section>
                        <h2 className={`${playfair.className} text-2xl font-semibold mb-4`}>No Refund Policy</h2>
                        <p className="mb-6">
                            Due to the nature of our AI-powered service and the immediate consumption of computational resources, we maintain a strict no-refund policy. Once a service is used or credits are consumed, we cannot offer refunds.
                        </p>
                    </section>

                    <section>
                        <h2 className={`${playfair.className} text-2xl font-semibold mb-4`}>Why We Cannot Offer Refunds</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-2">Immediate Resource Consumption</h3>
                                <p>
                                    When you generate AI content, we immediately incur costs for:
                                </p>
                                <ul className="list-disc ml-6 mt-2">
                                    <li>GPU/CPU processing power</li>
                                    <li>API calls to AI models</li>
                                    <li>Server resources</li>
                                    <li>Bandwidth usage</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-2">Real-Time Processing</h3>
                                <p>
                                    Each generation request consumes computational resources in real-time. These resources cannot be recovered or reused once consumed, similar to other utility services.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-2">AI Operating Costs</h3>
                                <p>
                                    AI technology requires significant investment in:
                                </p>
                                <ul className="list-disc ml-6 mt-2">
                                    <li>High-performance computing infrastructure</li>
                                    <li>AI model licensing and maintenance</li>
                                    <li>Technical support and monitoring</li>
                                    <li>System optimization and updates</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className={`${playfair.className} text-2xl font-semibold mb-4`}>Recommendations Before Purchase</h2>
                        <div className="space-y-4">
                            <p>To ensure the best experience with our service, we recommend:</p>
                            <ul className="list-disc ml-6">
                                <li>Testing with a smaller credit package first</li>
                                <li>Reviewing our documentation thoroughly</li>
                                <li>Understanding our service capabilities and limitations</li>
                                <li>Checking system requirements and compatibility</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className={`${playfair.className} text-2xl font-semibold mb-4`}>Technical Support</h2>
                        <p>
                            While we cannot offer refunds, we are committed to providing technical support if you encounter issues with our service. Please contact our support team for assistance with any technical difficulties you may experience.
                        </p>
                    </section>

                    <section>
                        <h2 className={`${playfair.className} text-2xl font-semibold mb-4`}>Exceptions</h2>
                        <p>
                            In cases where our service experiences significant technical failures preventing the delivery of purchased services, we may, at our discretion, provide compensation in the form of service credits for future use.
                        </p>
                    </section>

                    <div className="text-sm text-gray-600 mt-12 pt-8 border-t">
                        <p>Last Modified: {new Date().toLocaleDateString()}</p>
                        <p className="mt-2">
                            For any questions about this policy, please contact our support team.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
} 