// Category Translations
// Contains localized titles and subtitles for all platform categories

import type { SupportedLanguage } from './translations';

export interface CategoryTranslation {
  title: string;
  subtitle: string;
  highlight?: string;
}

export const categoryTranslations: Record<string, Record<SupportedLanguage, CategoryTranslation>> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // VIDEO CATEGORIES
  // ═══════════════════════════════════════════════════════════════════════════
  'streaming-vod': {
    en: {
      title: 'Streaming & VOD',
      subtitle: 'Movies, series, live TV and on-demand content',
      highlight: '4K & Dolby Atmos Quality',
    },
    fr: {
      title: 'Streaming & VOD',
      subtitle: 'Films, séries, TV en direct et contenus à la demande',
      highlight: 'Qualité 4K & Dolby Atmos',
    },
    de: {
      title: 'Streaming & VOD',
      subtitle: 'Filme, Serien, Live-TV und On-Demand-Inhalte',
      highlight: '4K & Dolby Atmos Qualität',
    },
    es: {
      title: 'Streaming & VOD',
      subtitle: 'Películas, series, TV en vivo y contenido bajo demanda',
      highlight: 'Calidad 4K y Dolby Atmos',
    },
    it: {
      title: 'Streaming & VOD',
      subtitle: 'Film, serie, TV live e contenuti on-demand',
      highlight: 'Qualità 4K e Dolby Atmos',
    },
    nl: {
      title: 'Streaming & VOD',
      subtitle: 'Films, series, live TV en on-demand content',
      highlight: '4K & Dolby Atmos kwaliteit',
    },
    sv: {
      title: 'Streaming & VOD',
      subtitle: 'Filmer, serier, live-TV och on-demand-innehåll',
      highlight: '4K & Dolby Atmos kvalitet',
    },
    no: {
      title: 'Strømming & VOD',
      subtitle: 'Filmer, serier, live-TV og on-demand-innhold',
      highlight: '4K & Dolby Atmos kvalitet',
    },
    da: {
      title: 'Streaming & VOD',
      subtitle: 'Film, serier, live-TV og on-demand indhold',
      highlight: '4K & Dolby Atmos kvalitet',
    },
    zh: {
      title: '流媒体与点播',
      subtitle: '电影、剧集、直播电视和点播内容',
      highlight: '4K与杜比全景声品质',
    },
    ar: {
      title: 'البث والطلب',
      subtitle: 'أفلام ومسلسلات وتلفزيون مباشر ومحتوى عند الطلب',
      highlight: 'جودة 4K ودولبي أتموس',
    },
    he: {
      title: 'סטרימינג ו-VOD',
      subtitle: 'סרטים, סדרות, טלוויזיה חיה ותוכן לפי דרישה',
      highlight: 'איכות 4K ו-Dolby Atmos',
    },
  },

  'free-tv': {
    en: {
      title: 'Free TV & Live',
      subtitle: 'Free channels, live broadcasts and catch-up TV',
    },
    fr: {
      title: 'TV Gratuite & Direct',
      subtitle: 'Chaînes gratuites, diffusions en direct et replay',
    },
    de: {
      title: 'Kostenloses TV & Live',
      subtitle: 'Kostenlose Kanäle, Live-Übertragungen und Mediatheken',
    },
    es: {
      title: 'TV Gratis & En Vivo',
      subtitle: 'Canales gratuitos, transmisiones en vivo y TV a la carta',
    },
    it: {
      title: 'TV Gratuita & Live',
      subtitle: 'Canali gratuiti, trasmissioni live e catch-up TV',
    },
    nl: {
      title: 'Gratis TV & Live',
      subtitle: 'Gratis kanalen, live uitzendingen en catch-up TV',
    },
    sv: {
      title: 'Gratis TV & Live',
      subtitle: 'Gratiskanaler, livesändningar och catch-up TV',
    },
    no: {
      title: 'Gratis TV & Live',
      subtitle: 'Gratiskanaler, live-sendinger og catch-up TV',
    },
    da: {
      title: 'Gratis TV & Live',
      subtitle: 'Gratiskanaler, live-udsendelser og catch-up TV',
    },
    zh: {
      title: '免费电视与直播',
      subtitle: '免费频道、直播和回看电视',
    },
    ar: {
      title: 'تلفزيون مجاني ومباشر',
      subtitle: 'قنوات مجانية وبث مباشر وتلفزيون الإعادة',
    },
    he: {
      title: 'טלוויזיה חינם ושידור חי',
      subtitle: 'ערוצים חינמיים, שידורים חיים וצפייה בחזרה',
    },
  },

  'europe': {
    en: {
      title: 'Europe Selection',
      subtitle: 'Operator TV and regional services for Europe',
    },
    fr: {
      title: 'Sélection Europe',
      subtitle: 'TV des opérateurs et services régionaux pour l\'Europe',
    },
    de: {
      title: 'Europa Auswahl',
      subtitle: 'Anbieter-TV und regionale Dienste für Europa',
    },
    es: {
      title: 'Selección Europa',
      subtitle: 'TV de operadores y servicios regionales para Europa',
    },
    it: {
      title: 'Selezione Europa',
      subtitle: 'TV degli operatori e servizi regionali per l\'Europa',
    },
    nl: {
      title: 'Europa Selectie',
      subtitle: 'Provider TV en regionale diensten voor Europa',
    },
    sv: {
      title: 'Europa Urval',
      subtitle: 'Operatörs-TV och regionala tjänster för Europa',
    },
    no: {
      title: 'Europa Utvalg',
      subtitle: 'Operatør-TV og regionale tjenester for Europa',
    },
    da: {
      title: 'Europa Udvalg',
      subtitle: 'Operatør-TV og regionale tjenester for Europa',
    },
    zh: {
      title: '欧洲精选',
      subtitle: '运营商电视和欧洲区域服务',
    },
    ar: {
      title: 'اختيار أوروبا',
      subtitle: 'تلفزيون المشغلين والخدمات الإقليمية لأوروبا',
    },
    he: {
      title: 'בחירת אירופה',
      subtitle: 'טלוויזיית מפעילים ושירותים אזוריים לאירופה',
    },
  },

  'asia-streaming': {
    en: {
      title: 'Asia & China Streaming',
      subtitle: 'Services integrated with Xmart OS (hidden outside Asia)',
    },
    fr: {
      title: 'Streaming Asie & Chine',
      subtitle: 'Services intégrés à Xmart OS (masqué hors Asie)',
    },
    de: {
      title: 'Asien & China Streaming',
      subtitle: 'In Xmart OS integrierte Dienste (außerhalb Asiens ausgeblendet)',
    },
    es: {
      title: 'Streaming Asia y China',
      subtitle: 'Servicios integrados en Xmart OS (oculto fuera de Asia)',
    },
    it: {
      title: 'Streaming Asia & Cina',
      subtitle: 'Servizi integrati in Xmart OS (nascosto fuori dall\'Asia)',
    },
    nl: {
      title: 'Azië & China Streaming',
      subtitle: 'Diensten geïntegreerd in Xmart OS (verborgen buiten Azië)',
    },
    sv: {
      title: 'Asien & Kina Streaming',
      subtitle: 'Tjänster integrerade i Xmart OS (dold utanför Asien)',
    },
    no: {
      title: 'Asia & Kina Strømming',
      subtitle: 'Tjenester integrert i Xmart OS (skjult utenfor Asia)',
    },
    da: {
      title: 'Asien & Kina Streaming',
      subtitle: 'Tjenester integreret i Xmart OS (skjult uden for Asien)',
    },
    zh: {
      title: '亚洲与中国流媒体',
      subtitle: '集成于Xmart OS的服务',
    },
    ar: {
      title: 'بث آسيا والصين',
      subtitle: 'خدمات متكاملة مع Xmart OS (مخفية خارج آسيا)',
    },
    he: {
      title: 'סטרימינג אסיה וסין',
      subtitle: 'שירותים משולבים ב-Xmart OS (מוסתר מחוץ לאסיה)',
    },
  },

  'learning': {
    en: {
      title: 'Education & Learning',
      subtitle: 'Online courses, tutorials and educational content',
    },
    fr: {
      title: 'Éducation & Apprentissage',
      subtitle: 'Cours en ligne, tutoriels et contenus éducatifs',
    },
    de: {
      title: 'Bildung & Lernen',
      subtitle: 'Online-Kurse, Tutorials und Bildungsinhalte',
    },
    es: {
      title: 'Educación y Aprendizaje',
      subtitle: 'Cursos en línea, tutoriales y contenido educativo',
    },
    it: {
      title: 'Istruzione & Apprendimento',
      subtitle: 'Corsi online, tutorial e contenuti educativi',
    },
    nl: {
      title: 'Onderwijs & Leren',
      subtitle: 'Online cursussen, tutorials en educatieve content',
    },
    sv: {
      title: 'Utbildning & Lärande',
      subtitle: 'Onlinekurser, tutorials och utbildningsinnehåll',
    },
    no: {
      title: 'Utdanning & Læring',
      subtitle: 'Nettkurs, veiledninger og utdanningsinnhold',
    },
    da: {
      title: 'Uddannelse & Læring',
      subtitle: 'Online kurser, tutorials og uddannelsesindhold',
    },
    zh: {
      title: '教育与学习',
      subtitle: '在线课程、教程和教育内容',
    },
    ar: {
      title: 'التعليم والتعلم',
      subtitle: 'دورات عبر الإنترنت ودروس تعليمية ومحتوى تعليمي',
    },
    he: {
      title: 'חינוך ולמידה',
      subtitle: 'קורסים מקוונים, מדריכים ותוכן חינוכי',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MUSIC CATEGORIES
  // ═══════════════════════════════════════════════════════════════════════════
  'music': {
    en: {
      title: 'Music & Audio',
      subtitle: 'XPENG Sound music streaming + country radios (BBC, Radio France, Radioplayer...)',
      highlight: 'Spatial Audio',
    },
    fr: {
      title: 'Musique & Audio',
      subtitle: 'Streaming musical XPENG Sound + radios par pays (BBC, Radio France, Radioplayer...)',
      highlight: 'Audio Spatial',
    },
    de: {
      title: 'Musik & Audio',
      subtitle: 'XPENG Sound Musik-Streaming + Länderradios (BBC, Radio France, Radioplayer...)',
      highlight: 'Räumlicher Klang',
    },
    es: {
      title: 'Música & Audio',
      subtitle: 'Streaming musical XPENG Sound + radios por país (BBC, Radio France, Radioplayer...)',
      highlight: 'Audio Espacial',
    },
    it: {
      title: 'Musica & Audio',
      subtitle: 'Streaming musicale XPENG Sound + radio nazionali (BBC, Radio France, Radioplayer...)',
      highlight: 'Audio Spaziale',
    },
    nl: {
      title: 'Muziek & Audio',
      subtitle: 'XPENG Sound muziekstreaming + landradio\'s (BBC, Radio France, Radioplayer...)',
      highlight: 'Ruimtelijke Audio',
    },
    sv: {
      title: 'Musik & Ljud',
      subtitle: 'XPENG Sound musikstreaming + landsradios (BBC, Radio France, Radioplayer...)',
      highlight: 'Rumsligt Ljud',
    },
    no: {
      title: 'Musikk & Lyd',
      subtitle: 'XPENG Sound musikkstrømming + landsradioer (BBC, Radio France, Radioplayer...)',
      highlight: 'Romlig Lyd',
    },
    da: {
      title: 'Musik & Lyd',
      subtitle: 'XPENG Sound musikstreaming + landeradioer (BBC, Radio France, Radioplayer...)',
      highlight: 'Rumlig Lyd',
    },
    zh: {
      title: '音乐与音频',
      subtitle: 'XPENG Sound音乐流媒体 + 各国电台（BBC、Radio France、Radioplayer...）',
      highlight: '空间音频',
    },
    ar: {
      title: 'موسيقى وصوت',
      subtitle: 'بث موسيقى XPENG Sound + راديو البلدان (BBC، Radio France، Radioplayer...)',
      highlight: 'صوت مكاني',
    },
    he: {
      title: 'מוזיקה ואודיו',
      subtitle: 'סטרימינג מוזיקלי XPENG Sound + רדיו ארצי (BBC, Radio France, Radioplayer...)',
      highlight: 'אודיו מרחבי',
    },
  },

  'asia-music': {
    en: {
      title: 'Asia & China Music',
      subtitle: 'Services integrated with Xmart OS (hidden outside Asia)',
    },
    fr: {
      title: 'Musique Asie & Chine',
      subtitle: 'Services intégrés à Xmart OS (masqué hors Asie)',
    },
    de: {
      title: 'Asien & China Musik',
      subtitle: 'In Xmart OS integrierte Dienste (außerhalb Asiens ausgeblendet)',
    },
    es: {
      title: 'Música Asia y China',
      subtitle: 'Servicios integrados en Xmart OS (oculto fuera de Asia)',
    },
    it: {
      title: 'Musica Asia & Cina',
      subtitle: 'Servizi integrati in Xmart OS (nascosto fuori dall\'Asia)',
    },
    nl: {
      title: 'Azië & China Muziek',
      subtitle: 'Diensten geïntegreerd in Xmart OS (verborgen buiten Azië)',
    },
    sv: {
      title: 'Asien & Kina Musik',
      subtitle: 'Tjänster integrerade i Xmart OS (dold utanför Asien)',
    },
    no: {
      title: 'Asia & Kina Musikk',
      subtitle: 'Tjenester integrert i Xmart OS (skjult utenfor Asia)',
    },
    da: {
      title: 'Asien & Kina Musik',
      subtitle: 'Tjenester integreret i Xmart OS (skjult uden for Asien)',
    },
    zh: {
      title: '亚洲与中国音乐',
      subtitle: '集成于Xmart OS的服务',
    },
    ar: {
      title: 'موسيقى آسيا والصين',
      subtitle: 'خدمات متكاملة مع Xmart OS (مخفية خارج آسيا)',
    },
    he: {
      title: 'מוזיקה אסיה וסין',
      subtitle: 'שירותים משולבים ב-Xmart OS (מוסתר מחוץ לאסיה)',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAMING CATEGORIES
  // ═══════════════════════════════════════════════════════════════════════════
  'gaming': {
    en: {
      title: 'Games & Entertainment',
      subtitle: 'Cloud gaming, instant games and family entertainment',
    },
    fr: {
      title: 'Jeux & Divertissement',
      subtitle: 'Cloud gaming, jeux instantanés et divertissement familial',
    },
    de: {
      title: 'Spiele & Unterhaltung',
      subtitle: 'Cloud-Gaming, Sofortspiele und Familienunterhaltung',
    },
    es: {
      title: 'Juegos y Entretenimiento',
      subtitle: 'Cloud gaming, juegos instantáneos y entretenimiento familiar',
    },
    it: {
      title: 'Giochi & Intrattenimento',
      subtitle: 'Cloud gaming, giochi istantanei e intrattenimento familiare',
    },
    nl: {
      title: 'Games & Entertainment',
      subtitle: 'Cloud gaming, instant games en familie-entertainment',
    },
    sv: {
      title: 'Spel & Underhållning',
      subtitle: 'Molnspel, direktspel och familjeunderhållning',
    },
    no: {
      title: 'Spill & Underholdning',
      subtitle: 'Skyspill, direktespill og familieunderholdning',
    },
    da: {
      title: 'Spil & Underholdning',
      subtitle: 'Cloud gaming, instant spil og familieunderholdning',
    },
    zh: {
      title: '游戏与娱乐',
      subtitle: '云游戏、即时游戏和家庭娱乐',
    },
    ar: {
      title: 'ألعاب وترفيه',
      subtitle: 'ألعاب سحابية وألعاب فورية وترفيه عائلي',
    },
    he: {
      title: 'משחקים ובידור',
      subtitle: 'משחקי ענן, משחקים מיידיים ובידור משפחתי',
    },
  },

  'kids': {
    en: {
      title: 'Kids & Family',
      subtitle: 'Safe content for children and family activities',
    },
    fr: {
      title: 'Enfants & Famille',
      subtitle: 'Contenus sécurisés pour enfants et activités familiales',
    },
    de: {
      title: 'Kinder & Familie',
      subtitle: 'Sichere Inhalte für Kinder und Familienaktivitäten',
    },
    es: {
      title: 'Niños y Familia',
      subtitle: 'Contenido seguro para niños y actividades familiares',
    },
    it: {
      title: 'Bambini & Famiglia',
      subtitle: 'Contenuti sicuri per bambini e attività familiari',
    },
    nl: {
      title: 'Kinderen & Familie',
      subtitle: 'Veilige content voor kinderen en familieactiviteiten',
    },
    sv: {
      title: 'Barn & Familj',
      subtitle: 'Säkert innehåll för barn och familjeaktiviteter',
    },
    no: {
      title: 'Barn & Familie',
      subtitle: 'Trygt innhold for barn og familieaktiviteter',
    },
    da: {
      title: 'Børn & Familie',
      subtitle: 'Sikkert indhold til børn og familieaktiviteter',
    },
    zh: {
      title: '儿童与家庭',
      subtitle: '适合儿童的安全内容和家庭活动',
    },
    ar: {
      title: 'أطفال وعائلة',
      subtitle: 'محتوى آمن للأطفال وأنشطة عائلية',
    },
    he: {
      title: 'ילדים ומשפחה',
      subtitle: 'תוכן בטוח לילדים ופעילויות משפחתיות',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OTHER SERVICES CATEGORIES
  // ═══════════════════════════════════════════════════════════════════════════
  'web-social': {
    en: {
      title: 'Web, Social & Productivity',
      subtitle: 'Email, messaging, social networks and work tools',
    },
    fr: {
      title: 'Web, Social & Productivité',
      subtitle: 'Email, messagerie, réseaux sociaux et outils de travail',
    },
    de: {
      title: 'Web, Social & Produktivität',
      subtitle: 'E-Mail, Messaging, soziale Netzwerke und Arbeitstools',
    },
    es: {
      title: 'Web, Social y Productividad',
      subtitle: 'Correo, mensajería, redes sociales y herramientas de trabajo',
    },
    it: {
      title: 'Web, Social & Produttività',
      subtitle: 'Email, messaggistica, social network e strumenti di lavoro',
    },
    nl: {
      title: 'Web, Social & Productiviteit',
      subtitle: 'E-mail, messaging, sociale netwerken en werktools',
    },
    sv: {
      title: 'Webb, Social & Produktivitet',
      subtitle: 'E-post, meddelanden, sociala nätverk och arbetsverktyg',
    },
    no: {
      title: 'Web, Sosial & Produktivitet',
      subtitle: 'E-post, meldinger, sosiale nettverk og arbeidsverktøy',
    },
    da: {
      title: 'Web, Social & Produktivitet',
      subtitle: 'E-mail, beskeder, sociale netværk og arbejdsværktøjer',
    },
    zh: {
      title: '网络、社交与效率',
      subtitle: '电子邮件、消息、社交网络和工作工具',
    },
    ar: {
      title: 'الويب والتواصل والإنتاجية',
      subtitle: 'البريد الإلكتروني والمراسلة والشبكات الاجتماعية وأدوات العمل',
    },
    he: {
      title: 'אינטרנט, חברתי ופרודוקטיביות',
      subtitle: 'דוא"ל, הודעות, רשתות חברתיות וכלי עבודה',
    },
  },

  'charging': {
    en: {
      title: 'Charging & Navigation',
      subtitle: 'Find stations, plan routes and optimize your electric trips',
    },
    fr: {
      title: 'Recharge & Navigation',
      subtitle: 'Trouvez des bornes, planifiez des itinéraires et optimisez vos trajets électriques',
    },
    de: {
      title: 'Laden & Navigation',
      subtitle: 'Finden Sie Stationen, planen Sie Routen und optimieren Sie Ihre Elektrofahrten',
    },
    es: {
      title: 'Carga y Navegación',
      subtitle: 'Encuentra estaciones, planifica rutas y optimiza tus viajes eléctricos',
    },
    it: {
      title: 'Ricarica & Navigazione',
      subtitle: 'Trova stazioni, pianifica percorsi e ottimizza i tuoi viaggi elettrici',
    },
    nl: {
      title: 'Opladen & Navigatie',
      subtitle: 'Vind stations, plan routes en optimaliseer uw elektrische ritten',
    },
    sv: {
      title: 'Laddning & Navigation',
      subtitle: 'Hitta stationer, planera rutter och optimera dina elresor',
    },
    no: {
      title: 'Lading & Navigasjon',
      subtitle: 'Finn stasjoner, planlegg ruter og optimaliser de elektriske turene dine',
    },
    da: {
      title: 'Opladning & Navigation',
      subtitle: 'Find stationer, planlæg ruter og optimer dine elektriske ture',
    },
    zh: {
      title: '充电与导航',
      subtitle: '寻找充电站，规划路线，优化您的电动出行',
    },
    ar: {
      title: 'الشحن والملاحة',
      subtitle: 'ابحث عن المحطات وخطط للمسارات وحسّن رحلاتك الكهربائية',
    },
    he: {
      title: 'טעינה וניווט',
      subtitle: 'מצא תחנות, תכנן מסלולים ומטב את הנסיעות החשמליות שלך',
    },
  },

  'news': {
    en: {
      title: 'News & Information',
      subtitle: 'Stay informed with news from around the world',
    },
    fr: {
      title: 'Actualités & Information',
      subtitle: 'Restez informé avec les actualités du monde entier',
    },
    de: {
      title: 'Nachrichten & Informationen',
      subtitle: 'Bleiben Sie informiert mit Nachrichten aus aller Welt',
    },
    es: {
      title: 'Noticias e Información',
      subtitle: 'Mantente informado con noticias de todo el mundo',
    },
    it: {
      title: 'Notizie & Informazioni',
      subtitle: 'Resta informato con le notizie da tutto il mondo',
    },
    nl: {
      title: 'Nieuws & Informatie',
      subtitle: 'Blijf op de hoogte met nieuws van over de hele wereld',
    },
    sv: {
      title: 'Nyheter & Information',
      subtitle: 'Håll dig informerad med nyheter från hela världen',
    },
    no: {
      title: 'Nyheter & Informasjon',
      subtitle: 'Hold deg informert med nyheter fra hele verden',
    },
    da: {
      title: 'Nyheder & Information',
      subtitle: 'Hold dig informeret med nyheder fra hele verden',
    },
    zh: {
      title: '新闻与资讯',
      subtitle: '了解全球新闻动态',
    },
    ar: {
      title: 'الأخبار والمعلومات',
      subtitle: 'ابق على اطلاع بالأخبار من جميع أنحاء العالم',
    },
    he: {
      title: 'חדשות ומידע',
      subtitle: 'הישאר מעודכן עם חדשות מרחבי העולם',
    },
  },
};

// Helper function to get category translation
export const getCategoryTranslation = (
  categoryId: string,
  language: SupportedLanguage
): CategoryTranslation => {
  const category = categoryTranslations[categoryId];
  if (!category) {
    return { title: categoryId, subtitle: '' };
  }
  
  return category[language] || category.en || { title: categoryId, subtitle: '' };
};

export default categoryTranslations;
