"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
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
import { format, differenceInDays, startOfDay } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import type { Car } from "@/types/car";
import type { DateRange } from "react-day-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchCars, sendInquiry } from "@/utils/api";
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

const countryCodes = [
  { code: "+995", country: "Georgia", flag: "🇬🇪" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
];

export const CarDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [car, setCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+995",
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

  const handleCountryCodeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, countryCode: value }));
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
 


      const inquiryData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: `${formData.countryCode}${formData.phoneNumber}`, 
        pickupdate: dateRange?.from?.toISOString() || "",
        dropoffdate: dateRange?.to?.toISOString() || "",
        carid: car?.id || "",
        message: formData.message,
        totalPrice: totalPrice || 0,
      };

      await sendInquiry(inquiryData);

      setSubmitSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        countryCode: "+995",
        phoneNumber: "",
        message: "",
      });
      setDateRange(undefined);
    } catch (error) {
      setSubmitError(
        language === "English"
          ? `Failed to send inquiry. Please try again. Error: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          : `Не удалось отправить запрос. Пожалуйста, попробуйте еще раз. Ошибка: ${
              error instanceof Error ? error.message : "Неизвестная ошибка"
            }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledDays = { before: startOfDay(new Date()) };

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
        title={car ? `${car.name} - Car Rental | AvtoNik` : "Car Details - AvtoNik"}
        description={
          car
            ? `Rent ${car.name} for $${car.price}/day. ${car.description} Book your ${car.category} rental car online with AvtoNik.`
            : "View car details and book your rental car with AvtoNik"
        }
        keywords={
          car
            ? `${car.name}, ${car.category} rental, ${car.fuelType} car rental, ${car.transmission} car, rent ${car.name.toLowerCase()}`
            : "car rental details, book rental car"
        }
        language={language}
      />
      
      <style>{slideUpAnimation}</style>
      <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Navbar language={language} setLanguage={setLanguage} />
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
                              onSelect={setDateRange}
                              numberOfMonths={2}
                              disabled={disabledDays}
                            />
                          </PopoverContent>
                        </Popover>
                        {formErrors.dateRange && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.dateRange}
                          </p>
                        )}
                      </div>
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
                            value={formData.countryCode}
                            onValueChange={handleCountryCodeChange}
                          >
                            <SelectTrigger className="w-full sm450:w-[140px] flex-shrink-0">
                              <SelectValue>
                                {
                                  countryCodes.find(
                                    (c) => c.code === formData.countryCode
                                  )?.flag
                                }{" "}
                                {formData.countryCode}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {countryCodes.map((country) => (
                                <SelectItem
                                  key={country.code}
                                  value={country.code}
                                >
                                  <span className="mr-2">{country.flag}</span>
                                  {country.code} ({country.country})
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
                        <div className="text-lg font-semibold text-center mb-4">
                          {language === "English"
                            ? "Total Price:"
                            : "Общая стоимость:"}{" "}
                          ${totalPrice.toFixed(2)}
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
