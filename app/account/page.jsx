import AccountForm from './account-form'
import { createClient } from '@/utils/supabase/server'
const Account = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <AccountForm user={user} />
}
export default Account;