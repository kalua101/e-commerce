export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
      
      <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">2. Use of Service</h2>
          <p>You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Transmit any harmful or malicious code</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use automated systems to access the service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">3. Account Registration</h2>
          <p>
            To make purchases, you may need to create an account. You are responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">4. Orders and Payments</h2>
          <p>
            All orders are subject to acceptance and availability. We reserve the right to refuse
            or cancel any order for any reason. Prices are subject to change without notice.
          </p>
          <p className="mt-4">
            Payment must be received before order processing. We accept major credit cards through
            our secure payment processor, Stripe.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Shipping and Delivery</h2>
          <p>
            Shipping times are estimates and not guaranteed. We are not responsible for delays
            caused by shipping carriers or circumstances beyond our control.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">6. Returns and Refunds</h2>
          <p>
            Please see our Refund Policy for detailed information about returns and refunds.
            Generally, items must be returned within 30 days in original condition.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">7. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and images, is the
            property of Shopping or its content suppliers and is protected by intellectual
            property laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
          <p>
            We shall not be liable for any indirect, incidental, special, consequential, or
            punitive damages resulting from your use of or inability to use the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the service
            after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at:
            <br />
            Email: support@shopping.com
          </p>
        </section>

        <p className="text-sm text-gray-400 mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
