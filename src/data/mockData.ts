import { User, BlogPost, Category } from '../types';
import { getRegisteredAuthors } from './authors';

// Initialize posts from localStorage or use default
const getStoredPosts = (): BlogPost[] => {
  const stored = localStorage.getItem('blogPosts');
  if (stored) {
    return JSON.parse(stored);
  }
  return defaultPosts;
};

const savePostsToStorage = (posts: BlogPost[]): void => {
  localStorage.setItem('blogPosts', JSON.stringify(posts));
};

const defaultPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Дигитална трансформација српске књижевности',
    content: `
      <p>У данашњем дигиталном добу, српска књижевност доживљава значајне промене. Писци се окрећу новим медијима и платформама за дељење својих дела.</p>
      
      <p>Електронске књиге постају све популарније међу читаоцима, што омогућава ауторима да директно допру до своје публике без посредника.</p>
      
      <p>Овај тренд не утиче само на дистрибуцију књига, већ и на сам процес писања и стварања књижевних дела.</p>
      
      <h3>Изазови и могућности</h3>
      <p>Главни изазов који стоји пред писцима је како да се прилагоде новом окружењу, а истовремено задрже квалитет и аутентичност својих дела.</p>
      
      <p>Са друге стране, дигитални медији пружају неслућене могућности за интерактивност и мултимедијалне садржаје.</p>
    `,
    excerpt: 'Анализа утицаја дигиталне револуције на српску књижевност и издаваштво.',
    slug: 'digitalna-transformacija-srpske-knjizevnosti',
    authorId: '1',
    category: 'Књижевност',
    tags: ['дигитализација', 'књижевност', 'технologija'],
    status: 'published',
    featuredImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    publishedAt: '2024-12-20T10:00:00Z',
    createdAt: '2024-12-19T15:30:00Z',
    updatedAt: '2024-12-20T09:45:00Z',
    viewCount: 234,
    isFeature: true
  },
  {
    id: '2',
    title: 'Савремене тенденције у српској поезији',
    content: `
      <p>Савремена српска поезија пролази кроз период интензивних промена и експериментисања.</p>
      
      <p>Млади песници трагају за новим изражајним средствима и темама које одговарају духу времена.</p>
      
      <p>Дигитални медији омогућавају песницима да истражују нове форме и начине представљања својих дела.</p>
      
      <h3>Главне карактеристике</h3>
      <p>Савремена поезија карактерише се већом слободом у избору тема и форми, као и отворенијим приступом различитим стиловима.</p>
      
      <p>Многи песници се окрећу урбаним темама и свакодневним искуствима, што чини поезију приступачнијом широј публици.</p>
    `,
    excerpt: 'Преглед актуелних токова и трендова у савременој српској поезији.',
    slug: 'savremene-tendencije-u-srpskoj-poeziji',
    authorId: '2',
    category: 'Књижевност',
    tags: ['поезија', 'савремена књижевност', 'трендови'],
    status: 'published',
    featuredImage: 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    publishedAt: '2024-12-19T14:00:00Z',
    createdAt: '2024-12-18T11:20:00Z',
    updatedAt: '2024-12-19T13:45:00Z',
    viewCount: 156,
    isFeature: false
  },
  {
    id: '3',
    title: 'Вештачка интелигенција и будућност писања',
    content: `
      <p>Развој вештачке интелигенције поставља нова питања о будућности писања и ствараштва.</p>
      
      <p>Алати за генерисање текста постају све софистициранији, што изазива дебате о улози аутора у креативном процесу.</p>
      
      <p>Ипак, људски елемент остаје незаменљив када је реч о емоцијама, искуству и аутентичном стваралаштву.</p>
      
      <h3>Нове могућности</h3>
      <p>AI алати могу да помогну писцима у истраживању, планирању и уређивању текстова.</p>
      
      <p>Важно је да се ова технологија користи као допунско средство, а не као замена за људску креативност.</p>
    `,
    excerpt: 'Размишљање о утицају вештачке интелигенције на процес писања и стварања садржаја.',
    slug: 'vestacka-inteligencija-i-buducnost-pisanja',
    authorId: '3',
    category: 'Технологија',
    tags: ['вештачка интелигенција', 'писање', 'будућност'],
    status: 'published',
    featuredImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    publishedAt: '2024-12-18T16:30:00Z',
    createdAt: '2024-12-17T09:15:00Z',
    updatedAt: '2024-12-18T16:00:00Z',
    viewCount: 189,
    isFeature: true
  },
  {
    id: '4',
    title: 'Културне манифестације у дигиталном добу',
    content: `
      <p>Пандемија је убрзала дигитализацију културних манифестација и променила начин на који публика конзумира културне садржаје.</p>
      
      <p>Виртуални фестивали, онлајн изложбе и стрим концерти постали су неизбежни део културног живота.</p>
      
      <p>Ова трансформација отвара нове могућности за уметнике и културне институције.</p>
      
      <h3>Предности дигитализације</h3>
      <p>Дигитални формат омогућава већу доступност културних садржаја и проширује публику.</p>
      
      <p>Интерактивност и мултимедијалност пружају нова искуства која нису могућа у традиционалним форматима.</p>
    `,
    excerpt: 'Анализа утицаја дигиталних технологија на културне манифестације и уметност.',
    slug: 'kulturne-manifestacije-u-digitalnom-dobu',
    authorId: '2',
    category: 'Култура',
    tags: ['дигитализација', 'култура', 'манифестације'],
    status: 'published',
    featuredImage: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    publishedAt: '2024-12-17T12:00:00Z',
    createdAt: '2024-12-16T14:45:00Z',
    updatedAt: '2024-12-17T11:30:00Z',
    viewCount: 142,
    isFeature: false
  }
];

// Export the posts with persistent storage
export const mockPosts: BlogPost[] = getStoredPosts();

export const addPost = (post: BlogPost): void => {
  const currentPosts = getStoredPosts();
  currentPosts.unshift(post); // Add to beginning of array
  savePostsToStorage(currentPosts);
  // Update the exported array
  mockPosts.length = 0;
  mockPosts.push(...currentPosts);
  
  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent('postsUpdated'));
};

export const updatePost = (postId: string, updatedPost: BlogPost): boolean => {
  const currentPosts = getStoredPosts();
  const index = currentPosts.findIndex(post => post.id === postId);
  if (index !== -1) {
    currentPosts[index] = updatedPost;
    savePostsToStorage(currentPosts);
    // Update the exported array
    mockPosts.length = 0;
    mockPosts.push(...currentPosts);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('postsUpdated'));
    return true;
  }
  return false;
};

export const deletePost = (postId: string): boolean => {
  const currentPosts = getStoredPosts();
  const index = currentPosts.findIndex(post => post.id === postId);
  if (index !== -1) {
    currentPosts.splice(index, 1);
    savePostsToStorage(currentPosts);
    // Update the exported array
    mockPosts.length = 0;
    mockPosts.push(...currentPosts);
    return true;
  }
  return false;
};

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Књижевност',
    slug: 'knjizevnost',
    description: 'Чланци о књижевности, књигама и писцима',
    postCount: 15
  },
  {
    id: '2',
    name: 'Култура',
    slug: 'kultura',
    description: 'Културни садржаји и дешавања',
    postCount: 12
  },
  {
    id: '3',
    name: 'Технологија',
    slug: 'tehnologija',
    description: 'Технолошке иновације и трендови',
    postCount: 8
  },
  {
    id: '4',
    name: 'Друштво',
    slug: 'drustvo',
    description: 'Друштвени коментари и анализе',
    postCount: 10
  }
];