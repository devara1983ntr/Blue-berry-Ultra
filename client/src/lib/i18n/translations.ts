export type Language = 'en' | 'hi' | 'od' | 'ta' | 'te';

export const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  od: 'ଓଡ଼ିଆ',
  ta: 'தமிழ்',
  te: 'తెలుగు'
};

export type TranslationKeys = {
  common: {
    home: string;
    search: string;
    categories: string;
    trending: string;
    recent: string;
    favorites: string;
    history: string;
    watchLater: string;
    notifications: string;
    settings: string;
    login: string;
    register: string;
    logout: string;
    profile: string;
    language: string;
    all: string;
    videos: string;
    loading: string;
    error: string;
    retry: string;
    cancel: string;
    save: string;
    delete: string;
    confirm: string;
    next: string;
    previous: string;
    page: string;
    of: string;
    noResults: string;
    searchPlaceholder: string;
  };
  ageVerification: {
    title: string;
    warning: string;
    warningDetails: string;
    confirmButton: string;
    exitButton: string;
    disclaimer: string;
  };
  auth: {
    loginTitle: string;
    registerTitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    forgotPassword: string;
    rememberMe: string;
    loginButton: string;
    registerButton: string;
    noAccount: string;
    hasAccount: string;
    resetPassword: string;
    sendResetLink: string;
    backToLogin: string;
    passwordMismatch: string;
    invalidEmail: string;
    weakPassword: string;
  };
  cookies: {
    title: string;
    message: string;
    acceptAll: string;
    acceptNecessary: string;
    customize: string;
    privacyPolicy: string;
  };
  legal: {
    privacyPolicy: string;
    termsOfService: string;
    contactSupport: string;
    aboutUs: string;
    developers: string;
  };
  video: {
    views: string;
    likes: string;
    dislikes: string;
    duration: string;
    addToWatchLater: string;
    removeFromWatchLater: string;
    addToFavorites: string;
    removeFromFavorites: string;
    share: string;
    report: string;
    relatedVideos: string;
    comments: string;
    tags: string;
    category: string;
    actors: string;
  };
  errors: {
    pageNotFound: string;
    somethingWentWrong: string;
    noConnection: string;
    tryAgain: string;
    goHome: string;
    offline: string;
    offlineMessage: string;
  };
  settings: {
    title: string;
    appearance: string;
    darkMode: string;
    autoplay: string;
    quality: string;
    notifications: string;
    pushNotifications: string;
    emailNotifications: string;
    privacy: string;
    clearHistory: string;
    deleteAccount: string;
    languageSettings: string;
  };
  guest: {
    limitTitle: string;
    limitMessage: string;
    videosRemaining: string;
    loginForMore: string;
  };
  onboarding: {
    welcome: string;
    welcomeMessage: string;
    step1Title: string;
    step1Message: string;
    step2Title: string;
    step2Message: string;
    step3Title: string;
    step3Message: string;
    getStarted: string;
    skip: string;
  };
};

export const translations: Record<Language, TranslationKeys> = {
  en: {
    common: {
      home: 'Home',
      search: 'Search',
      categories: 'Categories',
      trending: 'Trending',
      recent: 'Recent',
      favorites: 'Favorites',
      history: 'History',
      watchLater: 'Watch Later',
      notifications: 'Notifications',
      settings: 'Settings',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      profile: 'Profile',
      language: 'Language',
      all: 'All',
      videos: 'Videos',
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      confirm: 'Confirm',
      next: 'Next',
      previous: 'Previous',
      page: 'Page',
      of: 'of',
      noResults: 'No results found',
      searchPlaceholder: 'Search videos...',
    },
    ageVerification: {
      title: 'Age Verification Required',
      warning: 'This website contains adult content',
      warningDetails: 'You must be 18 years or older to access this website. By clicking "I am 18+" you confirm that you are of legal age to view adult content in your jurisdiction.',
      confirmButton: 'I am 18+',
      exitButton: 'Exit',
      disclaimer: 'All content on this website is intended for adults only. By entering, you accept our Terms of Service and Privacy Policy.',
    },
    auth: {
      loginTitle: 'Welcome Back',
      registerTitle: 'Create Account',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      username: 'Username',
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember Me',
      loginButton: 'Sign In',
      registerButton: 'Create Account',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      resetPassword: 'Reset Password',
      sendResetLink: 'Send Reset Link',
      backToLogin: 'Back to Login',
      passwordMismatch: 'Passwords do not match',
      invalidEmail: 'Please enter a valid email',
      weakPassword: 'Password must be at least 8 characters',
    },
    cookies: {
      title: 'Cookie Consent',
      message: 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
      acceptAll: 'Accept All',
      acceptNecessary: 'Necessary Only',
      customize: 'Customize',
      privacyPolicy: 'Privacy Policy',
    },
    legal: {
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      contactSupport: 'Contact Support',
      aboutUs: 'About Us',
      developers: 'Developers',
    },
    video: {
      views: 'views',
      likes: 'likes',
      dislikes: 'dislikes',
      duration: 'Duration',
      addToWatchLater: 'Add to Watch Later',
      removeFromWatchLater: 'Remove from Watch Later',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
      share: 'Share',
      report: 'Report',
      relatedVideos: 'Related Videos',
      comments: 'Comments',
      tags: 'Tags',
      category: 'Category',
      actors: 'Actors',
    },
    errors: {
      pageNotFound: 'Page Not Found',
      somethingWentWrong: 'Something went wrong',
      noConnection: 'No Internet Connection',
      tryAgain: 'Try Again',
      goHome: 'Go Home',
      offline: 'You are offline',
      offlineMessage: 'Please check your internet connection and try again.',
    },
    settings: {
      title: 'Settings',
      appearance: 'Appearance',
      darkMode: 'Dark Mode',
      autoplay: 'Autoplay Videos',
      quality: 'Video Quality',
      notifications: 'Notifications',
      pushNotifications: 'Push Notifications',
      emailNotifications: 'Email Notifications',
      privacy: 'Privacy',
      clearHistory: 'Clear Watch History',
      deleteAccount: 'Delete Account',
      languageSettings: 'Language Settings',
    },
    guest: {
      limitTitle: 'Guest Limit Reached',
      limitMessage: 'You have reached the maximum number of videos for guest users.',
      videosRemaining: 'Videos remaining',
      loginForMore: 'Login or register for unlimited access',
    },
    onboarding: {
      welcome: 'Welcome to Blueberry',
      welcomeMessage: 'Your premium streaming experience awaits',
      step1Title: 'Discover Content',
      step1Message: 'Browse thousands of videos across multiple categories',
      step2Title: 'Create Playlists',
      step2Message: 'Save your favorites and create watch later lists',
      step3Title: 'Personalized Experience',
      step3Message: 'Get recommendations based on your preferences',
      getStarted: 'Get Started',
      skip: 'Skip',
    },
  },
  hi: {
    common: {
      home: 'होम',
      search: 'खोजें',
      categories: 'श्रेणियाँ',
      trending: 'ट्रेंडिंग',
      recent: 'हाल का',
      favorites: 'पसंदीदा',
      history: 'इतिहास',
      watchLater: 'बाद में देखें',
      notifications: 'सूचनाएं',
      settings: 'सेटिंग्स',
      login: 'लॉगिन',
      register: 'रजिस्टर',
      logout: 'लॉगआउट',
      profile: 'प्रोफाइल',
      language: 'भाषा',
      all: 'सभी',
      videos: 'वीडियो',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      retry: 'पुनः प्रयास करें',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      confirm: 'पुष्टि करें',
      next: 'अगला',
      previous: 'पिछला',
      page: 'पृष्ठ',
      of: 'का',
      noResults: 'कोई परिणाम नहीं मिला',
      searchPlaceholder: 'वीडियो खोजें...',
    },
    ageVerification: {
      title: 'आयु सत्यापन आवश्यक',
      warning: 'इस वेबसाइट में वयस्क सामग्री है',
      warningDetails: 'इस वेबसाइट तक पहुंचने के लिए आपकी आयु 18 वर्ष या उससे अधिक होनी चाहिए। "मैं 18+ हूं" पर क्लिक करके आप पुष्टि करते हैं कि आप अपने क्षेत्राधिकार में वयस्क सामग्री देखने की कानूनी आयु के हैं।',
      confirmButton: 'मैं 18+ हूं',
      exitButton: 'बाहर निकलें',
      disclaimer: 'इस वेबसाइट पर सभी सामग्री केवल वयस्कों के लिए है। प्रवेश करके, आप हमारी सेवा की शर्तें और गोपनीयता नीति स्वीकार करते हैं।',
    },
    auth: {
      loginTitle: 'वापसी पर स्वागत है',
      registerTitle: 'खाता बनाएं',
      email: 'ईमेल',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      username: 'उपयोगकर्ता नाम',
      forgotPassword: 'पासवर्ड भूल गए?',
      rememberMe: 'मुझे याद रखें',
      loginButton: 'साइन इन करें',
      registerButton: 'खाता बनाएं',
      noAccount: 'खाता नहीं है?',
      hasAccount: 'पहले से खाता है?',
      resetPassword: 'पासवर्ड रीसेट करें',
      sendResetLink: 'रीसेट लिंक भेजें',
      backToLogin: 'लॉगिन पर वापस जाएं',
      passwordMismatch: 'पासवर्ड मेल नहीं खाते',
      invalidEmail: 'कृपया एक वैध ईमेल दर्ज करें',
      weakPassword: 'पासवर्ड कम से कम 8 अक्षरों का होना चाहिए',
    },
    cookies: {
      title: 'कुकी सहमति',
      message: 'हम आपके ब्राउज़िंग अनुभव को बेहतर बनाने, व्यक्तिगत सामग्री प्रदान करने और हमारे ट्रैफ़िक का विश्लेषण करने के लिए कुकीज़ का उपयोग करते हैं।',
      acceptAll: 'सभी स्वीकार करें',
      acceptNecessary: 'केवल आवश्यक',
      customize: 'अनुकूलित करें',
      privacyPolicy: 'गोपनीयता नीति',
    },
    legal: {
      privacyPolicy: 'गोपनीयता नीति',
      termsOfService: 'सेवा की शर्तें',
      contactSupport: 'सहायता से संपर्क करें',
      aboutUs: 'हमारे बारे में',
      developers: 'डेवलपर्स',
    },
    video: {
      views: 'दृश्य',
      likes: 'पसंद',
      dislikes: 'नापसंद',
      duration: 'अवधि',
      addToWatchLater: 'बाद में देखें में जोड़ें',
      removeFromWatchLater: 'बाद में देखें से हटाएं',
      addToFavorites: 'पसंदीदा में जोड़ें',
      removeFromFavorites: 'पसंदीदा से हटाएं',
      share: 'साझा करें',
      report: 'रिपोर्ट करें',
      relatedVideos: 'संबंधित वीडियो',
      comments: 'टिप्पणियाँ',
      tags: 'टैग',
      category: 'श्रेणी',
      actors: 'कलाकार',
    },
    errors: {
      pageNotFound: 'पृष्ठ नहीं मिला',
      somethingWentWrong: 'कुछ गलत हो गया',
      noConnection: 'कोई इंटरनेट कनेक्शन नहीं',
      tryAgain: 'पुनः प्रयास करें',
      goHome: 'होम जाएं',
      offline: 'आप ऑफ़लाइन हैं',
      offlineMessage: 'कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।',
    },
    settings: {
      title: 'सेटिंग्स',
      appearance: 'दिखावट',
      darkMode: 'डार्क मोड',
      autoplay: 'ऑटोप्ले वीडियो',
      quality: 'वीडियो गुणवत्ता',
      notifications: 'सूचनाएं',
      pushNotifications: 'पुश सूचनाएं',
      emailNotifications: 'ईमेल सूचनाएं',
      privacy: 'गोपनीयता',
      clearHistory: 'देखने का इतिहास साफ़ करें',
      deleteAccount: 'खाता हटाएं',
      languageSettings: 'भाषा सेटिंग्स',
    },
    guest: {
      limitTitle: 'अतिथि सीमा पहुंच गई',
      limitMessage: 'आप अतिथि उपयोगकर्ताओं के लिए अधिकतम वीडियो संख्या तक पहुंच गए हैं।',
      videosRemaining: 'शेष वीडियो',
      loginForMore: 'असीमित पहुंच के लिए लॉगिन या रजिस्टर करें',
    },
    onboarding: {
      welcome: 'ब्लूबेरी में आपका स्वागत है',
      welcomeMessage: 'आपका प्रीमियम स्ट्रीमिंग अनुभव इंतजार कर रहा है',
      step1Title: 'सामग्री खोजें',
      step1Message: 'कई श्रेणियों में हजारों वीडियो ब्राउज़ करें',
      step2Title: 'प्लेलिस्ट बनाएं',
      step2Message: 'अपने पसंदीदा सहेजें और बाद में देखने की सूची बनाएं',
      step3Title: 'व्यक्तिगत अनुभव',
      step3Message: 'अपनी प्राथमिकताओं के आधार पर सिफारिशें प्राप्त करें',
      getStarted: 'शुरू करें',
      skip: 'छोड़ें',
    },
  },
  od: {
    common: {
      home: 'ହୋମ',
      search: 'ସନ୍ଧାନ',
      categories: 'ବର୍ଗ',
      trending: 'ଟ୍ରେଣ୍ଡିଂ',
      recent: 'ସାମ୍ପ୍ରତିକ',
      favorites: 'ପସନ୍ଦ',
      history: 'ଇତିହାସ',
      watchLater: 'ପରେ ଦେଖନ୍ତୁ',
      notifications: 'ବିଜ୍ଞପ୍ତି',
      settings: 'ସେଟିଂସ',
      login: 'ଲଗଇନ',
      register: 'ରେଜିଷ୍ଟର',
      logout: 'ଲଗଆଉଟ',
      profile: 'ପ୍ରୋଫାଇଲ',
      language: 'ଭାଷା',
      all: 'ସମସ୍ତ',
      videos: 'ଭିଡିଓ',
      loading: 'ଲୋଡ ହେଉଛି...',
      error: 'ତ୍ରୁଟି',
      retry: 'ପୁନଃ ଚେଷ୍ଟା କରନ୍ତୁ',
      cancel: 'ବାତିଲ',
      save: 'ସେଭ',
      delete: 'ଡିଲିଟ',
      confirm: 'ନିଶ୍ଚିତ',
      next: 'ପରବର୍ତ୍ତୀ',
      previous: 'ପୂର୍ବବର୍ତ୍ତୀ',
      page: 'ପୃଷ୍ଠା',
      of: 'ର',
      noResults: 'କୌଣସି ଫଳାଫଳ ମିଳିଲା ନାହିଁ',
      searchPlaceholder: 'ଭିଡିଓ ଖୋଜନ୍ତୁ...',
    },
    ageVerification: {
      title: 'ବୟସ ଯାଞ୍ଚ ଆବଶ୍ୟକ',
      warning: 'ଏହି ୱେବସାଇଟରେ ବୟସ୍କ ବିଷୟବସ୍ତୁ ରହିଛି',
      warningDetails: 'ଏହି ୱେବସାଇଟ ଆକ୍ସେସ କରିବାକୁ ଆପଣଙ୍କ ବୟସ 18 ବର୍ଷ ବା ତଦୁର୍ଦ୍ଧ ହେବା ଆବଶ୍ୟକ। "ମୁଁ 18+" କ୍ଲିକ କରି ଆପଣ ନିଶ୍ଚିତ କରୁଛନ୍ତି ଯେ ଆପଣ ଆପଣଙ୍କ କ୍ଷେତ୍ରାଧିକାରରେ ବୟସ୍କ ବିଷୟବସ୍ତୁ ଦେଖିବାର ଆଇନଗତ ବୟସର ଅଟନ୍ତି।',
      confirmButton: 'ମୁଁ 18+',
      exitButton: 'ବାହାରକୁ ଯାଆନ୍ତୁ',
      disclaimer: 'ଏହି ୱେବସାଇଟର ସମସ୍ତ ବିଷୟବସ୍ତୁ କେବଳ ବୟସ୍କମାନଙ୍କ ପାଇଁ। ପ୍ରବେଶ କରି, ଆପଣ ଆମର ସେବା ସର୍ତ୍ତାବଳୀ ଏବଂ ଗୋପନୀୟତା ନୀତି ଗ୍ରହଣ କରନ୍ତି।',
    },
    auth: {
      loginTitle: 'ପୁଣି ସ୍ୱାଗତ',
      registerTitle: 'ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ',
      email: 'ଇମେଲ',
      password: 'ପାସୱାର୍ଡ',
      confirmPassword: 'ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ',
      username: 'ୟୁଜରନେମ',
      forgotPassword: 'ପାସୱାର୍ଡ ଭୁଲିଗଲେ?',
      rememberMe: 'ମୋତେ ମନେ ରଖନ୍ତୁ',
      loginButton: 'ସାଇନ ଇନ',
      registerButton: 'ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ',
      noAccount: 'ଖାତା ନାହିଁ?',
      hasAccount: 'ପୂର୍ବରୁ ଖାତା ଅଛି?',
      resetPassword: 'ପାସୱାର୍ଡ ରିସେଟ କରନ୍ତୁ',
      sendResetLink: 'ରିସେଟ ଲିଙ୍କ ପଠାନ୍ତୁ',
      backToLogin: 'ଲଗଇନକୁ ଫେରନ୍ତୁ',
      passwordMismatch: 'ପାସୱାର୍ଡ ମେଳ ଖାଉ ନାହିଁ',
      invalidEmail: 'ଏକ ବୈଧ ଇମେଲ ଦିଅନ୍ତୁ',
      weakPassword: 'ପାସୱାର୍ଡ ଅତି କମରେ 8 ଅକ୍ଷର ହେବା ଉଚିତ',
    },
    cookies: {
      title: 'କୁକି ସମ୍ମତି',
      message: 'ଆମେ ଆପଣଙ୍କ ବ୍ରାଉଜିଂ ଅନୁଭୂତି ବଢାଇବା, ବ୍ୟକ୍ତିଗତ ବିଷୟବସ୍ତୁ ପ୍ରଦାନ କରିବା ଏବଂ ଆମର ଟ୍ରାଫିକ ବିଶ୍ଳେଷଣ କରିବାକୁ କୁକି ବ୍ୟବହାର କରୁ।',
      acceptAll: 'ସମସ୍ତ ଗ୍ରହଣ କରନ୍ତୁ',
      acceptNecessary: 'କେବଳ ଆବଶ୍ୟକ',
      customize: 'କଷ୍ଟମାଇଜ',
      privacyPolicy: 'ଗୋପନୀୟତା ନୀତି',
    },
    legal: {
      privacyPolicy: 'ଗୋପନୀୟତା ନୀତି',
      termsOfService: 'ସେବା ସର୍ତ୍ତାବଳୀ',
      contactSupport: 'ସହାୟତା ସହ ଯୋଗାଯୋଗ',
      aboutUs: 'ଆମ ବିଷୟରେ',
      developers: 'ଡେଭଲପର୍ସ',
    },
    video: {
      views: 'ଦେଖିଲେ',
      likes: 'ପସନ୍ଦ',
      dislikes: 'ନପସନ୍ଦ',
      duration: 'ଅବଧି',
      addToWatchLater: 'ପରେ ଦେଖିବାକୁ ଯୋଡନ୍ତୁ',
      removeFromWatchLater: 'ପରେ ଦେଖିବାରୁ ହଟାନ୍ତୁ',
      addToFavorites: 'ପସନ୍ଦରେ ଯୋଡନ୍ତୁ',
      removeFromFavorites: 'ପସନ୍ଦରୁ ହଟାନ୍ତୁ',
      share: 'ସେୟାର',
      report: 'ରିପୋର୍ଟ',
      relatedVideos: 'ସମ୍ପର୍କିତ ଭିଡିଓ',
      comments: 'ମନ୍ତବ୍ୟ',
      tags: 'ଟ୍ୟାଗ',
      category: 'ବର୍ଗ',
      actors: 'କଳାକାର',
    },
    errors: {
      pageNotFound: 'ପୃଷ୍ଠା ମିଳିଲା ନାହିଁ',
      somethingWentWrong: 'କିଛି ଭୁଲ ହୋଇଗଲା',
      noConnection: 'ଇଣ୍ଟରନେଟ ସଂଯୋଗ ନାହିଁ',
      tryAgain: 'ପୁନଃ ଚେଷ୍ଟା କରନ୍ତୁ',
      goHome: 'ହୋମକୁ ଯାଆନ୍ତୁ',
      offline: 'ଆପଣ ଅଫଲାଇନ ଅଛନ୍ତି',
      offlineMessage: 'ଦୟାକରି ଆପଣଙ୍କ ଇଣ୍ଟରନେଟ ସଂଯୋଗ ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ପୁନଃ ଚେଷ୍ଟା କରନ୍ତୁ।',
    },
    settings: {
      title: 'ସେଟିଂସ',
      appearance: 'ଦୃଶ୍ୟ',
      darkMode: 'ଡାର୍କ ମୋଡ',
      autoplay: 'ଅଟୋପ୍ଲେ ଭିଡିଓ',
      quality: 'ଭିଡିଓ ଗୁଣବତ୍ତା',
      notifications: 'ବିଜ୍ଞପ୍ତି',
      pushNotifications: 'ପୁଶ ବିଜ୍ଞପ୍ତି',
      emailNotifications: 'ଇମେଲ ବିଜ୍ଞପ୍ତି',
      privacy: 'ଗୋପନୀୟତା',
      clearHistory: 'ଦେଖିବା ଇତିହାସ ସଫା କରନ୍ତୁ',
      deleteAccount: 'ଖାତା ଡିଲିଟ କରନ୍ତୁ',
      languageSettings: 'ଭାଷା ସେଟିଂସ',
    },
    guest: {
      limitTitle: 'ଅତିଥି ସୀମା ପହଞ୍ଚିଗଲା',
      limitMessage: 'ଆପଣ ଅତିଥି ୟୁଜରମାନଙ୍କ ପାଇଁ ସର୍ବାଧିକ ଭିଡିଓ ସଂଖ୍ୟାରେ ପହଞ୍ଚିଛନ୍ତି।',
      videosRemaining: 'ଅବଶିଷ୍ଟ ଭିଡିଓ',
      loginForMore: 'ଅସୀମିତ ଆକ୍ସେସ ପାଇଁ ଲଗଇନ ବା ରେଜିଷ୍ଟର କରନ୍ତୁ',
    },
    onboarding: {
      welcome: 'ବ୍ଲୁବେରୀରେ ସ୍ୱାଗତ',
      welcomeMessage: 'ଆପଣଙ୍କ ପ୍ରିମିୟମ ଷ୍ଟ୍ରିମିଂ ଅନୁଭୂତି ଅପେକ୍ଷା କରୁଛି',
      step1Title: 'ବିଷୟବସ୍ତୁ ଖୋଜନ୍ତୁ',
      step1Message: 'ଅନେକ ବର୍ଗରେ ହଜାରେ ଭିଡିଓ ବ୍ରାଉଜ କରନ୍ତୁ',
      step2Title: 'ପ୍ଲେଲିଷ୍ଟ ସୃଷ୍ଟି କରନ୍ତୁ',
      step2Message: 'ଆପଣଙ୍କ ପସନ୍ଦ ସେଭ କରନ୍ତୁ ଏବଂ ପରେ ଦେଖିବା ତାଲିକା ସୃଷ୍ଟି କରନ୍ତୁ',
      step3Title: 'ବ୍ୟକ୍ତିଗତ ଅନୁଭୂତି',
      step3Message: 'ଆପଣଙ୍କ ପସନ୍ଦ ଅନୁସାରେ ସୁପାରିଶ ପାଆନ୍ତୁ',
      getStarted: 'ଆରମ୍ଭ କରନ୍ତୁ',
      skip: 'ଛାଡନ୍ତୁ',
    },
  },
  ta: {
    common: {
      home: 'முகப்பு',
      search: 'தேடு',
      categories: 'வகைகள்',
      trending: 'டிரெண்டிங்',
      recent: 'சமீபத்திய',
      favorites: 'பிடித்தவை',
      history: 'வரலாறு',
      watchLater: 'பின்னர் பார்க்க',
      notifications: 'அறிவிப்புகள்',
      settings: 'அமைப்புகள்',
      login: 'உள்நுழைய',
      register: 'பதிவு',
      logout: 'வெளியேறு',
      profile: 'சுயவிவரம்',
      language: 'மொழி',
      all: 'அனைத்தும்',
      videos: 'வீடியோக்கள்',
      loading: 'ஏற்றுகிறது...',
      error: 'பிழை',
      retry: 'மீண்டும் முயற்சி',
      cancel: 'ரத்து',
      save: 'சேமி',
      delete: 'நீக்கு',
      confirm: 'உறுதிப்படுத்து',
      next: 'அடுத்து',
      previous: 'முந்தைய',
      page: 'பக்கம்',
      of: 'இல்',
      noResults: 'முடிவுகள் இல்லை',
      searchPlaceholder: 'வீடியோக்களைத் தேடு...',
    },
    ageVerification: {
      title: 'வயது சரிபார்ப்பு தேவை',
      warning: 'இந்த வலைத்தளத்தில் வயதுக்குட்பட்ட உள்ளடக்கம் உள்ளது',
      warningDetails: 'இந்த வலைத்தளத்தை அணுக நீங்கள் 18 வயது அல்லது அதற்கு மேல் இருக்க வேண்டும். "நான் 18+" கிளிக் செய்வதன் மூலம், உங்கள் அதிகார வரம்பில் வயதுக்குட்பட்ட உள்ளடக்கத்தைப் பார்க்கும் சட்ட வயதில் இருப்பதை உறுதிப்படுத்துகிறீர்கள்.',
      confirmButton: 'நான் 18+',
      exitButton: 'வெளியேறு',
      disclaimer: 'இந்த வலைத்தளத்தின் அனைத்து உள்ளடக்கமும் வயதுக்குட்பட்டவர்களுக்கு மட்டுமே. நுழைவதன் மூலம், எங்கள் சேவை விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை ஏற்றுக்கொள்கிறீர்கள்.',
    },
    auth: {
      loginTitle: 'மீண்டும் வரவேற்கிறோம்',
      registerTitle: 'கணக்கை உருவாக்கு',
      email: 'மின்னஞ்சல்',
      password: 'கடவுச்சொல்',
      confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்து',
      username: 'பயனர்பெயர்',
      forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
      rememberMe: 'என்னை நினைவில் வை',
      loginButton: 'உள்நுழை',
      registerButton: 'கணக்கை உருவாக்கு',
      noAccount: 'கணக்கு இல்லையா?',
      hasAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
      resetPassword: 'கடவுச்சொல்லை மீட்டமை',
      sendResetLink: 'மீட்டமை இணைப்பை அனுப்பு',
      backToLogin: 'உள்நுழைவுக்குத் திரும்பு',
      passwordMismatch: 'கடவுச்சொற்கள் பொருந்தவில்லை',
      invalidEmail: 'சரியான மின்னஞ்சலை உள்ளிடவும்',
      weakPassword: 'கடவுச்சொல் குறைந்தது 8 எழுத்துகள் இருக்க வேண்டும்',
    },
    cookies: {
      title: 'குக்கீ ஒப்புதல்',
      message: 'உங்கள் உலாவல் அனுபவத்தை மேம்படுத்தவும், தனிப்பயனாக்கப்பட்ட உள்ளடக்கத்தை வழங்கவும், எங்கள் போக்குவரத்தை பகுப்பாய்வு செய்யவும் குக்கீகளைப் பயன்படுத்துகிறோம்.',
      acceptAll: 'அனைத்தையும் ஏற்கவும்',
      acceptNecessary: 'அவசியமானவை மட்டும்',
      customize: 'தனிப்பயனாக்கு',
      privacyPolicy: 'தனியுரிமைக் கொள்கை',
    },
    legal: {
      privacyPolicy: 'தனியுரிமைக் கொள்கை',
      termsOfService: 'சேவை விதிமுறைகள்',
      contactSupport: 'ஆதரவைத் தொடர்புகொள்',
      aboutUs: 'எங்களைப் பற்றி',
      developers: 'டெவலப்பர்கள்',
    },
    video: {
      views: 'பார்வைகள்',
      likes: 'விருப்பங்கள்',
      dislikes: 'விரும்பாதவை',
      duration: 'காலம்',
      addToWatchLater: 'பின்னர் பார்க்க சேர்',
      removeFromWatchLater: 'பின்னர் பார்ப்பதிலிருந்து நீக்கு',
      addToFavorites: 'பிடித்தவைக்கு சேர்',
      removeFromFavorites: 'பிடித்தவையிலிருந்து நீக்கு',
      share: 'பகிர்',
      report: 'புகார்',
      relatedVideos: 'தொடர்புடைய வீடியோக்கள்',
      comments: 'கருத்துகள்',
      tags: 'குறிச்சொற்கள்',
      category: 'வகை',
      actors: 'நடிகர்கள்',
    },
    errors: {
      pageNotFound: 'பக்கம் கிடைக்கவில்லை',
      somethingWentWrong: 'ஏதோ தவறாகிவிட்டது',
      noConnection: 'இணைய இணைப்பு இல்லை',
      tryAgain: 'மீண்டும் முயற்சி',
      goHome: 'முகப்புக்குச் செல்',
      offline: 'நீங்கள் ஆஃப்லைனில் இருக்கிறீர்கள்',
      offlineMessage: 'உங்கள் இணைய இணைப்பை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
    },
    settings: {
      title: 'அமைப்புகள்',
      appearance: 'தோற்றம்',
      darkMode: 'இருண்ட பயன்முறை',
      autoplay: 'தானியங்கு இயக்கம்',
      quality: 'வீடியோ தரம்',
      notifications: 'அறிவிப்புகள்',
      pushNotifications: 'புஷ் அறிவிப்புகள்',
      emailNotifications: 'மின்னஞ்சல் அறிவிப்புகள்',
      privacy: 'தனியுரிமை',
      clearHistory: 'பார்வை வரலாற்றை அழி',
      deleteAccount: 'கணக்கை நீக்கு',
      languageSettings: 'மொழி அமைப்புகள்',
    },
    guest: {
      limitTitle: 'விருந்தினர் வரம்பு எட்டியது',
      limitMessage: 'விருந்தினர் பயனர்களுக்கான அதிகபட்ச வீடியோ எண்ணிக்கையை எட்டிவிட்டீர்கள்.',
      videosRemaining: 'மீதமுள்ள வீடியோக்கள்',
      loginForMore: 'வரம்பற்ற அணுகலுக்கு உள்நுழையுங்கள் அல்லது பதிவு செய்யுங்கள்',
    },
    onboarding: {
      welcome: 'ப்ளூபெர்ரிக்கு வரவேற்கிறோம்',
      welcomeMessage: 'உங்கள் பிரீமியம் ஸ்ட்ரீமிங் அனுபவம் காத்திருக்கிறது',
      step1Title: 'உள்ளடக்கத்தைக் கண்டறியுங்கள்',
      step1Message: 'பல வகைகளில் ஆயிரக்கணக்கான வீடியோக்களை உலாவுங்கள்',
      step2Title: 'பிளேலிஸ்ட்களை உருவாக்குங்கள்',
      step2Message: 'உங்கள் பிடித்தவைகளை சேமித்து பின்னர் பார்க்க பட்டியல்களை உருவாக்குங்கள்',
      step3Title: 'தனிப்பயனாக்கப்பட்ட அனுபவம்',
      step3Message: 'உங்கள் விருப்பங்களின் அடிப்படையில் பரிந்துரைகளைப் பெறுங்கள்',
      getStarted: 'தொடங்கு',
      skip: 'தவிர்',
    },
  },
  te: {
    common: {
      home: 'హోమ్',
      search: 'వెతుకు',
      categories: 'వర్గాలు',
      trending: 'ట్రెండింగ్',
      recent: 'ఇటీవల',
      favorites: 'ఇష్టమైనవి',
      history: 'చరిత్ర',
      watchLater: 'తర్వాత చూడండి',
      notifications: 'నోటిఫికేషన్లు',
      settings: 'సెట్టింగ్‌లు',
      login: 'లాగిన్',
      register: 'రిజిస్టర్',
      logout: 'లాగౌట్',
      profile: 'ప్రొఫైల్',
      language: 'భాష',
      all: 'అన్నీ',
      videos: 'వీడియోలు',
      loading: 'లోడ్ అవుతోంది...',
      error: 'లోపం',
      retry: 'మళ్ళీ ప్రయత్నించండి',
      cancel: 'రద్దు',
      save: 'సేవ్',
      delete: 'తొలగించు',
      confirm: 'నిర్ధారించు',
      next: 'తదుపరి',
      previous: 'మునుపటి',
      page: 'పేజీ',
      of: 'లో',
      noResults: 'ఫలితాలు కనుగొనబడలేదు',
      searchPlaceholder: 'వీడియోలు వెతుకండి...',
    },
    ageVerification: {
      title: 'వయస్సు ధృవీకరణ అవసరం',
      warning: 'ఈ వెబ్‌సైట్‌లో వయోజన కంటెంట్ ఉంది',
      warningDetails: 'ఈ వెబ్‌సైట్‌ను యాక్సెస్ చేయడానికి మీ వయస్సు 18 సంవత్సరాలు లేదా అంతకంటే ఎక్కువ ఉండాలి. "నేను 18+" క్లిక్ చేయడం ద్వారా మీరు మీ అధికార పరిధిలో వయోజన కంటెంట్‌ను చూడటానికి చట్టపరమైన వయస్సులో ఉన్నారని నిర్ధారిస్తున్నారు.',
      confirmButton: 'నేను 18+',
      exitButton: 'నిష్క్రమించు',
      disclaimer: 'ఈ వెబ్‌సైట్‌లోని అన్ని కంటెంట్ వయోజనులకు మాత్రమే. ప్రవేశించడం ద్వారా, మీరు మా సేవా నిబంధనలు మరియు గోప్యతా విధానాన్ని అంగీకరిస్తున్నారు.',
    },
    auth: {
      loginTitle: 'మళ్ళీ స్వాగతం',
      registerTitle: 'ఖాతా సృష్టించండి',
      email: 'ఇమెయిల్',
      password: 'పాస్‌వర్డ్',
      confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
      username: 'యూజర్‌నేమ్',
      forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
      rememberMe: 'నన్ను గుర్తుంచుకో',
      loginButton: 'సైన్ ఇన్',
      registerButton: 'ఖాతా సృష్టించండి',
      noAccount: 'ఖాతా లేదా?',
      hasAccount: 'ఇప్పటికే ఖాతా ఉందా?',
      resetPassword: 'పాస్‌వర్డ్ రీసెట్ చేయండి',
      sendResetLink: 'రీసెట్ లింక్ పంపండి',
      backToLogin: 'లాగిన్‌కు తిరిగి వెళ్ళండి',
      passwordMismatch: 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు',
      invalidEmail: 'దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ నమోదు చేయండి',
      weakPassword: 'పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి',
    },
    cookies: {
      title: 'కుక్కీ సమ్మతి',
      message: 'మీ బ్రౌజింగ్ అనుభవాన్ని మెరుగుపరచడానికి, వ్యక్తిగతీకరించిన కంటెంట్ అందించడానికి మరియు మా ట్రాఫిక్‌ను విశ్లేషించడానికి మేము కుక్కీలను ఉపయోగిస్తాము.',
      acceptAll: 'అన్నీ అంగీకరించు',
      acceptNecessary: 'అవసరమైనవి మాత్రమే',
      customize: 'అనుకూలీకరించు',
      privacyPolicy: 'గోప్యతా విధానం',
    },
    legal: {
      privacyPolicy: 'గోప్యతా విధానం',
      termsOfService: 'సేవా నిబంధనలు',
      contactSupport: 'సపోర్ట్‌ను సంప్రదించండి',
      aboutUs: 'మా గురించి',
      developers: 'డెవలపర్లు',
    },
    video: {
      views: 'వీక్షణలు',
      likes: 'లైక్‌లు',
      dislikes: 'డిస్‌లైక్‌లు',
      duration: 'వ్యవధి',
      addToWatchLater: 'తర్వాత చూడటానికి జోడించు',
      removeFromWatchLater: 'తర్వాత చూడటం నుండి తీసివేయి',
      addToFavorites: 'ఇష్టమైనవాటికి జోడించు',
      removeFromFavorites: 'ఇష్టమైనవాటి నుండి తీసివేయి',
      share: 'షేర్',
      report: 'రిపోర్ట్',
      relatedVideos: 'సంబంధిత వీడియోలు',
      comments: 'వ్యాఖ్యలు',
      tags: 'ట్యాగ్‌లు',
      category: 'వర్గం',
      actors: 'నటులు',
    },
    errors: {
      pageNotFound: 'పేజీ కనుగొనబడలేదు',
      somethingWentWrong: 'ఏదో తప్పు జరిగింది',
      noConnection: 'ఇంటర్నెట్ కనెక్షన్ లేదు',
      tryAgain: 'మళ్ళీ ప్రయత్నించండి',
      goHome: 'హోమ్‌కు వెళ్ళండి',
      offline: 'మీరు ఆఫ్‌లైన్‌లో ఉన్నారు',
      offlineMessage: 'దయచేసి మీ ఇంటర్నెట్ కనెక్షన్ తనిఖీ చేసి మళ్ళీ ప్రయత్నించండి.',
    },
    settings: {
      title: 'సెట్టింగ్‌లు',
      appearance: 'రూపం',
      darkMode: 'డార్క్ మోడ్',
      autoplay: 'ఆటోప్లే వీడియోలు',
      quality: 'వీడియో నాణ్యత',
      notifications: 'నోటిఫికేషన్లు',
      pushNotifications: 'పుష్ నోటిఫికేషన్లు',
      emailNotifications: 'ఇమెయిల్ నోటిఫికేషన్లు',
      privacy: 'గోప్యత',
      clearHistory: 'చూసిన చరిత్రను క్లియర్ చేయండి',
      deleteAccount: 'ఖాతాను తొలగించండి',
      languageSettings: 'భాషా సెట్టింగ్‌లు',
    },
    guest: {
      limitTitle: 'అతిథి పరిమితి చేరుకుంది',
      limitMessage: 'మీరు అతిథి వినియోగదారులకు గరిష్ట వీడియో సంఖ్యను చేరుకున్నారు.',
      videosRemaining: 'మిగిలిన వీడియోలు',
      loginForMore: 'అపరిమిత యాక్సెస్ కోసం లాగిన్ లేదా రిజిస్టర్ చేయండి',
    },
    onboarding: {
      welcome: 'బ్లూబెర్రీకి స్వాగతం',
      welcomeMessage: 'మీ ప్రీమియం స్ట్రీమింగ్ అనుభవం వేచి ఉంది',
      step1Title: 'కంటెంట్ కనుగొనండి',
      step1Message: 'బహుళ వర్గాలలో వేలకొద్దీ వీడియోలను బ్రౌజ్ చేయండి',
      step2Title: 'ప్లేలిస్ట్‌లు సృష్టించండి',
      step2Message: 'మీ ఇష్టమైనవి సేవ్ చేయండి మరియు తర్వాత చూడటానికి జాబితాలు సృష్టించండి',
      step3Title: 'వ్యక్తిగతీకరించిన అనుభవం',
      step3Message: 'మీ ప్రాధాన్యతల ఆధారంగా సిఫార్సులు పొందండి',
      getStarted: 'ప్రారంభించండి',
      skip: 'దాటవేయి',
    },
  },
};
