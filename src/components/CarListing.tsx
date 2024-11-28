import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, ShuffleIcon as GearShift, Fuel, Users, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { Car as CarType } from '@/types/car';

interface CarListingProps {
  cars: CarType[];
  language: string;
  isLoading: boolean;
}

export function CarListing({ cars: initialCars, language, isLoading }: CarListingProps) {
  const [cars, setCars] = useState<CarType[]>([]);
  const [sortBy, setSortBy] = useState('price-low');
  const [filters, setFilters] = useState({
    gearType: '',
    fuelType: '',
    priceFrom: '',
    priceTo: '',
    vehicleClass: '',
  });
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [hasFilterChanges, setHasFilterChanges] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      const sortedCars = sortCars(initialCars, sortBy);
      setCars(sortedCars);
    }
  }, [isLoading, initialCars, sortBy]);

  const sortCars = (carsToSort: CarType[], sortType: string) => {
    return [...carsToSort].sort((a, b) => {
      if (sortType === 'price-low') return a.price - b.price;
      if (sortType === 'price-high') return b.price - a.price;
      return 0;
    });
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    const sorted = sortCars(cars, value);
    setCars(sorted);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setHasFilterChanges(true);
  };

  const applyFilters = () => {
    let filteredCars = [...initialCars];

    if (filters.gearType) {
      filteredCars = filteredCars.filter(car => car.transmission.toLowerCase() === filters.gearType.toLowerCase());
    }
    if (filters.fuelType) {
      filteredCars = filteredCars.filter(car => car.fuelType.toLowerCase() === filters.fuelType.toLowerCase());
    }
    if (filters.priceFrom) {
      filteredCars = filteredCars.filter(car => car.price >= parseInt(filters.priceFrom));
    }
    if (filters.priceTo) {
      filteredCars = filteredCars.filter(car => car.price <= parseInt(filters.priceTo));
    }
    if (filters.vehicleClass) {
      filteredCars = filteredCars.filter(car => car.category.toLowerCase() === filters.vehicleClass.toLowerCase());
    }

    const sortedAndFilteredCars = sortCars(filteredCars, sortBy);
    setCars(sortedAndFilteredCars);
    setIsFilterApplied(true);
    setHasFilterChanges(false);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      gearType: '',
      fuelType: '',
      priceFrom: '',
      priceTo: '',
      vehicleClass: '',
    });
    const sortedCars = sortCars(initialCars, sortBy);
    setCars(sortedCars);
    setIsFilterApplied(false);
    setHasFilterChanges(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (isFilterApplied) {
      setHasFilterChanges(true);
    }
  }, [filters]);

  const handleRentNow = (carId: string) => {
    navigate(`/cars/${carId}`);
  };

  // Pagination
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(cars.length / carsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const CarSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          {language === 'English' ? 'Rent a Car, Start Your Journey' : 'Арендуйте автомобиль, начните свое путешествие'}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {language === 'English' 
            ? 'Ready to explore? Rent one of our top-quality cars and start your next journey today!'
            : 'Готовы к исследованию? Арендуйте один из наших высококачественных автомобилей и начните свое следующее путешествие сегодня!'}
        </p>
        
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Select value={filters.gearType} onValueChange={(value) => handleFilterChange('gearType', value)}>
            <SelectTrigger>
              <SelectValue placeholder={language === 'English' ? 'Gear Type' : 'Тип коробки передач'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">{language === 'English' ? 'Manual' : 'Механическая'}</SelectItem>
              <SelectItem value="automatic">{language === 'English' ? 'Automatic' : 'Автоматическая'}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.fuelType} onValueChange={(value) => handleFilterChange('fuelType', value)}>
            <SelectTrigger>
              <SelectValue placeholder={language === 'English' ? 'Fuel Type' : 'Тип топлива'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gasoline">{language === 'English' ? 'Gasoline' : 'Бензин'}</SelectItem>
              <SelectItem value="diesel">{language === 'English' ? 'Diesel' : 'Дизель'}</SelectItem>
              <SelectItem value="electric">{language === 'English' ? 'Electric' : 'Электро'}</SelectItem>
              <SelectItem value="hybrid">{language === 'English' ? 'Hybrid' : 'Гибрид'}</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={language === 'English' ? 'Price From' : 'Цена от'}
              value={filters.priceFrom}
              onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
            />
            <Input
              type="number"
              placeholder={language === 'English' ? 'Price To' : 'Цена до'}
              value={filters.priceTo}
              onChange={(e) => handleFilterChange('priceTo', e.target.value)}
            />
          </div>
          
          <Select value={filters.vehicleClass} onValueChange={(value) => handleFilterChange('vehicleClass', value)}>
            <SelectTrigger>
              <SelectValue placeholder={language === 'English' ? 'Vehicle Class' : 'Класс автомобиля'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">{language === 'English' ? 'Economy' : 'Эконом'}</SelectItem>
              <SelectItem value="compact">{language === 'English' ? 'Compact' : 'Компактный'}</SelectItem>
              <SelectItem value="midsize">{language === 'English' ? 'Midsize' : 'Средний'}</SelectItem>
              <SelectItem value="luxury">{language === 'English' ? 'Luxury' : 'Люкс'}</SelectItem>
              <SelectItem value="suv">{language === 'English' ? 'SUV' : 'Внедорожник'}</SelectItem>
              <SelectItem value="electric">{language === 'English' ? 'Electric' : 'Электрический'}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={isFilterApplied && !hasFilterChanges ? clearFilters : applyFilters}>
            {isFilterApplied && !hasFilterChanges 
              ? (language === 'English' ? 'Clear Filter' : 'Очистить фильтр')
              : (language === 'English' ? 'Apply Filter' : 'Применить фильтр')}
          </Button>
        </div>
        
        <div className="flex justify-end mb-4">
          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={language === 'English' ? 'Sort by' : 'Сортировать по'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-low">{language === 'English' ? 'Price: Low to High' : 'Цена: по возрастанию'}</SelectItem>
              <SelectItem value="price-high">{language === 'English' ? 'Price: High to Low' : 'Цена: по убыванию'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array(carsPerPage).fill(0).map((_, index) => (
                <CarSkeleton key={index} />
              ))
            : currentCars.map((car) => (
                <Card key={car.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-4">{car.name}</h3>
                    <p className="text-3xl font-bold text-orange-500 mb-6">
                      ${car.price}/{language === 'English' ? 'day' : 'день'}
                    </p>
                    <div className="grid grid-cols-2 gap-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Car className="h-5 w-5" />
                        <span>{car.category}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GearShift className="h-5 w-5" />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Fuel className="h-5 w-5" />
                        <span>{car.fuelType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-5 w-5" />
                        <span>{car.seats} seats</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-5 w-5" />
                        <span>{car.year}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg"
                      onClick={() => handleRentNow(car.id.toString())}
                    >
                      {language === 'English' ? 'Rent Now' : 'Арендовать'}
                    </Button>
                  </CardFooter>
                </Card>
              ))
          }
        </div>

        {cars.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex">
              <Button
                variant="outline"
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
                className="mr-1"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="mr-1"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => paginate(i + 1)}
                  className="mx-1"
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-1"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
                className="ml-1"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

