const sections = [
  {
    h: "1. What we collect",
    p: "Account details (name, email, phone, city), listings and messages you create, and transaction records needed to facilitate donations.",
  },
  {
    h: "2. How we use it",
    p: "To run the marketplace: matching buyers and sellers, processing payments, routing donations, preventing fraud, and providing support.",
  },
  {
    h: "3. What we never do",
    p: "We do not sell your personal data. Exact addresses are never stored or shown publicly.",
  },
  {
    h: "4. Your controls",
    p: "You can export your data or delete your account at any time from Settings. Deleting your account removes your personal data.",
  },
  {
    h: "5. Chat monitoring",
    p: "Messages may be reviewed for safety and moderation purposes, as disclosed here and in the Terms.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-[11px] font-bold uppercase tracking-wide text-brand">
        Legal
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sand-500">
        Placeholder copy — to be reviewed for CCPA/GDPR compliance before launch.
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
