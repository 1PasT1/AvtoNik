"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  format,
  differenceInDays,
  startOfDay,
  areIntervalsOverlapping,
} from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import type { Car } from "@/types/car";
import type { DateRange } from "react-day-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  fetchCars,
  sendInquiry,
  fetchBookedDates,
  createBooking,
  toDateOnly,
  DatesUnavailableError,
  fetchPickupLocations,
  pickupLocationName,
  type BookedRange,
  type PickupLocation,
} from "@/utils/api";
import { SEO } from "@/components/SEO"

const slideUpAnimation = `
  @keyframes slideUp {
    from {
      transform: translate(-50%, 100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }

  @keyframes slideDown {
    from {
      transform: translate(-50%, 0);
      opacity: 1;
    }
    to {
      transform: translate(-50%, 100%);
      opacity: 0;
    }
  }

  .slide-up {
    animation: slideUp 0.5s ease-out, slideDown 0.5s ease-in 9.5s;
  }
`;

/**
 * Every entry needs a unique `iso`, because dial codes are NOT unique:
 * Russia and Kazakhstan share +7, the USA and Canada share +1. The old list
 * keyed the <SelectItem> on `code`, so those pairs could never both exist —
 * duplicate React keys and, worse, two Radix items with the same value.
 * The ISO code is the identity; the dial code is just data hanging off it.
 */
const countryCodes = [
  // Home market first — this is the default.
  { iso: "GE", code: "+995", country: "Georgia", flag: "🇬🇪" },

  // ---- Europe, the Caucasus and Central Asia (alphabetical) ----
  { iso: "AL", code: "+355", country: "Albania", flag: "🇦🇱" },
  { iso: "AD", code: "+376", country: "Andorra", flag: "🇦🇩" },
  { iso: "AM", code: "+374", country: "Armenia", flag: "🇦🇲" },
  { iso: "AT", code: "+43", country: "Austria", flag: "🇦🇹" },
  { iso: "AZ", code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
  { iso: "BY", code: "+375", country: "Belarus", flag: "🇧🇾" },
  { iso: "BE", code: "+32", country: "Belgium", flag: "🇧🇪" },
  { iso: "BA", code: "+387", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { iso: "BG", code: "+359", country: "Bulgaria", flag: "🇧🇬" },
  { iso: "HR", code: "+385", country: "Croatia", flag: "🇭🇷" },
  { iso: "CY", code: "+357", country: "Cyprus", flag: "🇨🇾" },
  { iso: "CZ", code: "+420", country: "Czechia", flag: "🇨🇿" },
  { iso: "DK", code: "+45", country: "Denmark", flag: "🇩🇰" },
  { iso: "EE", code: "+372", country: "Estonia", flag: "🇪🇪" },
  { iso: "FO", code: "+298", country: "Faroe Islands", flag: "🇫🇴" },
  { iso: "FI", code: "+358", country: "Finland", flag: "🇫🇮" },
  { iso: "FR", code: "+33", country: "France", flag: "🇫🇷" },
  { iso: "DE", code: "+49", country: "Germany", flag: "🇩🇪" },
  { iso: "GI", code: "+350", country: "Gibraltar", flag: "🇬🇮" },
  { iso: "GR", code: "+30", country: "Greece", flag: "🇬🇷" },
  { iso: "GL", code: "+299", country: "Greenland", flag: "🇬🇱" },
  { iso: "HU", code: "+36", country: "Hungary", flag: "🇭🇺" },
  { iso: "IS", code: "+354", country: "Iceland", flag: "🇮🇸" },
  { iso: "IE", code: "+353", country: "Ireland", flag: "🇮🇪" },
  { iso: "IT", code: "+39", country: "Italy", flag: "🇮🇹" },
  { iso: "KZ", code: "+7", country: "Kazakhstan", flag: "🇰🇿" },
  { iso: "XK", code: "+383", country: "Kosovo", flag: "🇽🇰" },
  { iso: "KG", code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
  { iso: "LV", code: "+371", country: "Latvia", flag: "🇱🇻" },
  { iso: "LI", code: "+423", country: "Liechtenstein", flag: "🇱🇮" },
  { iso: "LT", code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { iso: "LU", code: "+352", country: "Luxembourg", flag: "🇱🇺" },
  { iso: "MT", code: "+356", country: "Malta", flag: "🇲🇹" },
  { iso: "MD", code: "+373", country: "Moldova", flag: "🇲🇩" },
  { iso: "MC", code: "+377", country: "Monaco", flag: "🇲🇨" },
  { iso: "ME", code: "+382", country: "Montenegro", flag: "🇲🇪" },
  { iso: "NL", code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { iso: "MK", code: "+389", country: "North Macedonia", flag: "🇲🇰" },
  { iso: "NO", code: "+47", country: "Norway", flag: "🇳🇴" },
  { iso: "PL", code: "+48", country: "Poland", flag: "🇵🇱" },
  { iso: "PT", code: "+351", country: "Portugal", flag: "🇵🇹" },
  { iso: "RO", code: "+40", country: "Romania", flag: "🇷🇴" },
  { iso: "RU", code: "+7", country: "Russia", flag: "🇷🇺" },
  { iso: "SM", code: "+378", country: "San Marino", flag: "🇸🇲" },
  { iso: "RS", code: "+381", country: "Serbia", flag: "🇷🇸" },
  { iso: "SK", code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { iso: "SI", code: "+386", country: "Slovenia", flag: "🇸🇮" },
  { iso: "ES", code: "+34", country: "Spain", flag: "🇪🇸" },
  { iso: "SE", code: "+46", country: "Sweden", flag: "🇸🇪" },
  { iso: "CH", code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { iso: "TJ", code: "+992", country: "Tajikistan", flag: "🇹🇯" },
  { iso: "TR", code: "+90", country: "Turkey", flag: "🇹🇷" },
  { iso: "TM", code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
  { iso: "UA", code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { iso: "GB", code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { iso: "UZ", code: "+998", country: "Uzbekistan", flag: "🇺🇿" },

  // ---- Rest of the world (kept from the original list, plus the
  //      neighbours your Georgian market actually gets) ----
  { iso: "AU", code: "+61", country: "Australia", flag: "🇦🇺" },
  { iso: "BR", code: "+55", country: "Brazil", flag: "🇧🇷" },
  { iso: "CA", code: "+1", country: "Canada", flag: "🇨🇦" },
  { iso: "CN", code: "+86", country: "China", flag: "🇨🇳" },
  { iso: "IN", code: "+91", country: "India", flag: "🇮🇳" },
  { iso: "IL", code: "+972", country: "Israel", flag: "🇮🇱" },
  { iso: "JP", code: "+81", country: "Japan", flag: "🇯🇵" },
  { iso: "MX", code: "+52", country: "Mexico", flag: "🇲🇽" },
  { iso: "SA", code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { iso: "KR", code: "+82", country: "South Korea", flag: "🇰🇷" },
  { iso: "AE", code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { iso: "US", code: "+1", country: "USA", flag: "🇺🇸" },
];

const DEFAULT_COUNTRY_ISO = "GE";

const dialCodeFor = (iso: string): string =>
  countryCodes.find((c) => c.iso === iso)?.code ?? "+995";

interface CarDetailPageProps {
  language: string;
}

/*
 * language now comes from App rather than being local state here. This page
 * used to render its OWN <Navbar> on top of the one App already renders, so
 * /cars/:id shipped two navigation bars with two independent language
 * toggles — switching one left the other showing the old language, and
 * search engines saw the whole nav duplicated on every car page.
 */
export const CarDetailPage: React.FC<CarDetailPageProps> = ({
  language,
}) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [car, setCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [pickupLocationId, setPickupLocationId] = useState<string>("");
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryIso: DEFAULT_COUNTRY_ISO,
    phoneNumber: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (params.id) {
        try {
          const cars = await fetchCars();
          const carData = cars.find((c: Car) => c.id.toString() === params.id);
          if (carData) {
            setCar(carData);
          } else {
            throw new Error("Car not found");
          }
        } catch (err) {
          console.error("Error fetching car data:", err);
          setError(
            language === "English"
              ? `Failed to load car data. Error: ${
                  err instanceof Error ? err.message : "Unknown error"
                }`
              : `Не удалось загрузить данные об автомобиле. Ошибка: ${
                  err instanceof Error ? err.message : "Неизвестная ошибка"
                }`
          );
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCarDetails();
  }, [params.id, language]);

  useEffect(() => {
    if (car && dateRange?.from && dateRange?.to) {
      const days = differenceInDays(dateRange.to, dateRange.from) + 1;
      setTotalPrice(days * car.price);
    } else {
      setTotalPrice(null);
    }
  }, [car, dateRange]);

  // Pickup locations are configured in the admin panel, so they are fetched
  // rather than hardcoded — prices can change without a deploy.
  useEffect(() => {
    let cancelled = false;
    fetchPickupLocations().then((locations) => {
      if (cancelled) return;
      setPickupLocations(locations);

      // Preselect the cheapest city option so the common case needs no
      // interaction, but never silently select a paid one.
      const freeCity = locations.find(
        (l) => l.category === "city" && l.price === 0
      );
      if (freeCity) setPickupLocationId(String(freeCity.id));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedPickup =
    pickupLocations.find((l) => String(l.id) === pickupLocationId) || null;
  const pickupFee = selectedPickup ? selectedPickup.price : 0;

  // What the customer actually pays: car cost plus delivery. The server
  // recomputes this from its own price list, so the two must agree.
  const grandTotal = totalPrice !== null ? totalPrice + pickupFee : null;

  const airportPickups = pickupLocations.filter((l) => l.category === "airport");
  const cityPickups = pickupLocations.filter((l) => l.category === "city");

  const handlePrevImage = () => {
    if (!car || !car.gallery || !Array.isArray(car.gallery)) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === car.gallery.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleNextImage = () => {
    if (!car || !car.gallery || !Array.isArray(car.gallery)) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === car.gallery.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleBackToCars = () => {
    navigate("/", { state: { scrollTo: "cars" } });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Receives an ISO code, not a dial code — see the note on countryCodes.
  const handleCountryCodeChange = (iso: string) => {
    setFormData((prev) => ({ ...prev, countryIso: iso }));
    setFormErrors((prev) => ({ ...prev, phoneNumber: "" }));
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) {
      errors.firstName =
        language === "English" ? "First name is required" : "Имя обязательно";
    }
    if (!formData.lastName.trim()) {
      errors.lastName =
        language === "English"
          ? "Last name is required"
          : "Фамилия обязательна";
    }
    if (!formData.email.trim()) {
      errors.email =
        language === "English" ? "Email is required" : "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email =
        language === "English" ? "Email is invalid" : "Неверный формат email";
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber =
        language === "English"
          ? "Phone number is required"
          : "Номер телефона обязателен";
    } else if (
      formData.phoneNumber.length < 9 ||
      formData.phoneNumber.length > 14
    ) {
      errors.phoneNumber =
        language === "English"
          ? "Phone number must be between 9 and 14 digits"
          : "Номер телефона должен содержать от 9 до 14 цифр";
    }
    if (!dateRange?.from || !dateRange?.to) {
      errors.dateRange =
        language === "English"
          ? "Please select a date range"
          : "Выберите период аренды";
    } else if (rangeHitsBookedDays(dateRange)) {
      // Backstop. handleDateSelect already blocks this, but availability
      // can change while the form sits open.
      errors.dateRange =
        language === "English"
          ? "That period includes days that are already booked"
          : "Этот период включает уже забронированные дни";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(null);

    if (!validateForm()) {
      setSubmitError(
        language === "English"
          ? "Please fill in all required fields."
          : "Пожалуйста, заполните все обязательные поля."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Date-only strings from the LOCAL calendar. toISOString() was
      // shifting these a day back for anyone east of UTC.
      const pickupDate = toDateOnly(dateRange!.from!);
      const dropoffDate = toDateOnly(dateRange!.to!);
      const phone = `${dialCodeFor(formData.countryIso)}${formData.phoneNumber}`;

      // Record the request first. It lands as "pending" and does not block
      // the dates for anyone else until you approve it in the admin panel.
      // Doing this before the email means a mailer outage cannot lose a
      // booking — the row is already safe in the database.
      const booking = await createBooking({
        carId: car?.id || "",
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone,
        pickupDate,
        dropoffDate,
        message: formData.message,
        // Car cost only. The server looks the delivery fee up itself, so a
        // tampered request can't book airport pickup for free.
        rentalPrice: totalPrice || 0,
        pickupLocationId: selectedPickup ? selectedPickup.id : null,
      });

      const inquiryData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone,
        pickupdate: pickupDate,
        dropoffdate: dropoffDate,
        carid: car?.id || "",
        message: formData.message,
        // Trust the server's figure over the local one — it is what was
        // actually recorded against the booking.
        totalPrice: booking.totalPrice ?? grandTotal ?? 0,
        pickupLocation: booking.pickupLocation ?? null,
        pickupFee: booking.pickupFee ?? pickupFee,
        bookingId: booking.id,
      };

      try {
        await sendInquiry(inquiryData);
      } catch (mailError) {
        // The booking is saved; only the notification failed. Do not show
        // the customer an error for something they cannot act on.
        console.error("Booking saved but notification email failed:", mailError);
      }

      setSubmitSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        countryIso: DEFAULT_COUNTRY_ISO,
        phoneNumber: "",
        message: "",
      });
      setDateRange(undefined);
    } catch (error) {
      if (error instanceof DatesUnavailableError) {
        // Someone else's booking was approved while this form was open.
        // Refresh the calendar so the newly blocked days show up.
        if (params.id) {
          const refreshed = await fetchBookedDates(params.id);
          setBookedRanges(refreshed);
        }
        setDateRange(undefined);
        setSubmitError(
          language === "English"
            ? "Sorry — those dates were just booked by someone else. The calendar has been updated, please pick another period."
            : "К сожалению, эти даты только что забронировали. Календарь обновлён, выберите другой период."
        );
      } else {
        setSubmitError(
          language === "English"
            ? `Failed to send inquiry. Please try again. Error: ${
                error instanceof Error ? error.message : "Unknown error"
              }`
            : `Не удалось отправить запрос. Пожалуйста, попробуйте еще раз. Ошибка: ${
                error instanceof Error ? error.message : "Неизвестная ошибка"
              }`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------
     Availability
     ------------------------------------------------------------------ */

  // Load the days already taken for this car. Runs whenever the car in the
  // URL changes, so navigating between cars never shows stale availability.
  useEffect(() => {
    let cancelled = false;

    const loadAvailability = async () => {
      if (!params.id) return;

      setAvailabilityLoading(true);
      const ranges = await fetchBookedDates(params.id);

      if (!cancelled) {
        setBookedRanges(ranges);
        setAvailabilityLoading(false);
      }
    };

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  // Past days, plus every booked block. react-day-picker accepts an array
  // of matchers, so these compose.
  const disabledDays = [
    { before: startOfDay(new Date()) },
    ...bookedRanges.map((range) => ({ from: range.from, to: range.to })),
  ];

  // A range picked around a booked block still swallows it: without this,
  // Aug 8 -> Aug 20 is selectable even when Aug 12-14 are taken.
  const rangeHitsBookedDays = (range: DateRange | undefined): boolean => {
    if (!range?.from || !range?.to) return false;

    return bookedRanges.some((booked) =>
      areIntervalsOverlapping(
        { start: startOfDay(range.from!), end: startOfDay(range.to!) },
        { start: startOfDay(booked.from), end: startOfDay(booked.to) },
        { inclusive: true }
      )
    );
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (rangeHitsBookedDays(range)) {
      // Keep the new start day so the next click continues naturally
      // instead of the selection vanishing under the cursor.
      setDateRange(range?.from ? { from: range.from, to: undefined } : undefined);
      setFormErrors((prev) => ({
        ...prev,
        dateRange:
          language === "English"
            ? "Those dates include days that are already booked. Please pick a period that does not cross a blocked day."
            : "Выбранный период включает уже забронированные дни. Пожалуйста, выберите период без занятых дней.",
      }));
      return;
    }

    setDateRange(range);
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.dateRange;
      return next;
    });
  };

  useEffect(() => {
    if (submitSuccess || submitError) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitError(null);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [submitSuccess, submitError]);

  return (
    <>
    <SEO
        title={
          car
            ? `Rent ${car.name} in Batumi — $${car.price}/day | AvtoNik`
            : "Car Details | AvtoNik Car Rental Batumi"
        }
        description={
          car
            ? `Rent a ${car.year} ${car.name} in Batumi for $${car.price} per day. ${car.transmission}, ${car.seats} seats, ${car.fuelType}. Airport pickup available, book online with AvtoNik.`
            : "View car details and book your rental car in Batumi with AvtoNik."
        }
        path={car ? `/cars/${car.id}` : undefined}
        image={car?.image}
        language={language}
        /*
         * Per-car structured data. This is what makes a listing eligible
         * for rich results — price and availability shown directly in the
         * search snippet, which matters far more than any meta keyword.
         */
        structuredData={
          car
            ? {
                "@context": "https://schema.org",
                "@type": "Car",
                name: car.name,
                description:
                  car.description ||
                  `${car.year} ${car.name} available for rental in Batumi, Georgia.`,
                image: car.gallery?.length ? car.gallery : car.image,
                brand: { "@type": "Brand", name: car.name.split(" ")[0] },
                vehicleTransmission: car.transmission,
                fuelType: car.fuelType,
                seatingCapacity: car.seats,
                vehicleModelDate: String(car.year),
                offers: {
                  "@type": "Offer",
                  price: String(car.price),
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  url: `https://autonik.rentals/cars/${car.id}`,
                  priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    price: String(car.price),
                    priceCurrency: "USD",
                    unitCode: "DAY",
                  },
                  seller: {
                    "@type": "AutoRental",
                    name: "AvtoNik Car Rental",
                    url: "https://autonik.rentals",
                  },
                },
              }
            : undefined
        }
      />
      
      <style>{slideUpAnimation}</style>
      <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 py-16 pt-32">
          <Button variant="ghost" className="mb-4" onClick={handleBackToCars}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {language === "English" ? "Back to Cars" : "Назад к автомобилям"}
          </Button>

          {error ? (
            <Alert variant="destructive">
              <AlertTitle>
                {language === "English" ? "Error" : "Ошибка"}
              </AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : loading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : car ? (
            <div className="flex flex-wrap gap-8">
              <div className="w-full lg:w-[calc(50%-1rem)]">
                <div className="relative w-full">
                  <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={
                        (car &&
                          car.gallery &&
                          Array.isArray(car.gallery) &&
                          car.gallery[currentImageIndex]) ||
                        "/placeholder.svg"
                      }
                      alt={car?.name || "Car"}
                      className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => {
                        setModalImageIndex(currentImageIndex);
                        setIsModalOpen(true);
                      }}
                    />
                  </div>
                  <div className="absolute inset-y-0 left-2 flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrevImage}
                      className="bg-white/80 hover:bg-white shadow-lg"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextImage}
                      className="bg-white/80 hover:bg-white shadow-lg"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {car.gallery.map((image, index) => (
                    <div
                      key={index}
                      className={`aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer ${
                        index === currentImageIndex
                          ? "ring-2 ring-orange-500"
                          : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${car.name} view ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-[calc(50%-1rem)]">
                <Card>
                  <CardHeader>
                    <CardTitle>{car.name}</CardTitle>
                    <CardDescription>
                      ${car.price}/{language === "English" ? "day" : "день"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                      <div className="space-y-2">
                        <Label className="block font-medium">
                          {language === "English" ? "Category" : "Категория"}
                        </Label>
                        <p className="text-gray-600">{car.category}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="block font-medium">
                          {language === "English"
                            ? "Transmission"
                            : "Коробка передач"}
                        </Label>
                        <p className="text-gray-600">{car.transmission}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="block font-medium">
                          {language === "English" ? "Fuel Type" : "Тип топлива"}
                        </Label>
                        <p className="text-gray-600">{car.fuelType}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="block font-medium">
                          {language === "English" ? "Seats" : "Места"}
                        </Label>
                        <p className="text-gray-600">{car.seats}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="block font-medium">
                          {language === "English" ? "Year" : "Год выпуска"}
                        </Label>
                        <p className="text-gray-600">{car.year}</p>
                      </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateRange">
                          {language === "English"
                            ? "Rental Period"
                            : "Период аренды"}
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="dateRange"
                              variant={"outline"}
                              className={`w-full justify-start text-left font-normal ${
                                !dateRange?.from && "text-muted-foreground"
                              }`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange?.from ? (
                                dateRange.to ? (
                                  <>
                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                    {format(dateRange.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(dateRange.from, "LLL dd, y")
                                )
                              ) : (
                                <span>
                                  {language === "English"
                                    ? "Pick a date"
                                    : "Выберите дату"}
                                </span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={new Date()}
                              selected={dateRange}
                              onSelect={handleDateSelect}
                              numberOfMonths={2}
                              disabled={disabledDays}
                              modifiers={{
                                booked: bookedRanges.map((r) => ({
                                  from: r.from,
                                  to: r.to,
                                })),
                              }}
                              modifiersClassNames={{
                                booked:
                                  "line-through text-red-400 opacity-70",
                              }}
                            />
                            <div className="border-t px-3 py-2 text-xs text-muted-foreground">
                              {availabilityLoading ? (
                                <span>
                                  {language === "English"
                                    ? "Checking availability…"
                                    : "Проверяем доступность…"}
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                                  {language === "English"
                                    ? "Crossed-out days are already booked"
                                    : "Зачёркнутые дни уже забронированы"}
                                </span>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                        {formErrors.dateRange && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.dateRange}
                          </p>
                        )}
                      </div>

                      {/*
                        Pickup location. Both categories live in one dropdown
                        under their own headings, and the fee is shown next to
                        each option so nothing is a surprise at the total.
                        Options come from the admin panel, so the whole block
                        hides itself if none are configured yet.
                      */}
                      {pickupLocations.length > 0 && (
                        <div className="space-y-2">
                          <Label htmlFor="pickupLocation">
                            {language === "English"
                              ? "Pickup location"
                              : "Место подачи"}
                          </Label>
                          <Select
                            value={pickupLocationId}
                            onValueChange={setPickupLocationId}
                          >
                            <SelectTrigger id="pickupLocation" className="w-full">
                              <SelectValue
                                placeholder={
                                  language === "English"
                                    ? "Where should we deliver the car?"
                                    : "Куда подать автомобиль?"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="max-h-[320px]">
                              {airportPickups.length > 0 && (
                                <>
                                  <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    {language === "English"
                                      ? "Airport pickup"
                                      : "Подача в аэропорт"}
                                  </div>
                                  {airportPickups.map((loc) => (
                                    <SelectItem key={loc.id} value={String(loc.id)}>
                                      {pickupLocationName(loc, language)}
                                      <span className="ml-2 text-muted-foreground">
                                        {loc.price > 0
                                          ? `+$${loc.price}`
                                          : language === "English"
                                          ? "free"
                                          : "бесплатно"}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </>
                              )}

                              {cityPickups.length > 0 && (
                                <>
                                  <div className="mt-1 border-t px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    {language === "English"
                                      ? "City pickup"
                                      : "Подача по городу"}
                                  </div>
                                  {cityPickups.map((loc) => (
                                    <SelectItem key={loc.id} value={String(loc.id)}>
                                      {pickupLocationName(loc, language)}
                                      <span className="ml-2 text-muted-foreground">
                                        {loc.price > 0
                                          ? `+$${loc.price}`
                                          : language === "English"
                                          ? "free"
                                          : "бесплатно"}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-4">
                        <div className="w-full sm:w-[calc(50%-0.5rem)] min-w-[200px]">
                          <Label htmlFor="firstName">
                            {language === "English" ? "First Name" : "Имя"}
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                          {formErrors.firstName && (
                            <p className="text-red-500 text-sm">
                              {formErrors.firstName}
                            </p>
                          )}
                        </div>
                        <div className="w-full sm:w-[calc(50%-0.5rem)] min-w-[200px]">
                          <Label htmlFor="lastName">
                            {language === "English" ? "Last Name" : "Фамилия"}
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                          {formErrors.lastName && (
                            <p className="text-red-500 text-sm">
                              {formErrors.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          {language === "English"
                            ? "Email"
                            : "Электронная почта"}
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-sm">
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">
                          {language === "English"
                            ? "Phone Number"
                            : "Номер телефона"}
                        </Label>
                        <div className="flex flex-col sm450:flex-row gap-2">
                          <Select
                            value={formData.countryIso}
                            onValueChange={handleCountryCodeChange}
                          >
                            <SelectTrigger className="w-full sm450:w-[140px] flex-shrink-0">
                              <SelectValue>
                                {
                                  countryCodes.find(
                                    (c) => c.iso === formData.countryIso
                                  )?.flag
                                }{" "}
                                {dialCodeFor(formData.countryIso)}
                              </SelectValue>
                            </SelectTrigger>
                            {/* Country name leads the label so Radix's
                                built-in typeahead works — with 70 entries,
                                typing "geo" beats scrolling. */}
                            <SelectContent className="max-h-[320px]">
                              {countryCodes.map((country) => (
                                <SelectItem key={country.iso} value={country.iso}>
                                  <span className="mr-2">{country.flag}</span>
                                  {country.country}{" "}
                                  <span className="text-muted-foreground">
                                    {country.code}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                            className="flex-1"
                            placeholder={
                              language === "English" ? "123456789" : "123456789"
                            }
                          />
                        </div>
                        {formErrors.phoneNumber && (
                          <p className="text-red-500 text-sm">
                            {formErrors.phoneNumber}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">
                          {language === "English"
                            ? "Message (Optional)"
                            : "Сообщение (Необязательно)"}
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                        />
                      </div>
                      {totalPrice !== null && (
                        <div className="mb-4 space-y-1 text-center">
                          {/* Itemised only when there is a fee to explain. */}
                          {pickupFee > 0 && (
                            <>
                              <div className="text-sm text-muted-foreground">
                                {language === "English" ? "Car:" : "Автомобиль:"}{" "}
                                ${totalPrice.toFixed(2)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {selectedPickup
                                  ? pickupLocationName(selectedPickup, language)
                                  : language === "English"
                                  ? "Pickup"
                                  : "Подача"}
                                : +${pickupFee.toFixed(2)}
                              </div>
                            </>
                          )}
                          <div className="text-lg font-semibold">
                            {language === "English"
                              ? "Total Price:"
                              : "Общая стоимость:"}{" "}
                            ${(grandTotal ?? totalPrice).toFixed(2)}
                          </div>
                        </div>
                      )}
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                        ref={submitButtonRef}
                      >
                        {isSubmitting
                          ? language === "English"
                            ? "Sending..."
                            : "Отправка..."
                          : language === "English"
                          ? "Send Inquiry"
                          : "Отправить запрос"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertTitle>
                {language === "English" ? "Error" : "Ошибка"}
              </AlertTitle>
              <AlertDescription>
                {language === "English"
                  ? "Car not found"
                  : "Автомобиль не найден"}
              </AlertDescription>
            </Alert>
          )}
        </div>
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center mb-4">
              <img
                src={car?.gallery[modalImageIndex] || "/placeholder.svg"}
                alt={car?.name || "Car"}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </Button>
            </div>

            {/* Navigation controls below the image */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <Button
                variant="outline"
                size="icon"
                className="bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!car || !car.gallery || !Array.isArray(car.gallery))
                    return;
                  setModalImageIndex((prev) =>
                    prev === 0 ? car.gallery.length - 1 : prev - 1
                  );
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-white text-sm px-3 py-1 bg-black/20 rounded-full">
                {modalImageIndex + 1} / {car?.gallery.length}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!car || !car.gallery || !Array.isArray(car.gallery))
                    return;
                  setModalImageIndex((prev) =>
                    prev === car.gallery.length - 1 ? 0 : prev + 1
                  );
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        {submitSuccess && (
          <Alert className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-100 border-green-400 text-green-700 slide-up w-[90%] sm:w-[70%] md:max-w-md">
            <AlertTitle>
              {language === "English" ? "Success" : "Успех"}
            </AlertTitle>
            <AlertDescription>
              {language === "English"
                ? "Your inquiry has been sent successfully. We will contact you soon."
                : "Ваш запрос успешно отправлен. Мы свяжемся с вами в ближайшее время."}
            </AlertDescription>
          </Alert>
        )}
        {submitError && (
          <Alert
            variant="destructive"
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 border-red-400 text-red-700 slide-up w-[90%] sm:w-[70%] md:max-w-md"
          >
            <AlertTitle>
              {language === "English" ? "Error" : "Ошибка"}
            </AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}
      </main>
    </>
  );
};
