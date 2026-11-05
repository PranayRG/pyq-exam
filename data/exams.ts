import { Exam } from '@/lib/types'

export const exams: Exam[] = [
  {
    id: 'ugc-net-forensic-science-june-2024',
    title: 'UGC NET June 2024',
    exam: 'UGC NET',
    subject: 'Forensic Science',
    year: 'June 2024',
    durationMinutes: 180,
    totalMarks: 300,
    marksPerQuestion: 2,
    sections: [
      {
        id: 'paper-1',
        name: 'Paper 1 - Teaching & Research Aptitude',
        questions: [
          {
            id: 1,
            question: 'Which of the following is the most important characteristic of a good teacher?',
            options: [
              'Subject matter knowledge only',
              'Ability to motivate and inspire students',
              'Strict discipline in the classroom',
              'Giving lengthy homework assignments'
            ],
            correctAnswer: 1,
            explanation: 'A good teacher must be able to motivate and inspire students to learn, which goes beyond just knowing the subject matter.'
          },
          {
            id: 2,
            question: 'Research is classified as "applied research" when it:',
            options: [
              'Is done in a laboratory setting',
              'Aims at finding a solution for an immediate problem',
              'Involves use of statistical methods',
              'Is theoretical in nature'
            ],
            correctAnswer: 1,
            explanation: 'Applied research is directed towards finding a solution to an existing problem or immediate practical application.'
          },
          {
            id: 3,
            question: 'The "__(RUSA)__" scheme of UGC stands for:',
            options: [
              'Rashtriya Uchchatar Shiksha Abhiyan',
              'Rashtriya Ucch Shiksha Academy',
              'Regional Universities Strategic Alliance',
              'Research and University Standards Authority'
            ],
            correctAnswer: 0,
            explanation: 'RUSA stands for Rashtriya Uchchatar Shiksha Abhiyan, a centrally sponsored scheme for funding state higher education institutions.'
          },
          {
            id: 4,
            question: 'Which of the following is NOT a measure of central tendency?',
            options: [
              'Mean',
              'Median',
              'Standard Deviation',
              'Mode'
            ],
            correctAnswer: 2,
            explanation: 'Standard Deviation is a measure of dispersion (spread), not central tendency. Mean, Median, and Mode are the three measures of central tendency.'
          },
          {
            id: 5,
            question: 'In communication, "feedback" refers to:',
            options: [
              'The message sent by the sender',
              'The channel used for communication',
              'The response of the receiver to the sender\'s message',
              'The noise in the communication process'
            ],
            correctAnswer: 2,
            explanation: 'Feedback is the receiver\'s response or reaction to the sender\'s message, completing the communication loop.'
          },
          {
            id: 6,
            question: 'Which of the following is an example of formative assessment?',
            options: [
              'Final semester examination',
              'Entrance test for admission',
              'Classroom quiz during a lesson',
              'Annual board examination'
            ],
            correctAnswer: 2,
            explanation: 'Formative assessment happens during the learning process (like quizzes, discussions) to monitor student learning, unlike summative assessments which evaluate at the end.'
          },
          {
            id: 7,
            question: 'ICT stands for:',
            options: [
              'International Communication Technology',
              'Information and Communication Technology',
              'Integrated Computer Technology',
              'Internet and Computer Technology'
            ],
            correctAnswer: 1,
            explanation: 'ICT stands for Information and Communication Technology, which encompasses all technologies used to handle telecommunications, media, and various types of information.'
          },
          {
            id: 8,
            question: 'The sampling technique where every member of the population has an equal chance of being selected is called:',
            options: [
              'Stratified sampling',
              'Convenience sampling',
              'Simple random sampling',
              'Purposive sampling'
            ],
            correctAnswer: 2,
            explanation: 'Simple random sampling gives every member of the population an equal probability of being selected in the sample.'
          },
          {
            id: 9,
            question: 'Which of the following is a greenhouse gas responsible for global warming?',
            options: [
              'Nitrogen',
              'Oxygen',
              'Carbon dioxide',
              'Hydrogen'
            ],
            correctAnswer: 2,
            explanation: 'Carbon dioxide (CO₂) is a major greenhouse gas that traps heat in the atmosphere and contributes significantly to global warming.'
          },
          {
            id: 10,
            question: 'The Right to Education Act (RTE) was enacted in India in the year:',
            options: [
              '2005',
              '2009',
              '2012',
              '2015'
            ],
            correctAnswer: 1,
            explanation: 'The Right of Children to Free and Compulsory Education Act (RTE) was enacted on 4 August 2009 and came into effect on 1 April 2010.'
          }
        ]
      },
      {
        id: 'paper-2',
        name: 'Paper 2 - Forensic Science',
        questions: [
          {
            id: 1,
            question: 'Locard\'s Exchange Principle states that:',
            options: [
              'Evidence must be exchanged between prosecution and defense',
              'Every contact leaves a trace',
              'Forensic evidence must be analyzed in duplicate',
              'Crime scenes must be processed by at least two officers'
            ],
            correctAnswer: 1,
            explanation: 'Locard\'s Exchange Principle, formulated by Dr. Edmond Locard, states that "every contact leaves a trace" — when two objects come in contact, there is always a transfer of material.'
          },
          {
            id: 2,
            question: 'The study of fingerprints for identification purposes is called:',
            options: [
              'Anthropology',
              'Dactyloscopy',
              'Odontology',
              'Serology'
            ],
            correctAnswer: 1,
            explanation: 'Dactyloscopy is the scientific study and classification of fingerprints as a method of identification.'
          },
          {
            id: 3,
            question: 'Which of the following is used as a presumptive test for blood?',
            options: [
              'Ninhydrin test',
              'Luminol test',
              'Duquenois-Levine test',
              'Marquis test'
            ],
            correctAnswer: 1,
            explanation: 'The Luminol test is a widely used presumptive test for blood that produces chemiluminescence when it reacts with the iron in hemoglobin.'
          },
          {
            id: 4,
            question: 'DNA profiling was first developed by:',
            options: [
              'Francis Crick',
              'Alec Jeffreys',
              'James Watson',
              'Kary Mullis'
            ],
            correctAnswer: 1,
            explanation: 'Sir Alec Jeffreys developed DNA profiling (genetic fingerprinting) in 1984 at the University of Leicester, England.'
          },
          {
            id: 5,
            question: 'The term "Rigor Mortis" refers to:',
            options: [
              'Cooling of the body after death',
              'Stiffening of muscles after death',
              'Discoloration of the body after death',
              'Decomposition of the body after death'
            ],
            correctAnswer: 1,
            explanation: 'Rigor Mortis is the post-mortem stiffening of muscles due to chemical changes in the muscle fibers, typically beginning 2-6 hours after death.'
          },
          {
            id: 6,
            question: 'Which type of fingerprint pattern has the highest frequency of occurrence?',
            options: [
              'Arch',
              'Whorl',
              'Loop',
              'Composite'
            ],
            correctAnswer: 2,
            explanation: 'Loops are the most common fingerprint pattern, occurring in approximately 60-65% of all fingerprints. Whorls account for about 30-35%, and arches about 5%.'
          },
          {
            id: 7,
            question: 'The instrument used to compare two bullets or cartridge cases simultaneously is:',
            options: [
              'Spectrometer',
              'Comparison microscope',
              'Scanning electron microscope',
              'Polarizing microscope'
            ],
            correctAnswer: 1,
            explanation: 'A comparison microscope allows the forensic examiner to view two bullets or cartridge cases side by side simultaneously for comparison of striations and markings.'
          },
          {
            id: 8,
            question: 'Which of the following poisons is known as "King of Poisons"?',
            options: [
              'Cyanide',
              'Arsenic',
              'Strychnine',
              'Mercury'
            ],
            correctAnswer: 1,
            explanation: 'Arsenic is historically known as the "King of Poisons" and "Poison of Kings" due to its potency, tastelessness, and historical use in assassinations.'
          },
          {
            id: 9,
            question: 'The process of determining the age of a document by examining the ink is known as:',
            options: [
              'Graphology',
              'Ink dating',
              'Chromatography',
              'Spectroscopy'
            ],
            correctAnswer: 1,
            explanation: 'Ink dating involves analyzing the chemical composition and aging characteristics of ink to determine when a document was written.'
          },
          {
            id: 10,
            question: 'Which of the following is used to develop latent fingerprints on porous surfaces like paper?',
            options: [
              'Cyanoacrylate fuming',
              'Ninhydrin',
              'Silver nitrate only',
              'Iodine fuming only'
            ],
            correctAnswer: 1,
            explanation: 'Ninhydrin reacts with amino acids present in sweat residues to produce a purple color (Ruhemann\'s purple), making it ideal for developing latent prints on porous surfaces like paper.'
          }
        ]
      }
    ]
  }
]

// Helper functions to get exam data
export function getExamById(id: string): Exam | undefined {
  return exams.find(e => e.id === id)
}

export function getExamsBySubject(examType: string, subject: string): Exam[] {
  return exams.filter(e => e.exam === examType && e.subject === subject)
}

export function getAvailableExamTypes(): string[] {
  return [...new Set(exams.map(e => e.exam))]
}

export function getAvailableSubjects(examType: string): string[] {
  return [...new Set(exams.filter(e => e.exam === examType).map(e => e.subject))]
}
