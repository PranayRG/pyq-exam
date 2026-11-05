import { Exam } from '@/lib/types'

export const exam31Dec2025Paper1: Exam = {
  id: 'ugc-net-31-dec-2025-shift-1-paper-1',
  title: 'UGC NET 31st Dec 2025 (Shift 1)',
  exam: 'UGC NET',
  subject: 'General Paper (Paper 1)',
  year: '31 Dec 2025 Morning',
  durationMinutes: 60,
  totalMarks: 100,
  marksPerQuestion: 2,
  sections: [
    {
      id: 'paper-1',
      name: 'Paper 1 - Teaching & Research Aptitude',
      questions: [
        {
          id: 1,
          question: `Study carefully the table given below and answer the question asked here under:
Number of students admitted in different academic programs of a college are provided year-wise:

| Year | B.A. | B.Sc. | B.B.A. | B.Com. | B.C.A. |
|---|---|---|---|---|---|
| 2021 | 150 | 25 | 50 | 45 | 75 |
| 2022 | 225 | 40 | 45 | 62 | 70 |
| 2023 | 450 | 65 | 30 | 90 | 73 |
| 2024 | 470 | 73 | 35 | 105 | 70 |
| 2025 | 500 | 80 | 36 | 132 | 74 |

In which year, the number of students have doubled with reference to the previous year in a particular program?`,
          options: ['2022', '2023', '2024', '2025'],
          correctAnswer: 1,
          explanation: 'Official NTA Answer Key: Option 2 (2023). In B.A. program, admissions in 2022 were 225 and doubled to 450 in 2023 (225 × 2 = 450).'
        },
        {
          id: 2,
          question: `Study the data from the table:

| Year | B.A. | B.Sc. | B.B.A. | B.Com. | B.C.A. |
|---|---|---|---|---|---|
| 2021 | 150 | 25 | 50 | 45 | 75 |
| 2022 | 225 | 40 | 45 | 62 | 70 |
| 2023 | 450 | 65 | 30 | 90 | 73 |
| 2024 | 470 | 73 | 35 | 105 | 70 |
| 2025 | 500 | 80 | 36 | 132 | 74 |

In how many year(s) does the 50% of total number of admitted students in a year is less than the number of students admitted in B.A. program that year?`,
          options: ['1', '2', '3', '4'],
          correctAnswer: 3,
          explanation: 'Official NTA Answer Key: Option 4 (4 years: 2022, 2023, 2024, 2025).'
        },
        {
          id: 3,
          question: `Study the data from the table:

| Year | B.A. | B.Sc. | B.B.A. | B.Com. | B.C.A. |
|---|---|---|---|---|---|
| 2021 | 150 | 25 | 50 | 45 | 75 |
| 2022 | 225 | 40 | 45 | 62 | 70 |
| 2023 | 450 | 65 | 30 | 90 | 73 |
| 2024 | 470 | 73 | 35 | 105 | 70 |
| 2025 | 500 | 80 | 36 | 132 | 74 |

Which program has the second highest percentage increase from 2021 to 2025 in the number of admitted students?`,
          options: ['B.A.', 'B.Sc.', 'B.B.A.', 'B.Com.'],
          correctAnswer: 1,
          explanation: 'Official NTA Answer Key: Option 2 (B.Sc.). B.A. increase = (500-150)/150 = 233.3%, B.Sc. increase = (80-25)/25 = 220%, B.Com = (132-45)/45 = 193.3%. The second highest is B.Sc.'
        },
        {
          id: 4,
          question: `Study the data from the table:

| Year | B.A. | B.Sc. | B.B.A. | B.Com. | B.C.A. |
|---|---|---|---|---|---|
| 2021 | 150 | 25 | 50 | 45 | 75 |
| 2022 | 225 | 40 | 45 | 62 | 70 |
| 2023 | 450 | 65 | 30 | 90 | 73 |
| 2024 | 470 | 73 | 35 | 105 | 70 |
| 2025 | 500 | 80 | 36 | 132 | 74 |

In which year, the ratio of admitted students to its previous year admitted students, is the highest?`,
          options: ['2022', '2023', '2024', '2025'],
          correctAnswer: 1,
          explanation: 'Official NTA Answer Key: Option 2 (2023). Total in 2022 = 442, in 2023 = 708. Ratio 708/442 ≈ 1.60, which is the highest.'
        },
        {
          id: 5,
          question: `Study the data from the table:

| Year | B.A. | B.Sc. | B.B.A. | B.Com. | B.C.A. |
|---|---|---|---|---|---|
| 2021 | 150 | 25 | 50 | 45 | 75 |
| 2022 | 225 | 40 | 45 | 62 | 70 |
| 2023 | 450 | 65 | 30 | 90 | 73 |
| 2024 | 470 | 73 | 35 | 105 | 70 |
| 2025 | 500 | 80 | 36 | 132 | 74 |

In which year, the ratio of admitted students in B. A. program to those in all the programs, is the lowest?`,
          options: ['2021', '2022', '2023', '2024'],
          correctAnswer: 0,
          explanation: 'Official NTA Answer Key: Option 1 (2021). B.A. ratio in 2021 was 150/345 ≈ 43.48%, lowest among all years.'
        },
        {
          id: 6,
          question: `Choose the correct statements from the following:

A. The capacity to think about our own thinking is Metacognition.
B. Metacognition is instrumental in controlling our own cognitive and motivational processes.
C. Teaching people how to learn stems from the idea of fostering a sense of agency and responsibility within learners.
D. Metacognition anyhow does not help in teaching people how to learn.
E. Metacognition knowledge and self-regulation are related components.

Choose the correct answer from the options given below:`,
          options: [
            'A, D and E Only',
            'A, C and D Only',
            'B, D and E Only',
            'A, B, C and E Only'
          ],
          correctAnswer: 3,
          explanation: 'Official NTA Answer Key: Option 4 (A, B, C and E Only). Statement D is incorrect because metacognition directly assists in teaching how to learn.'
        },
        {
          id: 7,
          question: `Arrange the following psychomotor domains of development from simple level to more complex one:

A. Perception
B. Set
C. Guided response
D. Mechanism
E. Complex overt response

Choose the correct answer from the options given below:`,
          options: [
            'A, B, C, D, E',
            'A, C, D, E, B',
            'A, B, D, E, C',
            'B, D, A, C, E'
          ],
          correctAnswer: 0,
          explanation: 'Official NTA Answer Key: Option 1 (A, B, C, D, E). In Simpson\'s psychomotor taxonomy, the progression is: Perception -> Set -> Guided Response -> Mechanism -> Complex Overt Response.'
        },
        {
          id: 8,
          question: `Match LIST-I with LIST-II:

| LIST-I | LIST-II |
|---|---|
| A. Reliability | I. Minimization of Personal Error |
| B. Validity | II. Minimization of Constant Error |
| C. Objectivity | III. Minimization of Variable Error |
| D. Norms | IV. Minimization of Interpretive Error |

Choose the correct answer from the options given below:`,
          options: [
            'A-III, B-II, C-I, D-IV',
            'A-I, B-II, C-III, D-IV',
            'A-III, B-IV, C-II, D-I',
            'A-IV, B-II, C-I, D-III'
          ],
          correctAnswer: 0,
          explanation: 'Official NTA Answer Key: Option 1 (A-III, B-II, C-I, D-IV). Reliability minimizes variable error, Validity minimizes constant error, Objectivity minimizes personal error, and Norms minimize interpretive error.'
        },
        {
          id: 9,
          question: 'Which of the following behavioural ability is associated with affective domain of a learner?',
          options: ['Evaluation', 'Synthesis', 'Characterization', 'Skilled movements'],
          correctAnswer: 2,
          explanation: 'Official NTA Answer Key: Option 3 (Characterization). Krathwohl\'s taxonomy for affective domain includes: Receiving, Responding, Valuing, Organization, and Characterization.'
        },
        {
          id: 10,
          question: 'Which of the following is NOT correct about the Criterion-Referenced Testing?',
          options: [
            'It is also called Domain-Referenced Testing.',
            'It is also called Objective-Referenced Testing.',
            'Its principal uses are in mastery tests.',
            'It is useful in testing the relative position of an individual in a group.'
          ],
          correctAnswer: 3,
          explanation: 'Official NTA Answer Key: Option 4. Testing the relative position of an individual in a group is a characteristic of Norm-Referenced Testing (NRT), not Criterion-Referenced Testing (CRT).'
        },
        {
          id: 11,
          question: `Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R:

Assertion A: Probability sampling is appropriate for quantitative research.
Reason R: Probability sampling helps in reducing bias in the selection of samples.

In the light of the above statements, choose the most appropriate answer from the options given below:`,
          options: [
            'Both A and R are correct and R is the correct explanation of A',
            'Both A and R are correct but R is NOT the correct explanation of A',
            'A is correct but R is not correct',
            'A is not correct but R is correct'
          ],
          correctAnswer: 0,
          explanation: 'Official NTA Answer Key: Option 1. Both statements are correct and Reason R correctly explains why probability sampling suits quantitative research.'
        },
        {
          id: 12,
          question: `Arrange the following p-values from lower level to higher level of significance:

A. 0.0001
B. 0.01
C. 0.05
D. 0.001
E. 0.5

Choose the correct answer from the options given below:`,
          options: [
            'A, B, D, C, E',
            'A, D, B, C, E',
            'E, C, B, D, A',
            'E, C, D, B, A'
          ],
          correctAnswer: 2,
          explanation: 'Official NTA Answer Key: Option 3 (E, C, B, D, A). A lower significance level corresponds to higher p-value (least stringent: 0.5) to highest level of significance (most stringent: 0.0001).'
        },
        {
          id: 13,
          question: `Match LIST-I with LIST-II:

| LIST-I (Scales of Measurement) | LIST-II (Characteristics) |
|---|---|
| A. Nominal | I. Place items from least to most or lowest to highest |
| B. Ordinal | II. Precisely how far apart the items are |
| C. Ratio | III. Denotes the categories only |
| D. Interval | IV. Enables researcher to determine the proportions easily |

Choose the correct answer from the options given below:`,
          options: [
            'A-III, B-I, C-IV, D-II',
            'A-IV, B-II, C-III, D-I',
            'A-I, B-II, C-IV, D-III',
            'A-III, B-II, C-I, D-IV'
          ],
          correctAnswer: 0,
          explanation: 'Official NTA Answer Key: Option 1 (A-III, B-I, C-IV, D-II).'
        },
        {
          id: 14,
          question: `Qualitative research can be construed as a research strategy that:`,
          options: [
            'entails a deductive approach to the relationship between theory and research',
            'has incorporated the practices and norms of the natural scientific model',
            'embodies a view of social reality as a constantly shifting emergent property of individuals\' creation',
            'embodies a view of social reality as an external objective reality'
          ],
          correctAnswer: 2,
          explanation: 'Official NTA Answer Key: Option 3. Qualitative research relies on interpretivism and constructionism, viewing social reality as constructed and constantly shifting.'
        },
        {
          id: 15,
          question: 'Survey research on a sample at a single point in time, pertains to which of the following research designs?',
          options: ['cross-sectional', 'experimental', 'longitudinal', 'case study'],
          correctAnswer: 0,
          explanation: 'Official NTA Answer Key: Option 1 (cross-sectional). Studies conducted at a single point in time across a population or sample are cross-sectional.'
        },
        {
          id: 16,
          question: `Which of the following Principles are true for a typical communication process?

A. Communication messages are both verbal and non-verbal.
B. The communication process does not involve mutual influence.
C. Communication messages can be intentional or unintentional.
D. Communication is both complex and subtle.

Choose the correct answer from the options given below:`,
          options: [
            'A, B & C Only',
            'B, C & D Only',
            'A, C & D Only',
            'A, B & D Only'
          ],
          correctAnswer: 2,
          explanation: 'Official NTA Answer Key: Option 3 (A, C & D Only). Statement B is false because communication inherently involves mutual influence between sender and receiver.'
        },
        {
          id: 17,
          question: `Arrange the following levels of communication in the sequential order of complexity beginning with the most personal:

A. Intergroup
B. Interpersonal
C. Intragroup
D. Intrapersonal
E. Institutional

Choose the correct answer from the options given below:`,
          options: [
            'B, D, A, C, E',
            'B, A, D, C, E',
            'D, B, E, C, A',
            'D, B, C, A, E'
          ],
          correctAnswer: 3,
          explanation: 'Official NTA Answer Key: Option 4 (D, B, C, A, E). Intrapersonal (self) -> Interpersonal (one-to-one) -> Intragroup (within group) -> Intergroup (between groups) -> Institutional (organizational).'
        },
        {
          id: 18,
          question: `Match LIST-I with LIST-II:

| LIST-I (Type of Noise in Communication) | LIST-II (Examples) |
|---|---|
| A. Physiological | I. Words not understood |
| B. Physical | II. Fatigue |
| C. Psychological | III. Prejudice |
| D. Semantic | IV. Bright Lights |

Choose the correct answer from the options given below:`,
          options: [
            'A-III, B-IV, C-II, D-I',
            'A-II, B-IV, C-III, D-I',
            'A-I, B-IV, C-II, D-III',
            'A-III, B-II, C-IV, D-I'
          ],
          correctAnswer: 1,
          explanation: 'Official NTA Answer Key: Option 2 (A-II, B-IV, C-III, D-I).'
        },
        {
          id: 19,
          question: `Planned publicity that spreads spontaneously and rapidly 'by word of mouth' (but also by social network sites) throughout a potential media consumer market, refers to:`,
          options: ['News', 'Viral Advertising', 'Communique', 'Rejoinder'],
          correctAnswer: 1,
          explanation: 'Official NTA Answer Key: Option 2 (Viral Advertising).'
        },
        {
          id: 20,
          question: `The mental or psychological recasting of a message so that its meaning is in line with a person's beliefs and attitudes, is:`,
          options: ['Selective Perception', 'Assertion', 'Lobbying', 'Reflection'],
          correctAnswer: 0,
          explanation: 'Official NTA Answer Key: Option 1 (Selective Perception).'
        },
        {
          id: 21,
          question: `Match LIST-I with LIST-II:

| LIST-I (Number) | LIST-II (Code) |
|---|---|
| A. 4 | I. 126 |
| B. 5 | II. 65 |
| C. 7 | III. 1332 |
| D. 11 | IV. 344 |

Choose the correct answer from the options given below:`,
          options: [
            'A-II, B-I, C-IV, D-III',
            'A-I, B-II, C-III, D-IV',
            'A-III, B-I, C-IV, D-II',
            'A-IV, B-II, C-III, D-I'
          ],
          correctAnswer: 0,
          explanation: 'Official NTA Answer Key: Option 1 (A-II, B-I, C-IV, D-III). Pattern is n³ + 1: 4³+1 = 65, 5³+1 = 126, 7³+1 = 344, 11³+1 = 1332.'
        },
        {
          id: 22,
          question: `Identify the correct mathematical statements:

A. The expression 1/(5×6) + 1/(6×7) + 1/(7×8) + ...... + 1/(24×25) is equal to 4/25
B. Of the three numbers, second is twice the first and is also thrice of the third. If the average of three numbers is 55, then largest number is 90.
C. If (a + b):(b + c):(c + a) = 6:7:8 and a + b + c = 14, then value of c is 8
D. (0.2×0.2 + 0.02×0.02 - 0.4×0.02) / 0.18 is equal to 0.09

Choose the correct answer from the options given below:`,
          options: [
            'A, B and D only',
            'B and C only',
            'B and D only',
            'A and B only'
          ],
          correctAnswer: 3,
          explanation: 'Official NTA Answer Key: Option 4 (A and B only).'
        },
        {
          id: 23,
          question: `Arrange the following fractions in descending order:

A. 2/5
B. 3/8
C. 5/13
D. 6/11
E. 4/9

Choose the correct answer from the options given below:`,
          options: [
            'D, E, C, A, B',
            'D, A, E, B, C',
            'B, A, C, D, E',
            'D, E, A, C, B'
          ],
          correctAnswer: 3,
          explanation: 'Official NTA Answer Key: Option 4 (D, E, A, C, B). Values: 6/11 ≈ 0.545, 4/9 ≈ 0.444, 2/5 = 0.400, 5/13 ≈ 0.385, 3/8 = 0.375.'
        },
        {
          id: 24,
          question: `Complete the following series:

4, 36, 252, 1260, .........`,
          options: ['2520', '3780', '2780', '3520'],
          correctAnswer: 1,
          explanation: 'Official NTA Answer Key: Option 2 (3780). Pattern: 4 × 9 = 36, 36 × 7 = 252, 252 × 5 = 1260, 1260 × 3 = 3780.'
        },
        {
          id: 25,
          question: `A train running at 54 km/hr takes 20 sec to cross a platform and 15 sec to pass a man walking in the same direction at a speed of 6 km/hr. Then the length of platform is:`,
          options: ['200 meters', '100 meters', '160 meters', '140 meters'],
          correctAnswer: 1,
          explanation: 'Official NTA Answer Key: Option 2 (100 meters).'
        },
        {
          id: 26,
          question: `Contraposition is not valid in the case of which categorical proposition?`,
          options: ['A', 'O', 'I', 'E'],
          correctAnswer: [2, 3], // Keys 3 and 4 are both awarded marks
          explanation: 'Official NTA Answer Key: Option 3 or 4 (Both I and E categorical propositions awarded full marks by NTA).'
        },
        {
          id: 27,
          question: `Match LIST-I with LIST-II:

| LIST-I (Syllogism) | LIST-II (Mood and Figure) |
|---|---|
| A. All M are P; Some M are S; therefore Some S are P | I. EOO-1 |
| B. No M are P; Some S are not M; therefore Some S are not P | II. AAA-2 |
| C. All P are M; All S are M; therefore All S are P | III. III-2 |
| D. Some P are M; Some S are M; therefore Some S are P | IV. AII-3 |

Choose the correct answer from the options given below:`,
          options: [
            'A-II, B-III, C-IV, D-I',
            'A-III, B-I, C-IV, D-II',
            'A-I, B-II, C-III, D-IV',
            'A-IV, B-I, C-II, D-III'
          ],
          correctAnswer: 3,
          explanation: 'Official NTA Answer Key: Option 4 (A-IV, B-I, C-II, D-III).'
        },
        {
          id: 28,
          question: `Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R:

Assertion A: In Indian logic, a material fallacy is called hetvābhāsa.
Reason R: In a fallacious inference (anumāna), the middle term appears to be a reason but is not a valid reason.

In the light of the above statements, choose the correct answer from the options given below:`,
          options: [
            'Both A and R are correct and R is the correct explanation of A',
            'Both A and R are correct but R is NOT the correct explanation of A',
            'A is correct but R is false',
            'A is false but R is correct'
          ],
          correctAnswer: 0,
          explanation: 'Official NTA Answer Key: Option 1. Both statements are correct and Reason R correctly explains hetvābhāsa.'
        },
        {
          id: 29,
          question: `Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R:

Assertion A: AAA-2 an invalid categorical syllogism.
Reason R: AAA-2 commits the fallacy of exclusive premises.

In the light of the above statements, choose the correct answer from the options given below:`,
          options: [
            'Both A and R are correct and R is the correct explanation of A',
            'Both A and R are correct but R is NOT the correct explanation of A',
            'A is correct but R is false',
            'A is false but R is correct'
          ],
          correctAnswer: 2,
          explanation: 'Official NTA Answer Key: Option 3 (A is correct but R is false). AAA-2 commits the fallacy of undistributed middle, not exclusive premises.'
        },
        {
          id: 30,
          question: `Which of the following is/are TRUE:

A. The categorical syllogism AAA-2 commits the fallacy of exclusive premises.
B. The categorical syllogism EIO-3 commits the fallacy of four terms.
C. The categorical syllogism AAA-1 commits no fallacy.
D. The categorical syllogism EAA-1 commits no fallacy.

Choose the correct answer from the options given below:`,
          options: ['A only', 'B and C only', 'C only', 'A and D only'],
          correctAnswer: 2,
          explanation: 'Official NTA Answer Key: Option 3 (C only). Barbara (AAA-1) is a unconditionally valid syllogism committing no fallacy.'
        },
        {
          id: 31,
          question: 'Which is NOT a valid file format for images?',
          options: ['.bmp', '.tiff', '.jpg', '.wav'],
          correctAnswer: 3,
          explanation: 'Official NTA Answer Key: Option 4 (.wav). .wav is an uncompressed audio file format, not an image format.'
        },
        {
          id: 32,
          question: 'Which of the following is a scripting language?',
          options: ['FORTRAN 95', 'COBOL', 'C++', 'Visual Basic'],
          correctAnswer: 3,
          explanation: 'Official NTA Answer Key: Option 4 (Visual Basic).'
        },
        {
          id: 33,
          question: `Match LIST-I with LIST-II:

| LIST-I | LIST-II |
|---|---|
| A. Digit keys | I. Backspace, return, spacebar |
| B. Special character keys | II. Numeric keypad |
| C. Non-printable keys | III. F1, F2, ......, F12 |
| D. Function keys | IV. +, @, & |

Choose the correct answer from the options given below:`,
          options: [
            'A-I, B-II, C-III, D-IV',
            'A-IV, B-II, C-I, D-III',
            'A-II, B-I, C-III, D-IV',
            'A-II, B-IV, C-I, D-III'
          ],
          correctAnswer: 3,
          explanation: 'Official NTA Answer Key: Option 4 (A-II, B-IV, C-I, D-III).'
        },
        {
          id: 34,
          question: `Arrange the following in decreasing order of processing power:

A. Mainframe Computer
B. Super Computer
C. Mini Computer
D. Micro Computer

Choose the correct answer from the options given below:`,
          options: ['B, C, A, D', 'B, A, C, D', 'A, B, C, D', 'A, B, D, C'],
          correctAnswer: 1,
          explanation: 'Official NTA Answer Key: Option 2 (B, A, C, D). Super Computer > Mainframe > Mini Computer > Micro Computer.'
        },
        {
          id: 35,
          question: `Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R:

Assertion A: ROM is a non-volatile memory.
Reason R: ROM does not lose its contents when power is switched off.

In the light of the above statements, choose the most appropriate answer from the options given below:`,
          options: [
            'Both A and R are correct and R is the correct explanation of A',
            'Both A and R are correct but R is NOT the correct explanation of A',
            'A is correct but R is not correct',
            'A is not correct but R is correct'
          ],
          correctAnswer: 0,
          explanation: 'Official NTA Answer Key: Option 1. Both statements are correct and Reason R provides the definition of non-volatility.'
        },
        {
          id: 36,
          question: `Which of the following are characteristics of sustainable development?

A. Intergenerational equity regarding natural resources.
B. Equitable distribution of natural resources in the society.
C. Economic development at the expense of environment.
D. Reduction in society's use of non-renewable resources.

Choose the correct answer from the options given below:`,
          options: ['A and D only', 'A and B only', 'A, B and C only', 'A, B and D only'],
          correctAnswer: 3,
          explanation: 'Official NTA Answer Key: Option 4 (A, B and D only). Statement C is incorrect because sustainable development does not sacrifice the environment.'
        },
        {
          id: 37,
          question: `Arrange the following in descending order of installed capacity of total solar power as of August, 2025:

A. Gujarat
B. Rajasthan
C. Maharashtra
D. Tamil Nadu

Choose the correct answer from the options given below:`,
          options: ['A, B, C, D', 'A, B, D, C', 'B, A, D, C', 'B, A, C, D'],
          correctAnswer: 3,
          explanation: 'Official NTA Answer Key: Option 4 (B, A, C, D).'
        },
        {
          id: 38,
          question: `Match LIST-I with LIST-II:

| LIST-I (Mission LiFE objectives) | LIST-II (Action) |
|---|---|
| A. Energy saved | I. Use menstrual cups instead of sanitary napkins |
| B. E-waste reduced | II. Start biodiversity conservation at community level |
| C. Healthy lifestyles adopted | III. Use carpooling with friends and colleagues |
| D. Single use plastic reduced | IV. Prefer cloud storage over a pen drive/hard drive |

Choose the correct answer from the options given below:`,
          options: [
            'A-III, B-IV, C-I, D-II',
            'A-IV, B-III, C-II, D-I',
            'A-III, B-IV, C-II, D-I',
            'A-I, B-III, C-IV, D-II'
          ],
          correctAnswer: 2,
          explanation: 'Official NTA Answer Key: Option 3 (A-III, B-IV, C-II, D-I).'
        },
        {
          id: 39,
          question: 'Which of the following is a criteria air pollutant as well as a greenhouse gas?',
          options: ['N2O', 'CO2', 'O3', 'NO2'],
          correctAnswer: 2,
          explanation: 'Official NTA Answer Key: Option 3 (O3 - Tropospheric Ozone).'
        },
        {
          id: 40,
          question: 'Liquid that passes through the landfill, and that has extracted dissolved and suspended matter from it is called _________.',
          options: ['activated sludge', 'leachate', 'ultrafiltration', 'refuse'],
          correctAnswer: 1,
          explanation: 'Official NTA Answer Key: Option 2 (leachate).'
        },
        {
          id: 41,
          question: 'Which among the following is NOT a fundamental principle of National Education Policy, 2020?',
          options: [
            'Highest priority to foundational literacy and numeracy',
            'Emphasis on conceptual understanding',
            'Promoting translingualism and the power of language',
            'Respect for diversity and local context'
          ],
          correctAnswer: 2,
          explanation: 'Official NTA Answer Key: Option 3 (Promoting multilingualism is the NEP principle, not translingualism).'
        },
        {
          id: 42,
          question: 'For the purpose of credit calculations under National Credit Framework (NCrF), overall, one Credit is equivalent to:',
          options: [
            '30 notional learning hours',
            '40 notional learning hours',
            '45 notional learning hours',
            '60 notional learning hours'
          ],
          correctAnswer: 0,
          explanation: 'Official NTA Answer Key: Option 1 (30 notional learning hours per credit).'
        },
        {
          id: 43,
          question: `Given below are two statements: one is labelled as Assertion A and the other is labelled as Reason R:

Assertion A: Leaders in higher education institutions set the tone for academic and research excellence.
Reason R: Effective leadership is essential for the effective allocation and management of resources in higher education.

In the light of the above statements, choose the most appropriate answer from the options given below:`,
          options: [
            'Both A and R are correct and R is the correct explanation of A',
            'Both A and R are correct but R is NOT the correct explanation of A',
            'A is correct but R is not correct',
            'A is not correct but R is correct'
          ],
          correctAnswer: [0, 1], // Key gives 1,2
          explanation: 'Official NTA Answer Key: Option 1 or Option 2 (Both options accepted by NTA).'
        },
        {
          id: 44,
          question: `Arrange the following developments of education in the chronological order:

A. SWAYAM MOOCs
B. Open education
C. Distance Education
D. Correspondence Education
E. Credit Transfer through Academic Bank of Credit

Choose the correct answer from the options given below:`,
          options: ['C, B, D, A, E', 'D, C, A, B, E', 'B, D, C, E, A', 'D, C, B, A, E'],
          correctAnswer: 3,
          explanation: 'Official NTA Answer Key: Option 4 (D, C, B, A, E). Correspondence -> Distance -> Open Education -> SWAYAM MOOCs -> Academic Bank of Credit (ABC).'
        },
        {
          id: 45,
          question: `Match LIST-I with LIST-II:

| LIST-I (Commission on Education) | LIST-II (Major Recommendation) |
|---|---|
| A. The Education Commission | I. Setting up of the University Grants Commission |
| B. University Education Commission | II. 12th Class should be attached to the university |
| C. The Knowledge Commission | III. Creation of Indian Educational Services |
| D. Secondary Education Commission | IV. Establishing an independent Regulatory Authority for Higher Education |

Choose the correct answer from the options given below:`,
          options: [
            'A-III, B-I, C-IV, D-II',
            'A-II, B-III, C-IV, D-I',
            'A-III, B-I, C-II, D-IV',
            'A-I, B-IV, C-II, D-III'
          ],
          correctAnswer: 0,
          explanation: 'Official NTA Answer Key: Option 1 (A-III, B-I, C-IV, D-II).'
        },
        {
          id: 46,
          question: `Read the passage given below and answer the question:

Conventional and outdated wisdom asserts that we each have 'learning styles' unique to ourselves. The implication is that if you don't learn using your preferred style you'll fail to acquire the knowledge desired. It also allows you an excuse not to work hard at learning something new. In Soft-Wired, however, Michael Merzenich shows that the plasticity of the brain extends to the way we learn. In other words, we can learn how to learn. Indeed, we should focus strongly on doing this.

As well as reading or attending lectures, look at cultivating different learning styles-or, more precisely, learning strategies. Micromastery enables you to experiment and use a vast array of different learning strategies. Since all are designed to succeed brilliantly (with a modicum of persistence) at the micromastery concerned, you have a perfect chance to increase your store of potential learning strategies. This in turn increases your ideational fluency – your ability to switch between idea sets that may be opposed or contradictory. If one strategy doesn't seem to work, no matter how wedded you are to it, you switch seamlessly to another. Ideational fluency is an attribute required of anyone working in a fast-changing, rapid-learning environment – the kind increasingly encountered today.

What becomes an excuse to not learn something new?`,
          options: [
            'The plasticity of the brain',
            'The rationale of ideational fluency',
            'The presence of micro mastery',
            'Each person has a unique learning style'
          ],
          correctAnswer: 3,
          explanation: 'Official NTA Answer Key: Option 4. The passage states that the belief in unique learning styles "allows you an excuse not to work hard at learning something new."'
        },
        {
          id: 47,
          question: `According to the passage on learning styles and micromastery:

Ideational fluency in the passage is defined as:`,
          options: [
            'The ability to switch between contradictory idea sets',
            'Various kinds of learning strategies and ideas',
            'Possessing the skill in one kind of learning strategy',
            'The ability to avoid many kinds of idea sets'
          ],
          correctAnswer: 0,
          explanation: 'Official NTA Answer Key: Option 1. The passage defines ideational fluency as "your ability to switch between idea sets that may be opposed or contradictory."'
        },
        {
          id: 48,
          question: 'Another word for "seamlessly" can be:',
          options: ['speedily', 'slowly', 'smoothly', 'gracefully'],
          correctAnswer: 2,
          explanation: 'Official NTA Answer Key: Option 3 (smoothly).'
        },
        {
          id: 49,
          question: 'According to the passage micromastery refers to:',
          options: [
            'The ability to master both macro and micro skills',
            'The ability to experiment and apply diverse learning strategies',
            'The aptitude to learn better and achieve all goals',
            'The ability to be a master of both process and product'
          ],
          correctAnswer: 1,
          explanation: 'Official NTA Answer Key: Option 2 (The ability to experiment and apply diverse learning strategies).'
        },
        {
          id: 50,
          question: 'Select the skill which would be the best one in a fast-changing rapid learning environment, according to the passage:',
          options: [
            'Ideational fluency',
            'A unique learning style',
            'Plasticity of the brain',
            'Capacity of hard work'
          ],
          correctAnswer: 0,
          explanation: 'Official NTA Answer Key: Option 1 (Ideational fluency).'
        }
      ]
    }
  ]
}
