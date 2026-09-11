'use client';

import { useState } from 'react';
import CatalogCard from './CatalogCard';
import styles from './CatalogTabs.module.css';

const TABS = [
  { id: 'services', label: 'Услуги' },
  { id: 'events', label: 'Мероприятия' },
];

export default function CatalogTabs({ services, events }) {
  const [activeTab, setActiveTab] = useState('services');
  const panels = { services, events };

  return (
    <div className={styles.catalogTabs}>
      <div className={styles.tabList} role="tablist" aria-label="Каталог студии">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return <button key={tab.id} className={`${styles.tab} ${isActive ? styles.tabActive : ''}`} type="button" role="tab" aria-selected={isActive} aria-controls={`${tab.id}-catalog`} id={`${tab.id}-tab`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>;
        })}
      </div>

      <div className={styles.panels}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <section key={tab.id} className={`${styles.panel} ${isActive ? styles.panelActive : ''}`} id={`${tab.id}-catalog`} role="tabpanel" aria-labelledby={`${tab.id}-tab`} aria-hidden={!isActive}>
              <div className={`${styles.grid} ${tab.id === 'events' ? styles.eventGrid : ''}`}>
                {panels[tab.id].map((item) => <CatalogCard key={item.slug} item={item} type={tab.id} />)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
