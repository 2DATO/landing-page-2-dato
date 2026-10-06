/* ===================================================================
   2Dato Landing Page — Internationalisation (EN / ES)
   Bilingual catalog, DOM rewrite, localStorage persistence,
   browser-language detection, and SR live-region announcement.
   =================================================================== */

'use strict';

/* ------------------------------------------------------------------
   Catalog
   Keys mirror every data-i18n and data-i18n-html attribute in
   index.html. HTML values MUST preserve the inner markup tree so
   styled elements (e.g. <span class="green">) survive a language
   switch without DOM thrash.
   ------------------------------------------------------------------ */
var CATALOG = {
    en: {
        /* Navigation */
        'nav.cap': 'Capabilities',
        'nav.app': 'Approach',
        'nav.ind': 'Industries',
        'nav.team': 'Team',
        'nav.cta': 'Request a proposal →',

        /* Hero */
        'hero.mark': 'El Punto · The mark',
        'hero.eyebrow': '2DATO · Bogotá → Worldwide',
        'hero.title':
            'From a single point<br />of data to <span class="green">decisions<span class="punto"></span></span><br />that <span class="green">run themselves.</span>',
        'hero.lede':
            '2DATO is a data & AI consultancy for organizations that have outgrown spreadsheets and dashboards. We design the data foundation, deploy the models, and build the agents that run on top — end to end.',
        'hero.see': 'See capabilities',
        'hero.tag': 'Data-Driven · AI-Powered',

        /* Outcomes */
        'out.1': 'Faster data retrieval, on average',
        'out.2': 'Reduction in manual processing',
        'out.3': 'Industries delivered — energy, telecom, CPG',
        'out.4': 'Engagements across Latin America & beyond',

        /* Capabilities */
        'caps.eyebrow': 'What we do',
        'caps.title': 'Six capabilities,<br />one <span class="green">accountable</span> partner.',
        'caps.pitch':
            'Most consultancies hand you a deck. We hand you a working system. From data ingestion to autonomous agents, we own the full stack — so insights become outcomes, not slides.',
        'cap1.t': 'Data Engineering',
        'cap1.d':
            'Modern lakehouse architectures, ETL/ELT pipelines, and real-time streaming — the foundation everything else stands on.',
        'cap2.t': 'Cloud Architecture',
        'cap2.d':
            'Migration, optimization, and infrastructure-as-code on Azure and AWS. Repeatable, secure, cost-aware.',
        'cap3.t': 'AI & Machine Learning',
        'cap3.d':
            'From predictive models to generative AI and autonomous agents — production-grade MLOps, not notebooks.',
        'cap4.t': 'Analytics & BI',
        'cap4.d':
            'Executive dashboards, KPI frameworks, and real-time analytics that drive decisions, not vanity metrics.',
        'cap5.t': 'Data Governance',
        'cap5.d':
            'Quality frameworks, lineage, and security policies. Trustworthy data at every layer — accurate, protected, auditable.',
        'cap6.t': 'IT Strategy & Consulting',
        'cap6.d':
            'Technology advisory, architecture reviews, and digital transformation roadmaps — pragmatic, business-anchored.',

        /* Approach */
        'app.eyebrow': 'How we work',
        'app.title': 'A method, not<br />a <span class="green">moonshot</span>.',
        'app.pitch':
            'Six weeks to first measurable impact. We move in tight, scoped sprints — every phase ends with something running in your environment.',
        'step1.n': '01 / DISCOVERY',
        'step1.t': 'Diagnose the data, not the symptoms.',
        'step1.d':
            'Two-week deep dive into your data landscape, decision flows, and biggest blockers. You leave with a prioritized roadmap — keep it whether you continue with us or not.',
        'step1.w': '~ 2 wks',
        'step2.n': '02 / FOUNDATION',
        'step2.t': 'Build the spine.',
        'step2.d':
            'Lakehouse, pipelines, governance. The unsexy infrastructure every AI initiative needs but most companies skip. Done right, once.',
        'step2.w': '4–8 wks',
        'step3.n': '03 / INTELLIGENCE',
        'step3.t': 'Deploy models that earn their keep.',
        'step3.d':
            'Predictive, generative, or agentic — chosen by business case, not hype. Each model ships with monitoring, retraining, and a clear ROI hypothesis.',
        'step3.w': '3–6 wks',
        'step4.n': '04 / ACTIVATION',
        'step4.t': 'Wire it into the business.',
        'step4.d':
            'Dashboards, agents, and automations integrated where work actually happens — not in a portal nobody opens.',
        'step4.w': '2–4 wks',
        'step5.n': '05 / HANDOFF',
        'step5.t': 'Leave you stronger than we found you.',
        'step5.d':
            'Documentation, runbooks, and team enablement. Optional ongoing support — but you’re never locked in.',
        'step5.w': 'ongoing',

        /* Promise */
        'promise.eyebrow': 'Our promise',
        'promise.quote':
            '“Every organization holds <span class="green">hidden potential</span> in its data<span class="punto" aria-hidden="true"></span> waiting to be discovered.”',
        'promise.attr': '— 2DATO · Brand Manifesto',

        /* Industries */
        'ind.eyebrow': 'Industries',
        'ind.title': 'Sectors we serve.',
        'ind.energy': 'Energy',
        'ind.tel': 'Telecom',
        'ind.cpg': 'CPG & Retail',
        'ind.fin': 'Financial Services',
        'ind.health': 'Healthcare',
        'ind.man': 'Manufacturing',

        /* Team */
        'team.eyebrow': 'The team',
        'team.title': 'Senior engineers.',
        'team.tag':
            'A small, hand-picked team. Every project led directly by the people who built 2DATO.',
        'team.r1': 'Data Architect',
        'team.r2': 'Data Scientist',
        'team.r3': 'Power BI Engineer',

        /* CTA */
        'cta.eyebrow': 'Get started',
        'cta.title':
            'Tell us what’s<br />in the <span class="green">way<span class="punto"></span></span>',
        'cta.lede':
            'Send a brief — current state, target outcome, timeline. We’ll come back within two business days with a scoped proposal, fixed-price where possible.',
        'cta.m1': 'response within 2 business days',
        'cta.m2': 'proposals fixed-price where possible',
        'cta.m3': 'NDA on request',

        /* Footer */
        'footer.contact': 'Contact',
        'footer.privacy': 'Privacy',
        'footer.terms': 'Terms',
        'footer.meta': '© 2026 2DATO · Bogotá → World',
    },

    es: {
        /* Navigation */
        'nav.cap': 'Capacidades',
        'nav.app': 'Metodología',
        'nav.ind': 'Industrias',
        'nav.team': 'Equipo',
        'nav.cta': 'Solicitar propuesta →',

        /* Hero */
        'hero.mark': 'El Punto · La marca',
        'hero.eyebrow': '2DATO · Bogotá → Al mundo',
        'hero.title':
            'De un solo punto<br />de datos a <span class="green">decisiones<span class="punto"></span></span><br />que <span class="green">se ejecutan solas.</span>',
        'hero.lede':
            '2DATO es una consultoría de datos e IA para organizaciones que han superado las hojas de cálculo y los dashboards. Diseñamos la base de datos, desplegamos los modelos y construimos los agentes que los ejecutan, de punta a punta.',
        'hero.see': 'Ver capacidades',
        'hero.tag': 'Basados en datos · Impulsados por IA',

        /* Outcomes */
        'out.1': 'Más rápida recuperación de datos, en promedio',
        'out.2': 'Reducción en procesamiento manual',
        'out.3': 'Industrias con entregas — energía, telecom, CPG',
        'out.4': 'Proyectos en Latinoamérica & más allá',

        /* Capabilities */
        'caps.eyebrow': 'Lo que hacemos',
        'caps.title': 'Seis capacidades,<br />un socio <span class="green">responsable</span>.',
        'caps.pitch':
            'La mayoría de las consultorías te entregan una presentación. Nosotros te entregamos un sistema que funciona. Desde la ingesta de datos hasta los agentes autónomos, manejamos el stack completo — para que los insights se conviertan en resultados, no en diapositivas.',
        'cap1.t': 'Ingeniería de Datos',
        'cap1.d':
            'Arquitecturas lakehouse modernas, pipelines ETL/ELT y streaming en tiempo real — la base sobre la que todo lo demás se apoya.',
        'cap2.t': 'Arquitectura Cloud',
        'cap2.d':
            'Migración, optimización e infraestructura como código en Azure y AWS. Repetible, segura, con control de costos.',
        'cap3.t': 'IA & Machine Learning',
        'cap3.d':
            'Desde modelos predictivos hasta IA generativa y agentes autónomos — MLOps de grado productivo, no notebooks.',
        'cap4.t': 'Analytics & BI',
        'cap4.d':
            'Dashboards ejecutivos, marcos de KPIs y analítica en tiempo real que impulsan decisiones, no métricas de vanidad.',
        'cap5.t': 'Gobernanza de Datos',
        'cap5.d':
            'Marcos de calidad, linaje y políticas de seguridad. Datos confiables en cada capa — precisos, protegidos, auditables.',
        'cap6.t': 'Estrategia TI & Consultoría',
        'cap6.d':
            'Asesoría tecnológica, revisiones de arquitectura y hojas de ruta de transformación digital — pragmáticas, ancladas al negocio.',

        /* Approach */
        'app.eyebrow': 'Cómo trabajamos',
        'app.title': 'Un método, no<br />un <span class="green">cohete a la luna</span>.',
        'app.pitch':
            'Seis semanas para el primer impacto medible. Avanzamos en sprints ajustados y acotados — cada fase termina con algo funcionando en tu entorno.',
        'step1.n': '01 / DESCUBRIMIENTO',
        'step1.t': 'Diagnostica los datos, no los síntomas.',
        'step1.d':
            'Dos semanas de análisis profundo de tu panorama de datos, flujos de decisión y principales bloqueos. Sales con un roadmap priorizado — quédatelo, independientemente de si continúas con nosotros.',
        'step1.w': '~ 2 sem',
        'step2.n': '02 / FUNDAMENTOS',
        'step2.t': 'Construye la columna vertebral.',
        'step2.d':
            'Lakehouse, pipelines, gobernanza. La infraestructura poco glamorosa que toda iniciativa de IA necesita pero la mayoría de empresas omite. Bien hecha, una sola vez.',
        'step2.w': '4–8 sem',
        'step3.n': '03 / INTELIGENCIA',
        'step3.t': 'Despliega modelos que se ganen su lugar.',
        'step3.d':
            'Predictivos, generativos o agénticos — elegidos por el caso de negocio, no por la moda. Cada modelo incluye monitoreo, reentrenamiento e hipótesis de ROI.',
        'step3.w': '3–6 sem',
        'step4.n': '04 / ACTIVACIÓN',
        'step4.t': 'Intégralo al negocio.',
        'step4.d':
            'Dashboards, agentes y automatizaciones integrados donde ocurre el trabajo real — no en un portal que nadie abre.',
        'step4.w': '2–4 sem',
        'step5.n': '05 / ENTREGA',
        'step5.t': 'Déjate más fuerte que como te encontramos.',
        'step5.d':
            'Documentación, runbooks y habilitación del equipo. Soporte continuo opcional — pero nunca estarás atado.',
        'step5.w': 'continuo',

        /* Promise */
        'promise.eyebrow': 'Nuestra promesa',
        'promise.quote':
            '“Toda organización guarda <span class="green">potencial oculto</span> en sus datos<span class="punto" aria-hidden="true"></span> esperando ser descubierto.”',
        'promise.attr': '— 2DATO · Manifiesto de Marca',

        /* Industries */
        'ind.eyebrow': 'Industrias',
        'ind.title': 'Sectores que atendemos.',
        'ind.energy': 'Energía',
        'ind.tel': 'Telecomunicaciones',
        'ind.cpg': 'CPG & Retail',
        'ind.fin': 'Servicios Financieros',
        'ind.health': 'Salud',
        'ind.man': 'Manufactura',

        /* Team */
        'team.eyebrow': 'El equipo',
        'team.title': 'Ingenieros senior.',
        'team.tag':
            'Un equipo pequeño y selecto. Cada proyecto liderado directamente por quienes fundaron 2DATO.',
        'team.r1': 'Arquitecto de Datos',
        'team.r2': 'Científico de Datos',
        'team.r3': 'Ingeniero Power BI',

        /* CTA */
        'cta.eyebrow': 'Comencemos',
        'cta.title':
            'Cuéntanos qué está<br />en el <span class="green">camino<span class="punto"></span></span>',
        'cta.lede':
            'Envía un brief — estado actual, objetivo deseado, cronograma. Responderemos en dos días hábiles con una propuesta acotada, precio fijo donde sea posible.',
        'cta.m1': 'respuesta en 2 días hábiles',
        'cta.m2': 'propuestas a precio fijo donde sea posible',
        'cta.m3': 'NDA a pedido',

        /* Footer */
        'footer.contact': 'Contacto',
        'footer.privacy': 'Privacidad',
        'footer.terms': 'Términos',
        'footer.meta': '© 2026 2DATO · Bogotá → Al mundo',
    },
};

/* ------------------------------------------------------------------
   DOM rewrite
   Two-pass: text-content nodes first, then innerHTML nodes.
   Attribute keys handled inline via data-i18n-attr (reserved for
   future use; not present in current markup).
   ------------------------------------------------------------------ */
function applyLang(lang, opts) {
    var announce = opts && opts.announce !== undefined ? opts.announce : true;
    var dict = CATALOG[lang];
    if (!dict) return;

    /* Pass 1 — text content */
    var textNodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < textNodes.length; i++) {
        var el = textNodes[i];
        var key = el.getAttribute('data-i18n');
        if (Object.prototype.hasOwnProperty.call(dict, key)) {
            el.textContent = dict[key];
        }
    }

    /* Pass 2 — innerHTML (preserves inner markup) */
    var htmlNodes = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlNodes.length; j++) {
        var elH = htmlNodes[j];
        var keyH = elH.getAttribute('data-i18n-html');
        if (Object.prototype.hasOwnProperty.call(dict, keyH)) {
            elH.innerHTML = dict[keyH];
        }
    }

    /* Update <html lang> */
    document.documentElement.lang = lang;

    /* Update toggle button states */
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var k = 0; k < buttons.length; k++) {
        var btn = buttons[k];
        var isActive = btn.getAttribute('data-set-lang') === lang;
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        if (isActive) {
            btn.classList.add('on');
        } else {
            btn.classList.remove('on');
        }
    }

    /* Update lang-toggle wrapper data attribute */
    var toggle = document.getElementById('langToggle');
    if (toggle) {
        toggle.setAttribute('data-lang', lang);
    }

    /* Announce language change to screen readers — skip on boot to avoid spurious SR chatter */
    if (announce) {
        var status = document.getElementById('lang-status');
        if (status) {
            status.textContent = lang === 'es' ? 'Idioma: Español' : 'Language: English';
        }
    }
}

/* ------------------------------------------------------------------
   Persistence and detection
   ------------------------------------------------------------------ */
var STORAGE_KEY = '2dato.lang';
var SUPPORTED = ['en', 'es'];

function detectLang() {
    /* 1. Honour explicit URL param: ?lang=en or ?lang=es */
    try {
        var params = new URLSearchParams(window.location.search);
        var paramLang = params.get('lang');
        if (paramLang && SUPPORTED.indexOf(paramLang) !== -1) {
            return paramLang;
        }
    } catch (_e) {
        /* URLSearchParams unavailable — fall through */
    }

    /* 2. Stored preference */
    try {
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED.indexOf(stored) !== -1) {
            return stored;
        }
    } catch (_e2) {
        /* localStorage unavailable — fall through */
    }

    /* 3. Browser language — default ES for es-* locales (Colombian audience) */
    var nav = window.navigator;
    var browserLang = (nav.language || nav.userLanguage || 'es').toLowerCase();
    return browserLang.indexOf('es') === 0 ? 'es' : 'en';
}

function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    try {
        localStorage.setItem(STORAGE_KEY, lang);
    } catch (_e) {
        /* storage blocked */
    }
    applyLang(lang);
}

/* ------------------------------------------------------------------
   Toggle wiring
   ------------------------------------------------------------------ */
function initI18n() {
    var initialLang = detectLang();
    // TODO: FOUC — pre-script in <head> would prevent EN→ES flash on initial load
    applyLang(initialLang, { announce: false });

    /* Wire toggle buttons */
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i++) {
        (function (btn) {
            btn.addEventListener('click', function () {
                var lang = btn.getAttribute('data-set-lang');
                setLang(lang);
            });
        })(buttons[i]);
    }
}

/* ------------------------------------------------------------------
   Boot
   ------------------------------------------------------------------ */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}
