'use client';

import { motion } from 'framer-motion';
import { Camera, Video, Sparkles, Check } from 'lucide-react';
import { FadeInUp } from './ScrollAnimations';

const services = [
  {
    icon: Camera,
    title: 'Фотография',
    description: 'Професионална сватбена фотография с внимание към всеки детайл.',
    features: [
      'Пълно покритие на сватбения ден',
      'Предсватбена фотосесия',
      'Обработка на всички снимки',
      'Онлайн галерия',
      'Печатни снимки',
    ],
    price: 'от 800 лв.',
  },
  {
    icon: Video,
    title: 'Видеография',
    description: 'Кинематографично заснемане на вашия специален ден.',
    features: [
      'Пълнометражен филм',
      'Кратък клип за социални мрежи',
      '4K качество',
      'Дрон заснемане',
      'Професионален монтаж',
    ],
    price: 'от 1200 лв.',
  },
  {
    icon: Sparkles,
    title: 'Допълнителни услуги',
    description: 'Специални пакети и добавки за незабравими моменти.',
    features: [
      'Фотобудка',
      'Второ събитие',
      'Експресна обработка',
      'Фотокнига',
      'USB с всички материали',
    ],
    price: 'по договаряне',
  },
];

export default function Services() {
  return (
    <section id="services" className="section-padding bg-dark-950">
      <div className="container-width">
        {/* Section Header */}
        <FadeInUp className="text-center mb-16">
          <span className="text-primary-400 font-medium text-sm uppercase tracking-wider">
            Какво предлагаме
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-dark-50 mt-4 mb-6">
            Нашите услуги
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Предлагаме пълен набор от услуги, за да уловим всеки момент от вашия
            специален ден.
          </p>
        </FadeInUp>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <FadeInUp key={service.title} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                className="h-full glass rounded-2xl p-8 group"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 12 }}
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center mb-6"
                >
                  <service.icon className="w-7 h-7 text-primary-400" />
                </motion.div>

                {/* Title & Description */}
                <h3 className="text-xl font-semibold text-dark-50 mb-3">
                  {service.title}
                </h3>
                <p className="text-dark-400 mb-6">{service.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-dark-300 text-sm"
                    >
                      <Check className="w-4 h-4 text-primary-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="mt-auto pt-6 border-t border-dark-700/50">
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
                    {service.price}
                  </span>
                </div>
              </motion.div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
