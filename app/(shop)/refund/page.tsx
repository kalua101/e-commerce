export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Refund Policy</h1>
      
      <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">30-Day Money-Back Guarantee</h2>
          <p>
            We want you to be completely satisfied with your purchase. If you're not happy with your
            order, you can return it within 30 days for a full refund.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Return Conditions</h2>
          <p>To be eligible for a return, items must:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Be in original condition and packaging</li>
            <li>Include all accessories and documentation</li>
            <li>Not be damaged or show signs of use</li>
            <li>Be returned within 30 days of delivery</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Non-Returnable Items</h2>
          <p>The following items cannot be returned:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personalized or custom-made items</li>
            <li>Digital products or downloads</li>
            <li>Opened hygiene products</li>
            <li>Gift cards</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">How to Request a Return</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Contact our support team at support@shopping.com</li>
            <li>Provide your order number and reason for return</li>
            <li>Receive return shipping instructions</li>
            <li>Ship the item back using a trackable method</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Refund Processing</h2>
          <p>
            Once we receive your return, we'll inspect it and process your refund within 5-7 business days.
            Refunds will be issued to the original payment method.
          </p>
          <p className="mt-4">
            Please note: Shipping costs are non-refundable unless the return is due to our error.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Exchanges</h2>
          <p>
            If you need a different size or color, please contact us to arrange an exchange.
            We'll cover return shipping for exchanges.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Damaged or Defective Items</h2>
          <p>
            If you receive a damaged or defective item, please contact us immediately with photos.
            We'll arrange for a replacement or full refund at no cost to you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
          <p>
            Questions about returns or refunds? Contact us at:
            <br />
            Email: support@shopping.com
            <br />
            We typically respond within 24 hours.
          </p>
        </section>

        <p className="text-sm text-gray-400 mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
