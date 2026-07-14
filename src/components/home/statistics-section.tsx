'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Users, Briefcase, Globe, Award } from 'lucide-react';

const iconMap = {
  users: Users,
  briefcase: Briefcase,
  globe: Globe,
  award: Award,
};

interface StatItem {
  icon: keyof typeof iconMap;
  value: string;
  suffix?: string;
  labelKey: string;
}

const stats: StatItem[] = [
  { icon: 'users', value: '500', suffix: '+', labelKey: 'clients' },
  { icon: 'briefcase', value: '150', suffix: '+', labelKey: 'projects' },
  { icon: 'globe', value: '15', suffix: '+', labelKey: 'partners' },
  { icon: 'award', value: '10', suffix: '+', labelKey: 'experience' },
];

export function StatisticsSection() {
  const t = useTranslations('statistics');

  return (
    <section className="py-20 bg-primary-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            {t('title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = iconMap[stat.icon];

            return (
              <motion.div
                key={stat.icon}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="text-primary-100 text-sm md:text-base">{t(stat.labelKey)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
