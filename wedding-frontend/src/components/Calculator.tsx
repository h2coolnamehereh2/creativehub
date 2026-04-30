'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, RotateCcw, Info, Check, Calendar } from 'lucide-react';
import { FadeInUp } from './ScrollAnimations';

type ServiceType = 'photo-video' | 'photo' | 'video' | null;
type CeremonyType = 'no' | 'photo-video' | 'photo' | 'video';

interface RadioOption<T extends string | number = string | number> {
  label: string;
  value: T;
  price: number;
}

interface ToggleOption {
  id: string;
  label: string;
  price: number;
}

// ─── Option Data ────────────────────────────────────────────

const photographerOptions: RadioOption<number>[] = [
  { label: 'Един фотограф', value: 1, price: 0 },
  { label: 'Двама фотографи', value: 2, price: 400 },
];

const shootingTimeOptions: RadioOption<number>[] = [
  { label: 'до 7 часа', value: 7, price: 0 },
  { label: 'до 8 часа', value: 8, price: 150 },
  { label: 'до 9 часа', value: 9, price: 300 },
  { label: 'до 10 часа', value: 10, price: 450 },
];

const photoEditingOptions: RadioOption<string>[] = [
  { label: 'Всички сортирани снимки с основна корекция', value: 'basic', price: 0 },
  { label: '+20 снимки с индивидуална обработка', value: '20', price: 100 },
  { label: '+40 снимки с индивидуална обработка', value: '40', price: 180 },
  { label: '+60 снимки с индивидуална обработка', value: '60', price: 250 },
  { label: '+80 снимки с индивидуална обработка', value: '80', price: 300 },
];

const photoDeliveryOptions: RadioOption<number>[] = [
  { label: 'до 60 дни', value: 60, price: 0 },
  { label: 'до 30 дни', value: 30, price: 150 },
  { label: 'до 7 дни', value: 7, price: 350 },
];

const videographerOptions: RadioOption<number>[] = [
  { label: 'Един видеограф', value: 1, price: 0 },
  { label: 'Двама видеографи', value: 2, price: 400 },
];

const videoQualityOptions: RadioOption<string>[] = [
  { label: 'FULL HD', value: 'fullhd', price: 0 },
  { label: '4K', value: '4k', price: 200 },
];

const filmLengthOptions: RadioOption<number>[] = [
  { label: '60 минути', value: 60, price: 0 },
  { label: '90 минути', value: 90, price: 150 },
  { label: '120 минути', value: 120, price: 250 },
  { label: '180 минути', value: 180, price: 400 },
];

const equipmentOptions: ToggleOption[] = [
  { id: 'gimbal', label: 'Стабилизатор (Gimbal)', price: 100 },
  { id: 'audio', label: 'Аудио пакет', price: 150 },
  { id: 'teaser', label: 'Сватбен тийзър', price: 200 },
  { id: 'highlight', label: 'Сватбен хайлайт трейлър', price: 300 },
  { id: 'tiktok', label: 'Видео формат TikTok / Reel', price: 100 },
  { id: 'drone', label: 'Въздушни кадри с дрон', price: 250 },
  { id: 'lighting', label: 'Осветителен пакет', price: 200 },
  { id: 'car', label: 'Кадри от движещ се автомобил', price: 300 },
];

const videoDeliveryOptions: RadioOption<number>[] = [
  { label: 'до 180 дни', value: 180, price: 0 },
  { label: 'до 120 дни', value: 120, price: 100 },
  { label: 'до 90 дни', value: 90, price: 200 },
];

const revisionOptions: RadioOption<number>[] = [
  { label: 'Една безплатна ревизия', value: 1, price: 0 },
  { label: 'Втора ревизия', value: 2, price: 50 },
  { label: 'Трета ревизия', value: 3, price: 100 },
];

const ceremonyPhotoTimeOptions: RadioOption<number>[] = [
  { label: '2 часа', value: 2, price: 200 },
  { label: '3 часа', value: 3, price: 300 },
  { label: '4 часа', value: 4, price: 400 },
];

const ceremonyVideoTimeOptions: RadioOption<number>[] = [
  { label: '2 часа', value: 2, price: 250 },
  { label: '3 часа', value: 3, price: 350 },
  { label: '4 часа', value: 4, price: 450 },
];

// ─── Helper Components ──────────────────────────────────────

function RadioGroup<T extends string | number>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: RadioOption<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-3">{title}</h4>
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all text-left ${
              value === opt.value
                ? 'bg-primary-500/10 border border-primary-500/30'
                : 'bg-dark-800/50 hover:bg-dark-800 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                  value === opt.value ? 'border-primary-500' : 'border-dark-600'
                }`}
              >
                {value === opt.value && <div className="w-2 h-2 rounded-full bg-primary-500" />}
              </div>
              <span className={`text-sm ${value === opt.value ? 'text-dark-100' : 'text-dark-300'}`}>
                {opt.label}
              </span>
            </div>
            <span
              className={`text-sm font-medium whitespace-nowrap ml-4 ${
                opt.price > 0 ? 'text-primary-400' : 'text-dark-500'
              }`}
            >
              {opt.price > 0 ? `+${opt.price}€` : 'включено'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckboxGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: ToggleOption[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-3">{title}</h4>
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onToggle(opt.id)}
            className={`w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all text-left ${
              selected.has(opt.id)
                ? 'bg-primary-500/10 border border-primary-500/30'
                : 'bg-dark-800/50 hover:bg-dark-800 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                  selected.has(opt.id)
                    ? 'bg-primary-500 border-primary-500'
                    : 'border-dark-600'
                }`}
              >
                {selected.has(opt.id) && <Check size={12} className="text-dark-950" />}
              </div>
              <span className={`text-sm ${selected.has(opt.id) ? 'text-dark-100' : 'text-dark-300'}`}>
                {opt.label}
              </span>
            </div>
            <span className="text-sm font-medium text-primary-400 whitespace-nowrap ml-4">
              +{opt.price}€
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────

const serviceTypeCards: {
  type: NonNullable<ServiceType>;
  label: string;
  description: string;
  icons: typeof Camera[];
}[] = [
  {
    type: 'photo-video',
    label: 'Снимки и Видео',
    description: 'Пълен пакет с фотография и видеография',
    icons: [Camera, Video],
  },
  {
    type: 'photo',
    label: 'Само Снимки',
    description: 'Професионална сватбена фотография',
    icons: [Camera],
  },
  {
    type: 'video',
    label: 'Само Видео',
    description: 'Професионална сватбена видеография',
    icons: [Video],
  },
];

export default function Calculator() {
  const [serviceType, setServiceType] = useState<ServiceType>(null);

  const [photographers, setPhotographers] = useState(1);
  const [shootingTime, setShootingTime] = useState(7);
  const [photoEditing, setPhotoEditing] = useState('basic');
  const [photoDelivery, setPhotoDelivery] = useState(60);

  const [videographers, setVideographers] = useState(1);
  const [videoQuality, setVideoQuality] = useState('fullhd');
  const [filmLength, setFilmLength] = useState(60);
  const [additionalEquipment, setAdditionalEquipment] = useState<Set<string>>(new Set());
  const [videoDelivery, setVideoDelivery] = useState(180);
  const [revisions, setRevisions] = useState(1);

  const [ceremony, setCeremony] = useState<CeremonyType>('no');
  const [ceremonyPhotoTime, setCeremonyPhotoTime] = useState(2);
  const [ceremonyVideoTime, setCeremonyVideoTime] = useState(2);

  const showPhoto = serviceType === 'photo-video' || serviceType === 'photo';
  const showVideo = serviceType === 'photo-video' || serviceType === 'video';

  useEffect(() => {
    if (serviceType === 'photo' && (ceremony === 'photo-video' || ceremony === 'video')) {
      setCeremony('no');
    }
    if (serviceType === 'video' && (ceremony === 'photo-video' || ceremony === 'photo')) {
      setCeremony('no');
    }
  }, [serviceType, ceremony]);

  const ceremonyOptions = useMemo((): RadioOption<string>[] => {
    const opts: RadioOption<string>[] = [{ label: 'Не', value: 'no', price: 0 }];
    if (showPhoto && showVideo) {
      opts.push({ label: 'Снимки и Видео', value: 'photo-video', price: 0 });
    }
    if (showPhoto) {
      opts.push({ label: 'Само снимки', value: 'photo', price: 0 });
    }
    if (showVideo) {
      opts.push({ label: 'Само видео', value: 'video', price: 0 });
    }
    return opts;
  }, [showPhoto, showVideo]);

  const totalPrice = useMemo(() => {
    if (!serviceType) return 0;
    let total = 0;

    if (showPhoto) {
      total += photographerOptions.find((o) => o.value === photographers)?.price ?? 0;
      total += shootingTimeOptions.find((o) => o.value === shootingTime)?.price ?? 0;
      total += photoEditingOptions.find((o) => o.value === photoEditing)?.price ?? 0;
      total += photoDeliveryOptions.find((o) => o.value === photoDelivery)?.price ?? 0;
    }

    if (showVideo) {
      total += videographerOptions.find((o) => o.value === videographers)?.price ?? 0;
      total += videoQualityOptions.find((o) => o.value === videoQuality)?.price ?? 0;
      total += filmLengthOptions.find((o) => o.value === filmLength)?.price ?? 0;
      additionalEquipment.forEach((id) => {
        total += equipmentOptions.find((o) => o.id === id)?.price ?? 0;
      });
      total += videoDeliveryOptions.find((o) => o.value === videoDelivery)?.price ?? 0;
      total += revisionOptions.find((o) => o.value === revisions)?.price ?? 0;
    }

    if (ceremony === 'photo-video' || ceremony === 'photo') {
      total += ceremonyPhotoTimeOptions.find((o) => o.value === ceremonyPhotoTime)?.price ?? 0;
    }
    if (ceremony === 'photo-video' || ceremony === 'video') {
      total += ceremonyVideoTimeOptions.find((o) => o.value === ceremonyVideoTime)?.price ?? 0;
    }

    return total;
  }, [
    serviceType, showPhoto, showVideo,
    photographers, shootingTime, photoEditing, photoDelivery,
    videographers, videoQuality, filmLength, additionalEquipment, videoDelivery, revisions,
    ceremony, ceremonyPhotoTime, ceremonyVideoTime,
  ]);

  const priceBreakdown = useMemo(() => {
    const items: { label: string; price: number }[] = [];
    if (!serviceType) return items;

    if (showPhoto) {
      const p = photographerOptions.find((o) => o.value === photographers);
      if (p && p.price > 0) items.push({ label: p.label, price: p.price });
      const st = shootingTimeOptions.find((o) => o.value === shootingTime);
      if (st && st.price > 0) items.push({ label: `Снимки ${st.label}`, price: st.price });
      const pe = photoEditingOptions.find((o) => o.value === photoEditing);
      if (pe && pe.price > 0) items.push({ label: pe.label, price: pe.price });
      const pd = photoDeliveryOptions.find((o) => o.value === photoDelivery);
      if (pd && pd.price > 0) items.push({ label: `Доставка снимки ${pd.label}`, price: pd.price });
    }

    if (showVideo) {
      const v = videographerOptions.find((o) => o.value === videographers);
      if (v && v.price > 0) items.push({ label: v.label, price: v.price });
      const vq = videoQualityOptions.find((o) => o.value === videoQuality);
      if (vq && vq.price > 0) items.push({ label: vq.label, price: vq.price });
      const fl = filmLengthOptions.find((o) => o.value === filmLength);
      if (fl && fl.price > 0) items.push({ label: `Филм ${fl.label}`, price: fl.price });
      additionalEquipment.forEach((id) => {
        const eq = equipmentOptions.find((o) => o.id === id);
        if (eq) items.push({ label: eq.label, price: eq.price });
      });
      const vd = videoDeliveryOptions.find((o) => o.value === videoDelivery);
      if (vd && vd.price > 0) items.push({ label: `Доставка видео ${vd.label}`, price: vd.price });
      const rv = revisionOptions.find((o) => o.value === revisions);
      if (rv && rv.price > 0) items.push({ label: rv.label, price: rv.price });
    }

    if (ceremony === 'photo-video' || ceremony === 'photo') {
      const cpt = ceremonyPhotoTimeOptions.find((o) => o.value === ceremonyPhotoTime);
      if (cpt) items.push({ label: `Церемония снимки ${cpt.label}`, price: cpt.price });
    }
    if (ceremony === 'photo-video' || ceremony === 'video') {
      const cvt = ceremonyVideoTimeOptions.find((o) => o.value === ceremonyVideoTime);
      if (cvt) items.push({ label: `Церемония видео ${cvt.label}`, price: cvt.price });
    }

    return items;
  }, [
    serviceType, showPhoto, showVideo,
    photographers, shootingTime, photoEditing, photoDelivery,
    videographers, videoQuality, filmLength, additionalEquipment, videoDelivery, revisions,
    ceremony, ceremonyPhotoTime, ceremonyVideoTime,
  ]);

  const toggleEquipment = (id: string) => {
    setAdditionalEquipment((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const reset = () => {
    setServiceType(null);
    setPhotographers(1);
    setShootingTime(7);
    setPhotoEditing('basic');
    setPhotoDelivery(60);
    setVideographers(1);
    setVideoQuality('fullhd');
    setFilmLength(60);
    setAdditionalEquipment(new Set());
    setVideoDelivery(180);
    setRevisions(1);
    setCeremony('no');
    setCeremonyPhotoTime(2);
    setCeremonyVideoTime(2);
  };

  return (
    <section id="calculator" className="section-padding bg-dark-950">
      <div className="container-width">
        <FadeInUp className="text-center mb-16">
          <span className="text-primary-400 font-medium text-sm uppercase tracking-wider">
            Планирайте бюджета си
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-dark-50 mt-4 mb-6">
            Ценова листа
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Изберете тип услуга и конфигурирайте опциите, за да получите ориентировъчна цена.
          </p>
        </FadeInUp>

        {/* Service Type Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {serviceTypeCards.map(({ type, label, description, icons }) => (
            <motion.button
              key={type}
              type="button"
              onClick={() => setServiceType(type)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-2xl text-left transition-all ${
                serviceType === type
                  ? 'bg-primary-500/10 border-2 border-primary-500/50 shadow-lg shadow-primary-500/10'
                  : 'glass border-2 border-transparent hover:border-dark-700'
              }`}
            >
              <div className="flex gap-2">
                {icons.map((Icon, i) => (
                  <Icon
                    key={i}
                    size={28}
                    className={serviceType === type ? 'text-primary-400' : 'text-dark-500'}
                  />
                ))}
              </div>
              <h3
                className={`text-lg font-semibold mt-3 ${
                  serviceType === type ? 'text-primary-400' : 'text-dark-200'
                }`}
              >
                {label}
              </h3>
              <p className="text-dark-500 text-sm mt-1">{description}</p>
            </motion.button>
          ))}
        </div>

        {/* Options & Summary */}
        <AnimatePresence>
          {serviceType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-[1fr,340px] gap-8 items-start"
            >
              {/* Options Column */}
              <div className="space-y-6">
                {/* Photo Options */}
                {showPhoto && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-6 md:p-8"
                  >
                    <h3 className="text-lg font-semibold text-dark-50 mb-6 flex items-center gap-2">
                      <Camera className="text-primary-400" size={20} />
                      Фотография
                    </h3>

                    <RadioGroup
                      title="Брой фотографи"
                      options={photographerOptions}
                      value={photographers}
                      onChange={setPhotographers}
                    />
                    <RadioGroup
                      title="Продължителност на снимките"
                      options={shootingTimeOptions}
                      value={shootingTime}
                      onChange={setShootingTime}
                    />
                    <RadioGroup
                      title="Обработка на снимки"
                      options={photoEditingOptions}
                      value={photoEditing}
                      onChange={setPhotoEditing}
                    />

                    <div className="flex gap-3 p-4 rounded-xl bg-dark-800/70 border border-dark-700/50 mb-6">
                      <Info size={18} className="text-primary-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-dark-400 leading-relaxed">
                        Индивидуалната обработка включва ретуширане на кожата, премахване на дребни
                        несъвършенства, избелване на зъби, усъвършенствано маскиране на светлината и
                        професионален цветови грейдинг.
                      </p>
                    </div>

                    <RadioGroup
                      title="Срок за доставка на снимки"
                      options={photoDeliveryOptions}
                      value={photoDelivery}
                      onChange={setPhotoDelivery}
                    />
                  </motion.div>
                )}

                {/* Video Options */}
                {showVideo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-2xl p-6 md:p-8"
                  >
                    <h3 className="text-lg font-semibold text-dark-50 mb-6 flex items-center gap-2">
                      <Video className="text-primary-400" size={20} />
                      Видеография
                    </h3>

                    <RadioGroup
                      title="Брой видеографи"
                      options={videographerOptions}
                      value={videographers}
                      onChange={setVideographers}
                    />
                    <RadioGroup
                      title="Качество на видеото"
                      options={videoQualityOptions}
                      value={videoQuality}
                      onChange={setVideoQuality}
                    />
                    <RadioGroup
                      title="Продължителност на филма"
                      options={filmLengthOptions}
                      value={filmLength}
                      onChange={setFilmLength}
                    />
                    <CheckboxGroup
                      title="Допълнително оборудване и опции"
                      options={equipmentOptions}
                      selected={additionalEquipment}
                      onToggle={toggleEquipment}
                    />
                    <RadioGroup
                      title="Срок за доставка на видео"
                      options={videoDeliveryOptions}
                      value={videoDelivery}
                      onChange={setVideoDelivery}
                    />
                    <RadioGroup
                      title="Брой ревизии"
                      options={revisionOptions}
                      value={revisions}
                      onChange={setRevisions}
                    />
                  </motion.div>
                )}

                {/* Ceremony Options */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass rounded-2xl p-6 md:p-8"
                >
                  <h3 className="text-lg font-semibold text-dark-50 mb-6 flex items-center gap-2">
                    <Calendar className="text-primary-400" size={20} />
                    Заснемане на церемония в отделен ден
                  </h3>

                  <RadioGroup
                    title="Церемония"
                    options={ceremonyOptions}
                    value={ceremony}
                    onChange={(v) => setCeremony(v as CeremonyType)}
                  />

                  <AnimatePresence>
                    {(ceremony === 'photo-video' || ceremony === 'photo') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <RadioGroup
                          title="Продължителност на фотозаснемане на церемонията"
                          options={ceremonyPhotoTimeOptions}
                          value={ceremonyPhotoTime}
                          onChange={setCeremonyPhotoTime}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {(ceremony === 'photo-video' || ceremony === 'video') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <RadioGroup
                          title="Продължителност на видеозаснемане на церемонията"
                          options={ceremonyVideoTimeOptions}
                          value={ceremonyVideoTime}
                          onChange={setCeremonyVideoTime}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Sticky Price Summary */}
              <div className="lg:sticky lg:top-8">
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-dark-50 mb-4">Обобщение</h3>

                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium">
                      {serviceTypeCards.find((s) => s.type === serviceType)?.label}
                    </span>
                  </div>

                  {priceBreakdown.length > 0 && (
                    <div className="space-y-2 mb-6 max-h-64 overflow-y-auto pr-1">
                      {priceBreakdown.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-dark-400 truncate mr-2">{item.label}</span>
                          <span className="text-primary-400 font-medium whitespace-nowrap">
                            +{item.price}€
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {priceBreakdown.length === 0 && (
                    <p className="text-dark-500 text-sm mb-6">Основна конфигурация</p>
                  )}

                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-600/10 border border-primary-500/20">
                    <div className="text-dark-400 text-sm mb-1">Крайна цена</div>
                    <div className="text-3xl font-bold text-primary-400">{totalPrice}€</div>
                  </div>

                  <motion.button
                    type="button"
                    onClick={reset}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 py-3 rounded-xl border border-dark-700 text-dark-400 hover:text-dark-200 hover:border-dark-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Нулиране
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
