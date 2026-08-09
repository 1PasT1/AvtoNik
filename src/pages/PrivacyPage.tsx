import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO } from '../components/SEO';

interface PrivacyPageProps {
  language: string;
}

/** One piece of a section: a paragraph, a bullet list, or the contact email. */
type Block =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'email'; address: string };

interface Section {
  heading: string;
  blocks: Block[];
}

interface Policy {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
}

const CONTACT_EMAIL = 'avtonikrental@gmail.com';

const content: Record<string, Policy> = {
  English: {
    title: 'Privacy Policy',
    updated: 'Last Updated: August 6, 2026',
    intro:
      'Welcome to AvtoNik. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains what information we collect, why we collect it, and how we handle it.',
    sections: [
      {
        heading: '1. Information We Collect',
        blocks: [
          {
            kind: 'p',
            text: 'When you make a booking through our website, we collect the following information:',
          },
          { kind: 'ul', items: ['Full Name', 'Phone Number', 'Email Address'] },
          {
            kind: 'p',
            text: 'We do not collect payment information through our website unless explicitly stated.',
          },
        ],
      },
      {
        heading: '2. Why We Collect Your Information',
        blocks: [
          { kind: 'p', text: 'Your personal information is collected solely to:' },
          {
            kind: 'ul',
            items: [
              'Process and manage your vehicle booking',
              'Contact you regarding your reservation if necessary',
              'Track active bookings and provide customer support',
            ],
          },
          { kind: 'p', text: 'Your information is never used for:' },
          {
            kind: 'ul',
            items: [
              'Marketing campaigns',
              'Promotional emails',
              'Selling or sharing customer data',
              'Advertising purposes',
            ],
          },
        ],
      },
      {
        heading: '3. Data Retention',
        blocks: [
          {
            kind: 'p',
            text: 'We retain your personal information for no longer than 30 days after it is submitted.',
          },
          {
            kind: 'p',
            text: 'After this period, your information is permanently deleted from our systems unless we are legally required to retain it for a longer period.',
          },
        ],
      },
      {
        heading: '4. How We Protect Your Data',
        blocks: [
          {
            kind: 'p',
            text: 'We take reasonable technical and organizational measures to protect your information against unauthorized access, loss, misuse, or disclosure.',
          },
        ],
      },
      {
        heading: '5. Data Sharing',
        blocks: [
          {
            kind: 'p',
            text: 'We do not sell, rent, trade, or share your personal information with any third party, organization, or marketing company.',
          },
          {
            kind: 'p',
            text: 'Your information remains solely within AvtoNik and is used only for booking management.',
          },
        ],
      },
      {
        heading: '6. Cookies',
        blocks: [
          {
            kind: 'p',
            text: 'Our website may use basic cookies necessary for the website to function properly. These cookies do not collect personal information for advertising or marketing purposes.',
          },
        ],
      },
      {
        heading: '7. Your Rights',
        blocks: [
          { kind: 'p', text: 'You have the right to:' },
          {
            kind: 'ul',
            items: [
              'Request access to the personal information we hold about you.',
              'Request correction of inaccurate information.',
              'Request deletion of your information before the 30-day retention period, unless it is required to complete an active booking or comply with legal obligations.',
            ],
          },
          {
            kind: 'p',
            text: 'To exercise these rights, please contact us using the information below.',
          },
        ],
      },
      {
        heading: '8. Contact Us',
        blocks: [
          {
            kind: 'p',
            text: 'If you have any questions regarding this Privacy Policy or how your data is handled, please contact us:',
          },
          { kind: 'p', text: 'AvtoNik' },
          { kind: 'email', address: CONTACT_EMAIL },
        ],
      },
      {
        heading: '9. Changes to This Privacy Policy',
        blocks: [
          {
            kind: 'p',
            text: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.',
          },
        ],
      },
    ],
  },

  Русский: {
    title: 'Политика конфиденциальности',
    updated: 'Последнее обновление: 6 августа 2026 г.',
    intro:
      'Добро пожаловать в AvtoNik. Мы ценим вашу конфиденциальность и стремимся защищать ваши персональные данные. Настоящая Политика конфиденциальности объясняет, какую информацию мы собираем, зачем мы это делаем и как мы обрабатываем ваши данные.',
    sections: [
      {
        heading: '1. Какие данные мы собираем',
        blocks: [
          {
            kind: 'p',
            text: 'При оформлении бронирования на нашем сайте мы собираем следующую информацию:',
          },
          {
            kind: 'ul',
            items: ['Полное имя', 'Номер телефона', 'Адрес электронной почты'],
          },
          {
            kind: 'p',
            text: 'Мы не собираем платежную информацию через наш сайт, если не указано иное.',
          },
        ],
      },
      {
        heading: '2. Для чего мы собираем ваши данные',
        blocks: [
          {
            kind: 'p',
            text: 'Ваши персональные данные используются исключительно для следующих целей:',
          },
          {
            kind: 'ul',
            items: [
              'Обработка и управление бронированием автомобиля;',
              'Связь с вами при необходимости по вопросам вашего бронирования;',
              'Отслеживание активных бронирований и предоставление клиентской поддержки.',
            ],
          },
          { kind: 'p', text: 'Ваши данные никогда не используются для:' },
          {
            kind: 'ul',
            items: [
              'Маркетинговых кампаний;',
              'Рассылки рекламных писем;',
              'Продажи или передачи третьим лицам;',
              'Рекламных или иных коммерческих целей.',
            ],
          },
        ],
      },
      {
        heading: '3. Срок хранения данных',
        blocks: [
          {
            kind: 'p',
            text: 'Мы храним ваши персональные данные не более 30 дней с момента их предоставления.',
          },
          {
            kind: 'p',
            text: 'По истечении этого срока ваши данные безвозвратно удаляются из наших систем, если иное не требуется в соответствии с действующим законодательством.',
          },
        ],
      },
      {
        heading: '4. Защита данных',
        blocks: [
          {
            kind: 'p',
            text: 'Мы принимаем разумные технические и организационные меры для защиты ваших персональных данных от несанкционированного доступа, утраты, неправомерного использования или раскрытия.',
          },
        ],
      },
      {
        heading: '5. Передача данных третьим лицам',
        blocks: [
          {
            kind: 'p',
            text: 'Мы не продаём, не сдаём в аренду, не обмениваем и не передаём ваши персональные данные каким-либо третьим лицам, организациям или маркетинговым компаниям.',
          },
          {
            kind: 'p',
            text: 'Ваши данные используются исключительно внутри AvtoNik для управления бронированиями.',
          },
        ],
      },
      {
        heading: '6. Файлы cookie',
        blocks: [
          {
            kind: 'p',
            text: 'Наш сайт может использовать только необходимые файлы cookie, обеспечивающие корректную работу сайта. Эти файлы cookie не используются для рекламы, маркетинга или отслеживания пользователей.',
          },
        ],
      },
      {
        heading: '7. Ваши права',
        blocks: [
          { kind: 'p', text: 'Вы имеете право:' },
          {
            kind: 'ul',
            items: [
              'Запросить информацию о ваших персональных данных, которые мы храним;',
              'Потребовать исправления неточных данных;',
              'Потребовать удаления ваших данных до истечения 30-дневного срока хранения, если они больше не требуются для выполнения активного бронирования или соблюдения требований законодательства.',
            ],
          },
          {
            kind: 'p',
            text: 'Для реализации этих прав свяжитесь с нами, используя контактную информацию ниже.',
          },
        ],
      },
      {
        heading: '8. Свяжитесь с нами',
        blocks: [
          {
            kind: 'p',
            text: 'Если у вас возникли вопросы относительно настоящей Политики конфиденциальности или обработки ваших персональных данных, пожалуйста, свяжитесь с нами:',
          },
          { kind: 'p', text: 'AvtoNik' },
          { kind: 'email', address: CONTACT_EMAIL },
        ],
      },
      {
        heading: '9. Изменения в Политике конфиденциальности',
        blocks: [
          {
            kind: 'p',
            text: 'Мы можем время от времени обновлять настоящую Политику конфиденциальности. Все изменения будут опубликованы на этой странице с указанием новой даты последнего обновления.',
          },
        ],
      },
    ],
  },
};

function renderBlock(block: Block, index: number) {
  if (block.kind === 'ul') {
    return (
      <ul key={index} className="list-disc space-y-2 pl-6 text-gray-700">
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.kind === 'email') {
    return (
      <p key={index} className="text-gray-700">
        Email:{' '}
        <a
          href={`mailto:${block.address}`}
          className="font-medium text-orange-600 underline underline-offset-2 hover:text-orange-700"
        >
          {block.address}
        </a>
      </p>
    );
  }

  return (
    <p key={index} className="leading-relaxed text-gray-700">
      {block.text}
    </p>
  );
}

export function PrivacyPage({ language }: PrivacyPageProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Fall back to English if an unexpected language value ever arrives, so
  // the page can never render blank.
  const policy = content[language] ?? content.English;

  return (
    <>
      <SEO
        title={language === 'English' ? 'Privacy Policy | AvtoNik Car Rental Batumi' : 'Политика конфиденциальности | AvtoNik Батуми'}
        description={
          language === 'English'
            ? 'How AvtoNik collects, uses and deletes your personal information when you book a car in Batumi.'
            : 'Как AvtoNik собирает, использует и удаляет ваши персональные данные при бронировании авто в Батуми.'
        }
        path="/privacy"
        language={language}
      />

    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-20">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-4xl font-bold">{policy.title}</h1>
        <p className="mb-8 text-sm text-gray-500">{policy.updated}</p>

        <p className="mb-10 leading-relaxed text-gray-700">{policy.intro}</p>

        <div className="space-y-10">
          {policy.sections.map((section, i) => (
            <section key={i}>
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.blocks.map((block, j) => renderBlock(block, j))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
    </>
  );
}
