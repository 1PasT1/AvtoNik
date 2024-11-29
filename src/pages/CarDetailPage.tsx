import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, differenceInDays, startOfDay } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Car } from '@/types/car';
import { DateRange } from 'react-day-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from "@/hooks/use-toast";
import { fetchCars, sendInquiry } from '@/utils/api';

export function CarDetailPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (params.id) {
        try {
          const cars = await fetchCars();
          const carData = cars.find((c: Car) => c.id.toString() === params.id);
          if (carData) {
            setCar(carData);
          } else {
            throw new Error('Car not found');
          }
        } catch (err) {
          console.error('Error fetching car data:', err);
          setError(language === 'English' 
            ? `Failed to load car data. Error: ${err instanceof Error ? err.message : 'Unknown error'}` 
            : `Не удалось загрузить данные об автомобиле. Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
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
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? (car?.gallery.length ?? 1) - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === (car?.gallery.length ?? 1) - 1 ? 0 : prevIndex + 1
    );
  };

  const handleBackToCars = () => {
    navigate('/', { state: { scrollTo: 'cars' } });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) {
      errors.firstName = language === 'English' ? 'First name is required' : 'Имя обязательно';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = language === 'English' ? 'Last name is required' : 'Фамилия обязательна';
    }
    if (!formData.email.trim()) {
      errors.email = language === 'English' ? 'Email is required' : 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = language === 'English' ? 'Email is invalid' : 'Неверный формат email';
    }
    if (!dateRange?.from || !dateRange?.to) {
      errors.dateRange = language === 'English' ? 'Please select a date range' : 'Выберите период аренды';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(null);

    if (!validateForm()) {
      setSubmitError(language === 'English' ? 'Please fill in all required fields.' : 'Пожалуйста, заполните все обязательные поля.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendInquiry({
        ...formData,
        carId: car?.id,
        dateFrom: dateRange?.from?.toISOString(),
        dateTo: dateRange?.to?.toISOString(),
      });

      setSubmitSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
      });
      setDateRange(undefined);
    } catch (error) {
      console.error('Error sending inquiry:', error);
      setSubmitError(language === 'English' ? 'Failed to send inquiry. Please try again.' : 'Не удалось отправить запрос. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledDays = { before: startOfDay(new Date()) };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Navbar 
        language={language}
        setLanguage={setLanguage}
      />
      <div className="container mx-auto px-4 py-16 pt-32">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={handleBackToCars}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {language === 'English' ? 'Back to Cars' : 'Назад к автомобилям'}
        </Button>
        
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>{language === 'English' ? 'Error' : 'Ошибка'}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : loading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : car ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative">
              <div className="relative h-[400px]">
                <img
                  src={car.gallery[currentImageIndex]}
                  alt={car.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
                />
                <div className="absolute inset-y-0 left-2 flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevImage}
                    className="bg-white/80 hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextImage}
                    className="bg-white/80 hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-4 mt-4">
                {car.gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${car.name} view ${index + 1}`}
                    className={`w-full h-20 object-cover rounded-lg cursor-pointer ${
                      index === currentImageIndex ? 'ring-2 ring-orange-500' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{car.name}</CardTitle>
                  <CardDescription>
                    ${car.price}/{language === 'English' ? 'day' : 'день'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label>{language === 'English' ? 'Category' : 'Категория'}</Label>
                      <p>{car.category}</p>
                    </div>
                    <div>
                      <Label>{language === 'English' ? 'Transmission' : 'Коробка передач'}</Label>
                      <p>{car.transmission}</p>
                    </div>
                    <div>
                      <Label>{language === 'English' ? 'Fuel Type' : 'Тип топлива'}</Label>
                      <p>{car.fuelType}</p>
                    </div>
                    <div>
                      <Label>{language === 'English' ? 'Seats' : 'Места'}</Label>
                      <p>{car.seats}</p>
                    </div>
                    <div>
                      <Label>{language === 'English' ? 'Year' : 'Год выпуска'}</Label>
                      <p>{car.year}</p>
                    </div>
                  </div>
                  {submitSuccess && (
                    <Alert className="mb-4">
                      <AlertTitle>{language === 'English' ? 'Success' : 'Успех'}</AlertTitle>
                      <AlertDescription>
                        {language === 'English' 
                          ? 'Your inquiry has been sent successfully. We will contact you soon.' 
                          : 'Ваш запрос успешно отправлен. Мы свяжемся с вами в ближайшее время.'}
                      </AlertDescription>
                    </Alert>
                  )}
                  {submitError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertTitle>{language === 'English' ? 'Error' : 'Ошибка'}</AlertTitle>
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateRange">{language === 'English' ? 'Rental Period' : 'Период аренды'}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="dateRange"
                            variant={"outline"}
                            className={`w-full justify-start text-left font-normal ${!dateRange?.from && "text-muted-foreground"}`}
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
                              <span>{language === 'English' ? 'Pick a date' : 'Выберите дату'}</span>
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
                      {formErrors.dateRange && <p className="text-red-500 text-sm mt-1">{formErrors.dateRange}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{language === 'English' ? 'First Name' : 'Имя'}</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                        {formErrors.firstName && <p className="text-red-500 text-sm">{formErrors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{language === 'English' ? 'Last Name' : 'Фамилия'}</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                        {formErrors.lastName && <p className="text-red-500 text-sm">{formErrors.lastName}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{language === 'English' ? 'Email' : 'Электронная почта'}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{language === 'English' ? 'Message (Optional)' : 'Сообщение (Необязательно)'}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                    </div>
                    {totalPrice !== null && (
                      <div className="text-lg font-semibold text-center mb-4">
                        {language === 'English' ? 'Total Price:' : 'Общая стоимость:'} ${totalPrice.toFixed(2)}
                      </div>
                    )}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting 
                        ? (language === 'English' ? 'Sending...' : 'Отправка...') 
                        : (language === 'English' ? 'Send Inquiry' : 'Отправить запрос')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertTitle>{language === 'English' ? 'Error' : 'Ошибка'}</AlertTitle>
            <AlertDescription>{language === 'English' ? 'Car not found' : 'Автомобиль не найден'}</AlertDescription>
          </Alert>
        )}
      </div>
    </main>
  );
}

