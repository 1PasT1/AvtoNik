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
      content: `1. Requirements for the Renter
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
- Up to 2 hours: Free (grace period)
- 2 to 6 hours: 50% of the daily rate
- More than 6 hours: Full daily rate for each additional day
Repeated late returns may result in administrative fees.

4. Vehicle Use
Authorized Drivers: Only persons listed in the rental agreement are allowed to drive the vehicle.
Prohibited Use: The vehicle may not be used:
- Off-road, if damage or loss is related to road conditions
- To transport passengers or goods for profit
- For subleasing
- While under the influence of alcohol or drugs

5. Insurance and Liability
Coverage: All rates include Collision Damage Waiver (CDW) and Theft Protection (TP), reducing the renter’s liability to the deductible stated in the rental agreement. Insurance is valid only if the rental terms are followed and the incident is officially reported to the police.
Additional Coverage: The renter may purchase a “Full Protection” option, which reduces or eliminates financial liability in case of damage or theft, provided the rental conditions are observed.

6. Additional Services
Delivery and Collection: If you request delivery or return of the vehicle outside the company office, an additional fee applies.
Out-of-Hours Service: Vehicle pickup or return outside of standard business hours must be pre-arranged and is subject to an additional fee.
Fuel Policy: Vehicles are provided with a full tank. You may return the vehicle with a full tank or pay for the missing fuel at the set rate.

7. Cancellation and Booking Changes
Free Cancellation: You may cancel your booking free of charge no later than 48 hours before the scheduled pickup time.
Late Cancellation Fee: If cancellation occurs less than 48 hours before the rental begins, a 30% fee of the total rental cost applies.
No-Show: If the renter fails to show up without prior notice, a fee equal to one day’s rental will be charged.
Booking Changes: Changes to your booking (e.g., pickup time or vehicle type) are possible depending on availability. Costs may change accordingly.

8. Renter’s Responsibilities
Traffic Violations: The renter is fully responsible for all fines and violations incurred during the rental period.
Vehicle Condition: The vehicle must be returned in the same condition as received, except for normal wear and tear.
Damages and Losses: The renter is responsible for any damage or loss of the vehicle, as well as for any fines or fees incurred during the rental.

For more information or assistance, please contact Avtonik customer support or visit our website: www.avtonik.com`
    },
    Русский: {
      title: "Условия использования",
      content: `...`,
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">
          {content[language as keyof typeof content].title}
        </h1>
        <div className="whitespace-pre-wrap text-gray-800">
          {content[language as keyof typeof content].content}
        </div>
      </div>
    </main>
  );
}
