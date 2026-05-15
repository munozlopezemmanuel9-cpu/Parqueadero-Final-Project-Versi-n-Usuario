import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jrkoqmvhcfrqtuibstjl.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya29xbXZoY2ZycXR1aWJzdGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NjM5NDYsImV4cCI6MjA5MzIzOTk0Nn0.Y9a8b83SEStOaWX2rrt-E76syDrMQyqrkAbketJ2TNc';

export const supabase = createClient(supabaseUrl, supabaseKey);
