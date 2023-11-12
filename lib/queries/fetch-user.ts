import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function fetchUser() {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
