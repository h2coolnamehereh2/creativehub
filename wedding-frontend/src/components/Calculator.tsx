'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { FadeInUp, SlideInLeft, SlideInRight } from './ScrollAnimations';
import { fetchDates, type DateInfo } from '@/lib/api';

interface Service {
  id: string;
  name: string;
  price: number;
}

interface Package {
  name: string;
  services: string[];
  discount: number;
}

const services: Service[] = [
  { id: 'photo', name: 'Фотография', price: 800 },
  { id: 'video', name: 'Видеография', price: 1200 },
  { id: 'drone', name: 'Дрон заснемане', price: 300 },
  { id: 'booth', name: 'Фотобудка', price: 400 },
  { id: 'album', name: 'Фотоалбум', price: 250 },
  { id: 'express', name: 'Експресна обработка', price: 200 },
];

const packages: Package[] = [
  { name: 'Сребърен', services: ['photo'], discount: 0 },
  { name: 'Златен', services: ['photo', 'video'], discount: 100 },
  { name: 'Диамантен', services: ['photo', 'video', 'drone', 'album'], discount: 300 },
];

export default function Calculator() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dateInfo, setDateInfo] = useState<DateInfo>({ bookedDates: [], lastAvailableDates: [] });
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadDates() {
      const data = await fetchDates();
      setDateInfo(data);
    }
    loadDates();
  }, []);

  // Calculate total price
  const totalPrice = useMemo(() => {
    const servicesTotal = services
      .filter((s) => selectedServices.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0);

    // Find applicable package discount
    const applicablePackage = packages
      .filter((pkg) => pkg.services.every((s) => selectedServices.includes(s)))
      .sort((a, b) => b.discount - a.discount)[0];

    const discount = applicablePackage?.discount || 0;
    return servicesTotal - discount;
  }, [selectedServices]);

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Apply package preset
  const applyPackage = (pkg: Package) => {
    setSelectedServices(pkg.services);
  };

  // Reset calculator
  const reset = () => {
    setSelectedServices([]);
    setSelectedDate(null);
  };

  // Generate calendar months
  const calendarMonths = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 4; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push({
        key: `${date.getFullYear()}-${date.getMonth()}`,
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleDateString('bg-BG', { month: 'long', year: 'numeric' }),
      });
    }
    return months;
  }, []);

  // Toggle month expansion
  const toggleMonth = (monthKey: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(monthKey)) {
        next.delete(monthKey);
      } else {
        next.add(monthKey);
      }
      return next;
    });
  };

  // Get weekends for a month
  const getWeekends = (year: number, month: number) => {
    const weekends = [];
    const date = new Date(year, month, 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (date.getMonth() === month) {
      const day = date.getDay();
      if (day === 0 || day === 6) {
        const dateStr = date.toISOString().split('T')[0];
        const isPast = date < today;
        const isBooked = dateInfo.bookedDates.includes(dateStr);
        const isLastAvailable = dateInfo.lastAvailableDates.includes(dateStr);

        weekends.push({
          date: dateStr,
          day: date.getDate(),
          dayName: date.toLocaleDateString('bg-BG', { weekday: 'short' }),
          isPast,
          isBooked,
          isLastAvailable,
          isSelected: selectedDate === dateStr,
        });
      }
      date.setDate(date.getDate() + 1);
    }
    return weekends;
  };

  return (
    <section id="calculator" className="section-padding bg-dark-950">
      <div className="container-width">
        {/* Section Header */}
        <FadeInUp className="text-center mb-16">
          <span className="text-primary-400 font-medium text-sm uppercase tracking-wider">
            Планирайте бюджета си
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-dark-50 mt-4 mb-6">
            Калкулатор
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Изберете услуги и дата, за да получите ориентировъчна цена.
          </p>
        </FadeInUp>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Services & Packages */}
          <SlideInLeft>
            <div className="glass rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-semibold text-dark-50 mb-6 flex items-center gap-2">
                <Check className="text-primary-400" size={20} />
                Изберете услуги
              </h3>

              {/* Service Checkboxes */}
              <div className="space-y-3 mb-8">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedServices.includes(service.id)
                            ? 'bg-primary-500 border-primary-500'
                            : 'border-dark-600 group-hover:border-dark-500'
                        }`}
                      >
                        {selectedServices.includes(service.id) && (
                          <Check size={12} className="text-dark-950" />
                        )}
                      </div>
                      <span className="text-dark-200">{service.name}</span>
                    </div>
                    <span className="text-dark-400 font-medium">{service.price} лв.</span>
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => toggleService(service.id)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>

              {/* Package Presets */}
              <h4 className="text-sm font-medium text-dark-400 mb-3">Готови пакети</h4>
              <div className="flex flex-wrap gap-2">
                {packages.map((pkg) => (
                  <motion.button
                    key={pkg.name}
                    onClick={() => applyPackage(pkg)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-lg bg-dark-800 text-dark-300 hover:text-primary-400 hover:bg-dark-700 transition-colors text-sm"
                  >
                    {pkg.name}
                    {pkg.discount > 0 && (
                      <span className="ml-2 text-green-400">-{pkg.discount} лв.</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </SlideInLeft>

          {/* Calendar & Total */}
          <SlideInRight>
            <div className="glass rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-semibold text-dark-50 mb-6 flex items-center gap-2">
                <Calendar className="text-primary-400" size={20} />
                Изберете дата
              </h3>

              {/* Calendar */}
              <div className="space-y-2 mb-8 max-h-64 overflow-y-auto">
                {calendarMonths.map((month) => (
                  <div key={month.key} className="rounded-xl bg-dark-800/50 overflow-hidden">
                    <button
                      onClick={() => toggleMonth(month.key)}
                      className="w-full flex items-center justify-between p-3 hover:bg-dark-800 transition-colors"
                    >
                      <span className="text-dark-200 capitalize">{month.label}</span>
                      {expandedMonths.has(month.key) ? (
                        <ChevronUp size={18} className="text-dark-400" />
                      ) : (
                        <ChevronDown size={18} className="text-dark-400" />
                      )}
                    </button>

                    {expandedMonths.has(month.key) && (
                      <div className="p-3 pt-0 flex flex-wrap gap-2">
                        {getWeekends(month.year, month.month).map((weekend) => (
                          <button
                            key={weekend.date}
                            onClick={() => !weekend.isPast && !weekend.isBooked && setSelectedDate(weekend.date)}
                            disabled={weekend.isPast || weekend.isBooked}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                              weekend.isSelected
                                ? 'bg-primary-500 text-dark-950 font-semibold'
                                : weekend.isPast
                                ? 'bg-dark-900/50 text-dark-600 cursor-not-allowed'
                                : weekend.isBooked
                                ? 'bg-red-500/20 text-red-400 cursor-not-allowed'
                                : weekend.isLastAvailable
                                ? 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30'
                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            }`}
                          >
                            {weekend.day} {weekend.dayName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-xs mb-8">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500/30" />
                  <span className="text-dark-400">Свободна</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary-500/30" />
                  <span className="text-dark-400">Последна</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/30" />
                  <span className="text-dark-400">Заета</span>
                </div>
              </div>

              {/* Total */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-600/10 border border-primary-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-dark-300">Избрани услуги:</span>
                  <span className="text-dark-200">{selectedServices.length}</span>
                </div>
                {selectedDate && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-dark-300">Избрана дата:</span>
                    <span className="text-dark-200">
                      {new Date(selectedDate).toLocaleDateString('bg-BG', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-dark-700/50">
                  <span className="text-dark-100 font-semibold">Обща цена:</span>
                  <span className="text-2xl font-bold text-primary-400">{totalPrice} лв.</span>
                </div>
              </div>

              {/* Reset Button */}
              <motion.button
                onClick={reset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-3 rounded-xl border border-dark-700 text-dark-400 hover:text-dark-200 hover:border-dark-600 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                Нулиране
              </motion.button>
            </div>
          </SlideInRight>
        </div>
      </div>
    </section>
  );
}
