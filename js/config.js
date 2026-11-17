/* =====================================================================
   CONFIGURACIÓN DEL EVALUADOR CO-STAR
   ---------------------------------------------------------------------
   Este archivo es el único que el profesorado necesita tocar para
   ajustar el comportamiento de la web. Todo se evalúa en el navegador
   del alumno mediante reglas (no se envía nada a ningún servidor).

   Marco de referencia: "Prompt Engineering Playbook (Beta v3)",
   GovTech Data Science & AI Division, apartado "The CO-STAR approach
   to writing your prompts" (págs. 26-41). Las definiciones, los
   recordatorios y los criterios de cada variable siguen ese documento,
   adaptados al encargo habitual de la asignatura (prototipar webs).

   Cómo se calcula la puntuación de cada variable (0-100):
     puntuación = 100 × ( PESOS.extension × extensión
                        + PESOS.cobertura × cobertura
                        + PESOS.precision × precisión )

     · extensión  → nº de palabras respecto a "palabrasObjetivo".
     · cobertura  → cuántos de los "criterios" de la variable aparecen
                    (cada criterio se detecta con su lista de términos).
     · precisión  → cifras, nombres propios, variedad de vocabulario,
                    densidad de detalles y ausencia de palabras vagas.

   IDIOMAS
     · Los textos visibles tienen versión { es: "...", en: "..." }.
     · Cada criterio tiene términos en español (es) y en inglés (en).
       Se buscan SIEMPRE los dos, así se puede evaluar un prompt escrito
       en cualquiera de los dos idiomas sea cual sea el idioma de la web.

   Sobre los términos:
     · Escríbelos en minúsculas y SIN tildes (la web normaliza el texto).
     · Por defecto un término se busca como inicio de palabra:
         "disen"  encuentra "diseño", "diseñar", "diseñado"...
     · Si empieza por "=" se busca como palabra exacta:
         "=tu"    encuentra "tú" pero no "turistas".
   ===================================================================== */

window.COSTAR_CONFIG = {

  // Por debajo de este porcentaje se muestra el recordatorio de la variable
  UMBRAL_RECORDATORIO: 60,

  // Peso de cada componente (deben sumar 1)
  PESOS: { extension: 0.25, cobertura: 0.50, precision: 0.25 },

  // Si una variable tiene menos palabras que esto, su nota se limita a TOPE_MUY_CORTO
  MINIMO_PALABRAS: 4,
  TOPE_MUY_CORTO: 20,

  // Idioma por defecto si el navegador no está en español ni en inglés
  IDIOMA_POR_DEFECTO: "es",

  // Textos del pie y del informe PDF
  ASIGNATURA: { es: "Publicación en Internet", en: "Internet Publishing" },
  CENTRO: { es: "Universidad de Cádiz", en: "University of Cádiz" },
  FUENTE: {
    es: "Basado en el enfoque CO-STAR del «Prompt Engineering Playbook» (Beta v3, GovTech Data Science & AI Division).",
    en: "Based on the CO-STAR approach in the “Prompt Engineering Playbook” (Beta v3, GovTech Data Science & AI Division)."
  },

  // Palabras que restan precisión (vaguedad), en ambos idiomas
  PALABRAS_VAGAS: [
    "=cosas", "=cosa", "=bonito", "=bonita", "=bonitos", "=bonitas",
    "=etc", "=normal", "=normales", "=chulo", "=chula", "=guay",
    "lo que sea", "=cualquier", "=interesante", "=atractivo", "=atractiva", "=tipico", "=tipica",
    "=stuff", "=things", "=thing", "=nice", "=cool", "=whatever", "=something", "=good", "=pretty", "=interesting", "=etc"
  ],

  // Plantillas que se insertan con el botón "Insertar plantilla"
  PLANTILLA: {
    es:
`# CONTEXTO
[Información de fondo: quién eres o para quién trabajas, qué marca/producto, situación actual y por qué haces el encargo, mercado, datos relevantes]

# OBJETIVO
[Qué tarea concreta debe hacer la IA, qué entregable esperas, para qué y cómo sabrás que funciona]

# ESTILO
[Qué rol o persona experta debe adoptar la IA (p. ej. «actúa como un diseñador UX senior»), estilo de redacción y/o visual, referentes, qué evitar]

# TONO
[Actitud y emoción: formal, cercano, humorístico, empático, inspirador... y sus matices]

# AUDIENCIA
[A quién va dirigido: público general o grupo concreto, edad, ubicación, intereses, necesidades, nivel de conocimiento]

# RESPUESTA
[Formato y longitud de la respuesta: tipo de salida (código, tabla, lista numerada, informe...), estructura y orden, extensión, especificaciones, ejemplo de salida]`,
    en:
`# CONTEXT
[Background information: who you are or who you work for, which brand/product, current situation and why you need this, market, relevant data]

# OBJECTIVE
[What specific task the AI must perform, what deliverable you expect, what for, and how you will know it works]

# STYLE
[Which role or expert persona the AI should adopt (e.g. "act as a senior UX designer"), writing and/or visual style, references, what to avoid]

# TONE
[Attitude and emotion: formal, casual, humorous, empathetic, inspirational... and its nuances]

# AUDIENCE
[Who it is for: general public or a specific group, age, location, interests, needs, level of knowledge]

# RESPONSE
[Response format and length: type of output (code, table, numbered list, report...), structure and order, length, specifications, sample output]`
  },

  // Cita del Playbook que se muestra justo después de la guía de variables
  CITA: "Remember that the AI is merely your co-star, and you are still the star of the show!",
  CITA_FUENTE: "Prompt Engineering Playbook (Beta v3), GovTech",

  // Consejos generales del Playbook que se muestran en la guía
  CONSEJOS: {
    es: [
      "Escribe el Contexto antes que el Objetivo: primero la situación, luego la tarea.",
      "Sé lo más específico posible: un prompt ambiguo obliga a la IA a adivinar qué quieres.",
      "Pide a la IA que adopte un rol o el estilo de un experto: su respuesta será menos genérica.",
      "Visualiza la respuesta antes de enviar el prompt: ¿corta o detallada? ¿texto, lista numerada, tabla, informe?",
      "Mostrar uno o varios ejemplos del resultado que esperas ayuda mucho a controlar el formato.",
      "Itera hasta la perfección: revisa la respuesta, ajusta el prompt y vuelve a probar."
    ],
    en: [
      "Write the Context before the Objective: first the situation, then the task.",
      "Be as specific as you can: an ambiguous prompt forces the AI to guess what you want.",
      "Ask the AI to adopt a role or an expert's style: the response will be less generic.",
      "Visualise the response before sending the prompt: short or detailed? Text, numbered list, table, report?",
      "Showing one or more examples of the output you expect greatly helps control the format.",
      "Iterate till perfection: review the response, adjust the prompt and try again."
    ]
  },

  VARIABLES: [
    /* ------------------------------------------------------------- C */
    {
      id: "contexto", letra: "C", color: "#2563eb",
      nombre: { es: "Contexto", en: "Context" },
      alias: ["contexto", "context", "antecedentes", "background", "situacion", "situation"],
      palabrasObjetivo: 80,
      precision: { cifras: 2, nombresPropios: 2 },
      definicion: {
        es: "La información de fondo necesaria para que la IA entienda el tema y la situación en la que te encuentras: quién eres o para quién trabajas, qué marca, producto o servicio está en juego, por qué haces el encargo y los detalles relevantes (mercado, datos, limitaciones). Sin contexto, la IA devuelve respuestas genéricas.",
        en: "The background information the AI needs to understand the topic and the situation you are in: who you are or who you work for, which brand, product or service is involved, why you need this, and any relevant details (market, data, constraints). Without context, the AI returns generic responses."
      },
      recordatorio: {
        es: [
          "Quién eres o qué organización/marca representas.",
          "Qué producto, servicio o proyecto está en juego.",
          "La situación actual y el motivo del encargo (por qué lo necesitas).",
          "El mercado, el sector o la competencia.",
          "Datos concretos: cifras, fechas, trayectoria, ubicación.",
          "Limitaciones o recursos: presupuesto, plazos, requisitos.",
          "Consejo: escribe el Contexto antes que el Objetivo."
        ],
        en: [
          "Who you are or which organisation/brand you represent.",
          "Which product, service or project is involved.",
          "The current situation and the reason for the request (why you need it).",
          "The market, sector or competitors.",
          "Specific data: figures, dates, track record, location.",
          "Constraints or resources: budget, deadlines, requirements.",
          "Tip: write the Context before the Objective."
        ]
      },
      criterios: [
        { nombre: "Organización o marca",
          es: ["empresa", "marca", "negocio", "organizacion", "startup", "tienda", "agencia", "cliente", "compania", "asociacion", "emprend", "=ong", "restaurante", "estudio", "fundad", "somos", "trabajo en", "trabajamos", "=soy", "proyecto", "cafeteria", "=bar", "hotel", "academia", "club", "bodega", "despacho", "consultora", "firma"],
          en: ["company", "brand", "business", "organisation", "organization", "startup", "shop", "store", "agency", "client", "association", "=ngo", "restaurant", "studio", "founded", "we are", "i work", "we work", "=i am", "=i'm", "project", "cafe", "coffee shop", "academy", "winery", "firm", "charity"] },
        { nombre: "Producto o servicio",
          es: ["producto", "servicio", "oferta", "catalogo", "coleccion", "lanzamiento", "lanza", "=app", "aplicacion", "plataforma", "curso", "evento", "vende", "vendemos", "ofrece", "ofrecemos", "menu", "linea de", "gama"],
          en: ["product", "service", "offer", "catalog", "collection", "launch", "=app", "application", "platform", "course", "event", "sell", "we sell", "menu", "range", "line of"] },
        { nombre: "Situación y motivo",
          es: ["actualmente", "situacion", "problema", "necesit", "reto", "desafio", "momento", "campana", "temporada", "crisis", "crec", "queremos", "quiere", "pretende", "hasta ahora", "todavia", "aun no", "no tiene", "no tenemos", "carece", "caida", "porque", "debido", "ya que", "motivo", "razon", "por eso"],
          en: ["currently", "situation", "problem", "need", "challenge", "moment", "campaign", "season", "crisis", "grow", "we want", "so far", "still", "not yet", "we don't have", "lack", "drop", "because", "due to", "since", "reason", "that's why"] },
        { nombre: "Mercado y competencia",
          es: ["mercado", "sector", "competencia", "competidor", "industria", "nicho", "tendencia", "diferencia", "posicionamiento", "frente a", "otras marcas", "rival"],
          en: ["market", "sector", "competition", "competitor", "industry", "niche", "trend", "differentiat", "positioning", "other brands", "rival"] },
        { nombre: "Datos y antecedentes", cuentaCifras: true,
          es: ["datos", "desde", "historia", "trayectoria", "ventas", "seguidores", "facturacion", "anos", "fundada", "fundado", "experiencia", "ubicad", "situad", "con sede", "localizad"],
          en: ["data", "=since", "history", "track record", "sales", "followers", "revenue", "years", "experience", "located", "based in"] },
        { nombre: "Limitaciones y recursos",
          es: ["presupuesto", "plazo", "recursos", "limit", "restric", "requisito", "disponible", "fecha", "antes de", "equipo", "coste", "euros", "gratis", "gratuit"],
          en: ["budget", "deadline", "resources", "limit", "constraint", "restrict", "requirement", "available", "date", "before", "team", "cost", "euro", "free"] }
      ]
    },
    /* ------------------------------------------------------------- O */
    {
      id: "objetivo", letra: "O", color: "#16a34a",
      nombre: { es: "Objetivo", en: "Objective" },
      alias: ["objetivo", "objetivos", "objective", "objectives", "tarea", "task", "meta", "goal", "proposito"],
      palabrasObjetivo: 40,
      precision: { cifras: 1, nombresPropios: 0 },
      definicion: {
        es: "La tarea concreta que quieres que realice la IA, expresada con claridad y de la forma más específica posible: qué debe hacer (generar, reescribir, resumir, extraer, clasificar, explicar, responder una pregunta...), qué resultado esperas, con qué finalidad y cómo sabrás que ha funcionado.",
        en: "The specific task you want the AI to perform, stated clearly and as specifically as possible: what it must do (generate, rewrite, summarise, extract, classify, explain, answer a question...), what result you expect, for what purpose and how you will know it worked."
      },
      recordatorio: {
        es: [
          "Un verbo de acción claro que indique la tarea (crear, diseñar, reescribir, resumir, explicar...).",
          "El entregable concreto que esperas (landing page, home, formulario, texto...).",
          "La finalidad: para qué sirve (captar, vender, informar, reservar...).",
          "Un criterio de éxito o algo medible (cifras, conversión, plazo).",
          "Qué es lo prioritario si hay varias metas.",
          "Evita objetivos ambiguos de dos o tres palabras: la IA tendría que adivinar."
        ],
        en: [
          "A clear action verb stating the task (create, design, rewrite, summarise, explain...).",
          "The specific deliverable you expect (landing page, home page, form, text...).",
          "The purpose: what it is for (attract, sell, inform, book...).",
          "A success criterion or something measurable (figures, conversion, deadline).",
          "What the priority is if there are several goals.",
          "Avoid ambiguous two- or three-word objectives: the AI would have to guess."
        ]
      },
      criterios: [
        { nombre: "Tarea explícita (verbo)",
          es: ["crea", "crear", "disen", "genera", "desarroll", "redact", "elabor", "prototip", "constru", "propon", "maquet", "escrib", "produc", "optimiz", "mejor", "plante", "defin", "=haz", "realiza", "necesito que", "quiero que", "reescrib", "resum", "extra", "clasific", "agrup", "explica", "responde", "analiza", "compara", "traduc"],
          en: ["create", "design", "generate", "develop", "draft", "build", "prototype", "propose", "write", "produce", "optimi", "improve", "define", "=make", "i need you", "i want you", "rewrite", "summari", "extract", "classify", "cluster", "group", "explain", "answer", "analy", "compare", "translate"] },
        { nombre: "Entregable concreto",
          es: ["=web", "pagina", "landing", "sitio", "prototipo", "home", "portada", "seccion", "formulario", "banner", "=post", "campana", "anuncio", "newsletter", "interfaz", "wireframe", "maqueta", "pantalla", "tienda online", "ecommerce", "e-commerce", "blog", "microsite"],
          en: ["website", "=web", "page", "landing", "site", "prototype", "homepage", "home page", "section", "form", "banner", "=post", "campaign", "=ad", "advert", "newsletter", "interface", "wireframe", "mockup", "screen", "online store", "ecommerce", "e-commerce", "blog", "microsite"] },
        { nombre: "Finalidad",
          es: ["=para", "con el fin", "con el objetivo", "de modo que", "de forma que", "que permita", "consegu", "logr", "aument", "capt", "fideliz", "vend", "inform", "convert", "reserv", "registr", "dar a conocer", "atraer", "generar leads", "suscrip", "visibilidad", "notoriedad"],
          en: ["in order to", "so that", "so they", "with the aim", "aim", "purpose", "achieve", "increase", "attract", "retain", "loyalty", "sell", "inform", "convert", "book", "register", "sign up", "awareness", "generate leads", "subscri", "visibility"] },
        { nombre: "Criterio medible", cuentaCifras: true,
          es: ["kpi", "conversion", "metrica", "medir", "resultado", "exito", "increment", "reduc", "porcentaje", "tasa", "al mes", "semanal", "en un plazo", "clics", "visitas"],
          en: ["kpi", "conversion", "metric", "measur", "result", "success", "increase", "reduce", "percent", "rate", "per month", "weekly", "within", "clicks", "visits"] },
        { nombre: "Prioridad o foco",
          es: ["principal", "prioridad", "prioritari", "fundamental", "sobre todo", "clave", "especialmente", "imprescindible", "lo mas importante", "foco", "centrad"],
          en: ["main", "priority", "key", "essential", "above all", "especially", "most important", "focus", "crucial"] }
      ]
    },
    /* ------------------------------------------------------------- S */
    {
      id: "estilo", letra: "S", color: "#9333ea",
      nombre: { es: "Estilo", en: "Style" },
      alias: ["estilo", "style", "estetica", "estilo visual", "visual style", "rol", "role"],
      palabrasObjetivo: 35,
      precision: { cifras: 0, nombresPropios: 1 },
      definicion: {
        es: "El estilo con el que la IA debe elaborar la respuesta. Lo más eficaz es pedirle que adopte un rol o persona (un experto de una profesión, como un consultor de marketing o un diseñador UX) o que imite el estilo de alguien conocido. Se completa con el estilo de redacción y/o visual, los referentes y lo que se quiere evitar. Sin estilo, la respuesta será genérica.",
        en: "The style in which the AI should craft the response. The most effective way is to ask it to adopt a role or persona (an expert in a profession, such as a marketing consultant or a UX designer) or to mimic the style of a well-known person. Complete it with the writing and/or visual style, references and what to avoid. Without a style, the response will be generic."
      },
      recordatorio: {
        es: [
          "Un rol o persona experta que la IA debe adoptar («actúa como un consultor de marketing», «eres un diseñador UX senior»...).",
          "O el estilo de alguien conocido a imitar (una marca, un autor, un diseñador).",
          "El estilo de redacción o la estética visual (minimalista, editorial, retro...).",
          "Elementos visuales: paleta de colores, tipografías, tipo de imágenes.",
          "Rasgos de la escritura: frases cortas, storytelling, vocabulario...",
          "Lo que NO quieres (qué evitar)."
        ],
        en: [
          "A role or expert persona for the AI to adopt (“act as a marketing consultant”, “you are a senior UX designer”...).",
          "Or the style of a well-known person or brand to mimic (a brand, an author, a designer).",
          "The writing style or visual aesthetic (minimalist, editorial, retro...).",
          "Visual elements: colour palette, fonts, type of images.",
          "Writing features: short sentences, storytelling, vocabulary...",
          "What you DON'T want (what to avoid)."
        ]
      },
      criterios: [
        { nombre: "Rol o persona experta",
          es: ["actua como", "actuando como", "=eres", "=seras", "como si fueras", "ponte en el papel", "en el papel de", "asume el rol", "adopta el rol", "rol de", "papel de", "experto", "experta", "especialista", "consultor", "disenador", "disenadora", "copywriter", "redactor", "director de arte", "directora de arte", "community manager", "profesional del", "profesional de", "coach", "senior", "estratega", "publicista", "al estilo de"],
          en: ["act as", "acting as", "=you are", "=you're", "pretend to be", "take the role", "adopt the role", "role of", "as an expert", "expert", "specialist", "consultant", "designer", "copywriter", "writer", "art director", "creative director", "community manager", "coach", "senior", "strategist", "in the style of"] },
        { nombre: "Estilo o estética",
          es: ["estilo", "estetica", "=look", "visual", "minimal", "modern", "elegant", "editorial", "clasic", "retro", "vintage", "futurist", "=flat", "brutal", "corporativ", "artesanal", "organic", "limpi", "sobrio", "colorid", "premium", "lujo", "rustic", "industrial", "nordic", "mediterrane"],
          en: ["style", "aesthetic", "=look", "visual", "minimal", "modern", "elegant", "editorial", "classic", "retro", "vintage", "futurist", "=flat", "brutalist", "corporate", "handmade", "artisan", "organic", "clean", "sober", "colourful", "colorful", "premium", "luxury", "rustic", "industrial", "nordic", "mediterranean"] },
        { nombre: "Referentes", cuentaNombresPropios: true,
          es: ["como la de", "como el de", "como las de", "como los de", "similar", "inspirad", "referente", "parecid", "a lo ", "por ejemplo", "como hace"],
          en: ["like the one", "similar to", "inspired by", "reference", "such as", "for example", "e.g.", "the way"] },
        { nombre: "Elementos visuales",
          es: ["color", "paleta", "tipograf", "fuente", "imagen", "imagenes", "fotograf", "ilustracion", "icono", "espacio en blanco", "blanco", "negro", "azul", "verde", "rojo", "amarillo", "naranja", "rosa", "morado", "gris", "beige", "dorado", "pastel", "serif", "sans", "#"],
          en: ["colour", "color", "palette", "font", "typeface", "typography", "image", "photo", "illustration", "icon", "white space", "whitespace", "white", "black", "blue", "green", "=red", "yellow", "orange", "pink", "purple", "grey", "gray", "gold", "pastel", "serif", "sans"] },
        { nombre: "Rasgos de escritura",
          es: ["frases", "parrafo", "titular", "storytelling", "lenguaje", "vocabulario", "tecnicismo", "metafora", "ritmo", "sencill", "conciso", "direct", "redaccion", "texto", "copy", "palabras", "claro", "clara"],
          en: ["sentence", "paragraph", "headline", "storytelling", "language", "vocabulary", "jargon", "metaphor", "rhythm", "simple", "concise", "direct", "writing", "text", "copy", "words", "clear"] },
        { nombre: "Qué evitar",
          es: ["evita", "no usar", "no uses", "=sin", "nada de", "no quiero", "no debe", "huir de", "=ni", "prohibid"],
          en: ["avoid", "do not use", "don't use", "=without", "=no", "i don't want", "must not", "never", "steer clear"] }
      ]
    },
    /* ------------------------------------------------------------- T */
    {
      id: "tono", letra: "T", color: "#ea580c",
      nombre: { es: "Tono", en: "Tone" },
      alias: ["tono", "tone", "actitud", "attitude", "tono de voz", "tone of voice"],
      palabrasObjetivo: 20,
      precision: { cifras: 0, nombresPropios: 0 },
      definicion: {
        es: "La actitud con la que debe «sonar» la respuesta: formal, informal/cercano, humorístico, empático, autoritario, inspirador... Elegir el tono adecuado hace que el mensaje conecte mejor con la audiencia. Conviene indicar también la emoción que debe provocar, el tratamiento y los matices o límites de ese tono.",
        en: "The attitude the response should “sound” like: formal, casual, humorous, empathetic, authoritative, inspirational... Choosing the right tone makes the message resonate better with the audience. It also helps to state the emotion it should evoke, the form of address and the nuances or limits of that tone."
      },
      recordatorio: {
        es: [
          "Dos o tres adjetivos que definan el tono (formal, cercano, humorístico, empático, autoritario, inspirador...).",
          "La emoción que debe provocar en el lector (confianza, ilusión, urgencia...).",
          "El tratamiento: tú, usted, vosotros, primera persona del plural...",
          "Los matices o límites: «cercano pero sin ser informal», «sin exagerar»...",
          "Que el tono sea coherente con la audiencia a la que te diriges."
        ],
        en: [
          "Two or three adjectives that define the tone (formal, casual, humorous, empathetic, authoritative, inspirational...).",
          "The emotion it should evoke in the reader (trust, excitement, urgency...).",
          "The form of address: you, we, first or second person...",
          "Nuances or limits: “friendly but not too informal”, “without exaggerating”...",
          "Make sure the tone fits the audience you are addressing."
        ]
      },
      criterios: [
        { nombre: "Adjetivos de tono", multiple: true,
          es: ["cercan", "formal", "informal", "casual", "amable", "profesional", "divertid", "humor", "serio", "seria", "inspirador", "motivador", "emocional", "empatic", "optimista", "entusiasta", "calid", "autoritari", "tranquil", "sofisticad", "desenfadad", "juvenil", "fresco", "fresca", "persuasiv", "confiable", "cordial", "ironic", "positiv", "respetuos", "apasionad", "sincer", "transparente", "exclusiv", "familiar", "energic", "seren", "dinamic", "accesible", "elegante", "irreverente", "atrevid", "honest", "natural", "directo", "directa", "didactic", "educativ", "tecnico", "experto", "experta", "ingenios"],
          en: ["friendly", "formal", "informal", "casual", "kind", "professional", "fun", "humor", "humour", "witty", "serious", "inspir", "motivat", "emotional", "empath", "optimis", "enthusias", "warm", "authoritative", "calm", "sophisticat", "playful", "youthful", "fresh", "persuasive", "trustworth", "cordial", "ironic", "positive", "respectful", "passionate", "sincere", "transparent", "exclusive", "familiar", "energetic", "dynamic", "approachable", "elegant", "irreverent", "bold", "honest", "natural", "=direct", "educational", "technical", "conversational", "compassionate", "confident", "assertive"] },
        { nombre: "Emoción a provocar",
          es: ["sentir", "sienta", "sientan", "emocion", "transmit", "provoc", "confianza", "seguridad", "ilusion", "curiosidad", "urgencia", "tranquilidad", "pertenencia", "orgullo", "alegria", "deseo", "nostalgia", "cercania", "calma", "inspir", "despert", "conect"],
          en: ["feel", "emotion", "convey", "evoke", "trust", "security", "excitement", "curiosity", "urgency", "peace", "belonging", "pride", "joy", "desire", "nostalgia", "closeness", "resonate", "connect"] },
        { nombre: "Tratamiento",
          es: ["tute", "=usted", "=tu", "vosotros", "=trato", "segunda persona", "primera persona", "=nosotros", "hablar de tu", "dirigirse"],
          en: ["address", "=you", "first person", "second person", "=we", "=us", "speak to"] },
        { nombre: "Matices y límites",
          es: ["=pero", "sin ser", "sin caer", "evita", "no demasiado", "equilibrio", "sin resultar", "aunque", "sin perder", "nunca", "sin llegar", "ni demasiado", "manteniendo"],
          en: ["=but", "without being", "avoid", "not too", "balance", "although", "while keeping", "never", "yet", "without sounding", "while remaining"] }
      ]
    },
    /* ------------------------------------------------------------- A */
    {
      id: "audiencia", letra: "A", color: "#db2777",
      nombre: { es: "Audiencia", en: "Audience" },
      alias: ["audiencia", "audience", "publico", "publico objetivo", "target", "target audience", "destinatarios", "buyer persona"],
      palabrasObjetivo: 45,
      precision: { cifras: 1, nombresPropios: 1 },
      definicion: {
        es: "A quién va dirigida la respuesta: un público general o un grupo concreto de personas. Especificar la audiencia permite a la IA adaptar su respuesta y elegir palabras, ejemplos y referencias que esas personas entiendan y con las que conecten (no se explica igual a un director general que a un niño de 6 años).",
        en: "Who the response is for: a general audience or a specific group of people. Specifying the audience lets the AI tailor its response and choose words, examples and references that those people will understand and resonate with (you would not explain something the same way to a CEO as to a 6-year-old)."
      },
      recordatorio: {
        es: [
          "Si es un público general o un grupo concreto.",
          "Datos demográficos: edad, género, ocupación, nivel socioeconómico.",
          "Ubicación: dónde viven o desde dónde acceden.",
          "Intereses, valores, necesidades y problemas que tienen.",
          "Su nivel de conocimiento del tema, para que la IA adapte el vocabulario.",
          "Sus hábitos digitales (dispositivos, redes que usan)."
        ],
        en: [
          "Whether it is a general audience or a specific group.",
          "Demographics: age, gender, occupation, socio-economic level.",
          "Location: where they live or access from.",
          "Their interests, values, needs and problems.",
          "Their level of knowledge of the topic, so the AI can adapt its vocabulary.",
          "Their digital habits (devices, social networks they use)."
        ]
      },
      criterios: [
        { nombre: "Demografía", cuentaCifras: true,
          es: ["edad", "anos", "hombres", "mujeres", "genero", "joven", "jovenes", "adulto", "mayores", "estudiantes", "padres", "madres", "familias", "profesionales", "millennial", "gen z", "generacion", "nivel socioeconomico", "ingresos", "poder adquisitivo", "universitari", "trabajador", "jubilad", "autonomos", "empresarios", "ninos", "adolescentes"],
          en: ["=age", "aged", "years old", "=men", "women", "gender", "young", "adult", "elderly", "senior citizens", "students", "parents", "families", "professionals", "millennial", "gen z", "generation", "income", "purchasing power", "workers", "retired", "freelancers", "entrepreneurs", "children", "teenagers"] },
        { nombre: "Ubicación", cuentaNombresPropios: true,
          es: ["viven", "residen", "ciudad", "zona", "urban", "rural", "espana", "pais", "=local", "internacional", "turista", "provincia", "barrio", "region", "europa", "andaluc"],
          en: ["live in", "living in", "based in", "city", "area", "urban", "rural", "spain", "country", "=local", "international", "tourist", "region", "neighbourhood", "neighborhood", "europe"] },
        { nombre: "Intereses y valores",
          es: ["interes", "aficion", "valores", "valoran", "les gusta", "preocup", "estilo de vida", "habitos", "sostenib", "consum", "motivacion", "gustos", "disfrutan", "apasionad", "comprometid", "ocio", "deporte", "musica", "viajar", "moda"],
          en: ["interest", "hobb", "values", "they value", "they like", "care about", "concerned", "lifestyle", "habits", "sustainab", "consum", "motivation", "taste", "enjoy", "passionate", "committed", "leisure", "sport", "music", "travel", "fashion"] },
        { nombre: "Necesidades y problemas",
          es: ["necesitan", "buscan", "problema", "dolor", "frustra", "dificultad", "quieren", "esperan", "demandan", "barrera", "objecion", "les cuesta", "no tienen tiempo", "les falta", "miedo", "dudas"],
          en: ["they need", "looking for", "problem", "pain point", "frustrat", "difficult", "they want", "expect", "demand", "barrier", "objection", "struggle", "no time", "lack", "fear", "doubts"] },
        { nombre: "Nivel de conocimiento y lenguaje",
          es: ["conocimiento", "nivel", "familiarizad", "experiencia", "expert", "principiante", "novat", "no saben", "saben", "entienden", "general", "especializad", "tecnicismo", "lenguaje", "vocabulario", "sin conocimientos", "basico", "avanzad"],
          en: ["knowledge", "level", "familiar", "experience", "expert", "beginner", "novice", "don't know", "they know", "understand", "general audience", "general public", "specialised", "specialized", "jargon", "language", "vocabulary", "basic", "advanced", "layperson", "non-technical"] },
        { nombre: "Hábitos digitales",
          es: ["redes", "instagram", "tiktok", "movil", "smartphone", "online", "digital", "compran", "usan", "navegan", "youtube", "linkedin", "internet", "google"],
          en: ["social media", "instagram", "tiktok", "mobile", "smartphone", "online", "digital", "they buy", "they use", "browse", "youtube", "linkedin", "internet", "google"] }
      ]
    },
    /* ------------------------------------------------------------- R */
    {
      id: "respuesta", letra: "R", color: "#0891b2",
      nombre: { es: "Respuesta", en: "Response" },
      alias: ["respuesta", "response", "formato de respuesta", "response format", "formato", "format", "formato de salida", "output", "output format", "salida", "entregable", "deliverable"],
      palabrasObjetivo: 45,
      precision: { cifras: 2, nombresPropios: 0 },
      definicion: {
        es: "La longitud y el formato en que quieres recibir la respuesta. Antes de enviar el prompt, visualiza el resultado: ¿una respuesta corta o una explicación detallada? ¿Texto corrido, lista numerada, tabla, informe o código? ¿En qué orden y con qué estructura? Puedes incluso mostrar un ejemplo del resultado que esperas.",
        en: "The length and format in which you want to receive the response. Before sending the prompt, visualise the result: a short answer or a detailed explanation? Running text, a numbered list, a table, a report or code? In what order and with what structure? You can even show an example of the output you expect."
      },
      recordatorio: {
        es: [
          "El formato de salida: código HTML/CSS, prototipo, texto, lista numerada, tabla, informe...",
          "La longitud o nivel de detalle: breve o detallada, nº de palabras, secciones o pantallas.",
          "La estructura y el orden: secciones o partes (cabecera, hero, CTA, pie...) y cómo ordenarlas.",
          "Especificaciones técnicas o de diseño: responsive, colores, tipografías, imágenes.",
          "Un ejemplo del resultado que esperas (one-shot / few-shot), si lo tienes.",
          "Cómo presentarla: idioma, si añadir explicaciones o el razonamiento paso a paso."
        ],
        en: [
          "The output format: HTML/CSS code, prototype, text, numbered list, table, report...",
          "The length or level of detail: short or detailed, number of words, sections or screens.",
          "The structure and order: sections or parts (header, hero, CTA, footer...) and how to order them.",
          "Technical or design specifications: responsive, colours, fonts, images.",
          "An example of the output you expect (one-shot / few-shot), if you have one.",
          "How to present it: language, whether to add explanations or step-by-step reasoning."
        ]
      },
      criterios: [
        { nombre: "Formato de salida",
          es: ["html", "css", "codigo", "=web", "landing", "pagina", "prototipo", "wireframe", "figma", "lista", "numerad", "vinetas", "tabla", "tabular", "informe", "documento", "json", "markdown", "texto", "componente", "archivo", "mockup", "react", "tailwind", "esquema"],
          en: ["html", "css", "code", "=web", "landing", "page", "prototype", "wireframe", "figma", "list", "numbered", "bullet", "table", "tabular", "report", "document", "json", "markdown", "text", "component", "file", "mockup", "react", "tailwind", "outline"] },
        { nombre: "Longitud y nivel de detalle", cuentaCifras: true,
          es: ["palabras", "caracteres", "maximo", "minimo", "breve", "corta", "detallad", "resumid", "extens", "longitud", "pantallas", "como mucho", "no mas de", "al menos", "entre", "lineas", "frases"],
          en: ["words", "characters", "maximum", "minimum", "=max", "=min", "brief", "short", "detailed", "concise", "length", "long", "screens", "at most", "no more than", "at least", "between", "lines", "sentences"] },
        { nombre: "Estructura y orden",
          es: ["seccion", "secciones", "cabecera", "header", "hero", "menu", "navegacion", "footer", "pie", "apartado", "bloque", "galeria", "formulario", "contacto", "testimonio", "faq", "preguntas frecuentes", "boton", "=cta", "llamada a la accion", "sobre nosotros", "precios", "mapa", "en orden", "en este orden", "ordenad", "ordena", "ranking", "primero", "despues", "cronologic"],
          en: ["section", "header", "hero", "menu", "navigation", "footer", "block", "gallery", "form", "contact", "testimonial", "faq", "button", "=cta", "call to action", "about us", "pricing", "=map", "in order", "in this order", "ordered", "sort", "rank", "first", "then", "chronolog"] },
        { nombre: "Especificaciones técnicas",
          es: ["responsive", "movil", "adaptable", "adapte", "accesib", "colores", "hex", "tipograf", "fuente", "imagenes", "iconos", "animacion", "desktop", "escritorio", "tablet", "#", "google fonts", "placeholder", "contraste"],
          en: ["responsive", "mobile", "adaptive", "accessib", "colours", "colors", "hex", "font", "images", "icons", "animation", "desktop", "tablet", "google fonts", "placeholder", "contrast"] },
        { nombre: "Ejemplo de salida",
          es: ["ejemplo de salida", "ejemplo de respuesta", "por ejemplo", "como este", "como esta", "con este formato", "siguiendo este", "siguiendo el ejemplo", "asi:", "plantilla", "modelo"],
          en: ["example output", "sample output", "for example", "like this", "like the following", "in this format", "following this", "as follows", "template", "e.g."] },
        { nombre: "Instrucciones de presentación",
          es: ["incluy", "incluir", "=debe", "deberia", "entrega", "idioma", "espanol", "ingles", "explica", "comentari", "sin explicaciones", "un solo archivo", "listo para", "devuelve", "muestra", "presenta", "paso a paso", "razonamiento", "emoji"],
          en: ["include", "must", "should", "deliver", "language", "english", "spanish", "explain", "comment", "no explanations", "single file", "ready to", "return", "show", "present", "step by step", "reasoning", "chain of thought", "emoji"] }
      ]
    }
  ]
};
