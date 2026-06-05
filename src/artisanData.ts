export interface ArtisanProfile {
  nickname: string;
  title: string;
  avatar: string;
  levelFiligree: number;
  levelEnamel: number;
  completedCount: number;
  followersCount: number;
  email: string;
}

export const SHARED_ARTISAN_PROFILES: Record<string, ArtisanProfile> = {
  '林渊': {
    nickname: '林渊',
    title: '国家级非物质文化遗产景泰蓝技艺传承人',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkBJiH8wE8aLEElDa6dHlO9bZelJA0mz2jgWv_0eZ7l1_pQKAslgEhj35RDiPtgHbR4VsaU0YUlMmqo30QDkIO1a5t_FBO6pAgPSZBS6ph0T1ZJ7xlQBHL5dM4x_OFi5SuP2Ea1dJ5ham07dVXo73i18S0f2ZmvDENTSxe7dtSc3vFj-jHplEhE2T1D-pzuXJrg-r5SmNkecV8YsXZurtSLvTf_Y9HjRxz3tTt7iAJEpZladtZ1qQLRBbt2RC0TSobCMrCxx1K_Rw',
    levelFiligree: 8,
    levelEnamel: 5,
    completedCount: 42,
    followersCount: 12,
    email: 'linyuan@cloisonne.com'
  },
  '李大师': {
    nickname: '李大师',
    title: '特级景泰蓝微雕宗师 · 珐琅非遗守护人',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLZLlFQVRIGeYDlDqKubd0QoSOhZY1Uy5mXVc_w6gdJg-8JPhya87HgceDiBRCDUZJkNJBPljaEq9-DEtPRWGlW8sjM3GETsXp4KXQ72uwMgwYixpimtbbHfP6pLZ4sJrVgZwz5MJ-vM-q2Sjs4jWG29Qa8GnPeiYygDI9ODu-mrzDmRVo1WaFGJYyT9CyoVUpc3eTm5tAq8I1aqtLV9ZvaZ9GDeF3ryWPSNuB7QqcqutYGrMflio-mWIxI4v9IDsUPRJMnXmnE2U',
    levelFiligree: 10,
    levelEnamel: 9,
    completedCount: 156,
    followersCount: 12400,
    email: 'limaster@cloisonne.com'
  },
  '王匠人': {
    nickname: '王匠人',
    title: '宫廷点蓝大漆技艺第五代传人 · 色彩美学专家',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkBJiH8wE8aLEElDa6dHlO9bZelJA0mz2jgWv_0eZ7l1_pQKAslgEhj35RDiPtgHbR4VsaU0YUlMmqo30QDkIO1a5t_FBO6pAgPSZBS6ph0T1ZJ7xlQBHL5dM4x_OFi5SuP2Ea1dJ5ham07dVXo73i18S0f2ZmvDENTSxe7dtSc3vFj-jHplEhE2T1D-pzuXJrg-r5SmNkecV8YsXZurtSLvTf_Y9HjRxz3tTt7iAJEpZladtZ1qQLRBbt2RC0TSobCMrCxx1K_Rw',
    levelFiligree: 7,
    levelEnamel: 10,
    completedCount: 94,
    followersCount: 8800,
    email: 'wang@cloisonne.com'
  },
  '张工': {
    nickname: '张工',
    title: '非物质文化遗产新锐艺术名家 · 现代彩琅探索者',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCqybxNWgIk_xz_fe2E9CWN7Deuze3q1KsbhQogs_7L-KNK9SsuqLUlpiDyBPr-p0-aOPWDPHf_pT8_4PmO91oZu7wHvbojqW_1qO2e5PjZEnZnAT4Lik_IL0m5uB8P2ip7k-SsIUu7AIh2EaJOs4qwq-llR7no_vGhVvaxXQaghpu0F_u43woi_kPMyPDzgdUqzbnm3ImyDyvx8x7MTQxHrb0Tvnw8Tnadxg0Br0OzdJAK45YXATvConeteX9gRE5V1nSqRfYHaM',
    levelFiligree: 9,
    levelEnamel: 8,
    completedCount: 68,
    followersCount: 5200,
    email: 'zhang@cloisonne.com'
  },
  '宫廷造办处': {
    nickname: '宫廷造办处',
    title: '清宫造办处皇家御制珐琅工艺传承保护中心',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-Ol44CDPyaZRvMVBpo7hM_eudPy5BbY06tr_4qhlzxbppYmHtoxeyfIkUQLblR-01QVHt9oIeNJsZ-CsZjFgZznvJW-0ZugAQ6KbSohuMDFIo1As_QWc-i1BdUN0Nz9EcKGeJA-A_h8aQLuSzFkjKiBnqXcscKLJpmdkanH7v9qkcB03DcwDsU_MguXpvABn1ckdV6ryjxhTuvRYkFZgCh0RV7iEyFVRCuVNRYK7g9XqRYDpy8jrtne_z82sHBJZt9cRmMw7xboQ',
    levelFiligree: 10,
    levelEnamel: 10,
    completedCount: 850,
    followersCount: 154000,
    email: 'palace@cloisonne-museum.org'
  },
  '陆华堂': {
    nickname: '陆华堂',
    title: '故宫博物院特聘文物修复专家 · 古法珐琅顾问',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkBJiH8wE8aLEElDa6dHlO9bZelJA0mz2jgWv_0eZ7l1_pQKAslgEhj35RDiPtgHbR4VsaU0YUlMmqo30QDkIO1a5t_FBO6pAgPSZBS6ph0T1ZJ7xlQBHL5dM4x_OFi5SuP2Ea1dJ5ham07dVXo73i18S0f2ZmvDENTSxe7dtSc3vFj-jHplEhE2T1D-pzuXJrg-r5SmNkecV8YsXZurtSLvTf_Y9HjRxz3tTt7iAJEpZladtZ1qQLRBbt2RC0TSobCMrCxx1K_Rw',
    levelFiligree: 9,
    levelEnamel: 9,
    completedCount: 45,
    followersCount: 2800,
    email: 'luhuabang@gugong.org'
  },
  '王映雪': {
    nickname: '王映雪',
    title: '青年景泰蓝点蓝艺术家 · 独立工作室主理人',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-Ol44CDPyaZRvMVBpo7hM_eudPy5BbY06tr_4qhlzxbppYmHtoxeyfIkUQLblR-01QVHt9oIeNJsZ-CsZjFgZznvJW-0ZugAQ6KbSohuMDFIo1As_QWc-i1BdUN0Nz9EcKGeJA-A_h8aQLuSzFkjKiBnqXcscKLJpmdkanH7v9qkcB03DcwDsU_MguXpvABn1ckdV6ryjxhTuvRYkFZgCh0RV7iEyFVRCuVNRYK7g9XqRYDpy8jrtne_z82sHBJZt9cRmMw7xboQ',
    levelFiligree: 8,
    levelEnamel: 6,
    completedCount: 24,
    followersCount: 1200,
    email: 'yingxue@jingtaiban.com'
  },
  '张绍唐': {
    nickname: '张绍唐',
    title: '国家非物质文化遗产研究会常务理事 · 宫廷技艺大收藏家',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLZLlFQVRIGeYDlDqKubd0QoSOhZY1Uy5mXVc_w6gdJg-8JPhya87HgceDiBRCDUZJkNJBPljaEq9-DEtPRWGlW8sjM3GETsXp4KXQ72uwMgwYixpimtbbHfP6pLZ4sJrVgZwz5MJ-vM-q2Sjs4jWG29Qa8GnPeiYygDI9ODu-mrzDmRVo1WaFGJYyT9CyoVUpc3eTm5tAq8I1aqtLV9ZvaZ9GDeF3ryWPSNuB7QqcqutYGrMflio-mWIxI4v9IDsUPRJMnXmnE2U',
    levelFiligree: 7,
    levelEnamel: 8,
    completedCount: 38,
    followersCount: 4200,
    email: 'shaotang@heritage.org'
  },
  'Caroline Dupont': {
    nickname: 'Caroline Dupont',
    title: '法国巴黎装饰艺术博物馆高级文博策展人',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCqybxNWgIk_xz_fe2E9CWN7Deuze3q1KsbhQogs_7L-KNK9SsuqLUlpiDyBPr-p0-aOPWDPHf_pT8_4PmO91oZu7wHvbojqW_1qO2e5PjZEnZnAT4Lik_IL0m5uB8P2ip7k-SsIUu7AIh2EaJOs4qwq-llR7no_vGhVvaxXQaghpu0F_u43woi_kPMyPDzgdUqzbnm3ImyDyvx8x7MTQxHrb0Tvnw8Tnadxg0Br0OzdJAK45YXATvConeteX9gRE5V1nSqRfYHaM',
    levelFiligree: 5,
    levelEnamel: 7,
    completedCount: 15,
    followersCount: 9500,
    email: 'caroline@madparis.fr'
  },
  '李泽溪': {
    nickname: '李泽溪',
    title: '琢玉工艺名师 · 东方金碧流萤馆主理人',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    levelFiligree: 9,
    levelEnamel: 4,
    completedCount: 52,
    followersCount: 3100,
    email: 'zexi@jade.org'
  },
  '叶舒怀': {
    nickname: '叶舒怀',
    title: '国风金线苏绣传承学者 · 丝缕彩珐琅合作人',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    levelFiligree: 8,
    levelEnamel: 5,
    completedCount: 31,
    followersCount: 1900,
    email: 'shuhuai@embroidery-academy.org'
  },
  '陈怀安': {
    nickname: '陈怀安',
    title: '天青色柴窑烧制工艺技艺传承专家',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    levelFiligree: 4,
    levelEnamel: 9,
    completedCount: 40,
    followersCount: 2600,
    email: 'huaian@celadon.org'
  },
  '萧默林': {
    nickname: '萧默林',
    title: '知名古代工艺品收藏名家 · 国宝探秘发起人',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    levelFiligree: 6,
    levelEnamel: 6,
    completedCount: 18,
    followersCount: 8400,
    email: 'molin@connoisseur.com'
  },
  '顾听风': {
    nickname: '顾听风',
    title: '宜兴紫泥紫砂艺术美术名匠',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
    levelFiligree: 8,
    levelEnamel: 7,
    completedCount: 42,
    followersCount: 3100,
    email: 'tingfeng@zisha.org'
  },
  '温婉亭': {
    nickname: '温婉亭',
    title: '掐丝珐琅器物收藏研究协会会长',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    levelFiligree: 6,
    levelEnamel: 9,
    completedCount: 21,
    followersCount: 4300,
    email: 'wanting@cloisonne-assoc.org'
  },
  '赵云舒': {
    nickname: '赵云舒',
    title: '清华美院工艺美术系副教授',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    levelFiligree: 9,
    levelEnamel: 8,
    completedCount: 64,
    followersCount: 7800,
    email: 'yunshu@tsinghua.edu.cn'
  },
  '盛唐风华': {
    nickname: '盛唐风华',
    title: '千万级传统工艺文化独立自媒体人',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    levelFiligree: 7,
    levelEnamel: 7,
    completedCount: 120,
    followersCount: 420000,
    email: 'shengtang@culture-media.com'
  }
};
