export const landing = {
  header: {
    cta: "Lista de espera",
  },
  hero: {
    eyebrow: "Documentación técnica recurrente",
    title: "Documentación técnica,\nsin pelearte con Word.",
    subtitle:
      "Darquis es una herramienta pensada para arquitectos, aparejadores e ingenieros que buscan una forma más clara y ordenada de elaborar certificados, informes y memorias técnicas recurrentes.",
    cta: "Apúntate a la lista de espera",
    microcopy: "Acceso prioritario a las primeras versiones · Sin compromiso",
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
    eyebrow: "Beneficios",
    title: "Por qué elegir Darquis",
  },
  features: [
    {
      key: "normativas",
      label: "Sin normativas",
      title: "La normativa no debería perseguirte",
      text:
        "Darquis tiene en cuenta la normativa desde el inicio del documento. Te guía en la estructura y en la información necesaria mientras trabajas, evitando dudas, revisiones de última hora y errores habituales.",
    },
    {
      key: "word",
      label: "Adiós Word",
      title: "Copiar y pegar no es un método",
      text:
        "Nada de pelearte con Word ni de reutilizar plantillas obsoletas. Darquis ordena los datos y genera documentación clara y profesional, sin trabajo artesanal ni revisiones innecesarias.",
    },
    {
      key: "estilo",
      label: "Tu estilo",
      title: "No te adaptes al documento, que se adapte a ti",
      text:
        "Las plantillas se ajustan a tu forma de trabajar y a tu criterio técnico. Todos los documentos mantienen el mismo formato, estructura y orden, independientemente del tipo de trabajo.",
    },
    {
      key: "rapidez",
      label: "Rapidez",
      title: "Menos vueltas, más resultado",
      text:
        "Eliges el tipo de trabajo y completas los formularios guiados. El documento se genera en PDF, listo para revisar, firmar y presentar, sin procesos innecesarios.",
    },
  ],
  documents: {
    title: "Documentos que puedes generar",
    text:
      "Darquis está pensada para la documentación técnica habitual en el trabajo diario de arquitectos y arquitectos técnicos.",
    categories: [
      { key: "certificados", name: "Certificados", description: "Segunda ocupación, antigüedad..." },
      { key: "informes", name: "Informes técnicos", description: "Pericial, tasación..." },
      { key: "memorias", name: "Memorias técnicas", description: "Aperturas, piscinas..." },
      { key: "anexos", name: "Anexos", description: "Declaración responsable, contratos..." },
    ],
    extras: ["Aperturas", "Reformas", "Herramientas", "Otros recursos"],
  },
  waitlist: {
    title: "Sé de los primeros en usar Darquis.",
    text:
      "Estamos preparando las primeras versiones. Si quieres probar Darquis antes que nadie y participar en su evolución, apúntate a la lista de espera.",
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
    email: "info@darquis.io",
    legal: [
      { label: "Aviso legal", href: "/aviso-legal" },
      { label: "Política de privacidad", href: "/privacidad" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
} as const;
