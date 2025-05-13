import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface TermsPageProps {
  language: string;
}

export function TermsPage({ language }: TermsPageProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const content = {
    English: {
      title: "Terms and Conditions",
      content:
        "1. Requirements for the Renter
Driver’s License: The renter must have held a valid driver’s license for at least 2 years. For citizens of non-EU countries, an International Driving Permit (IDP) is recommended.
Age Restrictions: The minimum age for renters is 21 years.
Identification: A valid passport or national ID must be presented when collecting the vehicle.

2. Payment and Deposit
Payment Methods: Major credit and debit cards, as well as cash, are accepted. Payment must be made in the renter’s name and must be valid for the entire rental period.
Deposit: A deposit is required when picking up the vehicle, with the amount depending on the selected car class. The deposit is refunded immediately after the vehicle is returned, provided all rental conditions are met.

3. Rental Period
Duration: The minimum rental period is 1 day. One rental day equals 24 hours from the start of the rental.
Grace Period: A 2-hour grace period is allowed. If the vehicle is returned more than 120 minutes late, an additional charge equal to the daily rental rate applies.
Late Return Fees:

Up to 2 hours: Free (grace period)

2 to 6 hours: 50% of the daily rate

More than 6 hours: Full daily rate for each additional day

Repeated late returns may result in administrative fees.

4. Vehicle Use
Authorized Drivers: Only persons listed in the rental agreement are allowed to drive the vehicle.
Prohibited Use: The vehicle may not be used:

Off-road, if damage or loss is related to road conditions

To transport passengers or goods for profit

For subleasing

While under the influence of alcohol or drugs

5. Insurance and Liability
Coverage: All rates include Collision Damage Waiver (CDW) and Theft Protection (TP), reducing the renter’s liability to the deductible stated in the rental agreement. Insurance is valid only if the rental terms are followed and the incident is officially reported to the police.
Additional Coverage: The renter may purchase a “Full Protection” option, which reduces or eliminates financial liability in case of damage or theft, provided the rental conditions are observed.

7. Additional Services
Delivery and Collection: If you request delivery or return of the vehicle outside the company office, an additional fee applies.
Out-of-Hours Service: Vehicle pickup or return outside of standard business hours must be pre-arranged and is subject to an additional fee.
Fuel Policy: Vehicles are provided with a full tank. You may return the vehicle with a full tank or pay for the missing fuel at the set rate.

8. Cancellation and Booking Changes
Free Cancellation: You may cancel your booking free of charge no later than 48 hours before the scheduled pickup time.
Late Cancellation Fee: If cancellation occurs less than 48 hours before the rental begins, a 30% fee of the total rental cost applies.
No-Show: If the renter fails to show up without prior notice, a fee equal to one day’s rental will be charged.
Booking Changes: Changes to your booking (e.g., pickup time or vehicle type) are possible depending on availability. Costs may change accordingly.

9. Renter’s Responsibilities
Traffic Violations: The renter is fully responsible for all fines and violations incurred during the rental period.
Vehicle Condition: The vehicle must be returned in the same condition as received, except for normal wear and tear.
Damages and Losses: The renter is responsible for any damage or loss of the vehicle, as well as for any fines or fees incurred during the rental.

For more information or assistance, please contact Avtonik customer support or visit our website: www.avtonik.com",
    },
    Русский: {
      title: "Условия использования",
      content:
        "1. Требования к арендатору
Водительские права: Арендатор должен иметь действительные водительские права не менее 2 лет. Для граждан стран, не входящих в ЕС, рекомендуется наличие международного водительского удостоверения (IDP).
Возрастные ограничения: Минимальный возраст арендатора — 21 год.
Идентификация: При получении автомобиля необходимо предоставить действующий паспорт или национальное удостоверение личности.
2. Оплата и депозит
Способы оплаты: Принимаются основные кредитные и дебетовые карты, а также наличные. Платёж должен быть произведён на имя арендатора и действителен на весь период аренды.
Депозит: При получении автомобиля требуется внести депозит, сумма которого зависит от выбранного класса автомобиля. Депозит возвращается сразу после возврата автомобиля клиентом, при условии соблюдения всех условий.
3. Срок аренды
Продолжительность: Минимальный срок аренды — 1 день. Один арендный день составляет 24 часа с момента начала аренды.
Льготный период: Предусмотрен льготный период в 2 часа. В случае возврата автомобиля с опозданием более чем на 120 минут взимается дополнительная плата в размере суточной арендной ставки.
Штрафы за просрочку:
  - До 2 часов: бесплатно (льготный период)
  - От 2 до 6 часов: 50% суточной ставки
  - Более 6 часов: полная суточная ставка за каждый дополнительный день
  - Повторные случаи просрочки могут повлечь за собой административные сборы.
4. Использование автомобиля
Разрешённые водители: Управлять автомобилем могут только лица, указанные в договоре аренды.
Запрещённое использование: Запрещается использовать автомобиль:
  - По бездорожью, если повреждения или потеря связаны с дорожными условиями
  - Для перевозки пассажиров или грузов с целью получения прибыли
  - Для субаренды
  - В состоянии алкогольного или наркотического опьянения

5. Страхование и ответственность
Покрытие: Все тарифы включают страховку от повреждений (CDW) и угона (TP), уменьшающую ответственность арендатора до размера франшизы, указанной в договоре аренды. Страхование действительно только при соблюдении условий договора и официальной фиксации инцидента в полиции.
Дополнительное покрытие: Арендатор может приобрести опцию 'Полная защита', которая снижает или полностью исключает финансовую ответственность в случае повреждения или угона при условии соблюдения условий аренды.
7. Дополнительные услуги
Доставка и возврат: В случае, если вы заказываете доставку или возврат автомобиля вне офиса компании, взимается дополнительная плата.
Обслуживание вне рабочего времени: Получение или возврат автомобиля вне стандартных рабочих часов требует предварительного согласования и оплачивается отдельно.
Политика топлива: Автомобили предоставляются с полным баком. Вы можете вернуть автомобиль с полным баком или оплатить стоимость недостающего топлива по установленному тарифу.
8. Отмена и изменения бронирования
Бесплатная отмена: Вы можете отменить бронирование бесплатно не позднее чем за 48 часов до запланированного времени получения автомобиля.
Плата за позднюю отмену: При отмене менее чем за 48 часов до начала аренды взимается штраф в размере 30% от общей стоимости аренды.
Отсутствие арендатора: В случае неявки без предварительного уведомления взымается сумма в размере стоимости одного дня аренды.
Изменения бронирования: Внесение изменений в бронирование (например, времени получения или типа автомобиля) возможно при наличии соответствующих опций. Возможны изменения в стоимости.
9. Обязанности арендатора
Нарушения ПДД: Арендатор несёт полную ответственность за все штрафы и нарушения, совершённые в период аренды.
Состояние автомобиля: Автомобиль должен быть возвращён в том же состоянии, в котором он был получен, за исключением обычного износа.
Повреждения и потери: Арендатор несёт ответственность за повреждения или потерю автомобиля, а также за любые штрафы и сборы, начисленные в период аренды.

Для получения дополнительной информации или консультации обратитесь в службу поддержки Avtonik или посетите наш сайт: www.avtonik.com",
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">
          {content[language as keyof typeof content].title}
        </h1>
        <p>{content[language as keyof typeof content].content}</p>
      </div>
    </main>
  );
}
