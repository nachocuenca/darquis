export const legalPages = {
  avisoLegal: {
    title: "Aviso legal",
    intro: "Información básica del titular de la web Darquis.",
    sections: [
      {
        title: "Titularidad",
        body: [
          "Titular: [Nombre fiscal pendiente]",
          "NIF: [NIF pendiente]",
          "Domicilio fiscal: [Domicilio fiscal pendiente]",
          "Email de contacto: info@darquis.com",
        ],
      },
      {
        title: "Uso del sitio web",
        body: [
          "Esta web tiene carácter informativo y permite solicitar acceso a una lista de espera de un software en desarrollo.",
          "El contenido puede evolucionar mientras el proyecto avanza hacia sus primeras versiones.",
        ],
      },
    ],
  },
  privacidad: {
    title: "Política de privacidad",
    intro: "Información básica sobre el tratamiento de datos en la lista de espera.",
    sections: [
      {
        title: "Responsable",
        body: [
          "Responsable: [Nombre fiscal pendiente]",
          "Email de contacto: info@darquis.com",
        ],
      },
      {
        title: "Finalidad",
        body: [
          "Los datos facilitados se usarán para gestionar la solicitud de acceso a la lista de espera y enviar información relacionada con Darquis.",
          "No se utilizarán para finalidades distintas sin informar previamente y, cuando corresponda, solicitar consentimiento.",
        ],
      },
      {
        title: "Datos tratados",
        body: [
          "Email profesional y, si el usuario lo facilita, perfil profesional.",
          "La implementación técnica actual valida la solicitud y queda pendiente de conectar una persistencia real antes de publicar.",
        ],
      },
      {
        title: "Derechos",
        body: [
          "Puedes solicitar información, rectificación o eliminación escribiendo a info@darquis.com.",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookies",
    intro: "Información provisional sobre cookies y tecnologías similares.",
    sections: [
      {
        title: "Uso actual",
        body: [
          "Esta versión de la landing no incorpora analítica, publicidad comportamental ni herramientas de seguimiento externas.",
          "Si se añaden cookies o servicios de terceros, esta página deberá actualizarse antes de publicar.",
        ],
      },
      {
        title: "Contacto",
        body: ["Para cualquier consulta, puedes escribir a info@darquis.com."],
      },
    ],
  },
} as const;
