
export const getDifficultyColor = (level: string) => {
  switch (level) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getImportanceColor = (importance: string) => {
  switch (importance) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const generateComprehensivePrompt = (documentContent: string) => {
  return `أنت خبير تعليمي متقدم متخصص في التحليل الشامل للمواد الدراسية. مهمتك هي تقديم تحليل متكامل ومتقدم للمستند التالي:

الغرض والأهداف المتقدمة:
- تحليل عميق للمفاهيم والنظريات
- تحديد مستويات الصعوبة للمفاهيم المختلفة
- تقدير الوقت المناسب للدراسة والمراجعة
- إنشاء أسئلة تطبيقية متنوعة
- تحديد المصطلحات الرئيسية مع تعريفاتها
- تحديد الأهداف التعليمية الواضحة
- تحليل الأخطاء الشائعة وكيفية تجنبها
- ربط الموضوع بمواضيع أخرى ذات صلة

المستند المراد تحليله:
---
${documentContent}
---

المطلوب تحليل شامل ومتقدم يتضمن:

1. ملخص رئيسي شامل ومركز (3-5 فقرات)
2. النقاط الرئيسية والمفاهيم الأساسية (5-10 نقاط)
3. خريطة ذهنية منظمة تربط بين المفاهيم
4. نصائح دراسية مخصصة
5. استراتيجيات الاستعداد للاختبارات
6. تحليل المفاهيم الصعبة مع مستوى الصعوبة
7. تقدير الوقت المطلوب للدراسة والمراجعة والممارسة
8. مواضيع ذات صلة للتوسع
9. أسئلة تطبيقية متنوعة (اختيار متعدد، مقالية، إجابات قصيرة)
10. قاموس المصطلحات الرئيسية
11. الأهداف التعليمية الواضحة
12. الأخطاء الشائعة وكيفية تجنبها

تنسيق الإجابة بـ JSON:
{
  "mainSummary": "الملخص الرئيسي الشامل هنا",
  "keyPoints": ["النقطة الأولى", "النقطة الثانية", ...],
  "mindMap": {
    "topic": "الموضوع الرئيسي",
    "branches": [
      {
        "title": "عنوان الفرع",
        "points": ["نقطة 1", "نقطة 2"],
        "note": "ملحوظة لتذكر المعلومة الأساسية"
      }
    ]
  },
  "studyTips": ["نصيحة دراسية 1", "نصيحة دراسية 2", ...],
  "examPreparation": ["استراتيجية اختبار 1", "استراتيجية اختبار 2", ...],
  "difficultyConcepts": [
    {
      "concept": "اسم المفهوم",
      "explanation": "شرح مبسط للمفهوم",
      "level": "easy|medium|hard"
    }
  ],
  "timeEstimate": {
    "studyTime": "الوقت المقدر للدراسة الأولى",
    "reviewTime": "الوقت المقدر للمراجعة",
    "practiceTime": "الوقت المقدر للممارسة"
  },
  "relatedTopics": ["موضوع ذو صلة 1", "موضوع ذو صلة 2", ...],
  "practiceQuestions": [
    {
      "question": "نص السؤال",
      "type": "multiple-choice|essay|short-answer",
      "difficulty": "easy|medium|hard"
    }
  ],
  "keyTermsGlossary": [
    {
      "term": "المصطلح",
      "definition": "تعريف المصطلح",
      "importance": "high|medium|low"
    }
  ],
  "learningObjectives": ["الهدف التعليمي 1", "الهدف التعليمي 2", ...],
  "commonMistakes": [
    {
      "mistake": "الخطأ الشائع",
      "correction": "التصحيح",
      "tip": "نصيحة لتجنب الخطأ"
    }
  ]
}

تأكد من:
- استخدام لغة احترافية وموجزة باللغة العربية
- تنويع مستويات الصعوبة في الأسئلة والمفاهيم
- تقديم تقديرات زمنية واقعية
- ربط المواضيع ببعضها البعض
- التركيز على الجوانب العملية والتطبيقية`;
};

export const generateDownloadContent = (summaryData: any, fileName: string) => {
  return `
تحليل شامل متقدم للمستند: ${fileName}
=====================================

الملخص الرئيسي:
${summaryData.mainSummary}

النقاط الرئيسية:
${summaryData.keyPoints.map((point: string, i: number) => `${i + 1}. ${point}`).join('\n')}

الأهداف التعليمية:
${summaryData.learningObjectives?.map((objective: string, i: number) => `${i + 1}. ${objective}`).join('\n') || 'غير متوفر'}

تحليل المفاهيم الصعبة:
${summaryData.difficultyConcepts?.map((concept: any, i: number) => `
${i + 1}. ${concept.concept} (مستوى: ${concept.level})
   الشرح: ${concept.explanation}
`).join('\n') || 'غير متوفر'}

تقدير الوقت:
- وقت الدراسة الأولى: ${summaryData.timeEstimate?.studyTime || 'غير محدد'}
- وقت المراجعة: ${summaryData.timeEstimate?.reviewTime || 'غير محدد'}
- وقت الممارسة: ${summaryData.timeEstimate?.practiceTime || 'غير محدد'}

الخريطة الذهنية:
الموضوع الرئيسي: ${summaryData.mindMap.topic}

الفروع:
${summaryData.mindMap.branches.map((branch: any, i: number) => `
${i + 1}. ${branch.title}
   النقاط:
   ${branch.points.map((point: string) => `   - ${point}`).join('\n')}
   ملحوظة: ${branch.note}
`).join('\n')}

قاموس المصطلحات:
${summaryData.keyTermsGlossary?.map((term: any, i: number) => `
${i + 1}. ${term.term} (أهمية: ${term.importance})
   التعريف: ${term.definition}
`).join('\n') || 'غير متوفر'}

أسئلة تطبيقية:
${summaryData.practiceQuestions?.map((q: any, i: number) => `
${i + 1}. ${q.question}
   النوع: ${q.type} | المستوى: ${q.difficulty}
`).join('\n') || 'غير متوفر'}

الأخطاء الشائعة:
${summaryData.commonMistakes?.map((mistake: any, i: number) => `
${i + 1}. الخطأ: ${mistake.mistake}
   التصحيح: ${mistake.correction}
   النصيحة: ${mistake.tip}
`).join('\n') || 'غير متوفر'}

النصائح الدراسية:
${summaryData.studyTips.map((tip: string, i: number) => `${i + 1}. ${tip}`).join('\n')}

استراتيجيات الاستعداد للاختبارات:
${summaryData.examPreparation.map((strategy: string, i: number) => `${i + 1}. ${strategy}`).join('\n')}

مواضيع ذات صلة:
${summaryData.relatedTopics?.map((topic: string, i: number) => `${i + 1}. ${topic}`).join('\n') || 'غير متوفر'}

تم إنشاء هذا التحليل الشامل باستخدام الذكاء الاصطناعي Gemini المتقدم
    `;
};
