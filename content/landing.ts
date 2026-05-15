export const landing = {
  header: {
    cta: "Unirme a la lista de espera",
  },
  hero: {
    eyebrow: "Software para documentación técnica recurrente",
    title: "Documentación técnica,\nsin pelearte con Word.",
    subtitle:
      "Darquis es un software para arquitectos, arquitectos técnicos, aparejadores e ingenieros que necesitan preparar certificados, informes técnicos y memorias con formularios guiados, estructura clara y documentos en PDF listos para revisar y firmar.",
    cta: "Unirme a la lista de espera",
    microcopy: "Acceso prioritario a las primeras versiones · Sin compromiso",
    bullets: [
      "Formularios guiados",
      "Documentos en PDF",
      "Revisión y firma",
    ],
  },
  problem: {
    eyebrow: "Por qué nace Darquis",
    title: "Menos trabajo repetitivo. Más criterio técnico donde importa.",
    text:
      "Darquis está en fase pre-MVP y se está diseñando para ordenar el trabajo documental habitual sin sustituir la revisión ni el criterio profesional.",
    items: [
      {
        title: "Plantillas Word heredadas",
        text: "Archivos duplicados, formatos que se rompen y documentos que cambian según quién los tocó por última vez.",
      },
      {
        title: "Revisión manual",
        text: "Datos repetidos en varios puntos, comprobaciones dispersas y pequeños errores que aparecen al final.",
      },
      {
        title: "Normativa dispersa",
        text: "Referencias, apartados y requisitos que obligan a ir saltando entre fuentes mientras redactas.",
      },
      {
        title: "Documentos repetitivos",
        text: "Certificados, informes y memorias con estructuras similares que consumen más tiempo del necesario.",
      },
    ],
  },
  featuresIntro: {
    eyebrow: "Ahorro de tiempo",
    title: "Menos Word. Más documento listo.",
    text:
      "Rellena datos una vez y Darquis te ayuda a ordenar certificados, informes y memorias para revisar y firmar.",
  },
  features: [
    {
      key: "normativas",
      label: "Normativa",
      title: "Menos dudas mientras rellenas",
      text:
        "La estructura te pide la información clave desde el inicio, para reducir revisiones y olvidos habituales.",
    },
    {
      key: "word",
      label: "Plantillas Word",
      title: "Deja de rehacer plantillas",
      text:
        "Sin copiar, pegar y arreglar formatos. Los datos quedan ordenados para generar documentación consistente.",
    },
    {
      key: "estilo",
      label: "Tu criterio",
      title: "Mantén tu forma de trabajar",
      text:
        "Plantillas alineadas con tu estilo técnico, con formato y orden comunes en cada documento.",
    },
    {
      key: "rapidez",
      label: "PDF",
      title: "Listo para revisar y firmar",
      text:
        "Completas el formulario guiado y obtienes un PDF preparado para revisión, firma y presentación.",
    },
  ],
  workflow: {
    eyebrow: "Cómo funciona",
    title: "De una plantilla Word dispersa a un PDF listo para revisar.",
    text:
      "Darquis convierte el trabajo repetitivo en un flujo guiado: eliges el documento, completas apartados, revisas la estructura y exportas una versión lista para revisar y firmar.",
  },
  documents: {
    eyebrow: "Documentos",
    title: "Documentación técnica habitual, ordenada en un mismo sistema",
    text:
      "Darquis está pensada para la documentación recurrente del trabajo diario de arquitectos, arquitectos técnicos, aparejadores e ingenieros.",
    categories: [
      { key: "certificados", name: "Certificados", description: "Segunda ocupación, antigüedad y documentación recurrente." },
      { key: "informes", name: "Informes técnicos", description: "Periciales, tasaciones y análisis técnicos." },
      { key: "memorias", name: "Memorias técnicas", description: "Aperturas, reformas y trabajos justificativos." },
      { key: "anexos", name: "Anexos", description: "Declaraciones responsables, contratos y documentación complementaria." },
    ],
    extras: ["Aperturas", "Reformas", "Herramientas", "Otros recursos"],
  },
  waitlist: {
    eyebrow: "Lista de espera",
    title: "Sé de los primeros en usar Darquis.",
    text:
      "Estamos preparando las primeras versiones. Si quieres probar Darquis antes que nadie y ayudarnos a diseñar un software realmente útil para técnicos, únete a la lista de espera.",
    cta: "Unirme a la lista de espera",
    microcopy: "Sin compromiso · Sin spam",
    confirmationTitle: "Solicitud recibida.",
    confirmationText:
      "Gracias por apuntarte. Te avisaremos en cuanto el acceso esté disponible para los primeros usuarios de Darquis.",
    privacyText:
      "Acepto la política de privacidad y el tratamiento de mis datos para recibir información sobre Darquis.",
  },
  profiles: [
    { value: "arquitecto", label: "Arquitecto" },
    { value: "arquitecto-tecnico", label: "Arquitecto técnico / Aparejador" },
    { value: "ingeniero", label: "Ingeniero" },
    { value: "otro-perfil-tecnico", label: "Otro perfil técnico" },
  ],
  footer: {
    email: "info@darquis.com",
    legal: [
      { label: "Aviso legal", href: "/aviso-legal" },
      { label: "Política de privacidad", href: "/privacidad" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
} as const;
