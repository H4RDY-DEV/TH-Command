export async function getJobs(){
  // Placeholder for Supabase select()
  return [
    {reference:'TH0001',client:'Demo Client',status:'Quote',event_date:'2026-08-01'}
  ];
}

export async function saveJob(job){
  // Placeholder for Supabase insert()
  console.log('Job saved',job);
  return true;
}
