import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { settingsToObject } from '@/lib/experience-mappers';
import { PROFILE_SITE_SETTINGS_DEFAULTS } from '@/lib/site-settings-defaults';

function parseRoleTitles(raw, fallbackTitle) {
  const source = (raw ?? '').toString().trim();
  if (!source) return [fallbackTitle];

  // Supports either JSON array or plain text (one role per line).
  if (source.startsWith('[')) {
    try {
      const parsed = JSON.parse(source);
      const list = Array.isArray(parsed)
        ? parsed.map((item) => (item ?? '').toString().trim()).filter(Boolean)
        : [];
      if (list.length) return list;
    } catch {
      // Fall back to line parsing.
    }
  }

  const list = source
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return list.length ? list : [fallbackTitle];
}

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

  const s = { ...PROFILE_SITE_SETTINGS_DEFAULTS, ...(settings || {}) };

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
    heroRoles:          parseRoleTitles(s.hero_role_titles, s.profile_role_title),
  };
}
