// scripts/addQuestions.js
require('dotenv').config();
const mongoose = require('mongoose');
const QuizQuestion = require('../models/QuizQuestion');

const MONGODB_URI = process.env.MONGODB_URI;

async function addQuestions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Array of 30 different bilingual questions
    const questions = [
      {
        question: {
          en: "What is the capital of France?",
          ar: "ما هي عاصمة فرنسا؟"
        },
        correctAnswer: {
          en: "Paris",
          ar: "باريس"
        },
        wrongAnswers: [
          { en: "London", ar: "لندن" },
          { en: "Berlin", ar: "برلين" },
          { en: "Madrid", ar: "مدريد" }
        ]
      },
      {
        question: {
          en: "What is the largest planet in our Solar System?",
          ar: "ما هو أكبر كوكب في نظامنا الشمسي؟"
        },
        correctAnswer: {
          en: "Jupiter",
          ar: "المشتري"
        },
        wrongAnswers: [
          { en: "Saturn", ar: "زحل" },
          { en: "Earth", ar: "الأرض" },
          { en: "Mars", ar: "المريخ" }
        ]
      },
      {
        question: {
          en: "Who wrote the play 'Romeo and Juliet'?",
          ar: "من كتب مسرحية 'روميو وجولييت'؟"
        },
        correctAnswer: {
          en: "William Shakespeare",
          ar: "ويليام شكسبير"
        },
        wrongAnswers: [
          { en: "Charles Dickens", ar: "تشارلز ديكنز" },
          { en: "Leo Tolstoy", ar: "ليو تولستوي" },
          { en: "Jane Austen", ar: "جين أوستن" }
        ]
      },
      {
        question: {
          en: "What is the boiling point of water at sea level (in °C)?",
          ar: "ما هي درجة غليان الماء على مستوى سطح البحر (بـ °م)؟"
        },
        correctAnswer: {
          en: "100",
          ar: "100"
        },
        wrongAnswers: [
          { en: "90", ar: "90" },
          { en: "110", ar: "110" },
          { en: "95", ar: "95" }
        ]
      },
      {
        question: {
          en: "Which element has the chemical symbol 'O'?",
          ar: "أي عنصر يحمل الرمز الكيميائي 'O'؟"
        },
        correctAnswer: {
          en: "Oxygen",
          ar: "الأكسجين"
        },
        wrongAnswers: [
          { en: "Gold", ar: "ذهب" },
          { en: "Silver", ar: "فضة" },
          { en: "Hydrogen", ar: "هيدروجين" }
        ]
      },
      {
        question: {
          en: "What is the square root of 144?",
          ar: "ما هو الجذر التربيعي لـ144؟"
        },
        correctAnswer: {
          en: "12",
          ar: "12"
        },
        wrongAnswers: [
          { en: "10", ar: "10" },
          { en: "14", ar: "14" },
          { en: "16", ar: "16" }
        ]
      },
      {
        question: {
          en: "In which continent is Brazil located?",
          ar: "في أي قارة يقع البرازيل؟"
        },
        correctAnswer: {
          en: "South America",
          ar: "أمريكا الجنوبية"
        },
        wrongAnswers: [
          { en: "North America", ar: "أمريكا الشمالية" },
          { en: "Europe", ar: "أوروبا" },
          { en: "Asia", ar: "آسيا" }
        ]
      },
      {
        question: {
          en: "Who painted the Mona Lisa?",
          ar: "من رسم لوحة الموناليزا؟"
        },
        correctAnswer: {
          en: "Leonardo da Vinci",
          ar: "ليوناردو د فينشي"
        },
        wrongAnswers: [
          { en: "Pablo Picasso", ar: "بابلو بيكاسو" },
          { en: "Vincent van Gogh", ar: "فنسنت فان جوخ" },
          { en: "Claude Monet", ar: "كلود مونيه" }
        ]
      },
      {
        question: {
          en: "What is the smallest prime number?",
          ar: "ما هو أصغر عدد أولي؟"
        },
        correctAnswer: {
          en: "2",
          ar: "2"
        },
        wrongAnswers: [
          { en: "1", ar: "1" },
          { en: "3", ar: "3" },
          { en: "0", ar: "0" }
        ]
      },
      {
        question: {
          en: "Which ocean is the largest?",
          ar: "أي محيط هو الأكبر؟"
        },
        correctAnswer: {
          en: "Pacific Ocean",
          ar: "المحيط الهادئ"
        },
        wrongAnswers: [
          { en: "Atlantic Ocean", ar: "المحيط الأطلسي" },
          { en: "Indian Ocean", ar: "المحيط الهندي" },
          { en: "Arctic Ocean", ar: "المحيط المتجمد الشمالي" }
        ]
      },
      // Add 20 more unique questions
      {
        question: {
          en: "What is the chemical symbol for gold?",
          ar: "ما هو الرمز الكيميائي للذهب؟"
        },
        correctAnswer: {
          en: "Au",
          ar: "Au"
        },
        wrongAnswers: [
          { en: "Ag", ar: "Ag" },
          { en: "Gd", ar: "Gd" },
          { en: "Go", ar: "Go" }
        ]
      },
      {
        question: {
          en: "Who is known as the 'Father of Computers'?",
          ar: "من يُعرف بأنه 'أب الحواسيب'؟"
        },
        correctAnswer: {
          en: "Charles Babbage",
          ar: "تشارلز باباج"
        },
        wrongAnswers: [
          { en: "Alan Turing", ar: "آلان تورينج" },
          { en: "Bill Gates", ar: "بيل غيتس" },
          { en: "Steve Jobs", ar: "ستيف جوبز" }
        ]
      },
      {
        question: {
          en: "What is the largest mammal in the world?",
          ar: "ما هو أكبر حيوان ثديي في العالم؟"
        },
        correctAnswer: {
          en: "Blue Whale",
          ar: "الحوت الأزرق"
        },
        wrongAnswers: [
          { en: "Elephant", ar: "فيل" },
          { en: "Giraffe", ar: "زرافة" },
          { en: "Hippopotamus", ar: "فرس النهر" }
        ]
      },
      {
        question: {
          en: "Which country hosted the 2016 Summer Olympics?",
          ar: "أي دولة استضافت دورة الألعاب الأولمبية الصيفية لعام 2016؟"
        },
        correctAnswer: {
          en: "Brazil",
          ar: "البرازيل"
        },
        wrongAnswers: [
          { en: "China", ar: "الصين" },
          { en: "UK", ar: "المملكة المتحدة" },
          { en: "Russia", ar: "روسيا" }
        ]
      },
      {
        question: {
          en: "What does DNA stand for?",
          ar: "بماذا يرمز الحمض النووي؟"
        },
        correctAnswer: {
          en: "Deoxyribonucleic Acid",
          ar: "حمض الديوكسيريبو核 النووي"
        },
        wrongAnswers: [
          { en: "Deoxyribose Nucleic Acid", ar: "حمض الديوكسيريبو核 النووي" },
          { en: "Dioxyribonucleic Acid", ar: "حمض الديوكسيريبو核 النووي" },
          { en: "Deoxyribose Acid", ar: "حمض الديوكسيريبو" }
        ]
      },
      {
        question: {
          en: "What year did World War II end?",
          ar: "في أي عام انتهت الحرب العالمية الثانية؟"
        },
        correctAnswer: {
          en: "1945",
          ar: "1945"
        },
        wrongAnswers: [
          { en: "1939", ar: "1939" },
          { en: "1944", ar: "1944" },
          { en: "1950", ar: "1950" }
        ]
      },
      {
        question: {
          en: "Which language is primarily spoken in Brazil?",
          ar: "ما هي اللغة الرئيسية المستخدمة في البرازيل؟"
        },
        correctAnswer: {
          en: "Portuguese",
          ar: "البرتغالية"
        },
        wrongAnswers: [
          { en: "Spanish", ar: "الإسبانية" },
          { en: "English", ar: "الإنجليزية" },
          { en: "French", ar: "الفرنسية" }
        ]
      },
      {
        question: {
          en: "How many continents are there?",
          ar: "كم عدد القارات؟"
        },
        correctAnswer: {
          en: "7",
          ar: "7"
        },
        wrongAnswers: [
          { en: "5", ar: "5" },
          { en: "6", ar: "6" },
          { en: "8", ar: "8" }
        ]
      },
      {
        question: {
          en: "What is the boiling point of water (in °C) at sea level?",
          ar: "ما هي درجة غليان الماء (بـ °م) على مستوى سطح البحر؟"
        },
        correctAnswer: {
          en: "100",
          ar: "100"
        },
        wrongAnswers: [
          { en: "90", ar: "90" },
          { en: "110", ar: "110" },
          { en: "95", ar: "95" }
        ]
      },
      {
        question: {
          en: "Who discovered penicillin?",
          ar: "من اكتشف البنسيلين؟"
        },
        correctAnswer: {
          en: "Alexander Fleming",
          ar: "ألكسندر فليمنج"
        },
        wrongAnswers: [
          { en: "Marie Curie", ar: "ماري كوري" },
          { en: "Louis Pasteur", ar: "لويس باستور" },
          { en: "Gregor Mendel", ar: "غريغور مندل" }
        ]
      },
      {
        question: {
          en: "What is the currency of Japan?",
          ar: "ما هي عملة اليابان؟"
        },
        correctAnswer: {
          en: "Yen",
          ar: "ين"
        },
        wrongAnswers: [
          { en: "Dollar", ar: "دولار" },
          { en: "Euro", ar: "يورو" },
          { en: "Won", ar: "وون" }
        ]
      },
      {
        question: {
          en: "Which planet is known as the Red Planet?",
          ar: "أي كوكب يُعرف بالكوكب الأحمر؟"
        },
        correctAnswer: {
          en: "Mars",
          ar: "المريخ"
        },
        wrongAnswers: [
          { en: "Venus", ar: "الزهرة" },
          { en: "Jupiter", ar: "المشتري" },
          { en: "Saturn", ar: "زحل" }
        ]
      },
      {
        question: {
          en: "What is the hardest natural substance?",
          ar: "ما هو أصعب مادة طبيعية؟"
        },
        correctAnswer: {
          en: "Diamond",
          ar: "ألماس"
        },
        wrongAnswers: [
          { en: "Gold", ar: "ذهب" },
          { en: "Iron", ar: "حديد" },
          { en: "Graphite", ar: "جرافيت" }
        ]
      },
      {
        question: {
          en: "Which ocean is the largest?",
          ar: "أي محيط هو الأكبر؟"
        },
        correctAnswer: {
          en: "Pacific Ocean",
          ar: "المحيط الهادئ"
        },
        wrongAnswers: [
          { en: "Atlantic Ocean", ar: "المحيط الأطلسي" },
          { en: "Indian Ocean", ar: "المحيط الهندي" },
          { en: "Arctic Ocean", ar: "المحيط المتجمد الشمالي" }
        ]
      },
      {
        question: {
          en: "What is the chemical symbol for iron?",
          ar: "ما هو الرمز الكيميائي للحديد؟"
        },
        correctAnswer: {
          en: "Fe",
          ar: "Fe"
        },
        wrongAnswers: [
          { en: "Ir", ar: "Ir" },
          { en: "In", ar: "In" },
          { en: "I", ar: "I" }
        ]
      },
      {
        question: {
          en: "Who is the author of '1984'?",
          ar: "من هو مؤلف '1984'؟"
        },
        correctAnswer: {
          en: "George Orwell",
          ar: "جورج أورويل"
        },
        wrongAnswers: [
          { en: "Aldous Huxley", ar: "ألدوس هكسلي" },
          { en: "Ray Bradbury", ar: "راي برادبري" },
          { en: "J.D. Salinger", ar: "جي. دي. سالينجر" }
        ]
      },
      {
        question: {
          en: "What is the tallest mountain in the world?",
          ar: "ما هو أعلى جبل في العالم؟"
        },
        correctAnswer: {
          en: "Mount Everest",
          ar: "جبل إيفرست"
        },
        wrongAnswers: [
          { en: "K2", ar: "ك2" },
          { en: "Kangchenjunga", ar: "كانشنجونجا" },
          { en: "Lhotse", ar: "لوشتي" }
        ]
      },
      {
        question: {
          en: "Which country is known as the Land of the Rising Sun?",
          ar: "أي دولة تُعرف بأرض الشمس المشرقة؟"
        },
        correctAnswer: {
          en: "Japan",
          ar: "اليابان"
        },
        wrongAnswers: [
          { en: "China", ar: "الصين" },
          { en: "South Korea", ar: "كوريا الجنوبية" },
          { en: "Thailand", ar: "تايلاند" }
        ]
      },
      {
        question: {
          en: "What is the freezing point of water in °C?",
          ar: "ما هي درجة تجمد الماء بـ °م؟"
        },
        correctAnswer: {
          en: "0",
          ar: "0"
        },
        wrongAnswers: [
          { en: "5", ar: "5" },
          { en: "-5", ar: "-5" },
          { en: "10", ar: "10" }
        ]
      },
      {
        question: {
          en: "How many sides does a hexagon have?",
          ar: "كم عدد أضلاع السداسي؟"
        },
        correctAnswer: {
          en: "6",
          ar: "6"
        },
        wrongAnswers: [
          { en: "5", ar: "5" },
          { en: "7", ar: "7" },
          { en: "8", ar: "8" }
        ]
      },
      {
        question: {
          en: "Which planet has the most moons?",
          ar: "أي كوكب لديه أكبر عدد من الأقمار؟"
        },
        correctAnswer: {
          en: "Saturn",
          ar: "زحل"
        },
        wrongAnswers: [
          { en: "Jupiter", ar: "المشتري" },
          { en: "Mars", ar: "المريخ" },
          { en: "Uranus", ar: "أورانوس" }
        ]
      },
      {
        question: {
          en: "Who invented the telephone?",
          ar: "من اخترع الهاتف؟"
        },
        correctAnswer: {
          en: "Alexander Graham Bell",
          ar: "ألكسندر جراهام بيل"
        },
        wrongAnswers: [
          { en: "Thomas Edison", ar: "توماس إديسون" },
          { en: "Nikola Tesla", ar: "نيكولا تسلا" },
          { en: "Guglielmo Marconi", ar: "جوليلمو ماركوني" }
        ]
      },
      {
        question: {
          en: "What is the largest desert in the world?",
          ar: "ما هو أكبر صحراء في العالم؟"
        },
        correctAnswer: {
          en: "Sahara",
          ar: "الصحراء الكبرى"
        },
        wrongAnswers: [
          { en: "Gobi", ar: "صحراء جوبي" },
          { en: "Kalahari", ar: "صحراء كالاهاري" },
          { en: "Arabian", ar: "صحراء العرب" }
        ]
      },
      {
        question: {
          en: "What is the currency of the United Kingdom?",
          ar: "ما هي عملة المملكة المتحدة؟"
        },
        correctAnswer: {
          en: "Pound Sterling",
          ar: "الجنيه الإسترليني"
        },
        wrongAnswers: [
          { en: "Euro", ar: "اليورو" },
          { en: "Dollar", ar: "الدولار" },
          { en: "Franc", ar: "الفرنك" }
        ]
      },
      {
        question: {
          en: "What is the main language spoken in Brazil?",
          ar: "ما هي اللغة الرئيسية في البرازيل؟"
        },
        correctAnswer: {
          en: "Portuguese",
          ar: "البرتغالية"
        },
        wrongAnswers: [
          { en: "Spanish", ar: "الإسبانية" },
          { en: "English", ar: "الإنجليزية" },
          { en: "French", ar: "الفرنسية" }
        ]
      },
      {
        question: {
          en: "Which instrument has 88 keys?",
          ar: "أي آلة موسيقية تحتوي على 88 مفتاحاً؟"
        },
        correctAnswer: {
          en: "Piano",
          ar: "البيانو"
        },
        wrongAnswers: [
          { en: "Guitar", ar: "الجيتار" },
          { en: "Violin", ar: "الكمان" },
          { en: "Drum", ar: "الطبول" }
        ]
      },
      {
        question: {
          en: "What is the chemical formula for water?",
          ar: "ما هي الصيغة الكيميائية للماء؟"
        },
        correctAnswer: {
          en: "H₂O",
          ar: "H₂O"
        },
        wrongAnswers: [
          { en: "CO₂", ar: "CO₂" },
          { en: "O₂", ar: "O₂" },
          { en: "NaCl", ar: "NaCl" }
        ]
      }
    ];

    // Insert all questions into the database
    const result = await QuizQuestion.insertMany(questions);
    console.log(`Inserted ${result.length} questions.`);
    process.exit(0);
  } catch (error) {
    console.error('Error adding questions:', error);
    process.exit(1);
  }
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  addQuestions();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
