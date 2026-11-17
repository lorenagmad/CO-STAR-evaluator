# Evaluador de prompts CO-STAR · CO-STAR Prompt Evaluator

[Español](#español) · [English](#english)

> *Remember that the AI is merely your co-star, and you are still the star of the show!*
> — Prompt Engineering Playbook (Beta v3), GovTech

---

## Español

Herramienta docente de la asignatura **Publicación en Internet** (grados de Publicidad y Marketing, Universidad de Cádiz) para aprender a escribir prompts completos con la estructura **CO-STAR**: **C**ontexto, **O**bjetivo, e**S**tilo, **T**ono, **A**udiencia y **R**espuesta.

### Qué hace

1. El alumno se identifica con su nombre, apellidos y DNI/NIE (o pasaporte).
2. Pega su prompt siguiendo la estructura CO-STAR, o parte de la plantilla con el botón «Insertar plantilla».
3. La web asigna a cada variable un porcentaje de completitud de 0 a 100 %. Si una variable queda por debajo del 60 %, se le recuerda qué debe incluir en general.
4. Puede corregir el prompt y volver a evaluarlo tantas veces como quiera. Todos los intentos quedan en un historial.
5. En cualquier momento puede descargar un **informe PDF** con su identificación, el historial de prompts y sus calificaciones.
6. El botón **«Empezar de cero»** borra los datos y el historial de ese navegador para comenzar una sesión nueva.

La interfaz está disponible en **español e inglés** (botón ES | EN). La evaluación reconoce los títulos y las palabras clave de los dos idiomas a la vez, así que se puede escribir el prompt en cualquiera de ellos.

### Privacidad

Todo se ejecuta en el navegador del alumno. No hay servidor, no se necesita clave de API y no se envía ningún dato a ningún sitio. El historial se guarda solo en ese navegador (localStorage) hasta que se pulsa «Empezar de cero».

### Estructura del proyecto

| Archivo | Contenido |
|---|---|
| `index.html` | Página, diseño e interfaz. |
| `js/config.js` | **Parámetros que puede ajustar el profesorado**: umbral del recordatorio, pesos, definiciones, recordatorios, consejos, cita, plantillas, títulos admitidos y palabras clave (español e inglés) de cada variable. |
| `js/i18n.js` | Textos de la interfaz y del PDF en español e inglés. |
| `js/evaluador.js` | Motor de evaluación por reglas. No hace falta modificarlo. |
| `js/app.js` | Identificación, historial, cambio de idioma y generación del PDF. |
| `lib/` | Librerías jsPDF y jsPDF-AutoTable, incluidas en el repositorio para no depender de servicios externos. |

### Cómo se evalúa

Cada variable se puntúa por separado combinando tres componentes:

- **Extensión (25 %)**: número de palabras respecto a un objetivo orientativo (Contexto 80, Objetivo 40, Estilo 35, Tono 20, Audiencia 45, Respuesta 45).
- **Cobertura de la definición (50 %)**: entre 4 y 6 criterios por variable, tomados de su definición en el Playbook. Por ejemplo, en Audiencia: demografía, ubicación, intereses, necesidades, nivel de conocimiento y hábitos digitales.
- **Detalle y precisión (25 %)**: cifras y nombres propios (cuando procede), variedad de vocabulario, densidad de detalles y penalización por expresiones vagas («bonito», «cosas», «etc.»...).

Además:

- Si una variable tiene menos de 4 palabras, su nota no puede pasar del 20 %.
- El texto de la plantilla que siga entre corchetes `[ ]` no se tiene en cuenta.
- Si el Objetivo aparece antes que el Contexto, se muestra el consejo del Playbook de cambiar el orden (no resta puntos).

Todos estos valores se pueden cambiar en `js/config.js`.

**Marco de referencia.** Las definiciones, los recordatorios y los criterios siguen el apartado «The CO-STAR approach to writing your prompts» del *Prompt Engineering Playbook* (Beta v3, GovTech Data Science & AI Division), adaptados al encargo de la asignatura (prototipar webs).

### Títulos de sección reconocidos

Cada variable debe empezar con su título en una línea propia. Se aceptan, entre otras, estas formas: `# CONTEXTO`, `Contexto:`, `**Contexto:**`, `1. Contexto`, `(C) Contexto` y `C - Contexto:`. También se aceptan los títulos en inglés (`Context`, `Objective`, `Style`, `Tone`, `Audience`, `Response`) y sinónimos como `Público objetivo`, `Target` o `Formato`.

### Limitaciones

- La evaluación es **automática y orientativa**: se basa en palabras clave y no «entiende» el texto. Un alumno podría subir la nota añadiendo palabras clave sin sentido, por lo que conviene que el profesorado revise los prompts del informe.
- El historial solo existe en el navegador donde se ha trabajado. Si se cambia de equipo o se borran los datos del navegador, se pierde, así que hay que descargar el informe antes.
- El PDF lo genera el propio alumno y técnicamente podría editarse. Si se necesita garantía, pedid también el prompt final en la entrega.

---

## English

A teaching tool for the **Internet Publishing** course (Advertising and Marketing degrees, University of Cádiz) that helps students learn to write complete prompts using the **CO-STAR** structure: **C**ontext, **O**bjective, **S**tyle, **T**one, **A**udience and **R**esponse.

### What it does

1. Students identify themselves with their name, surname(s) and Spanish DNI/NIE (or passport number).
2. They paste their prompt following the CO-STAR structure, or start from the template with the "Insert template" button.
3. The site gives each variable a completeness score from 0 to 100%. If a variable scores below 60%, it shows a general reminder of what that variable should include.
4. Students can revise the prompt and evaluate it again as many times as they like. Every attempt is kept in a history table.
5. At any time they can download a **PDF report** with their identification, their prompt history and the scores.
6. The **"Start over"** button deletes the details and history from that browser and starts a new session.

The interface is available in **Spanish and English** (ES | EN button). The evaluation recognises headings and keywords in both languages at once, so the prompt can be written in either language.

### Privacy

Everything runs in the student's browser. There is no server, no API key is needed and no data is sent anywhere. The history is stored only in that browser (localStorage) until "Start over" is clicked.

### Project structure

| File | Content |
|---|---|
| `index.html` | Page, layout and interface. |
| `js/config.js` | **Settings lecturers can adjust**: reminder threshold, weights, definitions, reminders, tips, quote, templates, accepted headings and keywords (Spanish and English) for each variable. |
| `js/i18n.js` | Interface and PDF texts in Spanish and English. |
| `js/evaluador.js` | Rule-based evaluation engine. No changes needed. |
| `js/app.js` | Identification, history, language switching and PDF generation. |
| `lib/` | jsPDF and jsPDF-AutoTable libraries, bundled so the site does not depend on external services. |

### How prompts are scored

Each variable is scored separately by combining three components:

- **Length (25%)**: number of words compared with an indicative target (Context 80, Objective 40, Style 35, Tone 20, Audience 45, Response 45).
- **Coverage of the definition (50%)**: 4 to 6 criteria per variable, taken from its definition in the Playbook. For example, for Audience: demographics, location, interests, needs, level of knowledge and digital habits.
- **Detail and precision (25%)**: figures and proper nouns (where relevant), vocabulary variety, density of detail, and a penalty for vague words ("nice", "stuff", "etc."...).

In addition:

- If a variable has fewer than 4 words, its score is capped at 20%.
- Template text left inside square brackets `[ ]` is ignored.
- If the Objective comes before the Context, the Playbook's tip to swap the order is shown (no points are deducted).

All these values can be changed in `js/config.js`.

**Reference framework.** The definitions, reminders and criteria follow the section "The CO-STAR approach to writing your prompts" of the *Prompt Engineering Playbook* (Beta v3, GovTech Data Science & AI Division), adapted to the course assignment (website prototyping).

### Recognised section headings

Each variable must start with its heading on its own line. Accepted forms include `# CONTEXT`, `Context:`, `**Context:**`, `1. Context`, `(C) Context` and `C - Context:`. Spanish headings (`Contexto`, `Objetivo`, `Estilo`, `Tono`, `Audiencia`, `Respuesta`) and synonyms such as `Target audience`, `Task` or `Output format` are also accepted.

### Limitations

- The evaluation is **automatic and indicative**: it is keyword-based and does not "understand" the text. A student could raise the score by adding meaningless keywords, so lecturers should review the prompts in the report.
- The history exists only in the browser where the student worked. Changing computers or clearing browser data loses it, so the report should be downloaded first.
- The PDF is generated by the student and could technically be edited. If you need a guarantee, also ask for the final prompt in the submission.
