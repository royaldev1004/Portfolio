import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { settingsToObject } from '@/lib/experience-mappers';

// Hardcoded fallbacks — used when Supabase is not configured or data not yet seeded
const DEFAULTS = {
  profile_name:           'Nguyen Hiep',
  profile_location:       'Vietnam',
  profile_email:          'fullmaster240@gmail.com',
  profile_role_title:     'Senior AI & Automation Engineer',
  profile_avatar_url:     '/nguyen-hiep.png',
  profile_work_image_url: '/Work.png',
  hero_tagline_pre:       'I build',
  hero_tagline_highlight: 'AI & automation',
  hero_tagline_post:      'that ships',
};

export function useProfile() {
  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    enabled: isSupabaseConfigured(),
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      return settingsToObject(data);
    },
  });

  const s = { ...DEFAULTS, ...(settings || {}) };

  return {
    name:               s.profile_name,
    location:           s.profile_location,
    email:              s.profile_email,
    roleTitle:          s.profile_role_title,
    avatarUrl:          s.profile_avatar_url,
    workImageUrl:       s.profile_work_image_url,
    taglinePre:         s.hero_tagline_pre,
    taglineHighlight:   s.hero_tagline_highlight,
    taglinePost:        s.hero_tagline_post,
  };
}
