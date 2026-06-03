const sections = [
  {
    h: "1. Overview",
    p: "Marketplace for Non-Profits is a commercial technology platform that lets people sell secondhand goods and route the proceeds to verified nonprofits. We are not a nonprofit ourselves.",
  },
  {
    h: "2. Accounts",
    p: "You are responsible for the activity on your account and for keeping your credentials secure. You must provide accurate information and be eligible to transact in your jurisdiction.",
  },
  {
    h: "3. Listings & sales",
    p: "Sellers warrant they have the right to sell listed items and that items are not prohibited. The platform is not responsible for item quality or transaction disputes beyond the tools it provides.",
  },
  {
    h: "4. Payments & donations",
    p: "Payments are processed and held by our payment provider until both parties confirm the meetup. Donations are routed to the selected nonprofit. Donations are not tax-deductible from the platform.",
  },
  {
    h: "5. Prohibited items",
    p: "Weapons, drugs, alcohol, tobacco, stolen or counterfeit goods, animals, hazardous materials, and other restricted items may not be listed.",
  },
  {
    h: "6. Termination",
    p: "We may suspend or ban accounts that violate these terms or harm the community.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
        Legal
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">
        Terms of Service
      </h1>
      <p className="mt-2 text-sand-500">
        Placeholder copy — to be drafted with a licensed attorney before launch.
      </p>
      <div className="mt-8 space-y-7">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-lg font-bold">{s.h}</h2>
            <p className="mt-1.5 text-sand-700">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
