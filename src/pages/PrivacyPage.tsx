
interface PrivacyPageProps {
  language: string;
}

export function PrivacyPage({ language }: PrivacyPageProps) {
  const content = {
    English: {
      title: "Privacy Policy",
      content: "This is a placeholder for the privacy policy content. Replace this with your actual privacy policy."
    },
    Русский: {
      title: "Политика конфиденциальности",
      content: "Это место для содержания политики конфиденциальности. Замените это на вашу актуальную политику конфиденциальности."
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{content[language as keyof typeof content].title}</h1>
        <p>{content[language as keyof typeof content].content}</p>
      </div>
    </main>
  );
}

