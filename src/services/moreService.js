import { supabase } from '../lib/supabase'

export const fetchResources = async () => supabase.from('resources').select('*').order('category').order('name')
export const fetchRoutes = async () => supabase.from('evacuation_routes').select('*')
export const fetchDrills = async () => supabase.from('drills').select('*').order('date', { ascending: false })
export const fetchStaff = async () => supabase.from('staff').select('*').order('name')

export const updateResource = async (id, payload) => supabase.from('resources').update(payload).eq('id', id)
export const resetTodayCheckins = async (date) => supabase.from('checkins').delete().eq('date', date)
