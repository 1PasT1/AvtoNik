import React from 'react';

interface TermsPageProps {
  language: string;
}

export function TermsPage({ language }: TermsPageProps) {
  const content = {
    English: {
      title: "Terms and Conditions",
      content: "This is a placeholder for the terms and conditions content. Replace this with your actual terms and conditions."
    },
    Русский: {
      title: "Условия использования",
      content: "Это место для содержания условий использования. Замените это на ваши актуальные условия использования."
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

