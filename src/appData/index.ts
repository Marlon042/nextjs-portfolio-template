import {
  getSkills,
  getSections,
  getSectionItems,
  getSocialLinks,
  getFooterLinks,
  getThemes,
  getSiteConfig,
} from '@/services/site'
import type { Skill, Section, SectionItem, SocialLink, FooterLink, Theme } from '@/services/site'

export { getSkills, getSections, getSectionItems, getSocialLinks, getFooterLinks, getThemes, getSiteConfig }
export type { Skill, Section, SectionItem, SocialLink, FooterLink, Theme }

export const languages = ['En', 'Es', 'Fr', 'De', 'Ru']
