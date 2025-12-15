import type { Food } from '@/types/food'

// Mock 음식 데이터 (실제로는 API에서 가져올 데이터)
export const mockFoods: Food[] = [
    // 밥류
    { id: '1', name: '백미밥', category: '밥류', servingSize: '1공기(210g)', calories: 310, carbs: 68, protein: 6, fat: 0.5, sugar: 0.1, sodium: 2 },
    { id: '2', name: '현미밥', category: '밥류', servingSize: '1공기(210g)', calories: 330, carbs: 70, protein: 7, fat: 2, sugar: 0.2, sodium: 3 },
    { id: '3', name: '잡곡밥', category: '밥류', servingSize: '1공기(210g)', calories: 320, carbs: 69, protein: 8, fat: 1.5, sugar: 0.3, sodium: 5 },

    // 육류
    { id: '4', name: '닭가슴살', category: '육류', servingSize: '100g', calories: 165, carbs: 0, protein: 31, fat: 3.6, sugar: 0, sodium: 74 },
    { id: '5', name: '소고기 등심', category: '육류', servingSize: '100g', calories: 250, carbs: 0, protein: 26, fat: 16, sugar: 0, sodium: 60 },
    { id: '6', name: '돼지고기 삼겹살', category: '육류', servingSize: '100g', calories: 331, carbs: 0, protein: 17, fat: 29, sugar: 0, sodium: 65 },

    // 채소류
    { id: '7', name: '브로콜리', category: '채소류', servingSize: '100g', calories: 34, carbs: 7, protein: 2.8, fat: 0.4, sugar: 1.7, sodium: 33 },
    { id: '8', name: '시금치', category: '채소류', servingSize: '100g', calories: 23, carbs: 3.6, protein: 2.9, fat: 0.4, sugar: 0.4, sodium: 79 },
    { id: '9', name: '양배추', category: '채소류', servingSize: '100g', calories: 25, carbs: 5.8, protein: 1.3, fat: 0.1, sugar: 3.2, sodium: 18 },
    { id: '10', name: '샐러드', category: '채소류', servingSize: '1접시(200g)', calories: 50, carbs: 10, protein: 3, fat: 0.5, sugar: 4, sodium: 30 },

    // 생선류
    { id: '11', name: '연어', category: '생선류', servingSize: '100g', calories: 208, carbs: 0, protein: 20, fat: 13, sugar: 0, sodium: 59 },
    { id: '12', name: '고등어', category: '생선류', servingSize: '100g', calories: 205, carbs: 0, protein: 19, fat: 14, sugar: 0, sodium: 90 },
    { id: '13', name: '참치 캔', category: '생선류', servingSize: '1캔(100g)', calories: 116, carbs: 0, protein: 26, fat: 0.8, sugar: 0, sodium: 320 },

    // 계란/유제품
    { id: '14', name: '계란', category: '계란/유제품', servingSize: '1개(60g)', calories: 90, carbs: 0.6, protein: 7.5, fat: 6, sugar: 0.6, sodium: 70 },
    { id: '15', name: '우유', category: '계란/유제품', servingSize: '1컵(200ml)', calories: 122, carbs: 9, protein: 6, fat: 6.4, sugar: 9, sodium: 90 },
    { id: '16', name: '그릭요거트', category: '계란/유제품', servingSize: '1개(170g)', calories: 100, carbs: 6, protein: 17, fat: 0.7, sugar: 4, sodium: 60 },

    // 과일류
    { id: '17', name: '사과', category: '과일류', servingSize: '1개(200g)', calories: 104, carbs: 28, protein: 0.5, fat: 0.3, sugar: 21, sodium: 2 },
    { id: '18', name: '바나나', category: '과일류', servingSize: '1개(120g)', calories: 105, carbs: 27, protein: 1.3, fat: 0.4, sugar: 14, sodium: 1 },
    { id: '19', name: '딸기', category: '과일류', servingSize: '100g', calories: 32, carbs: 7.7, protein: 0.7, fat: 0.3, sugar: 4.9, sodium: 1 },

    // 간식류
    { id: '20', name: '아몬드', category: '견과류', servingSize: '30g', calories: 170, carbs: 6, protein: 6, fat: 15, sugar: 1.2, sodium: 0 },
    { id: '21', name: '프로틴바', category: '간식류', servingSize: '1개(60g)', calories: 200, carbs: 20, protein: 20, fat: 7, sugar: 5, sodium: 180 },
    { id: '22', name: '다크초콜릿', category: '간식류', servingSize: '30g', calories: 170, carbs: 13, protein: 2, fat: 12, sugar: 10, sodium: 6 },

    // 면류
    { id: '23', name: '스파게티', category: '면류', servingSize: '1인분(80g)', calories: 280, carbs: 56, protein: 10, fat: 1.5, sugar: 2, sodium: 5 },
    { id: '24', name: '우동', category: '면류', servingSize: '1인분(200g)', calories: 260, carbs: 54, protein: 8, fat: 1, sugar: 3, sodium: 800 },
    { id: '25', name: '라면', category: '면류', servingSize: '1개(120g)', calories: 500, carbs: 70, protein: 10, fat: 20, sugar: 5, sodium: 1800 },

    // 두부/콩류
    { id: '26', name: '두부', category: '두부/콩류', servingSize: '1/3모(100g)', calories: 76, carbs: 1.9, protein: 8.5, fat: 4.2, sugar: 0.6, sodium: 7 },
    { id: '27', name: '병아리콩', category: '두부/콩류', servingSize: '100g', calories: 164, carbs: 27, protein: 9, fat: 2.6, sugar: 4.8, sodium: 7 },
    { id: '28', name: '렌틸콩', category: '두부/콩류', servingSize: '100g', calories: 116, carbs: 20, protein: 9, fat: 0.4, sugar: 1.8, sodium: 2 },

    // 빵류
    { id: '29', name: '식빵', category: '빵류', servingSize: '1장(30g)', calories: 80, carbs: 15, protein: 2.5, fat: 1, sugar: 2, sodium: 150 },
    { id: '30', name: '통밀빵', category: '빵류', servingSize: '1장(30g)', calories: 70, carbs: 13, protein: 3, fat: 1, sugar: 1.5, sodium: 130 },
    { id: '31', name: '베이글', category: '빵류', servingSize: '1개(90g)', calories: 245, carbs: 48, protein: 9, fat: 1.5, sugar: 5, sodium: 430 },
]

export const categories = [
    '밥류',
    '육류',
    '채소류',
    '생선류',
    '계란/유제품',
    '과일류',
    '간식류',
    '견과류',
    '면류',
    '두부/콩류',
    '빵류',
]
