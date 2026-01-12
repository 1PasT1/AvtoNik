type Review = {
  name: string;
  rating: number;
  text: string;
};

const reviews: Review[] = [
  {
    name: "Alex K.",
    rating: 5,
    text: "Smooth booking, clean car, no hidden fees. Would rent again without thinking."
  },
  {
    name: "Mariam T.",
    rating: 5,
    text: "Pickup was fast and professional. Deposit returned the same day."
  },
  {
    name: "Giorgi L.",
    rating: 4,
    text: "Great experience overall. Car was exactly as described."
  }
];

export default function ReviewsSection() {
  return (
    <section className="bg-white py-24 px-4 border-t border-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Trusted by our customers
        </h2>

        <p className="mt-3 text-gray-500 max-w-xl mx-auto">
          Real experiences from people who rented with AvtoNik
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-lg shadow-black/5 hover:-translate-y-1 hover:shadow-xl transition"
            >
              <div className="text-orange-500 text-lg mb-4">
                {"★".repeat(r.rating)}
                <span className="text-gray-300">
                  {"★".repeat(5 - r.rating)}
                </span>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                “{r.text}”
              </p>

              <span className="block mt-6 font-semibold text-gray-900">
                {r.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
