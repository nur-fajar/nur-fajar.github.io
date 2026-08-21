/**
 * "Inside One Program", satu program dibaca lewat lima fase ADDIE.
 *
 * File ini dipisah dari ledger.ts karena panjangnya, bukan karena aturannya
 * berbeda: ledger.ts me-`export *` isi file ini kembali, jadi seluruh scan
 * mekanis di ledger.test.ts (em dash, ejaan US, kata sifat tanpa bukti,
 * jembatan sebab-akibat) tetap berjalan di atas setiap kalimat di bawah ini.
 * Konten yang tidak ikut discan adalah konten yang cepat atau lambat melanggar.
 *
 * SUMBERNYA delapan dokumen retrospektif dari program Train the Trainers:
 * GenAI Product Manager (Learning Needs Assessment, Learning Objectives,
 * Curriculum Map, Training Calendar, Storyboard, Facilitator Guide, Assessment
 * Strategy & Rubric, Impact & Evaluation Summary). Yang ada di sini adalah
 * highlight reel, bukan reproduksi: tiap fakta muncul tepat sekali, dan
 * dokumen yang memuat fakta yang sama tidak mengulanginya di fase lain.
 * Training Calendar, misalnya, hanya menyumbang tanggal di stepper Design.
 *
 * ATURAN PENYAMARAN, berlaku di kelima fase tanpa kecuali:
 *
 *   - Nama peserta dihapus, bukan diganti inisial. Kutipan dirujuk sebagai
 *     "Participant A" dan "Participant B", yang cukup untuk membedakan dua
 *     suara tanpa menunjuk siapa pun.
 *   - Link chatbot individual dihapus. URL-nya memuat username asli peserta.
 *   - Nama institusi peserta dan nama pimpinan program tidak ditampilkan.
 *
 * JUMLAH PESERTA TIDAK DISEBUT DI MANA PUN, dan itu berlaku ke seluruh situs,
 * bukan cuma ke file ini: berapa dosen yang ikut, berapa yang mengembalikan
 * form evaluasi, dan berapa chatbot yang terbit semuanya dihapus. Rating
 * kualitatif tetap ada, jumlah kepala tidak.
 *
 * BATAS DATA TIDAK LAGI DITULIS, dan itu keputusan Fajar yang perlu dicatat
 * di sini karena ia berlawanan dengan prinsip P2 situs. Rating 4.5/5 dan 4.0/5
 * sekarang berdiri tanpa baris metode: kalimat "from the participants who
 * returned the evaluation form" dihapus, begitu juga catatan penutup yang
 * menyatakan tidak semua peserta mengembalikan form.
 *
 * Yang masih menanggung sebagian tugas itu cuma badge "Retrospective
 * documentation" di kepala tiap tab, dan ia menerangkan sifat dokumennya,
 * bukan cakupan angkanya. Larangan menulis "seluruh peserta" atas data
 * parsial tetap berlaku dan tetap dijaga tes, jadi angkanya tidak boleh
 * MENGKLAIM cakupan penuh; ia hanya tidak lagi menyangkalnya.
 */

/** Warna tag aktivitas di storyboard, dipetakan ke sapuan gradient situs. */
export type ActivityTag = 'Concept' | 'Demo' | 'Practice' | 'Discussion';

export type AddieBlock =
  /** Paragraf biasa. Dipakai untuk kalimat pembuka sub-blok. */
  | { kind: 'prose'; body: string }
  /** Kotak bergaris kiri: catatan metodologi, catatan pacing, batas klaim. */
  | { kind: 'note'; title: string; body: string }
  /** Tabel current state vs desired state. */
  | {
      kind: 'gapTable';
      rows: { dimension: string; current: string; desired: string }[];
      footnote: string;
    }
  /** Kartu constraint C1 sampai C3. */
  | { kind: 'constraints'; items: { code: string; title: string; body: string }[] }
  /** Satu baris temuan yang berubah jadi satu keputusan desain. */
  | { kind: 'decision'; finding: string; decision: string }
  /** Piramida Bloom, enam level, dirender dari puncak ke dasar. */
  | { kind: 'bloom'; levels: { level: string; day: string }[] }
  /** Contoh objective berikut cara mengukurnya. */
  | { kind: 'objectives'; items: { level: string; objective: string; evidence: string }[] }
  /** Stepper hari, dengan tanggal dari Training Calendar. */
  | { kind: 'stepper'; steps: { day: string; date: string; title: string; body: string }[] }
  /** Kartu tautan ke halaman yang masih hidup dan bisa dibuka pembaca. */
  | { kind: 'linkCard'; title: string; domain: string; href: string; body: string; cta: string }
  /** Frame storyboard: menit, judul, tag aktivitas, tujuan pedagogisnya. */
  | { kind: 'frames'; items: { time: string; title: string; tag: ActivityTag; goal: string }[] }
  /** Pertanyaan peserta non-teknis, berikut jawaban yang disiapkan. */
  | { kind: 'qa'; question: string; answer: string }
  /** Daftar bertanda, dipakai untuk kriteria lulus. */
  | { kind: 'checklist'; title: string; items: string[] }
  /** Rubrik mini: kriteria kali nama level, tanpa deskripsi tiap sel. */
  | { kind: 'rubric'; criteria: string[]; levels: string[]; footnote: string }
  /** Bar skor kepuasan. `of` selalu ditulis, tidak pernah tersirat.
   *  `method` opsional: baris keterangan di bawah bar dihapus atas permintaan
   *  Fajar, dan bidangnya dibiarkan ada supaya ia bisa dipasang kembali tanpa
   *  mengubah bentuk data. */
  | { kind: 'scores'; items: { label: string; value: number }[]; of: number; method?: string }
  /** Kutipan peserta, sudah dianonimkan di sumbernya. */
  | { kind: 'quotes'; items: { text: string; by: string }[] }
  /** Pemisah tipis berlabel di dalam satu tab, bukan tab terpisah. */
  | { kind: 'divider'; label: string };

export interface AddiePhase {
  id: string;
  /** Nomor urut fase, 01 sampai 05, ditampilkan di tombol tab. */
  index: string;
  letter: string;
  phase: string;
  /** Kalimat pembuka isi panel. Tab sudah membawa nama fasenya, jadi baris
   *  ini yang mengatakan apa isi fase itu sebenarnya. */
  headline: string;
  /** Pertanyaan yang dijawab fase ini, dari sudut pandang pembaca yang menilai. */
  question: string;
  /** Dokumen sumber yang berdiri di belakang fase ini, ditampilkan sebagai
   *  chip di kepala panel.
   *
   *  Ia ada karena satu pertanyaan yang selalu muncul di portofolio proses:
   *  "ini kamu ringkas dari mana?". Menyebut nama dokumennya mengubah panel
   *  dari klaim jadi kutipan, dan itu pekerjaan yang tidak bisa dilakukan
   *  oleh badge "Retrospective documentation" sendirian, karena badge itu
   *  menerangkan SIFAT dokumennya, bukan dokumen yang mana. */
  sources: string[];
  blocks: AddieBlock[];
}

/** Judul, kalimat pembukanya, dan badge di kepala panel.
 *
 *  Body copy-nya dikunci kata per kata oleh tes, jadi ia tidak bisa bergeser
 *  diam-diam lewat satu edit yang niatnya cuma merapikan. Bunyinya berasal
 *  dari spec, dengan satu perubahan yang datang belakangan: jumlah dosen
 *  dihapus dari kalimat pembuka. */
export const ADDIE_SECTION = {
  eyebrow: 'Behind the work',
  title: 'How one program actually got made.',
  lede:
    'Train the Trainers: GenAI Product Manager. University lecturers, four live sessions, ' +
    'and a five week independent build. Below is the working method behind it, from the needs ' +
    'assessment that started it to the evaluation data that closed it.',
  badge: 'Retrospective documentation',
  /** Nama tablist untuk pembaca layar. Tanpa ini, screen reader mengumumkan
   *  lima tab tanpa mengatakan lima tab dari apa. */
  tablistLabel: 'The five ADDIE phases of this program',
} as const;

export const ADDIE_PHASES: AddiePhase[] = [
  /* ── 01 ANALYSIS ──────────────────────────────────────────────────────── */
  {
    id: 'analysis',
    index: '01',
    letter: 'A',
    phase: 'Analysis',
    headline:
      'University lecturers, mixed technical and non-technical, and one gap worth closing.',
    question: 'Can this person diagnose a need before designing a solution?',
    sources: ['Learning Needs Assessment'],
    blocks: [
      {
        kind: 'prose',
        body:
          'The trigger was a gap between what campuses teach about AI and how AI products are ' +
          'actually built. Lecturers are strong on theory and rarely reach implementation, so the ' +
          'program aimed at the multiplier: teach the lecturers, and the material reaches their ' +
          'students next.',
      },
      {
        kind: 'gapTable',
        rows: [
          {
            dimension: 'Technical ability',
            current: 'Cannot yet build a working AI product. Some are not programmers.',
            desired: 'Ship a working GenAI chatbot on a platform that does not require code.',
          },
          {
            dimension: 'Output',
            current: 'Conceptual knowledge. No product artifact to point at.',
            desired: 'A live chatbot, plus a certification that names the competency.',
          },
          {
            dimension: 'Reach',
            current: 'Knowledge stops at the individual.',
            desired: 'Able to teach it forward, to students or into an existing course.',
          },
        ],
        footnote:
          'The core gap was concept to practice. These participants did not need more theory. ' +
          'They needed the shortest honest path from understanding AI to building with it.',
      },
      {
        kind: 'constraints',
        items: [
          {
            code: 'C1',
            title: 'Time is fixed and small',
            body:
              'Lecturers cannot take an intensive multi day bootcamp. The program had to fit ' +
              'morning slots of two hours.',
          },
          {
            code: 'C2',
            title: 'Hands on is mandatory',
            body:
              'Listening does not count. A working product was set as the condition for passing, ' +
              'not as a stretch goal.',
          },
          {
            code: 'C3',
            title: 'Concept and practice in balance',
            body:
              'Not theory alone, not blind practice. They needed enough conceptual grip to teach ' +
              'the material to someone else afterward.',
          },
        ],
      },
      {
        kind: 'decision',
        finding:
          'A concept to practice gap, across an audience that mixes technical and non-technical backgrounds.',
        decision:
          'Build on a platform that does not require programming, so the non-technical half of the ' +
          'room could still ship something that runs. A shallow learning curve was the only way a ' +
          'two hour session could end with a working artifact.',
      },
      {
        kind: 'note',
        title: 'How this analysis was done',
        body:
          'Through a strategy discussion with the program team, not through formal research with a ' +
          'survey instrument or documented interviews. Audience, goals, approach and constraints ' +
          'were synthesized from that discussion. Saying so is part of the record: an assessment ' +
          'that overstates its own method is the first thing a reviewer catches.',
      },
    ],
  },

  /* ── 02 DESIGN ────────────────────────────────────────────────────────── */
  {
    id: 'design',
    index: '02',
    letter: 'D',
    phase: 'Design',
    headline:
      'Objectives laid on Bloom, then a four day sequence where each day owes the next one something.',
    question: 'Can this person write measurable objectives and sequence a program that builds?',
    sources: ['Learning Objectives (Bloom’s Taxonomy)', 'Curriculum Map', 'Training Calendar'],
    blocks: [
      {
        kind: 'prose',
        body:
          'Objectives were written against Bloom’s taxonomy and mapped onto the four sessions, ' +
          'so each level lands on the day that can carry it. Every objective was paired with the ' +
          'evidence that would prove it, before the program ran.',
      },
      {
        kind: 'bloom',
        levels: [
          { level: 'Create', day: 'Day 4' },
          { level: 'Evaluate', day: 'Day 4' },
          { level: 'Analyze', day: 'Day 3' },
          { level: 'Apply', day: 'Day 2' },
          { level: 'Understand', day: 'Day 1' },
          { level: 'Remember', day: 'Day 1' },
        ],
      },
      {
        kind: 'objectives',
        items: [
          {
            level: 'Apply',
            objective:
              'Implement prompt engineering and GPT API integration to configure chatbot behavior, ' +
              'including a spreadsheet as the content database and keyword matching for FAQs.',
            evidence:
              'The submitted chatbot runs live: it answers FAQs by keyword match, reads from the ' +
              'connected sheet, and falls back to GPT under the configured system prompt.',
          },
          {
            level: 'Create',
            objective:
              'Build a functional GenAI Product Manager chatbot with its own persona, FAQ matching, ' +
              'data integration and a defined GPT fallback, ready to be adopted as a real product.',
            evidence:
              'A published chatbot with a distinct identity, at least five keyword matched FAQs, a ' +
              'live data connection, and a working demo given in front of the group.',
          },
        ],
      },
      {
        kind: 'stepper',
        steps: [
          {
            day: 'Day 1',
            date: '11 May 2026',
            title: 'Mindset & Identity',
            body: 'Product manager thinking for GenAI, user context, and the chatbot’s identity.',
          },
          {
            day: 'Day 2',
            date: '13 May 2026',
            title: 'AI Integration & Behavior',
            body: 'System prompts, prompt engineering, and deciding where rules beat an LLM.',
          },
          {
            day: 'Day 3',
            date: '18 May 2026',
            title: 'Data & Tracking',
            body: 'A spreadsheet as knowledge base, and tracking markers that make usage readable.',
          },
          {
            day: 'Day 4',
            date: '20 May 2026',
            title: 'Peer Review & Showcase',
            body: 'Live demos, structured peer review, and the final submission form.',
          },
          {
            day: 'Build',
            date: '21 May to 30 June 2026',
            title: 'Independent build',
            body: 'Five weeks to iterate on peer feedback, with weekly consultation available.',
          },
        ],
      },
      {
        kind: 'note',
        title: 'Why the sequence is the dependency map',
        body:
          'Each day hands the next one its input. Product identity from Day 1 becomes the system ' +
          'prompt on Day 2; a working GPT on Day 2 becomes something worth connecting to data on ' +
          'Day 3; the data and tracking from Day 3 become the thing worth showing on Day 4. Read in ' +
          'order, the steps above are the dependency map.',
      },
    ],
  },

  /* ── 03 DEVELOPMENT ───────────────────────────────────────────────────── */
  {
    id: 'development',
    index: '03',
    letter: 'D',
    phase: 'Development',
    headline: 'The materials are public, so this phase can be checked instead of described.',
    question: 'Did the design turn into real material, or did it stop at a plan?',
    sources: ['Published course page and course notes'],
    blocks: [
      {
        kind: 'prose',
        body:
          'The modules, course notes and lab guides built for this program are live on the platform ' +
          'that hosts it. Nothing below has to be taken on trust: the page opens, and what was built ' +
          'is on it.',
      },
      {
        kind: 'linkCard',
        title: 'Generative AI Product Manager',
        domain: 'ai4impact.org',
        href: 'https://ai4impact.org/learn/detail?v=gen-ai-product-manager-id',
        body:
          'Three lessons, twelve hours. Course notes written step by step with annotated ' +
          'screenshots, a chatbot template participants start from, and lab guides that sit inside ' +
          'the teaching sequence rather than after it.',
        cta: 'Open the live course',
      },
      {
        kind: 'note',
        title: 'What was checked before anyone else saw it',
        body:
          'The full Day 1 to Day 4 cycle was walked through solo before the cohort arrived, and ' +
          'every lab was run start to finish the same way. Notes were revised in place each time a ' +
          'run-through broke. Every code block in the notes is a block that executed first.',
      },
    ],
  },

  /* ── 04 IMPLEMENTATION ────────────────────────────────────────────────── */
  {
    id: 'implementation',
    index: '04',
    letter: 'I',
    phase: 'Implementation',
    headline: 'Four live sessions, 11 to 20 May 2026, storyboarded minute by minute.',
    question: 'Could someone else run this session from the documents alone?',
    sources: ['Storyboard, Day 1', 'Facilitator Guide'],
    blocks: [
      {
        kind: 'prose',
        body:
          'Day 1 was storyboarded frame by frame before it was delivered: what is on screen, what ' +
          'the participants do, what each frame is for, and why it sits where it does. Four of the ' +
          'frames are below, one per kind of activity.',
      },
      {
        kind: 'frames',
        items: [
          {
            time: '00:10',
            title: 'Feature-centric to user-centric',
            tag: 'Concept',
            goal:
              'Product management for AI is a set of decisions about scope, risk and trade-offs, ' +
              'not a contest of model sophistication.',
          },
          {
            time: '00:25',
            title: 'Decision matrix: rules or an LLM',
            tag: 'Discussion',
            goal:
              'Participants apply the concept immediately on two or three scenarios, which surfaces ' +
              'misunderstanding while it is still cheap to fix.',
          },
          {
            time: '01:00',
            title: 'Worksheet: jobs to be done',
            tag: 'Practice',
            goal:
              'Each participant defines the user and the job for the chatbot they will build, so ' +
              'the rest of the program has something specific to attach to.',
          },
          {
            time: '01:55',
            title: 'Lab 1: the editor, and where things live',
            tag: 'Demo',
            goal:
              'They see where the product decisions will be built, without needing to read code on ' +
              'day one. Orientation only, five minutes, deliberately at the end.',
          },
        ],
      },
      {
        kind: 'note',
        title: 'The pacing decision behind all of it',
        body:
          'No coding on day one. Every 15 to 20 minute block of concept is followed by 10 to 15 ' +
          'minutes of discussion or practice, and the break sits at minute 60, right after the first ' +
          'thing participants finish successfully. For a room that mixes technical and ' +
          'non-technical backgrounds, confidence has to be built before the tool is opened.',
      },
      {
        kind: 'qa',
        question: 'I am not a technical person. Can I really be a product manager for an AI product?',
        answer:
          'That is exactly where the value is. Product management for AI is not about writing code, ' +
          'it is about understanding the user and owning the scope decisions. Engineering owns the ' +
          'technical side. The job is making sure the right thing gets built.',
      },
      {
        kind: 'note',
        title: 'Why this question was written down in advance',
        body:
          'It is the question most likely to make a non-technical participant go quiet for two ' +
          'hours. A facilitator guide that answers it in writing means the answer does not depend on ' +
          'who happens to be running the session that day.',
      },
    ],
  },

  /* ── 05 EVALUATION ────────────────────────────────────────────────────── */
  {
    id: 'evaluation',
    index: '05',
    letter: 'E',
    phase: 'Evaluation',
    headline: 'How it was judged, and then what actually came back.',
    question: 'Does the assessment match the objectives, and did anyone measure what happened?',
    sources: ['Assessment Strategy & Rubric', 'Impact & Evaluation Summary'],
    blocks: [
      { kind: 'divider', label: 'How it was assessed' },
      {
        kind: 'prose',
        body:
          'Formative through Day 1 to Day 3, to catch trouble while it is still small, then ' +
          'summative on Day 4 through peer review and a live showcase. The assessment was designed ' +
          'before the program ran, not attached to it afterward.',
      },
      {
        kind: 'checklist',
        title: 'What passing required',
        items: [
          'Attend all four live sessions.',
          'Submit the chatbot through the final evaluation form before the June deadline.',
          'The chatbot has to be published, integrated with GPT, and built on a clear use case.',
        ],
      },
      {
        kind: 'rubric',
        criteria: [
          'Use case & target user',
          'Prompt & system design',
          'Data & tracking',
          'Ready for real use',
        ],
        levels: ['Beginning', 'Developing', 'Proficient', 'Exemplary'],
        footnote:
          'Four criteria, four levels, every cell described in full in the source rubric. The ' +
          'facilitator scored against it; peers used a simplified 1 to 5 version of the same four ' +
          'criteria, with at least one strength and one suggestion written for every chatbot ' +
          'reviewed. Peer scores informed the discussion. They did not decide who passed.',
      },
      { kind: 'divider', label: 'What came of it' },
      {
        kind: 'scores',
        items: [
          { label: 'Material', value: 4.5 },
          { label: 'Facilitation', value: 4.5 },
          { label: 'Platform', value: 4.5 },
          { label: 'Overall', value: 4.5 },
        ],
        of: 5,
      },
      {
        kind: 'prose',
        body:
          'The chatbots that came back were published and publicly reachable, covering course ' +
          'material consultation, campus information for prospective students, and institutional ' +
          'advisory services. Every one of them was tested with no critical errors and connected to ' +
          'GPT, and most also read from a live spreadsheet as their knowledge base.',
      },
      {
        kind: 'quotes',
        items: [
          {
            text:
              'The material opened up how I think about this. The part that stayed with me was ' +
              'designing and developing a chatbot until it actually worked the way its users needed.',
            by: 'Participant A',
          },
          {
            text: 'The moment the chatbot ran for the first time.',
            by: 'Participant B',
          },
        ],
      },
      {
        kind: 'prose',
        body:
          'Confidence to teach the material forward averaged 4.0 out of 5. Every one of those ' +
          'who responded planned to keep using the chatbot they built, and some said ' +
          'explicitly that they planned to teach the material to colleagues, which is the outcome a ' +
          'train the trainers program exists for.',
      },
      {
        kind: 'note',
        title: 'What still needs fixing',
        body:
          'Participants asked for more hands-on practice time, and for more complete written ' +
          'technical guides after falling behind the live instructions. Someone reported a ' +
          'publishing error on the platform and wanted a direct channel to ask about it. A ' +
          'post-program consultation channel is the gap that shows up most clearly in the responses.',
      },
    ],
  },
];
