import type { TFunction } from 'i18next';

type ButtonItem = {
  label: string;
  key?: string;
  defaultPath?: string;
  path?: string;
  external?: boolean;
};

type TeamMember = {
  department: string;
  name: string;
};

type ContactInfo = {
  location: string;
  email: string;
  phone: string;
  altTexts: {
    location: string;
    email: string;
    phone: string;
  };
};
type BlogPost = {
  title: string;
  description: string;
};

type GalleryTranslations = {
  title: string;
  blogSection: {
    title: string;
    indicators: {
      ariaLabel: string;
    };
  };
  getImageAlt: (key: string) => string;
  blogPosts: {
    [key: string]: BlogPost;
  };
};

/**
 * Get header banner texts
 */
export const getHeaderTexts = (t: TFunction) => ({
  menu: t('Menu'),
  welcome: t('welcome to'),
  collegeName: t('V.E.I PARAMEDICAL COLLEGE SINDAGI'),
  collegeSubtitle: t('Affiliated by Paramedical Board Bengaluru Recognized By Govt of Karnataka'),
  enquiry: t('Enquiry'),
  brochere:t('Brochere'),
  admissionsOpen: t('Admissions Open Now! Apply Today'),
  diplomaCourses: {
    imaging: t('courses.Diploma in Medical Imaging Technology'),
    lab: t('courses.Diploma in Medical Laboratory Technology'),
    health: t('courses.Diploma in Health Inspector')
  }
});

/**
 * Get navigation header items (top nav)
 */
export const getNavItemTexts = (t: TFunction) => ({
  home: t('header.home'),
  about: t('header.about'),
  courses: t('header.courses'),
  achievers: t('header.achievers'),
  admissions: t('header.admissions'),
  certificate: t('header.certificate'),
  contact: t('header.contact'),
  gallery: t('header.gallery')
});

/**
 * Get footer texts
 */
export const getFooterTexts = (t: TFunction) => ({
  contactUs: t('footer.contactUs'),
  address: t('footer.address'),
  email: t('footer.email'),
  phone: t('footer.phone'),
  branches: t('footer.branches'),
  karnataka: t('footer.karnataka'),
  courses: t('footer.courses'),
  terms: t('footer.terms'),
  privacy: t('footer.privacy'),
  refund: t('footer.refund'),
  followUs: t('footer.followUs'),
  allRights: t('footer.allRights'),
  developer: t('footer.developer')
});

/**
 *  Get Home Page text
 */
export const getHomePageTexts = (t: TFunction) => ({
  title: t('notifications.title'),
  rightSide: t('buttons.rightSide', { returnObjects: true }) as ButtonItem[],
  leftSide: t('buttons.leftSide', { returnObjects: true }) as ButtonItem[],
  admissionOpen: t('admissionOpen', { returnObjects: true }) as string[]
});

/**
 * Get About Page text
 */
export const getAboutPageTexts = (t: TFunction) => ({
  title: t('aboutPage.title'),
  descriptionParagraphs: t('aboutPage.descriptionParagraphs', { returnObjects: true }) as string[],
  message: t('aboutPage.subscribeBox.message', { returnObjects: true }) as string[],
  emailLabel: t('aboutPage.subscribeBox.emailLabel'),
  subscribeButton: t('aboutPage.subscribeBox.subscribeButton', { returnObjects: true }) as string[],
  ourTeam: t('aboutPage.ourTeam'),
  team: t('aboutPage.team', { returnObjects: true }) as TeamMember[]
});

/**
 * Get Courses Page Text
 */
export const getCoursesPageTexts = (t: TFunction) => {
  const normalize = (val: unknown): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'object' && val !== null)
      return Object.values(val).map(String);
    if (typeof val === 'string') return [val];
    return [];
  };

  return {
    title: t('coursesPage.title'),
    selectLabel: t('coursesPage.selectLabel'),
    courseDetails: t('coursesPage.courseDetails'),
    courses: {
      DHI: {
        title: t('coursesPage.courses.DHI.title'),
        details: t('coursesPage.courses.DHI.details'),
        qualificationIntro: t('coursesPage.courses.DHI.qualificationIntro'),
        qualifications: normalize(t('coursesPage.courses.DHI.qualifications', { returnObjects: true })),
      },
      DMLT: {
        title: t('coursesPage.courses.DMLT.title'),
        details: t('coursesPage.courses.DMLT.details'),
        qualificationIntro: t('coursesPage.courses.DMLT.qualificationIntro'),
        qualifications: normalize(t('coursesPage.courses.DMLT.qualifications', { returnObjects: true })),
      },
      DMIT: {
        title: t('coursesPage.courses.DMIT.title'),
        details: t('coursesPage.courses.DMIT.details'),
        qualificationIntro: t('coursesPage.courses.DMIT.qualificationIntro'),
        qualifications: normalize(t('coursesPage.courses.DMIT.qualifications', { returnObjects: true })),
      },
    },
  };
};


/**
 * Get Achivers Page Text
 */
export const getAchieversPageTexts = (t: TFunction) => ({
  bannerAlt: t('achieversPage.bannerAlt'),
  topStudentsTitle: t('achieversPage.topStudentsTitle'),
  achieversTitle: t('achieversPage.achieversTitle'),
  tableColumns: {
    number: t('achieversPage.tableColumns.number'),
    name: t('achieversPage.tableColumns.name'),
    department: t('achieversPage.tableColumns.department'),
    image: t('achieversPage.tableColumns.image')
  },
  topperBadge: (number: number) => t('achieversPage.topperBadge', { number }),
  closeButton: t('achieversPage.closeButton'),
  defaultStudents: t('achieversPage.defaultStudents', { returnObjects: true }) as Array<{
    No: string;
    name: string;
    department: string;
  }>
});

/**
 * Get Admission page text
 */
export const getAdmissionPageTexts = (t: TFunction) => {
  const normalize = (val: unknown): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'object' && val !== null)
      return Object.values(val).map(String);
    if (typeof val === 'string') return [val];
    return [];
  };

  return {
    bannerAlt: t('admissionPage.bannerAlt'),
    selectCareer: t('admissionPage.selectCareer'),
    courseDetails: {
      duration: t('admissionPage.courseDetails.duration'),
      eligibility: normalize(t('admissionPage.courseDetails.eligibility', { returnObjects: true })),
      career: t('admissionPage.courseDetails.career')
    },
    courses: {
      DHI: {
        title: t('admissionPage.courses.DHI.title'),
        details: t('admissionPage.courses.DHI.details'),
        qualificationIntro: t('admissionPage.courses.DHI.qualificationIntro'),
        qualifications: normalize(t('admissionPage.courses.DHI.qualifications', { returnObjects: true })),
      },
      DMLT: {
        title: t('admissionPage.courses.DMLT.title'),
        details: t('admissionPage.courses.DMLT.details'),
        qualificationIntro: t('admissionPage.courses.DMLT.qualificationIntro'),
        qualifications: normalize(t('admissionPage.courses.DMLT.qualifications', { returnObjects: true })),
      },
      DMIT: {
        title: t('admissionPage.courses.DMIT.title'),
        details: t('admissionPage.courses.DMIT.details'),
        qualificationIntro: t('admissionPage.courses.DMIT.qualificationIntro'),
        qualifications: normalize(t('admissionPage.courses.DMIT.qualifications', { returnObjects: true })),
      }
    },
    rulesAndRegulations: normalize(t('admissionPage.rulesAndRegulations', { returnObjects: true }))
  };
};

/**
 * Get Certificate page text
 */

export const getCertificatesPageTexts = (t: TFunction) => ({
  title: t('certificatesPage.title'),
  tableColumns: {
    title: t('certificatesPage.tableColumns.title'),
    postedOn: t('certificatesPage.tableColumns.postedOn'),
    preview: t('certificatesPage.tableColumns.preview'),
    action: t('certificatesPage.tableColumns.action')
  },
  viewingCertificate: (title: string) => t('certificatesPage.viewingCertificate') + title,
  noFileAlert: t('certificatesPage.noFileAlert'),
  closeButton: t('certificatesPage.closeButton')
});

/**
 * Get Contact us page text
 */
export const getContactTranslations = (t: TFunction) => ({
  title: t('contactPage.title'),
  form: {
    labels: {
      name: t('contactPage.form.name'),
      mobile: t('contactPage.form.mobile'),
      email: t('contactPage.form.email'),
      message: t('contactPage.form.message')
    },
    submit: t('contactPage.form.submit'),
    validation: {
      required: (field: string) => t('contactPage.form.validation.required', { field }),
      invalidEmail: t('contactPage.form.validation.invalidEmail'),
      invalidMobile: t('contactPage.form.validation.invalidMobile'),
      minLength: (min: number) => t('contactPage.form.validation.minLength', { min }),
      maxLength: (max: number) => t('contactPage.form.validation.maxLength', { max })
    }
  },
  getContactInfo: (): ContactInfo => ({
    location: t('contactPage.contactInfo.location'),
    email: t('contactPage.contactInfo.email'),
    phone: t('contactPage.contactInfo.phone'),
    altTexts: {
      location: t('contactPage.contactInfo.altTexts.location'),
      email: t('contactPage.contactInfo.altTexts.email'),
      phone: t('contactPage.contactInfo.altTexts.phone')
    }
  })
});

/**
 * Get Gallery page text
 */

export const getGalleryTranslations = (t: TFunction): GalleryTranslations => ({
  title: t('galleryPage.title'),
  blogSection: {
    title: t('galleryPage.blogSection.title'),
    indicators: {
      ariaLabel: t('galleryPage.blogSection.indicators.ariaLabel')
    }
  },
  getImageAlt: (key: string) => t(`galleryPage.images.${key}`),
  blogPosts:{
   performance1: {
      title: t('galleryPage.blogPosts.performance1.title'),
      description: t('galleryPage.blogPosts.performance1.description')
    },
    performance2:{
      title: t('galleryPage.blogPosts.performance2.title'),
      description: t('galleryPage.blogPosts.performance2.description')
    },
   performance3: {
      title: t('galleryPage.blogPosts.performance3.title'),
      description: t('galleryPage.blogPosts.performance3.description')
    },
   performance4: {
      title: t('galleryPage.blogPosts.performance4.title'),
      description: t('galleryPage.blogPosts.performance4.description')
    },
   performance5: {
      title: t('galleryPage.blogPosts.performance5.title'),
      description: t('galleryPage.blogPosts.performance5.description')
    }
  },
});

/**
 * Apply Now Page text
 */

export const getApplyNowText = (t: TFunction) => ({
  title: t('applyNowPage.title')
});

/**
 * common component text
 */
export const getComponentTranslations = (t: TFunction) => {
  return {
    aadhaarCardField: {
      requiredError: (label: string) => t('components.aadhaarCardField.requiredError', { label }),
      invalidError: t('components.aadhaarCardField.invalidError')
    },
    checkboxGroup: {
      requiredError: (label: string) => t('components.checkboxGroup.requiredError', { label })
    },
    dateTimeField: {
      requiredError: (label: string) => t('components.dateTimeField.requiredError', { label })
    },
    dropdownField: {
      requiredError: (label: string) => t('components.dropdownField.requiredError', { label }),
      emptyError: t('components.dropdownField.emptyError')
    },
    emailField: {
      requiredError: (label: string) => t('components.emailField.requiredError', { label }),
      invalidFormat: t('components.emailField.invalidFormat'),
      invalidDomain: t('components.emailField.invalidDomain')
    },
    fileUpload: {
      requiredError: (label: string) => t('components.fileUpload.requiredError', { label }),
      invalidType: (types: string) => t('components.fileUpload.invalidType', { types }),
      sizeLimit: (maxSize: number, selectedSize: number) => 
        t('components.fileUpload.sizeLimit', { 
          maxSize, 
          selectedSize: Math.round(selectedSize) 
        })
    },
    mobileField: {
      requiredError: (label: string) => t('components.mobileField.requiredError', { label }),
      invalidFormat: t('components.mobileField.invalidFormat'),
      maxDigits: t('components.mobileField.maxDigits'),
      minDigits: t('components.mobileField.minDigits')
    },
    numericField: {
      requiredError: (label: string) => t('components.numericField.requiredError', { label }),
      invalidNumber: (label: string) => t('components.numericField.invalidNumber', { label }),
      onlyNumbers: (label: string) => t('components.numericField.onlyNumbers', { label }),
      minValue: (label: string, min: number | string) => 
        t('components.numericField.minValue', { 
          label, 
          min: typeof min === 'number' ? min.toString() : min 
        }),
      maxValue: (label: string, max: number | string) => 
        t('components.numericField.maxValue', { 
          label, 
          max: typeof max === 'number' ? max.toString() : max 
        }),
      decimalLimit: (label: string, digits: number) => 
        t('components.numericField.decimalLimit', { label, digits })
    },
    passwordField: {
      requiredError: (label: string) => t('components.passwordField.requiredError', { label }),
      minLength: (min: number) => t('components.passwordField.minLength', { min }),
      maxLength: (max: number) => t('components.passwordField.maxLength', { max }),
      caseRequirement: t('components.passwordField.caseRequirement'),
      numberRequirement: t('components.passwordField.numberRequirement'),
      specialCharRequirement: t('components.passwordField.specialCharRequirement'),
      mismatch: t('components.passwordField.mismatch'),
      strength: {
        weak: t('components.passwordField.strength.weak'),
        medium: t('components.passwordField.strength.medium'),
        strong: t('components.passwordField.strength.strong'),
        veryStrong: t('components.passwordField.strength.veryStrong')
      }
    },
    radioField: {
      requiredError: (label: string) => t('components.radioField.requiredError', { label })
    },
    searchField: {
      requiredError: (label: string) => t('components.searchField.requiredError', { label })
    },
    textInputField: {
      requiredError: (label: string) => t('components.textInputField.requiredError', { label }),
      minLength: (min: number) => t('components.textInputField.minLength', { min }),
      maxLength: (max: number) => t('components.textInputField.maxLength', { max }),
      validation: {
        alphanumeric: t('components.textInputField.validation.alphanumeric'),
        alphabets: t('components.textInputField.validation.alphabets'),
        numbers: t('components.textInputField.validation.numbers'),
        email: t('components.textInputField.validation.email'),
        textarea: t('components.textInputField.validation.textarea')
      }
    }
  };
};

/**
 * login page
 */

export const getLoginPageText = (t: TFunction) => ({
  title: t('loginPage.title'),
  RememberMe: t('loginPage.RememberMe'),
  ForgetPass: t('loginPage.ForgotPass'),
  CreateNewAcc: t('loginPage.CreateNewAcc')
   
});

/**
 * Scholrship Page Text
 */

export const getScholarshipPage = (t: TFunction) => ({
  title: t('scholarshipLogin.title'),
  subtitle: t('scholarshipLogin.subtitle'),
  Note: t('scholarshipLogin.Note'),
  
  step1: {
    title: t('scholarshipLogin.step1.title'),
    Piont: t('scholarshipLogin.step1.Piont', { returnObjects: true }) as string[]
  },

  step2: {
    title: t('scholarshipLogin.step2.title'),
    Piont: t('scholarshipLogin.step2.Piont', { returnObjects: true }) as string[]
  },

  step3: {
    title: t('scholarshipLogin.step3.title'),
    Piont: t('scholarshipLogin.step3.Piont', { returnObjects: true }) as string[]
  },

  step4: {
    title: t('scholarshipLogin.step4.title'),
    Piont: t('scholarshipLogin.step4.Piont', { returnObjects: true }) as string[]
  },

  step5: {
    title: t('scholarshipLogin.step5.title'),
    Piont: t('scholarshipLogin.step5.Piont', { returnObjects: true }) as string[]
  }
});

/**
 * Syllabus page text
 */

export const getSyllabusPageText = (t: TFunction) => ({
   title: t('Syllabus.title')
});
/**
 * common text
 */

export const getCommonTranslations = (t: TFunction) => ({
  common:{
    courseName:{
      DHI: t('common.courseName.DHI'),
      DMIT: t('common.courseName.DMIT'),
      DMLT: t('common.courseName.DMLT')
    },
  text:{
    SuperAdmin: t('common.text.SuperAdmin'),
    Admin: t('common.text.Admin'),
    User: t('common.text.User'),
    Role: t('common.text.Role'),
    Password: t('common.text.Password'),
    Course: t('common.text.course'),
    AllCourses: t('common.text.AllCourses'),
    Year: t('common.text.year'),
    Action: t('common.text.action')

  }, 

  button:{
    Apply:t('common.buttons.Apply'),
    LogIn:t('common.buttons.LogIn'),
    SignUp:t('common.buttons.SignUp'),
    Download:t('common.buttons.Download')
  }   
  }
  

  
});