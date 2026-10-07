export type LoginLanguage = 'en' | 'ar';

export const LOGIN_LANGUAGE_KEY = 'alimanrouh-admin-lang';

type LoginCopy = {
  language: string;
  brand: string;
  admin: string;
  intro: string;
  features: Array<{ title: string; description: string }>;
  signInEyebrow: string;
  welcome: string;
  formIntro: string;
  email: string;
  password: string;
  passwordPlaceholder: string;
  showPassword: string;
  hidePassword: string;
  signingIn: string;
  signIn: string;
  tokenMissing: string;
  signedIn: string;
  invalidCredentials: string;
  notice: string;
};

export const loginCopy: Record<LoginLanguage, LoginCopy> = {
  en: {
    language: 'Language',
    brand: 'Al Iman Rouh',
    admin: 'Admin',
    intro:
      'Packages, bookings, and customer messages stay in one workspace for the team.',
    features: [
      {
        title: 'Packages',
        description: 'Publish Hajj and Umrah packages for the website.',
      },
      {
        title: 'Bookings',
        description: 'Review requests and update their status.',
      },
      {
        title: 'Access control',
        description: 'Restricted to authorized admin accounts.',
      },
    ],
    signInEyebrow: 'Sign in',
    welcome: 'Welcome back',
    formIntro: 'Enter your work email and password to open the admin panel.',
    email: 'Email',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    signingIn: 'Signing in...',
    signIn: 'Sign in',
    tokenMissing: 'Token not found',
    signedIn: 'Logged in successfully',
    invalidCredentials: 'Invalid email or password',
    notice:
      'This panel is for authorized personnel. Activity on this account is recorded.',
  },
  ar: {
    language: 'اللغة',
    brand: 'الإيمان روح',
    admin: 'لوحة الإدارة',
    intro: 'الباقات والحجوزات ورسائل العملاء في مساحة عمل واحدة للفريق.',
    features: [
      {
        title: 'الباقات',
        description: 'انشر باقات الحج والعمرة على الموقع.',
      },
      {
        title: 'الحجوزات',
        description: 'راجع الطلبات وحدّث حالتها.',
      },
      {
        title: 'التحكم بالوصول',
        description: 'مخصص لحسابات المشرفين المصرّح لهم.',
      },
    ],
    signInEyebrow: 'تسجيل الدخول',
    welcome: 'أهلاً بعودتك',
    formIntro: 'أدخل بريد العمل وكلمة المرور لفتح لوحة الإدارة.',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    passwordPlaceholder: 'أدخل كلمة المرور',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
    signingIn: 'جارٍ تسجيل الدخول...',
    signIn: 'تسجيل الدخول',
    tokenMissing: 'لم يتم العثور على الرمز',
    signedIn: 'تم تسجيل الدخول بنجاح',
    invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    notice:
      'هذه اللوحة مخصصة للموظفين المصرّح لهم. يتم تسجيل النشاط على هذا الحساب.',
  },
};

export function readLoginLanguage(): LoginLanguage {
  const saved = localStorage.getItem(LOGIN_LANGUAGE_KEY);
  return saved === 'ar' ? 'ar' : 'en';
}
