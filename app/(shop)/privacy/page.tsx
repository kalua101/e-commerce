export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
      
      <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name, email address, and contact information</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Shipping address and order history</li>
            <li>Account preferences and settings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Respond to your questions and provide customer support</li>
            <li>Improve our products and services</li>
            <li>Send marketing communications (with your consent)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
          <p>We do not sell your personal information. We share information only with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Payment processors (Stripe) to process transactions</li>
            <li>Shipping carriers to deliver your orders</li>
            <li>Service providers who assist our operations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies</h2>
          <p>
            We use cookies and similar technologies to improve your experience, analyze usage,
            and deliver personalized content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
          <p>
            For privacy-related questions or requests, please contact us at:
            <br />
            Email: privacy@shopping.com
          </p>
        </section>

        <p className="text-sm text-gray-400 mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
